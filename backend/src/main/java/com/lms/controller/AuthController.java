package com.lms.controller;

import com.lms.dto.request.LoginRequest;
import com.lms.dto.request.RefreshTokenRequest;
import com.lms.dto.request.UserCreateRequest;
import com.lms.dto.response.JwtResponse;
import com.lms.dto.response.UserResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.AuthService;
import com.lms.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public JwtResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        return authService.login(request, servletRequest);
    }

    @PostMapping("/refresh")
    public JwtResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/logout")
    public void logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal UserPrincipal principal) {
        return UserResponse.from(principal.getUser());
    }

    @PostMapping("/register")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public UserResponse register(@Valid @RequestBody UserCreateRequest request) {
        return userService.create(request);
    }
}
