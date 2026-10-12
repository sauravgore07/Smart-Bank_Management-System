package com.banking.system.controller;

import com.banking.system.dto.AccountRequest;
import com.banking.system.dto.AccountQrResponse;
import com.banking.system.entity.Account;
import com.banking.system.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(
            AccountService accountService) {

        this.accountService = accountService;
    }

    // ==========================================
    // CREATE ACCOUNT
    // ==========================================

    @PostMapping
    public ResponseEntity<Account> createAccount(
            @Valid @RequestBody AccountRequest request) {

        Account account =
                accountService.createAccount(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(account);
    }

    // ==========================================
    // GET ALL ACCOUNTS
    // ADMIN ONLY
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {

        return ResponseEntity.ok(
                accountService.getAllAccounts()
        );
    }

    // ==========================================
    // GET ACCOUNTS BY USER
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Account>> getAccountsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                accountService.getAccountsByUserId(userId)
        );
    }

    // ==========================================
    // QR ACCOUNT INFORMATION
    // PUBLIC
    // ==========================================

    @GetMapping("/qr/{accountNumber}")
    public ResponseEntity<AccountQrResponse> getAccountQrInformation(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                accountService.getAccountQrInformation(
                        accountNumber
                )
        );
    }

    // ==========================================
    // GET ACCOUNT
    // ==========================================

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Account> getAccount(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                accountService.getAccount(accountNumber)
        );
    }

    // ==========================================
    // UPDATE ACCOUNT
    // ==========================================

    @PutMapping("/{accountNumber}")
    public ResponseEntity<Account> updateAccount(
            @PathVariable String accountNumber,
            @Valid @RequestBody AccountRequest request) {

        return ResponseEntity.ok(
                accountService.updateAccount(
                        accountNumber,
                        request
                )
        );
    }

    // ==========================================
    // DELETE ACCOUNT
    // ==========================================

    @DeleteMapping("/{accountNumber}")
    public ResponseEntity<String> deleteAccount(
            @PathVariable String accountNumber) {

        accountService.deleteAccount(accountNumber);

        return ResponseEntity.ok(
                "Account deleted successfully"
        );
    }

    // ==========================================
    // ASSIGN ACCOUNT TO USER
    // ADMIN ONLY
    // ==========================================

    @PutMapping("/{accountNumber}/assign/{userId}")
    public ResponseEntity<Account> assignAccountToUser(
            @PathVariable String accountNumber,
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                accountService.assignAccountToUser(
                        accountNumber,
                        userId
                )
        );
    }
}