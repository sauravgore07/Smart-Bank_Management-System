package com.banking.system.controller;

import com.banking.system.dto.KycRequest;
import com.banking.system.entity.KycApplication;
import com.banking.system.entity.KycStatus;
import com.banking.system.service.KycService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    private final KycService kycService;

    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    // ==========================================
    // SUBMIT KYC
    // ==========================================

    @PostMapping("/submit/{userId}")
    public ResponseEntity<KycApplication> submitKyc(
            @PathVariable Long userId,
            @Valid @RequestBody KycRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        kycService.submitKyc(
                                userId,
                                request
                        )
                );
    }

    // ==========================================
    // GET USER KYC
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<KycApplication>> getUserKyc(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                kycService.getUserKyc(userId)
        );
    }

    // ==========================================
    // GET ALL KYC HISTORY - ADMIN
    // ==========================================

    @GetMapping("/admin/history")
    public ResponseEntity<List<KycApplication>> getAllKyc() {

        return ResponseEntity.ok(
                kycService.getAllKyc()
        );
    }

    // ==========================================
    // GET KYC BY ID
    // ==========================================

    @GetMapping("/{kycId}")
    public ResponseEntity<KycApplication> getKycById(
            @PathVariable Long kycId) {

        return ResponseEntity.ok(
                kycService.getKycById(kycId)
        );
    }

    // ==========================================
    // GET PENDING KYC
    // ==========================================

    @GetMapping("/pending")
    public ResponseEntity<List<KycApplication>> getPendingKyc() {

        return ResponseEntity.ok(
                kycService.getPendingKyc()
        );
    }

    // ==========================================
    // UPDATE KYC STATUS
    // ==========================================

    @PutMapping("/{kycId}/status")
    public ResponseEntity<KycApplication> updateKycStatus(
            @PathVariable Long kycId,
            @RequestParam KycStatus status) {

        return ResponseEntity.ok(
                kycService.updateKycStatus(
                        kycId,
                        status
                )
        );
    }
}

