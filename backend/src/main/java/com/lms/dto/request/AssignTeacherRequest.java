package com.lms.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignTeacherRequest(@NotNull UUID teacherId) {
}

