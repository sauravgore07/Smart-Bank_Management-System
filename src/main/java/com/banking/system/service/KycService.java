        package com.banking.system.service;

import com.banking.system.dto.KycRequest;
import com.banking.system.entity.Account;
import com.banking.system.entity.KycApplication;
import com.banking.system.entity.KycStatus;
import com.banking.system.entity.Role;
import com.banking.system.entity.User;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.KycApplicationRepository;
import com.banking.system.repository.UserRepository;
import com.banking.system.security.SecurityUtil;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KycService {

    private final KycApplicationRepository kycRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final SecurityUtil securityUtil;
    private final NotificationService notificationService;

    public KycService(
            KycApplicationRepository kycRepository,
            UserRepository userRepository,
            AccountRepository accountRepository,
            SecurityUtil securityUtil,
            NotificationService notificationService) {

        this.kycRepository = kycRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.securityUtil = securityUtil;
        this.notificationService = notificationService;
    }

    public KycApplication submitKyc(
            Long userId,
            KycRequest request) {

        User currentUser =
                securityUtil.getCurrentUser();

        if (!securityUtil.isAdmin()
                && !currentUser.getId().equals(userId)) {

            throw new IllegalArgumentException(
                    "You can submit KYC only for yourself"
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

        KycApplication kyc =
                new KycApplication();

        kyc.setUser(user);

        kyc.setFullName(
                request.getFullName()
        );

        kyc.setDateOfBirth(
                request.getDateOfBirth()
        );

        kyc.setPhoneNumber(
                request.getPhoneNumber()
        );

        kyc.setAddress(
                request.getAddress()
        );

        kyc.setCity(
                request.getCity()
        );

        kyc.setState(
                request.getState()
        );

        kyc.setPincode(
                request.getPincode()
        );

        kyc.setIdentityType(
                request.getIdentityType()
        );

        kyc.setIdentityNumber(
                request.getIdentityNumber()
        );

        kyc.setStatus(
                KycStatus.PENDING
        );

        KycApplication savedKyc =
                kycRepository.save(kyc);

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
                            + " has submitted a new KYC request.",
                    "KYC_SUBMITTED"
            );
        }

        return savedKyc;
    }

    public List<KycApplication> getUserKyc(
            Long userId) {

        User currentUser =
                securityUtil.getCurrentUser();

        if (!securityUtil.isAdmin()
                && !currentUser.getId().equals(userId)) {

            throw new IllegalArgumentException(
                    "You can access only your own KYC"
            );
        }

        return kycRepository
                .findByUser_IdOrderBySubmittedAtDesc(userId);
    }

    public KycApplication getKycById(
            Long kycId) {

        KycApplication kyc =
                kycRepository.findById(kycId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "KYC application not found: "
                                                + kycId
                                )
                        );

        if (securityUtil.isAdmin()) {
            return kyc;
        }

        if (kyc.getUser() == null
                || !kyc.getUser()
                .getId()
                .equals(
                        securityUtil.getCurrentUserId()
                )) {

            throw new IllegalArgumentException(
                    "You can access only your own KYC"
            );
        }

        return kyc;
    }

    public List<KycApplication> getPendingKyc() {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can view pending KYC"
            );
        }

        return kycRepository.findByStatus(
                KycStatus.PENDING
        );
    }

    public List<KycApplication> getAllKyc() {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can view KYC history"
            );
        }

        return kycRepository
                .findAllByOrderBySubmittedAtDesc();
    }

    public KycApplication updateKycStatus(
            Long kycId,
            KycStatus status) {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can update KYC status"
            );
        }

        KycApplication kyc =
                kycRepository.findById(kycId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "KYC application not found: "
                                                + kycId
                                )
                        );

        kyc.setStatus(status);

        KycApplication updatedKyc =
                kycRepository.save(kyc);

        User admin =
                securityUtil.getCurrentUser();

        User user =
                kyc.getUser();

        String message;

        if (status == KycStatus.APPROVED) {

            user.setName(
                    kyc.getFullName()
            );

            user.setPhoneNumber(
                    kyc.getPhoneNumber()
            );

            user.setDateOfBirth(
                    kyc.getDateOfBirth()
            );

            user.setAddress(
                    kyc.getAddress()
            );

            user.setCity(
                    kyc.getCity()
            );

            user.setState(
                    kyc.getState()
            );

            user.setPincode(
                    kyc.getPincode()
            );

            user.setIdentityType(
                    kyc.getIdentityType()
            );

            user.setIdentityNumber(
                    kyc.getIdentityNumber()
            );

            userRepository.save(user);

            List<Account> accounts =
                    accountRepository.findByUserId(
                            user.getId()
                    );

            for (Account account : accounts) {

                account.setCustomerName(
                        user.getName()
                );

                account.setEmail(
                        user.getEmail()
                );

                account.setPhone(
                        user.getPhoneNumber()
                );
            }

            accountRepository.saveAll(accounts);

            message =
                    "Your KYC application has been approved by Admin.";

        } else if (status == KycStatus.REJECTED) {

            message =
                    "Your KYC application has been rejected by Admin.";

        } else {

            message =
                    "Your KYC application status has been updated to "
                            + status + ".";
        }

        notificationService.createNotification(
                user,
                admin,
                message,
                "KYC_STATUS_UPDATED"
        );

        return updatedKyc;
    }
}

