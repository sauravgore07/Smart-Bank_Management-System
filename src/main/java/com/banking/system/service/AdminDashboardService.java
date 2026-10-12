package com.banking.system.service;

import com.banking.system.dto.AdminDashboardResponse;
import com.banking.system.entity.Account;
import com.banking.system.entity.KycStatus;
import com.banking.system.entity.LoanStatus;
import com.banking.system.entity.CardStatus;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.CardApplicationRepository;
import com.banking.system.repository.KycApplicationRepository;
import com.banking.system.repository.LoanApplicationRepository;
import com.banking.system.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final KycApplicationRepository kycApplicationRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final CardApplicationRepository cardApplicationRepository;

    public AdminDashboardService(
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

    public AdminDashboardResponse getAdminDashboard() {

        AdminDashboardResponse response =
                new AdminDashboardResponse();

        // Total Users
        long totalUsers = userRepository.count();
        response.setTotalUsers(totalUsers);

        // Total Accounts
        long totalAccounts = accountRepository.count();
        response.setTotalAccounts(totalAccounts);

        // Total Balance
        BigDecimal totalBalance = BigDecimal.ZERO;

        List<Account> accounts =
                accountRepository.findAll();

        for (Account account : accounts) {

            if (account.getBalance() != null) {
                totalBalance =
                        totalBalance.add(account.getBalance());
            }
        }

        response.setTotalBalance(totalBalance);

        // Pending KYC
        long pendingKyc =
                kycApplicationRepository
                        .findByStatus(KycStatus.PENDING)
                        .size();

        response.setPendingKyc(pendingKyc);

        // Pending Loans
        long pendingLoans =
                loanApplicationRepository
                        .findByStatus(LoanStatus.PENDING)
                        .size();

        response.setPendingLoans(pendingLoans);

        // Pending Cards
        long pendingCards =
                cardApplicationRepository
                        .findByStatus(CardStatus.PENDING)
                        .size();

        response.setPendingCards(pendingCards);

        return response;
    }
}