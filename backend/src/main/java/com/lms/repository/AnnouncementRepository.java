package com.lms.repository;

import com.lms.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
    List<Announcement> findTop10ByLmsClassIdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID classId);
    List<Announcement> findByLmsClassIdAndDeletedAtIsNullOrderByCreatedAtDesc(UUID classId);
}
