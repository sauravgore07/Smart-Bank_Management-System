        package com.banking.system.repository;

import com.banking.system.entity.KycApplication;
import com.banking.system.entity.KycStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KycApplicationRepository
        extends JpaRepository<KycApplication, Long> {

    List<KycApplication> findByUser_Id(Long userId);

    List<KycApplication> findByUser_IdOrderBySubmittedAtDesc(
            Long userId
    );

    List<KycApplication> findAllByOrderBySubmittedAtDesc();

    Optional<KycApplication> findByIdAndUser_Id(
            Long id,
            Long userId
    );

    List<KycApplication> findByStatus(
            KycStatus status
    );
}

