package com.lms.service;

import com.lms.dto.response.ActivityResponse;
import com.lms.dto.response.DashboardResponse;
import com.lms.entity.Role;
import com.lms.entity.SubmissionStatus;
import com.lms.entity.User;
import com.lms.repository.AssignmentRepository;
import com.lms.repository.ClassRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.SubmissionRepository;
import com.lms.repository.UserActivityLogRepository;
import com.lms.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserActivityLogRepository activityLogRepository;

    public DashboardService(UserRepository userRepository, ClassRepository classRepository, AssignmentRepository assignmentRepository, SubmissionRepository submissionRepository, EnrollmentRepository enrollmentRepository, UserActivityLogRepository activityLogRepository) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public DashboardResponse forUser(User user) {
        Map<String, Number> stats = new LinkedHashMap<>();
        if (user.getRole() == Role.ADMIN) {
            stats.put("totalUsers", userRepository.count());
            stats.put("totalClasses", classRepository.countByDeletedAtIsNull());
            stats.put("totalAssignments", assignmentRepository.countByDeletedAtIsNull());
            stats.put("recentActivity", activityLogRepository.count());
        } else if (user.getRole() == Role.TEACHER) {
            stats.put("myClasses", classRepository.countByTeacherIdAndDeletedAtIsNull(user.getId()));
            stats.put("assignmentsCreated", assignmentRepository.countByLmsClassTeacherIdAndDeletedAtIsNull(user.getId()));
            stats.put("pendingSubmissions", submissionRepository.countByAssignmentLmsClassTeacherIdAndStatus(user.getId(), SubmissionStatus.SUBMITTED));
            stats.put("upcomingDeadlines", assignmentRepository.countByDueDateAfterAndDeletedAtIsNull(OffsetDateTime.now()));
        } else {
            stats.put("enrolledClasses", enrollmentRepository.countByStudentIdAndDroppedAtIsNull(user.getId()));
            stats.put("submitted", submissionRepository.countByStudentIdAndStatus(user.getId(), SubmissionStatus.SUBMITTED));
            stats.put("pending", submissionRepository.countByStudentIdAndStatus(user.getId(), SubmissionStatus.MISSING));
            stats.put("graded", submissionRepository.countByStudentIdAndStatus(user.getId(), SubmissionStatus.GRADED));
        }
        return new DashboardResponse(
                stats,
                activityLogRepository.findTop10ByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(ActivityResponse::from).toList(),
                demoCharts(user.getRole()),
                List.of(Map.of("title", "API Design Brief", "dueDate", OffsetDateTime.now().plusDays(7), "kind", "assignment")),
                tips(user.getRole())
        );
    }

    private Map<String, List<Map<String, Object>>> demoCharts(Role role) {
        String key = role == Role.ADMIN ? "userGrowth" : role == Role.TEACHER ? "submissionRate" : "gradeProgress";
        return Map.of(key, List.of(
                Map.of("label", "Jan", "value", 63),
                Map.of("label", "Feb", "value", 71),
                Map.of("label", "Mar", "value", 78),
                Map.of("label", "Apr", "value", 84)
        ));
    }

    private List<String> tips(Role role) {
        if (role == Role.ADMIN) return List.of("Review inactive users weekly.", "Archive completed classes after end dates.");
        if (role == Role.TEACHER) return List.of("Publish assignments early to give students runway.", "Use draft grades before releasing feedback.");
        return List.of("Check upcoming due dates daily.", "Review rubric criteria before submitting.");
    }
}

