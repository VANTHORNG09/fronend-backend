package com.lms.controller;

import com.lms.dto.request.AnnouncementRequest;
import com.lms.entity.Announcement;
import com.lms.repository.AnnouncementRepository;
import com.lms.service.ClassService;
import com.lms.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementRepository announcementRepository;
    private final ClassService classService;

    public AnnouncementController(AnnouncementRepository announcementRepository, ClassService classService) {
        this.announcementRepository = announcementRepository;
        this.classService = classService;
    }

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public Announcement create(@Valid @RequestBody AnnouncementRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        Announcement announcement = new Announcement();
        announcement.setLmsClass(classService.get(request.classId()));
        announcement.setTeacher(principal.getUser());
        announcement.setTitle(request.title());
        announcement.setMessage(request.message());
        return announcementRepository.save(announcement);
    }
}

