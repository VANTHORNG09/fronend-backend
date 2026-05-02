package com.lms.dto.request;

import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record GradeSubmissionRequest(
        @PositiveOrZero BigDecimal grade,
        String feedback,
        boolean draft
) {
}

