package com.lms.repository;

import com.lms.entity.ClassEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<ClassEnrollment, UUID> {
    long countByLmsClassIdAndDroppedAtIsNull(UUID classId);
    long countByStudentIdAndDroppedAtIsNull(UUID studentId);
    List<ClassEnrollment> findByLmsClassIdAndDroppedAtIsNull(UUID classId);
    List<ClassEnrollment> findByStudentIdAndDroppedAtIsNull(UUID studentId);
    Optional<ClassEnrollment> findByLmsClassIdAndStudentId(UUID classId, UUID studentId);
}

