package com.lms.dto.request;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

public record AddStudentsRequest(@NotEmpty List<UUID> studentIds) {
}

