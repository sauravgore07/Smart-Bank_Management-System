package com.banking.system.controller;

import com.banking.system.entity.User;
import com.banking.system.service.JwtService;
import com.banking.system.service.ProfileService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    public ProfileController(
            ProfileService profileService,
            JwtService jwtService) {

        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    // =========================
    // GET PROFILE
    // =========================
    @GetMapping
    public ResponseEntity<User> getProfile(
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = getToken(authorizationHeader);

        if (token == null ||
                !jwtService.isTokenValid(token)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        String email = jwtService.extractEmail(token);

        User user = profileService.getProfile(email);

        return ResponseEntity.ok(user);
    }

    // =========================
    // GET PROFILE PHOTO
    // =========================
    @GetMapping("/photo")
    public ResponseEntity<?> getProfilePhoto(
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = getToken(authorizationHeader);

        if (token == null ||
                !jwtService.isTokenValid(token)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        String email = jwtService.extractEmail(token);

        User user = profileService.getProfile(email);

        if (user.getProfilePhoto() == null ||
                user.getProfilePhotoType() == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        try {

            MediaType mediaType =
                    MediaType.parseMediaType(
                            user.getProfilePhotoType()
                    );

            return ResponseEntity
                    .ok()
                    .contentType(mediaType)
                    .body(user.getProfilePhoto());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    // =========================
    // GET USER PHOTO BY USER ID
    // QR CODE
    // =========================
    @GetMapping("/photo/user/{userId}")
    public ResponseEntity<?> getUserPhoto(
            @PathVariable Long userId) {

        User user = profileService.getProfileByUserId(userId);

        if (user == null ||
                user.getProfilePhoto() == null ||
                user.getProfilePhotoType() == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        try {

            MediaType mediaType =
                    MediaType.parseMediaType(
                            user.getProfilePhotoType()
                    );

            return ResponseEntity
                    .ok()
                    .contentType(mediaType)
                    .body(user.getProfilePhoto());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    // =========================
    // UPLOAD / CHANGE PHOTO
    // =========================
    @PostMapping("/photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("file") MultipartFile file) {

        String token = getToken(authorizationHeader);

        if (token == null ||
                !jwtService.isTokenValid(token)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        }

        String email = jwtService.extractEmail(token);

        profileService.uploadProfilePhoto(
                email,
                file
        );

        return ResponseEntity.ok(
                "Profile photo uploaded successfully"
        );
    }

    // =========================
    // REMOVE PHOTO
    // =========================
    @DeleteMapping("/photo")
    public ResponseEntity<?> removeProfilePhoto(
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = getToken(authorizationHeader);

        if (token == null ||
                !jwtService.isTokenValid(token)) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        }

        String email = jwtService.extractEmail(token);

        profileService.removeProfilePhoto(email);

        return ResponseEntity.ok(
                "Profile photo removed successfully"
        );
    }

    // =========================
    // EXTRACT JWT TOKEN
    // =========================
    private String getToken(String authorizationHeader) {

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            return null;
        }

        return authorizationHeader.substring(7);
    }
}