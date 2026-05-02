package com.lms.dto.response;

import com.lms.entity.ClassStatus;
import com.lms.entity.LmsClass;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ClassResponse(
        UUID id,
        String name,
        String description,
        String subject,
        UUID teacherId,
        String teacherName,
        String classCode,
        ClassStatus status,
        String schedule,
        LocalDate startDate,
        LocalDate endDate,
        long studentCount,
        OffsetDateTime createdAt
) {
    public static ClassResponse from(LmsClass c, long studentCount) {
        String teacherName = c.getTeacher() == null ? null : c.getTeacher().getFirstName() + " " + c.getTeacher().getLastName();
        UUID teacherId = c.getTeacher() == null ? null : c.getTeacher().getId();
        return new ClassResponse(c.getId(), c.getName(), c.getDescription(), c.getSubject(), teacherId, teacherName, c.getClassCode(), c.getStatus(), c.getSchedule(), c.getStartDate(), c.getEndDate(), studentCount, c.getCreatedAt());
    }
}

