CREATE INDEX idx_users_role_status ON users(role, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
CREATE INDEX idx_activity_user_created ON user_activity_log(user_id, created_at DESC);
CREATE INDEX idx_classes_teacher_status ON classes(teacher_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_classes_code ON classes(class_code);
CREATE INDEX idx_enrollments_student ON class_enrollments(student_id) WHERE dropped_at IS NULL;
CREATE INDEX idx_assignments_class_due ON assignments(class_id, due_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_submissions_assignment_status ON submissions(assignment_id, status);
CREATE INDEX idx_submissions_student ON submissions(student_id, submitted_at DESC);
CREATE INDEX idx_announcements_class_created ON announcements(class_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);

