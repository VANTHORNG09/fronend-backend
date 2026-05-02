package com.lms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "assignments")
public class Assignment {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private LmsClass lmsClass;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "due_date", nullable = false)
    private OffsetDateTime dueDate;

    @Column(name = "publish_date")
    private OffsetDateTime publishDate;

    @Column(name = "max_points", nullable = false)
    private BigDecimal maxPoints = BigDecimal.valueOf(100);

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentType type = AssignmentType.TEXT_ENTRY;

    @Column(name = "allow_late")
    private boolean allowLate = true;

    @Column(name = "late_penalty_per_day")
    private BigDecimal latePenaltyPerDay = BigDecimal.ZERO;

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String rubric;

    private boolean draft = true;

    @Column(name = "allowed_file_types")
    private String allowedFileTypes;

    @Column(name = "max_file_size_mb")
    private Integer maxFileSizeMb = 25;

    @Column(name = "allow_group_submission")
    private boolean allowGroupSubmission;

    @Column(name = "deleted_at")
    private OffsetDateTime deletedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public LmsClass getLmsClass() { return lmsClass; }
    public void setLmsClass(LmsClass lmsClass) { this.lmsClass = lmsClass; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public OffsetDateTime getDueDate() { return dueDate; }
    public void setDueDate(OffsetDateTime dueDate) { this.dueDate = dueDate; }
    public OffsetDateTime getPublishDate() { return publishDate; }
    public void setPublishDate(OffsetDateTime publishDate) { this.publishDate = publishDate; }
    public BigDecimal getMaxPoints() { return maxPoints; }
    public void setMaxPoints(BigDecimal maxPoints) { this.maxPoints = maxPoints; }
    public AssignmentType getType() { return type; }
    public void setType(AssignmentType type) { this.type = type; }
    public boolean isAllowLate() { return allowLate; }
    public void setAllowLate(boolean allowLate) { this.allowLate = allowLate; }
    public BigDecimal getLatePenaltyPerDay() { return latePenaltyPerDay; }
    public void setLatePenaltyPerDay(BigDecimal latePenaltyPerDay) { this.latePenaltyPerDay = latePenaltyPerDay; }
    public String getRubric() { return rubric; }
    public void setRubric(String rubric) { this.rubric = rubric; }
    public boolean isDraft() { return draft; }
    public void setDraft(boolean draft) { this.draft = draft; }
    public String getAllowedFileTypes() { return allowedFileTypes; }
    public void setAllowedFileTypes(String allowedFileTypes) { this.allowedFileTypes = allowedFileTypes; }
    public Integer getMaxFileSizeMb() { return maxFileSizeMb; }
    public void setMaxFileSizeMb(Integer maxFileSizeMb) { this.maxFileSizeMb = maxFileSizeMb; }
    public boolean isAllowGroupSubmission() { return allowGroupSubmission; }
    public void setAllowGroupSubmission(boolean allowGroupSubmission) { this.allowGroupSubmission = allowGroupSubmission; }
    public OffsetDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(OffsetDateTime deletedAt) { this.deletedAt = deletedAt; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
