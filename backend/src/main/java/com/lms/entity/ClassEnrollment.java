package com.lms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "class_enrollments")
public class ClassEnrollment {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private LmsClass lmsClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private OffsetDateTime enrolledAt = OffsetDateTime.now();
    private OffsetDateTime droppedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public LmsClass getLmsClass() { return lmsClass; }
    public void setLmsClass(LmsClass lmsClass) { this.lmsClass = lmsClass; }
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    public OffsetDateTime getEnrolledAt() { return enrolledAt; }
    public void setEnrolledAt(OffsetDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
    public OffsetDateTime getDroppedAt() { return droppedAt; }
    public void setDroppedAt(OffsetDateTime droppedAt) { this.droppedAt = droppedAt; }
}

