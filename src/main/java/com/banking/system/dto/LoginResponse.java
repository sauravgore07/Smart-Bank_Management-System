package com.banking.system.dto;

public class LoginResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String message;
    private String token;

    public LoginResponse() {
    }

    public LoginResponse(Long id, String name, String email,
                         String role, String message, String token) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.message = message;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }
}