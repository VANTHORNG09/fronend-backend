package com.lms.controller;

import com.lms.config.AppConfig;
import com.lms.dto.request.AppealRequest;
import com.lms.dto.request.GradeSubmissionRequest;
import com.lms.dto.request.SubmitAssignmentRequest;
import com.lms.dto.response.SubmissionResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class SubmissionController {
    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping("/submissions")
    public Page<SubmissionResponse> submissions(@RequestParam(required = false) UUID assignmentId,
                                                @RequestParam(required = false) UUID studentId,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        UUID effectiveStudentId = principal.getUser().getRole().name().equals("STUDENT") ? principal.getId() : studentId;
        return submissionService.search(assignmentId, effectiveStudentId, AppConfig.page(page, size));
    }

    @PostMapping("/assignments/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public SubmissionResponse submit(@PathVariable UUID id, @Valid @RequestBody SubmitAssignmentRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        return submissionService.submit(id, principal.getUser(), request);
    }

    @GetMapping("/submissions/{id}")
    public SubmissionResponse get(@PathVariable UUID id) {
        return SubmissionResponse.from(submissionService.get(id));
    }

    @PutMapping("/submissions/{id}/grade")
    @PreAuthorize("hasRole('TEACHER')")
    public SubmissionResponse grade(@PathVariable UUID id, @Valid @RequestBody GradeSubmissionRequest request) {
        return submissionService.grade(id, request);
    }

    @PostMapping("/submissions/{id}/release")
    @PreAuthorize("hasRole('TEACHER')")
    public SubmissionResponse release(@PathVariable UUID id) {
        return submissionService.release(id);
    }

    @PostMapping("/submissions/{id}/appeal")
    @PreAuthorize("hasRole('STUDENT')")
    public SubmissionResponse appeal(@PathVariable UUID id, @Valid @RequestBody AppealRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        return submissionService.appeal(id, principal.getUser(), request);
    }

    @GetMapping("/assignments/{id}/submissions/download")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<byte[]> download(@PathVariable UUID id) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=submissions.zip")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(("Zip generation placeholder for assignment " + id).getBytes(StandardCharsets.UTF_8));
    }
}

