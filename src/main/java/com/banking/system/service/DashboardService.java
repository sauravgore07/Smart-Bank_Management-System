package com.banking.system.service;

import com.banking.system.dto.DashboardResponse;
import com.banking.system.dto.TransactionResponse;
import com.banking.system.entity.Account;
import com.banking.system.entity.User;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.UserRepository;
import com.banking.system.repository.KycApplicationRepository;
import com.banking.system.repository.LoanApplicationRepository;
import com.banking.system.repository.CardApplicationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final KycApplicationRepository kycApplicationRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final CardApplicationRepository cardApplicationRepository;

    public DashboardService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            KycApplicationRepository kycApplicationRepository,
            LoanApplicationRepository loanApplicationRepository,
            CardApplicationRepository cardApplicationRepository) {

        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.kycApplicationRepository = kycApplicationRepository;
        this.loanApplicationRepository = loanApplicationRepository;
        this.cardApplicationRepository = cardApplicationRepository;
    }

    public DashboardResponse getDashboard(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found: " + userId));

        List<Account> accounts =
                accountRepository.findByUserId(userId);

        DashboardResponse response =
                new DashboardResponse();

        response.setUserId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        var kycList =
                kycApplicationRepository.findByUser_Id(userId);

        if (!kycList.isEmpty()) {

            response.setKycStatus(
                    kycList.get(kycList.size() - 1)
                            .getStatus()
                            .toString()
            );
        }

        var loanList =
                loanApplicationRepository.findByUserId(userId);

        if (!loanList.isEmpty()) {

            response.setLoanStatus(
                    loanList.get(loanList.size() - 1)
                            .getStatus()
                            .toString()
            );
        }

        var cardList =
                cardApplicationRepository.findByUserId(userId);

        if (!cardList.isEmpty()) {

            response.setCardStatus(
                    cardList.get(cardList.size() - 1)
                            .getStatus()
                            .toString()
            );
        }

        if (!accounts.isEmpty()) {

            Account account =
                    accounts.get(0);

            response.setAccountNumber(
                    account.getAccountNumber()
            );

            response.setAccountType(
                    account.getAccountType().toString()
            );

            response.setBalance(
                    account.getBalance()
            );

            List<TransactionResponse> transactions =
                    account.getTransactions()
                            .stream()
                            .limit(5)
                            .map(transaction ->
                                    new TransactionResponse(
                                            transaction.getId(),
                                            account.getAccountNumber(),
                                            account.getCustomerName(),
                                            transaction.getTransactionType(),
                                            transaction.getAmount(),
                                            transaction.getBalanceAfterTransaction(),
                                            transaction.getTransactionDate(),
                                            transaction.getDescription()
                                    ))
                            .toList();

            response.setRecentTransactions(
                    transactions
            );
        }

        return response;
    }
}

