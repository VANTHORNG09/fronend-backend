package com.lms.service;

import com.lms.dto.request.ClassRequest;
import com.lms.dto.response.ClassResponse;
import com.lms.dto.response.UserResponse;
import com.lms.entity.ClassEnrollment;
import com.lms.entity.ClassStatus;
import com.lms.entity.LmsClass;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.ClassRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.UserRepository;
import com.lms.util.ClassCodeGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ClassService {
    private final ClassRepository classRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public ClassService(ClassRepository classRepository, UserRepository userRepository, EnrollmentRepository enrollmentRepository) {
        this.classRepository = classRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public Page<ClassResponse> search(UUID teacherId, ClassStatus status, String search, Pageable pageable) {
        return classRepository.search(teacherId, status, search, pageable)
                .map(c -> ClassResponse.from(c, enrollmentRepository.countByLmsClassIdAndDroppedAtIsNull(c.getId())));
    }

    @Transactional
    public ClassResponse create(ClassRequest request) {
        LmsClass c = new LmsClass();
        apply(c, request);
        c.setClassCode(uniqueCode());
        return ClassResponse.from(classRepository.save(c), 0);
    }

    @Transactional
    public ClassResponse update(UUID id, ClassRequest request) {
        LmsClass c = get(id);
        apply(c, request);
        return ClassResponse.from(classRepository.save(c), enrollmentRepository.countByLmsClassIdAndDroppedAtIsNull(id));
    }

    @Transactional
    public void archive(UUID id) {
        LmsClass c = get(id);
        c.setStatus(ClassStatus.ARCHIVED);
        c.setDeletedAt(OffsetDateTime.now());
        classRepository.save(c);
    }

    @Transactional
    public List<UserResponse> addStudents(UUID classId, List<UUID> studentIds) {
        LmsClass c = get(classId);
        for (UUID studentId : studentIds) {
            User student = userRepository.findById(studentId).filter(u -> u.getRole() == Role.STUDENT).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
            enrollmentRepository.findByLmsClassIdAndStudentId(classId, studentId).orElseGet(() -> {
                ClassEnrollment enrollment = new ClassEnrollment();
                enrollment.setLmsClass(c);
                enrollment.setStudent(student);
                return enrollmentRepository.save(enrollment);
            });
        }
        return students(classId);
    }

    @Transactional
    public void removeStudent(UUID classId, UUID studentId) {
        enrollmentRepository.findByLmsClassIdAndStudentId(classId, studentId).ifPresent(e -> {
            e.setDroppedAt(OffsetDateTime.now());
            enrollmentRepository.save(e);
        });
    }

    public List<UserResponse> students(UUID classId) {
        return enrollmentRepository.findByLmsClassIdAndDroppedAtIsNull(classId).stream()
                .map(e -> UserResponse.from(e.getStudent()))
                .toList();
    }

    @Transactional
    public ClassResponse assignTeacher(UUID classId, UUID teacherId) {
        LmsClass c = get(classId);
        User teacher = userRepository.findById(teacherId).filter(u -> u.getRole() == Role.TEACHER).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        c.setTeacher(teacher);
        return ClassResponse.from(classRepository.save(c), enrollmentRepository.countByLmsClassIdAndDroppedAtIsNull(classId));
    }

    @Transactional
    public ClassResponse copy(UUID classId) {
        LmsClass original = get(classId);
        LmsClass copy = new LmsClass();
        copy.setName(original.getName() + " Copy");
        copy.setDescription(original.getDescription());
        copy.setSubject(original.getSubject());
        copy.setTeacher(original.getTeacher());
        copy.setSchedule(original.getSchedule());
        copy.setStartDate(original.getStartDate());
        copy.setEndDate(original.getEndDate());
        copy.setClassCode(uniqueCode());
        return ClassResponse.from(classRepository.save(copy), 0);
    }

    public LmsClass get(UUID id) {
        return classRepository.findById(id).filter(c -> c.getDeletedAt() == null).orElseThrow(() -> new ResourceNotFoundException("Class not found"));
    }

    private void apply(LmsClass c, ClassRequest request) {
        c.setName(request.name());
        c.setDescription(request.description());
        c.setSubject(request.subject());
        c.setSchedule(request.schedule());
        c.setStartDate(request.startDate());
        c.setEndDate(request.endDate());
        if (request.teacherId() != null) {
            User teacher = userRepository.findById(request.teacherId()).filter(u -> u.getRole() == Role.TEACHER).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            c.setTeacher(teacher);
        }
    }

    private String uniqueCode() {
        String code;
        do {
            code = ClassCodeGenerator.generate();
        } while (classRepository.findByClassCode(code).isPresent());
        return code;
    }
}

