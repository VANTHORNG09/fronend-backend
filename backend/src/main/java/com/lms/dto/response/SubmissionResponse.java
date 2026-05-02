package com.lms.dto.response;

import com.lms.entity.Submission;
import com.lms.entity.SubmissionStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record SubmissionResponse(
        UUID id,
        UUID assignmentId,
        String assignmentTitle,
        UUID studentId,
        String studentName,
        String contentText,
        String fileUrls,
        OffsetDateTime submittedAt,
        BigDecimal grade,
        String feedback,
        SubmissionStatus status,
        OffsetDateTime gradedAt,
        boolean released,
        int attemptNumber
) {
    public static SubmissionResponse from(Submission s) {
        return new SubmissionResponse(s.getId(), s.getAssignment().getId(), s.getAssignment().getTitle(), s.getStudent().getId(), s.getStudent().getFirstName() + " " + s.getStudent().getLastName(), s.getContentText(), s.getFileUrls(), s.getSubmittedAt(), s.getGrade(), s.getFeedback(), s.getStatus(), s.getGradedAt(), s.isReleased(), s.getAttemptNumber());
    }
}

