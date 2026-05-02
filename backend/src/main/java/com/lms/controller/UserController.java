package com.lms.controller;

import com.lms.config.AppConfig;
import com.lms.dto.request.UpdateRoleRequest;
import com.lms.dto.request.UpdateStatusRequest;
import com.lms.dto.request.UserCreateRequest;
import com.lms.dto.response.ClassResponse;
import com.lms.dto.response.UserResponse;
import com.lms.entity.Role;
import com.lms.entity.UserStatus;
import com.lms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Page<UserResponse> users(@RequestParam(required = false) Role role,
                                    @RequestParam(required = false) UserStatus status,
                                    @RequestParam(required = false) String search,
                                    @RequestParam(defaultValue = "0") int page,
                                    @RequestParam(defaultValue = "20") int size) {
        return userService.search(role, status, search, AppConfig.page(page, size));
    }

    @PostMapping
    public UserResponse create(@Valid @RequestBody UserCreateRequest request) {
        return userService.create(request);
    }

    @PatchMapping("/{id}/role")
    public UserResponse role(@PathVariable UUID id, @Valid @RequestBody UpdateRoleRequest request) {
        return userService.updateRole(id, request.role());
    }

    @PatchMapping("/{id}/status")
    public UserResponse status(@PathVariable UUID id, @Valid @RequestBody UpdateStatusRequest request) {
        return userService.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        userService.softDelete(id);
    }

    @GetMapping("/{id}/classes")
    public List<ClassResponse> classes(@PathVariable UUID id) {
        return userService.classesForUser(id);
    }

    @PostMapping("/import")
    public ResponseEntity<String> importUsers() {
        return ResponseEntity.accepted().body("CSV import placeholder accepted. Wire file storage/queue for production batch creation.");
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportUsers() {
        String csv = "name,email,role,status\n";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=users.csv")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }
}

