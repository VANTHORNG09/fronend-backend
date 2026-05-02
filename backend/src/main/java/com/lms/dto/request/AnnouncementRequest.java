package com.lms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AnnouncementRequest(
        @NotNull UUID classId,
        @NotBlank String title,
        @NotBlank String message
) {
}

