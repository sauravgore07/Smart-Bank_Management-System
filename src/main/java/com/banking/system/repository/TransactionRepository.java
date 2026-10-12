package com.banking.system.repository;

import com.banking.system.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    // User - specific account transaction history
    List<Transaction> findByAccountAccountNumberOrderByTransactionDateDesc(
            String accountNumber
    );

    // Admin - get all transactions
    List<Transaction> findAllByOrderByTransactionDateDesc();
}