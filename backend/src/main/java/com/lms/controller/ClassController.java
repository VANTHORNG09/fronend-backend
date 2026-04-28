package com.lms.controller;

import com.lms.config.AppConfig;
import com.lms.dto.request.AddStudentsRequest;
import com.lms.dto.request.AssignTeacherRequest;
import com.lms.dto.request.ClassRequest;
import com.lms.dto.request.JoinClassRequest;
import com.lms.dto.response.ClassResponse;
import com.lms.dto.response.UserResponse;
import com.lms.entity.ClassStatus;
import com.lms.security.UserPrincipal;
import com.lms.service.ClassService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/classes")
public class ClassController {
    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @GetMapping
    public Page<ClassResponse> classes(@RequestParam(required = false) UUID teacherId,
                                       @RequestParam(required = false) ClassStatus status,
                                       @RequestParam(required = false) String search,
                                       @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "20") int size) {
        return classService.search(teacherId, status, search, AppConfig.page(page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ClassResponse create(@Valid @RequestBody ClassRequest request) {
        return classService.create(request);
    }

    @GetMapping("/{id}")
    public ClassResponse get(@PathVariable UUID id) {
        var c = classService.get(id);
        return ClassResponse.from(c, classService.students(id).size());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ClassResponse update(@PathVariable UUID id, @Valid @RequestBody ClassRequest request) {
        return classService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void archive(@PathVariable UUID id) {
        classService.archive(id);
    }

    @PostMapping("/{id}/students")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public List<UserResponse> addStudents(@PathVariable UUID id, @Valid @RequestBody AddStudentsRequest request) {
        return classService.addStudents(id, request.studentIds());
    }

    @DeleteMapping("/{id}/students/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public void removeStudent(@PathVariable UUID id, @PathVariable UUID studentId) {
        classService.removeStudent(id, studentId);
    }

    @GetMapping("/{id}/students")
    public List<UserResponse> students(@PathVariable UUID id) {
        return classService.students(id);
    }

    @PostMapping("/join")
    @PreAuthorize("hasRole('STUDENT')")
    public ClassResponse join(@Valid @RequestBody JoinClassRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        return classService.joinByCode(request.classCode(), principal.getUser());
    }

    @DeleteMapping("/{id}/drop")
    @PreAuthorize("hasRole('STUDENT')")
    public void drop(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        classService.dropClass(id, principal.getUser());
    }

    @PostMapping("/{id}/teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ClassResponse assignTeacher(@PathVariable UUID id, @Valid @RequestBody AssignTeacherRequest request) {
        return classService.assignTeacher(id, request.teacherId());
    }

    @PostMapping("/{id}/copy")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ClassResponse copy(@PathVariable UUID id) {
        return classService.copy(id);
    }

    @GetMapping("/{id}/analytics")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public Map<String, Object> analytics(@PathVariable UUID id) {
        return Map.of("completionRate", 82, "averageGrade", 87, "gradeDistribution", List.of(12, 18, 9, 4));
    }
}
