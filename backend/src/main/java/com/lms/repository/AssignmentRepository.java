package com.lms.repository;

import com.lms.entity.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    long countByDeletedAtIsNull();
    long countByLmsClassTeacherIdAndDeletedAtIsNull(UUID teacherId);
    long countByLmsClassIdAndDeletedAtIsNull(UUID classId);
    List<Assignment> findTop5ByLmsClassIdAndDeletedAtIsNullOrderByDueDateAsc(UUID classId);

    @Query("""
        select a from Assignment a
        where a.deletedAt is null
          and (:classId is null or a.lmsClass.id = :classId)
          and (:teacherId is null or a.lmsClass.teacher.id = :teacherId)
          and (:search is null or lower(a.title) like lower(concat('%', :search, '%')))
        order by a.dueDate asc
        """)
    Page<Assignment> search(UUID classId, UUID teacherId, String search, Pageable pageable);

    long countByDueDateAfterAndDeletedAtIsNull(OffsetDateTime after);
}

