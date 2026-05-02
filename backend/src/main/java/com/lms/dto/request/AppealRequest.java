package com.lms.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AppealRequest(@NotBlank String reason) {
}

