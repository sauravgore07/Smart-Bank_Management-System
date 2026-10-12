package com.banking.system.controller;

import com.banking.system.entity.User;
import com.banking.system.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = userRepository.findAll();

        return ResponseEntity.ok(users);
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found with id: " + id));

        return ResponseEntity.ok(user);
    }
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<User> deactivateUser(
            @PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found with id: " + id));

        user.setActive(false);

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(updatedUser);
    }
    @PutMapping("/{id}/activate")
    public ResponseEntity<User> activateUser(
            @PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found with id: " + id));

        user.setActive(true);

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(updatedUser);
    }
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam String keyword) {

        List<User> users =
                userRepository.findByNameContainingIgnoreCase(keyword);

        if (users.isEmpty()) {
            users =
                    userRepository.findByEmailContainingIgnoreCase(keyword);
        }

        return ResponseEntity.ok(users);
    }
}