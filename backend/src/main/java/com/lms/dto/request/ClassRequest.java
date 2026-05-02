package com.lms.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.UUID;

public record ClassRequest(
        @NotBlank String name,
        String description,
        String subject,
        String schedule,
        UUID teacherId,
        LocalDate startDate,
        LocalDate endDate
) {
}

