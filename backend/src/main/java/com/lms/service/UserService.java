package com.lms.service;

import com.lms.dto.request.ChangePasswordRequest;
import com.lms.dto.request.ProfileUpdateRequest;
import com.lms.dto.request.UserCreateRequest;
import com.lms.dto.response.ActivityResponse;
import com.lms.dto.response.ClassResponse;
import com.lms.dto.response.UserResponse;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.entity.UserStatus;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.ClassRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.UserActivityLogRepository;
import com.lms.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, ClassRepository classRepository, EnrollmentRepository enrollmentRepository, UserActivityLogRepository activityLogRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<UserResponse> search(Role role, UserStatus status, String search, org.springframework.data.domain.Pageable pageable) {
        return userRepository.search(role, status, search, pageable).map(UserResponse::from);
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email().toLowerCase());
        user.setRole(request.role());
        user.setStatus(UserStatus.ACTIVE);
        user.setPasswordHash(passwordEncoder.encode(request.initialPassword() == null || request.initialPassword().isBlank() ? "ChangeMe123!" : request.initialPassword()));
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateRole(UUID id, Role role) {
        User user = getUser(id);
        user.setRole(role);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateStatus(UUID id, UserStatus status) {
        User user = getUser(id);
        user.setStatus(status);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void softDelete(UUID id) {
        User user = getUser(id);
        user.setDeletedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    public List<ClassResponse> classesForUser(UUID id) {
        User user = getUser(id);
        if (user.getRole() == Role.TEACHER) {
            return classRepository.search(user.getId(), null, null, org.springframework.data.domain.Pageable.unpaged())
                    .map(c -> ClassResponse.from(c, enrollmentRepository.countByLmsClassIdAndDroppedAtIsNull(c.getId())))
                    .toList();
        }
        return enrollmentRepository.findByStudentIdAndDroppedAtIsNull(user.getId()).stream()
                .map(e -> ClassResponse.from(e.getLmsClass(), enrollmentRepository.countByLmsClassIdAndDroppedAtIsNull(e.getLmsClass().getId())))
                .toList();
    }

    public List<ActivityResponse> activity(UUID userId) {
        return activityLogRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId).stream().map(ActivityResponse::from).toList();
    }

    @Transactional
    public UserResponse updateProfile(User user, ProfileUpdateRequest request) {
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email().toLowerCase());
        user.setAvatarUrl(request.avatarUrl());
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserResponse enable2fa(User user) {
        user.setTwoFactorEnabled(true);
        user.setTotpSecret("otpauth://totp/LMS:" + user.getEmail() + "?secret=PLACEHOLDER&issuer=LMS");
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse disable2fa(User user) {
        user.setTwoFactorEnabled(false);
        user.setTotpSecret(null);
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void requestDelete(User user) {
        user.setDeleteRequestedAt(OffsetDateTime.now());
        userRepository.save(user);
    }

    public User getUser(UUID id) {
        return userRepository.findById(id).filter(u -> u.getDeletedAt() == null).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}

