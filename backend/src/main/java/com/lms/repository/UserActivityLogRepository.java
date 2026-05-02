package com.lms.repository;

import com.lms.entity.UserActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, UUID> {
    List<UserActivityLog> findTop10ByUserIdOrderByCreatedAtDesc(UUID userId);
}

