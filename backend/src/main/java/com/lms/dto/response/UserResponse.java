package com.lms.dto.response;

import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.entity.UserStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Role role,
        UserStatus status,
        String avatarUrl,
        OffsetDateTime lastLogin,
        OffsetDateTime createdAt,
        boolean twoFactorEnabled
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getStatus(),
                user.getAvatarUrl(),
                user.getLastLogin(),
                user.getCreatedAt(),
                user.isTwoFactorEnabled()
        );
    }
}

