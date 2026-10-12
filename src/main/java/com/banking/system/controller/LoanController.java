package com.banking.system.controller;

import com.banking.system.dto.LoanRequest;
import com.banking.system.entity.LoanApplication;
import com.banking.system.entity.LoanStatus;
import com.banking.system.service.LoanService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    // Apply for loan
    @PostMapping("/apply/{userId}")
    public ResponseEntity<LoanApplication> applyLoan(
            @PathVariable Long userId,
            @Valid @RequestBody LoanRequest request) {

        LoanApplication loan = loanService.applyLoan(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(loan);
    }

    // Get all loans of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanApplication>> getUserLoans(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                loanService.getUserLoans(userId)
        );
    }

    // Get all loan history for admin
    @GetMapping("/admin/history")
    public ResponseEntity<List<LoanApplication>> getAllLoans() {

        return ResponseEntity.ok(
                loanService.getAllLoans()
        );
    }

    // Get loan by ID
    @GetMapping("/{loanId}")
    public ResponseEntity<LoanApplication> getLoanById(
            @PathVariable Long loanId) {

        return ResponseEntity.ok(
                loanService.getLoanById(loanId)
        );
    }

    // Get all pending loans
    @GetMapping("/pending")
    public ResponseEntity<List<LoanApplication>> getPendingLoans() {

        return ResponseEntity.ok(
                loanService.getPendingLoans()
        );
    }

    // Approve / Reject loan
    @PutMapping("/{loanId}/status")
    public ResponseEntity<LoanApplication> updateLoanStatus(
            @PathVariable Long loanId,
            @RequestParam LoanStatus status) {

        return ResponseEntity.ok(
                loanService.updateLoanStatus(loanId, status)
        );
    }
}

