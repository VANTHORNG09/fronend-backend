package com.lms.controller;

import com.lms.dto.response.DashboardResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public DashboardResponse stats(@AuthenticationPrincipal UserPrincipal principal) {
        return dashboardService.forUser(principal.getUser());
    }

    @GetMapping("/recent-activity")
    public List<?> activity(@AuthenticationPrincipal UserPrincipal principal) {
        return dashboardService.forUser(principal.getUser()).recentActivity();
    }

    @GetMapping("/charts")
    public Map<String, ?> charts(@AuthenticationPrincipal UserPrincipal principal) {
        return dashboardService.forUser(principal.getUser()).charts();
    }
}

