        package com.banking.system.service;

import com.banking.system.dto.LoanRequest;
import com.banking.system.entity.LoanApplication;
import com.banking.system.entity.LoanStatus;
import com.banking.system.entity.Role;
import com.banking.system.entity.User;
import com.banking.system.repository.LoanApplicationRepository;
import com.banking.system.repository.UserRepository;
import com.banking.system.security.SecurityUtil;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class LoanService {

    private final LoanApplicationRepository loanRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final NotificationService notificationService;

    public LoanService(
            LoanApplicationRepository loanRepository,
            UserRepository userRepository,
            SecurityUtil securityUtil,
            NotificationService notificationService) {

        this.loanRepository = loanRepository;
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
        this.notificationService = notificationService;
    }


    // ==========================================
    // GET INTEREST RATE BY LOAN TYPE
    // ==========================================

    private BigDecimal getInterestRate(String loanType) {

        if (loanType == null) {
            throw new IllegalArgumentException(
                    "Loan type cannot be null"
            );
        }

        switch (loanType.toUpperCase()) {

            case "PERSONAL":
                return new BigDecimal("12.00");

            case "HOME":
                return new BigDecimal("8.50");

            case "EDUCATION":
                return new BigDecimal("7.00");

            case "VEHICLE":
                return new BigDecimal("9.00");

            case "BUSINESS":
                return new BigDecimal("11.00");

            case "MEDICAL":
                return new BigDecimal("10.00");

            default:
                throw new IllegalArgumentException(
                        "Invalid loan type: " + loanType
                );
        }
    }


    // ==========================================
    // APPLY FOR LOAN
    // ==========================================

    public LoanApplication applyLoan(
            Long userId,
            LoanRequest request) {

        User currentUser =
                securityUtil.getCurrentUser();

        if (!securityUtil.isAdmin()
                && !currentUser.getId().equals(userId)) {

            throw new IllegalArgumentException(
                    "You can apply for a loan only for yourself"
            );
        }

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found: "
                                                + userId
                                )
                        );

        LoanApplication loan =
                new LoanApplication();

        loan.setUser(user);

        loan.setLoanType(
                request.getLoanType()
        );

        BigDecimal interestRate =
                getInterestRate(
                        request.getLoanType()
                );

        loan.setInterestRate(
                interestRate
        );

        loan.setLoanAmount(
                request.getLoanAmount()
        );

        loan.setTenureMonths(
                request.getTenureMonths()
        );

        loan.setMonthlyIncome(
                request.getMonthlyIncome()
        );

        loan.setEmploymentType(
                request.getEmploymentType()
        );

        loan.setPurpose(
                request.getPurpose()
        );

        loan.setStatus(
                LoanStatus.PENDING
        );

        LoanApplication savedLoan =
                loanRepository.save(loan);

        List<User> admins =
                userRepository.findAll()
                        .stream()
                        .filter(admin ->
                                admin.getRole() == Role.ADMIN)
                        .toList();

        for (User admin : admins) {

            notificationService.createNotification(
                    admin,
                    user,
                    user.getName()
                            + " has submitted a new "
                            + request.getLoanType()
                            + " loan request.",
                    "LOAN_SUBMITTED"
            );
        }

        return savedLoan;
    }


    // ==========================================
    // GET USER LOANS
    // ==========================================

    public List<LoanApplication> getUserLoans(
            Long userId) {

        User currentUser =
                securityUtil.getCurrentUser();

        if (!securityUtil.isAdmin()
                && !currentUser.getId().equals(userId)) {

            throw new IllegalArgumentException(
                    "You can access only your own loans"
            );
        }

        return loanRepository.findByUserId(userId);
    }


    // ==========================================
    // GET LOAN BY ID
    // ==========================================

    public LoanApplication getLoanById(
            Long loanId) {

        LoanApplication loan =
                loanRepository.findById(loanId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Loan application not found: "
                                                + loanId
                                )
                        );

        if (securityUtil.isAdmin()) {
            return loan;
        }

        if (loan.getUser() == null
                || !loan.getUser()
                .getId()
                .equals(
                        securityUtil.getCurrentUserId()
                )) {

            throw new IllegalArgumentException(
                    "You can access only your own loan"
            );
        }

        return loan;
    }


    // ==========================================
    // GET ALL PENDING LOANS
    // ==========================================

    public List<LoanApplication> getPendingLoans() {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can view pending loans"
            );
        }

        return loanRepository.findByStatus(
                LoanStatus.PENDING
        );
    }


    // ==========================================
    // GET ALL LOAN HISTORY
    // ==========================================

    public List<LoanApplication> getAllLoans() {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can view loan history"
            );
        }

        return loanRepository
                .findAllByOrderByAppliedAtDesc();
    }


    // ==========================================
    // UPDATE LOAN STATUS
    // ==========================================

    public LoanApplication updateLoanStatus(
            Long loanId,
            LoanStatus status) {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can update loan status"
            );
        }

        LoanApplication loan =
                loanRepository.findById(loanId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Loan application not found: "
                                                + loanId
                                )
                        );

        loan.setStatus(status);

        LoanApplication updatedLoan =
                loanRepository.save(loan);

        User admin =
                securityUtil.getCurrentUser();

        User user =
                loan.getUser();

        String message;

        if (status == LoanStatus.APPROVED) {

            message =
                    "Your "
                            + loan.getLoanType()
                            + " loan application has been approved by Admin.";

        } else if (status == LoanStatus.REJECTED) {

            message =
                    "Your "
                            + loan.getLoanType()
                            + " loan application has been rejected by Admin.";

        } else {

            message =
                    "Your "
                            + loan.getLoanType()
                            + " loan application status has been updated to "
                            + status + ".";
        }

        notificationService.createNotification(
                user,
                admin,
                message,
                "LOAN_STATUS_UPDATED"
        );

        return updatedLoan;
    }
}

