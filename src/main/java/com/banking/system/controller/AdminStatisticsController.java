package com.banking.system.controller;

import com.banking.system.service.AdminStatisticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/statistics")
public class AdminStatisticsController {

    private final AdminStatisticsService adminStatisticsService;

    public AdminStatisticsController(
            AdminStatisticsService adminStatisticsService
    ) {
        this.adminStatisticsService = adminStatisticsService;
    }

    @GetMapping
    public Map<String, Object> getStatistics() {
        return adminStatisticsService.getStatistics();
    }
}