package com.lms.dto.response;

import com.lms.entity.UserActivityLog;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ActivityResponse(UUID id, String action, String ipAddress, String device, OffsetDateTime createdAt) {
    public static ActivityResponse from(UserActivityLog log) {
        return new ActivityResponse(log.getId(), log.getAction(), log.getIpAddress(), log.getDevice(), log.getCreatedAt());
    }
}

