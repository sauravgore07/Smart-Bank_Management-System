  package com.banking.system.service;

import com.banking.system.dto.TransactionRequest;
import com.banking.system.entity.Account;
import com.banking.system.entity.Transaction;
import com.banking.system.entity.TransactionType;
import com.banking.system.exception.AccountNotFoundException;
import com.banking.system.exception.InsufficientBalanceException;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.TransactionRepository;
import com.banking.system.security.SecurityUtil;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final SecurityUtil securityUtil;

    public TransactionService(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            SecurityUtil securityUtil) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.securityUtil = securityUtil;
    }


    // =========================
    // DEPOSIT
    // =========================

    @Transactional
    public Transaction deposit(
            String accountNumber,
            TransactionRequest request) {

        // USER can access only own account
        Account account = getOwnedAccount(accountNumber);

        BigDecimal amount = request.getAmount();

        // Amount validation
        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Deposit amount must be greater than zero"
            );
        }

        account.setBalance(
                account.getBalance().add(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAccount(account);

        transaction.setTransactionType(
                TransactionType.DEPOSIT
        );

        transaction.setAmount(amount);

        transaction.setBalanceAfterTransaction(
                account.getBalance()
        );

        transaction.setDescription(
                request.getDescription()
        );

        return transactionRepository.save(transaction);
    }


    // =========================
    // WITHDRAW
    // =========================

    @Transactional
    public Transaction withdraw(
            String accountNumber,
            TransactionRequest request) {

        // USER can access only own account
        Account account = getOwnedAccount(accountNumber);

        BigDecimal amount = request.getAmount();

        // Amount validation
        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Withdraw amount must be greater than zero"
            );
        }

        // Check balance
        if (account.getBalance()
                .compareTo(amount) < 0) {

            throw new InsufficientBalanceException(
                    "Insufficient balance"
            );
        }

        account.setBalance(
                account.getBalance().subtract(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setAccount(account);

        transaction.setTransactionType(
                TransactionType.WITHDRAW
        );

        transaction.setAmount(amount);

        transaction.setBalanceAfterTransaction(
                account.getBalance()
        );

        transaction.setDescription(
                request.getDescription()
        );

        return transactionRepository.save(transaction);
    }


    // =========================
    // FUND TRANSFER
    // =========================

    @Transactional
    public Transaction transfer(
            String fromAccountNumber,
            String toAccountNumber,
            BigDecimal amount,
            String description) {

        // Sender must be current user's account
        Account fromAccount =
                getOwnedAccount(fromAccountNumber);

        // Receiver can be another user's account
        Account toAccount =
                findAccount(toAccountNumber);


        // Same account transfer not allowed
        if (fromAccountNumber.equals(toAccountNumber)) {

            throw new IllegalArgumentException(
                    "Cannot transfer money to the same account"
            );
        }


        // Amount validation
        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Transfer amount must be greater than zero"
            );
        }


        // Check sender balance
        if (fromAccount.getBalance()
                .compareTo(amount) < 0) {

            throw new InsufficientBalanceException(
                    "Insufficient balance"
            );
        }


        // =========================
        // DEBIT SENDER
        // =========================

        fromAccount.setBalance(
                fromAccount.getBalance()
                        .subtract(amount)
        );


        // =========================
        // CREDIT RECEIVER
        // =========================

        toAccount.setBalance(
                toAccount.getBalance()
                        .add(amount)
        );


        // Save both accounts
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);


        // =========================
        // SENDER TRANSACTION
        // =========================

        Transaction senderTransaction =
                new Transaction();

        senderTransaction.setAccount(
                fromAccount
        );

        senderTransaction.setTransactionType(
                TransactionType.TRANSFER
        );

        senderTransaction.setAmount(
                amount
        );

        senderTransaction.setBalanceAfterTransaction(
                fromAccount.getBalance()
        );

        senderTransaction.setDescription(
                "Transfer to "
                        + toAccountNumber
                        + " - "
                        + description
        );

        transactionRepository.save(
                senderTransaction
        );


        // =========================
        // RECEIVER TRANSACTION
        // =========================

        Transaction receiverTransaction =
                new Transaction();

        receiverTransaction.setAccount(
                toAccount
        );

        receiverTransaction.setTransactionType(
                TransactionType.TRANSFER
        );

        receiverTransaction.setAmount(
                amount
        );

        receiverTransaction.setBalanceAfterTransaction(
                toAccount.getBalance()
        );

        receiverTransaction.setDescription(
                "Transfer from "
                        + fromAccountNumber
                        + " - "
                        + description
        );

        transactionRepository.save(
                receiverTransaction
        );


        // Return sender transaction
        return senderTransaction;
    }


    // =========================
    // GET BALANCE
    // =========================

    public BigDecimal getBalance(
            String accountNumber) {

        // USER can see only own balance
        Account account =
                getOwnedAccount(accountNumber);

        return account.getBalance();
    }


    // =========================
    // TRANSACTION HISTORY
    // =========================

    public List<Transaction> getTransactionHistory(
            String accountNumber) {

        // USER can see only own transaction history
        getOwnedAccount(accountNumber);

        return transactionRepository
                .findByAccountAccountNumberOrderByTransactionDateDesc(
                        accountNumber
                );
    }


    // =========================
    // ADMIN - ALL TRANSACTIONS
    // =========================

    public List<Transaction> getAllTransactions() {

        // This endpoint is already protected by
        // /api/admin/** in SecurityConfig

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can view all transactions"
            );
        }

        return transactionRepository
                .findAllByOrderByTransactionDateDesc();
    }


    // =========================
    // GET OWNED ACCOUNT
    // =========================

    private Account getOwnedAccount(
            String accountNumber) {

        Account account = findAccount(accountNumber);

        // ADMIN can access all accounts
        if (securityUtil.isAdmin()) {
            return account;
        }

        // USER can access only own account
        if (account.getUser() == null ||
                !account.getUser()
                        .getId()
                        .equals(securityUtil.getCurrentUserId())) {

            throw new IllegalArgumentException(
                    "You can access only your own account"
            );
        }

        return account;
    }


    // =========================
    // FIND ACCOUNT
    // =========================

    private Account findAccount(
            String accountNumber) {

        return accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new AccountNotFoundException(
                                "Account not found: "
                                        + accountNumber
                        )
                );
    }
}
