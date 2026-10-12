package com.banking.system.security;

import com.banking.system.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new IllegalArgumentException(
                    "User is not authenticated"
            );
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User)) {

            throw new IllegalArgumentException(
                    "Invalid authenticated user"
            );
        }

        return (User) principal;
    }

    public Long getCurrentUserId() {

        return getCurrentUser().getId();
    }

    public boolean isAdmin() {

        return getCurrentUser()
                .getRole()
                .name()
                .equals("ADMIN");
    }
}