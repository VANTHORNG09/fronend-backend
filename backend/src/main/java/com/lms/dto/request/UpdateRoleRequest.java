package com.lms.dto.request;

import com.lms.entity.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateRoleRequest(@NotNull Role role) {
}

