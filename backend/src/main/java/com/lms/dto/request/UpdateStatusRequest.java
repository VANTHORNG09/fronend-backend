package com.lms.dto.request;

import com.lms.entity.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(@NotNull UserStatus status) {
}

