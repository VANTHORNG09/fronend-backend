package com.lms.dto.response;

import com.lms.entity.Notification;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NotificationResponse(UUID id, String type, String message, boolean read, OffsetDateTime createdAt) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(notification.getId(), notification.getType(), notification.getMessage(), notification.isRead(), notification.getCreatedAt());
    }
}

