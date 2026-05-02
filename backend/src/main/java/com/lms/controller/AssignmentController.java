package com.lms.controller;

import com.lms.config.AppConfig;
import com.lms.dto.request.AssignmentRequest;
import com.lms.dto.response.AssignmentResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {
    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public Page<AssignmentResponse> assignments(@RequestParam(required = false) UUID classId,
                                                @RequestParam(required = false) String search,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        UUID teacherId = principal.getUser().getRole().name().equals("TEACHER") ? principal.getId() : null;
        return assignmentService.search(classId, teacherId, search, AppConfig.page(page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public AssignmentResponse create(@Valid @RequestBody AssignmentRequest request) {
        return assignmentService.create(request);
    }

    @GetMapping("/{id}")
    public AssignmentResponse get(@PathVariable UUID id) {
        return AssignmentResponse.from(assignmentService.get(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public AssignmentResponse update(@PathVariable UUID id, @Valid @RequestBody AssignmentRequest request) {
        return assignmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public void delete(@PathVariable UUID id) {
        assignmentService.softDelete(id);
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('TEACHER')")
    public AssignmentResponse publish(@PathVariable UUID id) {
        return assignmentService.publish(id);
    }
}

