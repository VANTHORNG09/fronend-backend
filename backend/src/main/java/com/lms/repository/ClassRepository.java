package com.lms.repository;

import com.lms.entity.ClassStatus;
import com.lms.entity.LmsClass;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface ClassRepository extends JpaRepository<LmsClass, UUID> {
    Optional<LmsClass> findByClassCode(String classCode);
    long countByDeletedAtIsNull();
    long countByTeacherIdAndDeletedAtIsNull(UUID teacherId);

    @Query("""
        select c from LmsClass c
        where c.deletedAt is null
          and (:teacherId is null or c.teacher.id = :teacherId)
          and (:status is null or c.status = :status)
          and (:search is null or lower(concat(c.name, ' ', c.subject, ' ', c.classCode)) like lower(concat('%', :search, '%')))
        """)
    Page<LmsClass> search(UUID teacherId, ClassStatus status, String search, Pageable pageable);
}

