package com.lms.dto.response;

import com.lms.entity.Assignment;
import com.lms.entity.AssignmentType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AssignmentResponse(
        UUID id,
        UUID classId,
        String className,
        String title,
        String description,
        OffsetDateTime dueDate,
        OffsetDateTime publishDate,
        BigDecimal maxPoints,
        AssignmentType type,
        boolean allowLate,
        BigDecimal latePenaltyPerDay,
        String rubric,
        boolean draft,
        OffsetDateTime createdAt
) {
    public static AssignmentResponse from(Assignment a) {
        return new AssignmentResponse(a.getId(), a.getLmsClass().getId(), a.getLmsClass().getName(), a.getTitle(), a.getDescription(), a.getDueDate(), a.getPublishDate(), a.getMaxPoints(), a.getType(), a.isAllowLate(), a.getLatePenaltyPerDay(), a.getRubric(), a.isDraft(), a.getCreatedAt());
    }
}

