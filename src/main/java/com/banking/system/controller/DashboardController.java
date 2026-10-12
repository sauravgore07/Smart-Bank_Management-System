package com.banking.system.controller;

import com.banking.system.dto.DashboardResponse;
import com.banking.system.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<DashboardResponse> getDashboard(
            @PathVariable Long userId) {

        DashboardResponse dashboard =
                dashboardService.getDashboard(userId);

        return ResponseEntity.ok(dashboard);
    }
}