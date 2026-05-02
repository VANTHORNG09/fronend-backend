package com.lms.service;

import com.lms.dto.request.AppealRequest;
import com.lms.dto.request.GradeSubmissionRequest;
import com.lms.dto.request.SubmitAssignmentRequest;
import com.lms.dto.response.SubmissionResponse;
import com.lms.entity.Assignment;
import com.lms.entity.Submission;
import com.lms.entity.SubmissionStatus;
import com.lms.entity.User;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.AssignmentRepository;
import com.lms.repository.SubmissionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;

    public SubmissionService(SubmissionRepository submissionRepository, AssignmentRepository assignmentRepository) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public Page<SubmissionResponse> search(UUID assignmentId, UUID studentId, Pageable pageable) {
        if (assignmentId != null) {
            return submissionRepository.findByAssignmentId(assignmentId, pageable).map(SubmissionResponse::from);
        }
        if (studentId != null) {
            return submissionRepository.findByStudentId(studentId, pageable).map(SubmissionResponse::from);
        }
        return submissionRepository.findAll(pageable).map(SubmissionResponse::from);
    }

    @Transactional
    public SubmissionResponse submit(UUID assignmentId, User student, SubmitAssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        Submission previous = submissionRepository.findFirstByAssignmentIdAndStudentIdOrderByAttemptNumberDesc(assignmentId, student.getId()).orElse(null);
        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setContentText(request.contentText());
        submission.setFileUrls(request.fileUrls());
        submission.setSubmittedAt(OffsetDateTime.now());
        submission.setAttemptNumber(previous == null ? 1 : previous.getAttemptNumber() + 1);
        submission.setStatus(assignment.getDueDate().isBefore(OffsetDateTime.now()) ? SubmissionStatus.LATE : SubmissionStatus.SUBMITTED);
        return SubmissionResponse.from(submissionRepository.save(submission));
    }

    @Transactional
    public SubmissionResponse grade(UUID id, GradeSubmissionRequest request) {
        Submission submission = get(id);
        submission.setGrade(request.grade());
        submission.setFeedback(request.feedback());
        submission.setGradedAt(OffsetDateTime.now());
        submission.setStatus(SubmissionStatus.GRADED);
        submission.setReleased(!request.draft());
        return SubmissionResponse.from(submissionRepository.save(submission));
    }

    @Transactional
    public SubmissionResponse release(UUID id) {
        Submission submission = get(id);
        submission.setReleased(true);
        submission.setStatus(SubmissionStatus.RETURNED);
        return SubmissionResponse.from(submissionRepository.save(submission));
    }

    @Transactional
    public SubmissionResponse appeal(UUID id, User student, AppealRequest request) {
        Submission submission = get(id);
        if (!submission.getStudent().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Cannot appeal another student's submission");
        }
        submission.setAppealReason(request.reason());
        return SubmissionResponse.from(submissionRepository.save(submission));
    }

    public Submission get(UUID id) {
        return submissionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
    }
}

