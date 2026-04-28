package com.lms.dto.request;

import jakarta.validation.constraints.NotBlank;

public record JoinClassRequest(@NotBlank String classCode) {
}

