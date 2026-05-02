package com.lms.dto.request;

public record SubmitAssignmentRequest(
        String contentText,
        String fileUrls
) {
}

