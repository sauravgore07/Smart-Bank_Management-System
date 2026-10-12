        package com.banking.system.security;

import com.banking.system.entity.User;
import com.banking.system.repository.UserRepository;
import com.banking.system.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            String email = jwtService.extractEmail(token);

            System.out.println("JWT EMAIL: " + email);

            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                User user = userRepository
                        .findByEmail(email)
                        .orElse(null);

                if (user != null) {

                    System.out.println(
                            "DATABASE USER: " + user.getEmail()
                    );

                    System.out.println(
                            "DATABASE ROLE: " + user.getRole()
                    );

                    System.out.println(
                            "DATABASE ACTIVE: " + user.isActive()
                    );

                    if (user.isActive()) {

                        String role = jwtService.extractRole(token);

                        System.out.println(
                                "JWT ROLE: " + role
                        );

                        if (role != null) {

                            role = role.trim();

                            if (role.startsWith("ROLE_")) {
                                role = role.substring(5);
                            }

                            SimpleGrantedAuthority authority =
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + role
                                    );

                            System.out.println(
                                    "SPRING AUTHORITY: "
                                            + authority.getAuthority()
                            );

                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            user,
                                            null,
                                            List.of(authority)
                                    );

                            SecurityContextHolder
                                    .getContext()
                                    .setAuthentication(authentication);

                            System.out.println(
                                    "AUTHENTICATION SET SUCCESSFULLY"
                            );
                        }

                    } else {

                        System.out.println(
                                "USER IS INACTIVE"
                        );
                    }

                } else {

                    System.out.println(
                            "USER NOT FOUND IN DATABASE"
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT AUTHENTICATION ERROR: "
                            + e.getMessage()
            );

            SecurityContextHolder
                    .clearContext();
        }

        filterChain.doFilter(request, response);
    }
}

