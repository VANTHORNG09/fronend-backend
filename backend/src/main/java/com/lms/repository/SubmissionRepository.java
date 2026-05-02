package com.lms.repository;

import com.lms.entity.Submission;
import com.lms.entity.SubmissionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {
    Page<Submission> findByAssignmentId(UUID assignmentId, Pageable pageable);
    Page<Submission> findByStudentId(UUID studentId, Pageable pageable);
    long countByAssignmentId(UUID assignmentId);
    long countByAssignmentIdAndStatus(UUID assignmentId, SubmissionStatus status);
    long countByStudentIdAndStatus(UUID studentId, SubmissionStatus status);
    long countByAssignmentLmsClassTeacherIdAndStatus(UUID teacherId, SubmissionStatus status);
    Optional<Submission> findFirstByAssignmentIdAndStudentIdOrderByAttemptNumberDesc(UUID assignmentId, UUID studentId);
}

