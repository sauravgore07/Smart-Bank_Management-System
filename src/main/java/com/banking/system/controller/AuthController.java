
        package com.banking.system.controller;

import com.banking.system.dto.ChangePasswordRequest;
import com.banking.system.dto.LoginRequest;
import com.banking.system.dto.LoginResponse;
import com.banking.system.dto.RegisterRequest;
import com.banking.system.entity.User;
import com.banking.system.service.AuthService;
import com.banking.system.service.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService) {

        this.authService = authService;
        this.jwtService = jwtService;
    }

    // =========================
    // USER REGISTRATION
    // =========================
    @PostMapping("/register")
    public ResponseEntity<User> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(user);
    }

    // =========================
    // USER / ADMIN LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }

    // =========================
    // CHANGE PASSWORD
    // =========================
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authorization token is required");
        }

        String token =
                authorizationHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        }

        String email =
                jwtService.extractEmail(token);

        authService.changePassword(
                email,
                request
        );

        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }

    // =========================
    // TEMPORARY ADMIN PASSWORD RESET
    // =========================
    @PostMapping("/reset-admin-password")
    public ResponseEntity<String> resetAdminPassword(
            @RequestParam String email) {

        authService.resetAdminPassword(email);

        return ResponseEntity.ok(
                "Admin password reset successfully"
        );
    }
}

