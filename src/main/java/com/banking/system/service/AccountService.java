package com.banking.system.service;

import com.banking.system.dto.AccountQrResponse;
import com.banking.system.dto.AccountRequest;
import com.banking.system.entity.Account;
import com.banking.system.entity.User;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.UserRepository;
import com.banking.system.security.SecurityUtil;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final NotificationService notificationService;

    public AccountService(
            AccountRepository accountRepository,
            UserRepository userRepository,
            SecurityUtil securityUtil,
            NotificationService notificationService) {

        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
        this.notificationService = notificationService;
    }

    public Account createAccount(AccountRequest request) {

        if (!securityUtil.isAdmin()) {
            throw new IllegalArgumentException(
                    "Only admin can create an account"
            );
        }

        if (request.getUserId() == null) {
            throw new IllegalArgumentException(
                    "User ID is required"
            );
        }

        if (request.getInitialBalance() == null) {
            throw new IllegalArgumentException(
                    "Initial balance is required"
            );
        }

        if (request.getInitialBalance().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Initial balance cannot be negative"
            );
        }

        if (request.getAccountType() == null) {
            throw new IllegalArgumentException(
                    "Account type is required"
            );
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        boolean accountAlreadyExists = accountRepository
                .findByUserId(request.getUserId())
                .stream()
                .anyMatch(account ->
                        account.getAccountType() == request.getAccountType()
                );

        if (accountAlreadyExists) {

            String notificationMessage =
                    "Your " + request.getAccountType()
                            + " account already exists.";

            notificationService.createNotification(
                    user,
                    null,
                    notificationMessage,
                    "ACCOUNT"
            );

            throw new IllegalArgumentException(
                    notificationMessage
            );
        }

        Account account = new Account();

        account.setAccountNumber(generateAccountNumber());

        account.setCustomerName(user.getName());
        account.setEmail(user.getEmail());
        account.setPhone(user.getPhoneNumber());

        account.setAccountType(request.getAccountType());
        account.setBalance(request.getInitialBalance());

        account.setUser(user);

        Account savedAccount = accountRepository.save(account);

        notificationService.createNotification(
                user,
                securityUtil.getCurrentUser(),
                "Your " + savedAccount.getAccountType()
                        + " account " + savedAccount.getAccountNumber()
                        + " has been created successfully by Admin.",
                "ACCOUNT_CREATED"
        );

        return savedAccount;
    }

    public List<Account> getAllAccounts() {

        if (!securityUtil.isAdmin()) {
            throw new IllegalArgumentException(
                    "Only admin can view all accounts"
            );
        }

        return accountRepository.findAll();
    }

    public List<Account> getAccountsByUserId(Long userId) {

        if (!securityUtil.isAdmin()
                && !securityUtil.getCurrentUserId().equals(userId)) {

            throw new IllegalArgumentException(
                    "You can only view your own accounts"
            );
        }

        return accountRepository.findByUserId(userId);
    }

    public Account getAccount(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Account not found"
                        )
                );

        if (!securityUtil.isAdmin()) {

            if (account.getUser() == null ||
                    !account.getUser().getId()
                            .equals(securityUtil.getCurrentUserId())) {

                throw new IllegalArgumentException(
                        "You can only view your own account"
                );
            }
        }

        return account;
    }

    public AccountQrResponse getAccountQrInformation(
            String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Account not found"
                        )
                );

        AccountQrResponse response = new AccountQrResponse();

        response.setAccountNumber(account.getAccountNumber());
        response.setCustomerName(account.getCustomerName());
        response.setAccountType(account.getAccountType().name());

        return response;
    }

    public Account updateAccount(
            String accountNumber,
            AccountRequest request) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Account not found"
                        )
                );

        if (!securityUtil.isAdmin()) {

            if (account.getUser() == null ||
                    !account.getUser().getId()
                            .equals(securityUtil.getCurrentUserId())) {

                throw new IllegalArgumentException(
                        "You can only update your own account"
                );
            }
        }

        if (request.getAccountType() != null) {

            if (account.getUser() != null) {

                boolean duplicateAccountType = accountRepository
                        .findByUserId(account.getUser().getId())
                        .stream()
                        .anyMatch(existingAccount ->
                                !existingAccount.getAccountNumber()
                                        .equals(account.getAccountNumber())
                                        && existingAccount.getAccountType()
                                        == request.getAccountType()
                        );

                if (duplicateAccountType) {

                    String notificationMessage =
                            "Your " + request.getAccountType()
                                    + " account already exists.";

                    notificationService.createNotification(
                            account.getUser(),
                            null,
                            notificationMessage,
                            "ACCOUNT"
                    );

                    throw new IllegalArgumentException(
                            notificationMessage
                    );
                }
            }

            account.setAccountType(
                    request.getAccountType()
            );
        }

        if (request.getInitialBalance() != null) {

            if (request.getInitialBalance()
                    .compareTo(BigDecimal.ZERO) < 0) {

                throw new IllegalArgumentException(
                        "Balance cannot be negative"
                );
            }

            account.setBalance(
                    request.getInitialBalance()
            );
        }

        return accountRepository.save(account);
    }

    public void deleteAccount(String accountNumber) {

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Account not found"
                        )
                );

        if (!securityUtil.isAdmin()) {

            if (account.getUser() == null ||
                    !account.getUser().getId()
                            .equals(securityUtil.getCurrentUserId())) {

                throw new IllegalArgumentException(
                        "You can only delete your own account"
                );
            }
        }

        accountRepository.delete(account);
    }

    public Account assignAccountToUser(
            String accountNumber,
            Long userId) {

        if (!securityUtil.isAdmin()) {
            throw new IllegalArgumentException(
                    "Only admin can assign account"
            );
        }

        Account account = accountRepository
                .findByAccountNumber(accountNumber)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Account not found"
                        )
                );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        boolean duplicateAccountType = accountRepository
                .findByUserId(userId)
                .stream()
                .anyMatch(existingAccount ->
                        !existingAccount.getAccountNumber()
                                .equals(account.getAccountNumber())
                                && existingAccount.getAccountType()
                                == account.getAccountType()
                );

        if (duplicateAccountType) {

            String notificationMessage =
                    "Your " + account.getAccountType()
                            + " account already exists.";

            notificationService.createNotification(
                    user,
                    null,
                    notificationMessage,
                    "ACCOUNT"
            );

            throw new IllegalArgumentException(
                    notificationMessage
            );
        }

        account.setUser(user);

        account.setCustomerName(user.getName());
        account.setEmail(user.getEmail());
        account.setPhone(user.getPhoneNumber());

        Account savedAccount = accountRepository.save(account);

        notificationService.createNotification(
                user,
                securityUtil.getCurrentUser(),
                "Your " + savedAccount.getAccountType()
                        + " account " + savedAccount.getAccountNumber()
                        + " has been assigned successfully by Admin.",
                "ACCOUNT_ASSIGNED"
        );

        return savedAccount;
    }

    private String generateAccountNumber() {

        String accountNumber;

        do {
            int number = 100000 + new Random().nextInt(900000);

            accountNumber = "BANK" + number;

        } while (
                accountRepository
                        .existsByAccountNumber(accountNumber)
        );

        return accountNumber;
    }
}