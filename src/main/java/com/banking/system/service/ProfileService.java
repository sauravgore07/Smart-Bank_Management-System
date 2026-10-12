package com.banking.system.service;

import com.banking.system.entity.User;
import com.banking.system.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // GET PROFILE
    // =========================
    public User getProfile(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }

    // =========================
    // GET PROFILE BY USER ID
    // =========================
    public User getProfileByUserId(Long userId) {

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }

    // =========================
    // UPLOAD / CHANGE PHOTO
    // =========================
    public User uploadProfilePhoto(
            String email,
            MultipartFile file) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        // Check file
        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "Please select a profile photo"
            );
        }

        // Allow only image files
        String contentType = file.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {

            throw new IllegalArgumentException(
                    "Only image files are allowed"
            );
        }

        try {

            // Save photo in database
            user.setProfilePhoto(file.getBytes());

            // Save image type
            user.setProfilePhotoType(contentType);

            return userRepository.save(user);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to upload profile photo"
            );
        }
    }

    // =========================
    // REMOVE PHOTO
    // =========================
    public User removeProfilePhoto(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        // Remove photo
        user.setProfilePhoto(null);
        user.setProfilePhotoType(null);

        return userRepository.save(user);
    }
}