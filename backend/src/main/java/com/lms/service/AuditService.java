package com.lms.service;

import com.lms.entity.User;
import com.lms.entity.UserActivityLog;
import com.lms.repository.UserActivityLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final UserActivityLogRepository repository;

    public AuditService(UserActivityLogRepository repository) {
        this.repository = repository;
    }

    public void log(User user, String action, HttpServletRequest request) {
        UserActivityLog log = new UserActivityLog();
        log.setUser(user);
        log.setAction(action);
        log.setIpAddress(request == null ? null : request.getRemoteAddr());
        log.setDevice(request == null ? null : request.getHeader("User-Agent"));
        repository.save(log);
    }
}

