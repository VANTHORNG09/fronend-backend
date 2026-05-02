package com.lms.controller;

import com.lms.dto.response.NotificationResponse;
import com.lms.repository.NotificationRepository;
import com.lms.security.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public List<NotificationResponse> notifications(@AuthenticationPrincipal UserPrincipal principal) {
        return notificationRepository.findTop20ByUserIdOrderByCreatedAtDesc(principal.getId()).stream().map(NotificationResponse::from).toList();
    }

    @PatchMapping("/{id}/read")
    public NotificationResponse read(@PathVariable UUID id) {
        var notification = notificationRepository.findById(id).orElseThrow();
        notification.setRead(true);
        return NotificationResponse.from(notificationRepository.save(notification));
    }
}

