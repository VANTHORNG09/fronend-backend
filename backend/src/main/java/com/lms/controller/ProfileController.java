package com.lms.controller;

import com.lms.dto.request.ChangePasswordRequest;
import com.lms.dto.request.ProfileUpdateRequest;
import com.lms.dto.response.ActivityResponse;
import com.lms.dto.response.UserResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse profile(@AuthenticationPrincipal UserPrincipal principal) {
        return UserResponse.from(principal.getUser());
    }

    @PutMapping
    public UserResponse update(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody ProfileUpdateRequest request) {
        return userService.updateProfile(principal.getUser(), request);
    }

    @PutMapping("/change-password")
    public void changePassword(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getUser(), request);
    }

    @PutMapping("/avatar")
    public UserResponse avatar(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Map<String, String> request) {
        return userService.updateProfile(principal.getUser(), new ProfileUpdateRequest(principal.getUser().getFirstName(), principal.getUser().getLastName(), principal.getUser().getEmail(), request.get("avatarUrl")));
    }

    @PostMapping("/enable-2fa")
    public Map<String, Object> enable2fa(@AuthenticationPrincipal UserPrincipal principal) {
        UserResponse user = userService.enable2fa(principal.getUser());
        return Map.of("user", user, "qrCodeUrl", "otpauth://totp/LMS:" + user.email() + "?secret=PLACEHOLDER&issuer=LMS");
    }

    @PostMapping("/disable-2fa")
    public UserResponse disable2fa(@AuthenticationPrincipal UserPrincipal principal) {
        return userService.disable2fa(principal.getUser());
    }

    @GetMapping("/activity-log")
    public List<ActivityResponse> activity(@AuthenticationPrincipal UserPrincipal principal) {
        return userService.activity(principal.getId());
    }

    @DeleteMapping
    public void delete(@AuthenticationPrincipal UserPrincipal principal) {
        userService.requestDelete(principal.getUser());
    }
}

