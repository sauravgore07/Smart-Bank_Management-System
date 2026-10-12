package com.banking.system.controller;

import com.banking.system.dto.AdminDashboardResponse;
import com.banking.system.service.AdminDashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(
            AdminDashboardService adminDashboardService) {

        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {

        AdminDashboardResponse response =
                adminDashboardService.getAdminDashboard();

        return ResponseEntity.ok(response);
    }
}