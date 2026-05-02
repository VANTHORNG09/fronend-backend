package com.lms.dto.response;

import java.util.List;
import java.util.Map;

public record DashboardResponse(
        Map<String, Number> stats,
        List<ActivityResponse> recentActivity,
        Map<String, List<Map<String, Object>>> charts,
        List<Map<String, Object>> upcomingDeadlines,
        List<String> tips
) {
}

