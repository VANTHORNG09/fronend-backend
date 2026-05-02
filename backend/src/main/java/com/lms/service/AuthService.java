package com.lms.service;

import com.lms.config.JwtUtils;
import com.lms.dto.request.LoginRequest;
import com.lms.dto.request.RefreshTokenRequest;
import com.lms.dto.response.JwtResponse;
import com.lms.dto.response.UserResponse;
import com.lms.entity.RefreshToken;
import com.lms.entity.User;
import com.lms.exception.UnauthorizedException;
import com.lms.repository.RefreshTokenRepository;
import com.lms.repository.UserRepository;
import com.lms.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public AuthService(AuthenticationManager authenticationManager, JwtUtils jwtUtils, RefreshTokenRepository refreshTokenRepository, UserRepository userRepository, AuditService auditService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public JwtResponse login(LoginRequest request, HttpServletRequest servletRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = principal.getUser();
        user.setLastLogin(OffsetDateTime.now());
        userRepository.save(user);
        auditService.log(user, "LOGIN", servletRequest);
        return issueTokens(principal);
    }

    @Transactional
    public JwtResponse refresh(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(hash(request.refreshToken()))
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        if (refreshToken.getRevokedAt() != null || refreshToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new UnauthorizedException("Expired refresh token");
        }
        return issueTokens(new UserPrincipal(refreshToken.getUser()));
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenRepository.findByTokenHash(hash(request.refreshToken())).ifPresent(token -> {
            token.setRevokedAt(OffsetDateTime.now());
            refreshTokenRepository.save(token);
        });
    }

    private JwtResponse issueTokens(UserPrincipal principal) {
        String refreshPlain = UUID.randomUUID() + "." + UUID.randomUUID();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(principal.getUser());
        refreshToken.setTokenHash(hash(refreshPlain));
        refreshToken.setExpiresAt(OffsetDateTime.now().plusDays(jwtUtils.refreshTokenDays()));
        refreshTokenRepository.save(refreshToken);
        return new JwtResponse(jwtUtils.generateAccessToken(principal), refreshPlain, "Bearer", jwtUtils.accessTokenSeconds(), UserResponse.from(principal.getUser()));
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}

