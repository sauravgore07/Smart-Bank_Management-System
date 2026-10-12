package com.banking.system.repository;

import com.banking.system.entity.CardApplication;
import com.banking.system.entity.CardStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardApplicationRepository
        extends JpaRepository<CardApplication, Long> {

    List<CardApplication> findByUserId(Long userId);

    List<CardApplication> findByStatus(CardStatus status);
}