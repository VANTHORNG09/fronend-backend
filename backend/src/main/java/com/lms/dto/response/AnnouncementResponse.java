package com.lms.dto.response;

import com.lms.entity.Announcement;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AnnouncementResponse(
        UUID id,
        UUID classId,
        UUID teacherId,
        String teacherName,
        String title,
        String message,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static AnnouncementResponse from(Announcement announcement) {
        return new AnnouncementResponse(
                announcement.getId(),
                announcement.getLmsClass().getId(),
                announcement.getTeacher().getId(),
                announcement.getTeacher().getFirstName() + " " + announcement.getTeacher().getLastName(),
                announcement.getTitle(),
                announcement.getMessage(),
                announcement.getCreatedAt(),
                announcement.getUpdatedAt()
        );
    }
}

