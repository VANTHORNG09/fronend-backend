package com.lms.service;

import com.lms.dto.request.AssignmentRequest;
import com.lms.dto.response.AssignmentResponse;
import com.lms.entity.Assignment;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.AssignmentRepository;
import com.lms.repository.ClassRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.math.BigDecimal;
import java.util.UUID;

@Service
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final ClassRepository classRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, ClassRepository classRepository) {
        this.assignmentRepository = assignmentRepository;
        this.classRepository = classRepository;
    }

    public Page<AssignmentResponse> search(UUID classId, UUID teacherId, String search, Pageable pageable) {
        return assignmentRepository.search(classId, teacherId, search, pageable).map(AssignmentResponse::from);
    }

    @Transactional
    public AssignmentResponse create(AssignmentRequest request) {
        Assignment assignment = new Assignment();
        apply(assignment, request);
        return AssignmentResponse.from(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentResponse update(UUID id, AssignmentRequest request) {
        Assignment assignment = get(id);
        apply(assignment, request);
        return AssignmentResponse.from(assignmentRepository.save(assignment));
    }

    @Transactional
    public void softDelete(UUID id) {
        Assignment assignment = get(id);
        assignment.setDeletedAt(OffsetDateTime.now());
        assignmentRepository.save(assignment);
    }

    @Transactional
    public AssignmentResponse publish(UUID id) {
        Assignment assignment = get(id);
        assignment.setDraft(false);
        if (assignment.getPublishDate() == null) {
            assignment.setPublishDate(OffsetDateTime.now());
        }
        return AssignmentResponse.from(assignmentRepository.save(assignment));
    }

    public Assignment get(UUID id) {
        return assignmentRepository.findById(id).filter(a -> a.getDeletedAt() == null).orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
    }

    private void apply(Assignment assignment, AssignmentRequest request) {
        assignment.setLmsClass(classRepository.findById(request.classId()).orElseThrow(() -> new ResourceNotFoundException("Class not found")));
        assignment.setTitle(request.title());
        assignment.setDescription(request.description());
        assignment.setDueDate(request.dueDate());
        assignment.setPublishDate(request.publishDate());
        assignment.setMaxPoints(request.maxPoints() == null ? BigDecimal.valueOf(100) : request.maxPoints());
        assignment.setType(request.type());
        assignment.setAllowLate(request.allowLate());
        assignment.setLatePenaltyPerDay(request.latePenaltyPerDay() == null ? BigDecimal.ZERO : request.latePenaltyPerDay());
        assignment.setRubric(request.rubric());
        assignment.setDraft(request.draft());
        assignment.setAllowedFileTypes(request.allowedFileTypes());
        assignment.setMaxFileSizeMb(request.maxFileSizeMb() == null ? 25 : request.maxFileSizeMb());
        assignment.setAllowGroupSubmission(request.allowGroupSubmission());
    }
}
