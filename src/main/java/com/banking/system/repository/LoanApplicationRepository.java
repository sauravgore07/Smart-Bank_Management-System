package com.banking.system.repository;

import com.banking.system.entity.LoanApplication;
import com.banking.system.entity.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanApplicationRepository
        extends JpaRepository<LoanApplication, Long> {

    List<LoanApplication> findByUserId(Long userId);

    List<LoanApplication> findByStatus(LoanStatus status);

    List<LoanApplication> findAllByOrderByAppliedAtDesc();
}

