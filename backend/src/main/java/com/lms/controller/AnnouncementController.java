package com.lms.controller;

import com.lms.dto.request.AnnouncementRequest;
import com.lms.dto.response.AnnouncementResponse;
import com.lms.entity.Announcement;
import com.lms.entity.Notification;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.AnnouncementRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.NotificationRepository;
import com.lms.service.ClassService;
import com.lms.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementRepository announcementRepository;
    private final ClassService classService;
    private final EnrollmentRepository enrollmentRepository;
    private final NotificationRepository notificationRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository, ClassService classService, EnrollmentRepository enrollmentRepository, NotificationRepository notificationRepository) {
        this.announcementRepository = announcementRepository;
        this.classService = classService;
        this.enrollmentRepository = enrollmentRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public AnnouncementResponse create(@Valid @RequestBody AnnouncementRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        Announcement announcement = new Announcement();
        announcement.setLmsClass(classService.get(request.classId()));
        announcement.setTeacher(principal.getUser());
        announcement.setTitle(request.title());
        announcement.setMessage(request.message());
        Announcement saved = announcementRepository.save(announcement);
        enrollmentRepository.findByLmsClassIdAndDroppedAtIsNull(request.classId()).forEach(enrollment -> {
            Notification notification = new Notification();
            notification.setUser(enrollment.getStudent());
            notification.setType("CLASS_ANNOUNCEMENT");
            notification.setMessage(saved.getTitle() + " in " + saved.getLmsClass().getName());
            notificationRepository.save(notification);
        });
        return AnnouncementResponse.from(saved);
    }

    @GetMapping
    public List<AnnouncementResponse> list(@RequestParam UUID classId) {
        return announcementRepository.findByLmsClassIdAndDeletedAtIsNullOrderByCreatedAtDesc(classId)
                .stream()
                .map(AnnouncementResponse::from)
                .toList();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public AnnouncementResponse update(@PathVariable UUID id, @Valid @RequestBody AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
        announcement.setTitle(request.title());
        announcement.setMessage(request.message());
        announcement.setUpdatedAt(OffsetDateTime.now());
        return AnnouncementResponse.from(announcementRepository.save(announcement));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public void delete(@PathVariable UUID id) {
        Announcement announcement = announcementRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Announcement not found"));
        announcement.setDeletedAt(OffsetDateTime.now());
        announcementRepository.save(announcement);
    }
}
