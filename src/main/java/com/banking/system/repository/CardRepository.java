package com.banking.system.repository;

import com.banking.system.entity.Card;
import com.banking.system.entity.IssuedCardStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {

    Optional<Card> findByCardNumber(String cardNumber);

    boolean existsByCardNumber(String cardNumber);

    boolean existsByCardApplicationId(Long applicationId);

    Optional<Card> findByCardApplicationId(Long applicationId);

    long countByStatus(IssuedCardStatus status);
}