package com.banking.system.controller;

import com.banking.system.entity.Transaction;
import com.banking.system.service.TransactionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/transactions")
public class AdminTransactionController {

    private final TransactionService transactionService;

    public AdminTransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {

        return ResponseEntity.ok(
                transactionService.getAllTransactions()
        );
    }
}