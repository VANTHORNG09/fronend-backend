package com.lms.dto.request;

import com.lms.entity.AssignmentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AssignmentRequest(
        @NotNull UUID classId,
        @NotBlank String title,
        String description,
        @NotNull OffsetDateTime dueDate,
        OffsetDateTime publishDate,
        @Positive BigDecimal maxPoints,
        @NotNull AssignmentType type,
        boolean allowLate,
        BigDecimal latePenaltyPerDay,
        String rubric,
        boolean draft,
        String allowedFileTypes,
        Integer maxFileSizeMb,
        boolean allowGroupSubmission
) {
}

