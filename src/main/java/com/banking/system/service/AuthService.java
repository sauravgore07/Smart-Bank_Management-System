package com.banking.system.service;

import com.banking.system.dto.ChangePasswordRequest;
import com.banking.system.dto.LoginRequest;
import com.banking.system.dto.LoginResponse;
import com.banking.system.dto.RegisterRequest;
import com.banking.system.entity.Role;
import com.banking.system.entity.User;
import com.banking.system.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            NotificationService notificationService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }

    // =========================
    // USER REGISTRATION
    // =========================
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new IllegalArgumentException(
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(Role.USER);

        user.setActive(true);

        User savedUser = userRepository.save(user);

        userRepository.findAll()
                .stream()
                .filter(admin -> admin.getRole() == Role.ADMIN)
                .forEach(admin ->
                        notificationService.createNotification(
                                admin,
                                savedUser,
                                "New user registered: " + savedUser.getName(),
                                "USER_REGISTRATION"
                        )
                );

        return savedUser;
    }

    // =========================
    // USER / ADMIN LOGIN
    // =========================
    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (!user.isActive()) {

            throw new IllegalArgumentException(
                    "Your account is deactivated"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                "Login successful",
                token
        );
    }

    // =========================
    // CHANGE PASSWORD
    // =========================
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Current password is incorrect"
            );
        }

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "New password and confirm password do not match"
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "New password must be different from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }

    // =========================
    // TEMPORARY PASSWORD RESET
    // =========================
    public void resetAdminPassword(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        user.setPassword(
                passwordEncoder.encode("Rahul@123")
        );

        userRepository.save(user);
    }
}

