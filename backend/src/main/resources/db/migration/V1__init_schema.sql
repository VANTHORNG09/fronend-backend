CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    avatar_url TEXT,
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    totp_secret VARCHAR(128),
    delete_requested_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(64),
    device VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(160) NOT NULL,
    description TEXT,
    subject VARCHAR(120),
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    class_code VARCHAR(16) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
    schedule TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    dropped_at TIMESTAMPTZ,
    UNIQUE (class_id, student_id)
);

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    publish_date TIMESTAMPTZ,
    max_points NUMERIC(8,2) NOT NULL DEFAULT 100,
    type VARCHAR(30) NOT NULL CHECK (type IN ('FILE_UPLOAD', 'TEXT_ENTRY', 'QUIZ')),
    allow_late BOOLEAN NOT NULL DEFAULT TRUE,
    late_penalty_per_day NUMERIC(5,2) NOT NULL DEFAULT 0,
    rubric JSONB,
    draft BOOLEAN NOT NULL DEFAULT TRUE,
    allowed_file_types TEXT,
    max_file_size_mb INTEGER DEFAULT 25,
    allow_group_submission BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_text TEXT,
    file_urls TEXT,
    submitted_at TIMESTAMPTZ,
    grade NUMERIC(8,2),
    feedback TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'MISSING' CHECK (status IN ('MISSING', 'SUBMITTED', 'LATE', 'GRADED', 'RETURNED')),
    graded_at TIMESTAMPTZ,
    released BOOLEAN NOT NULL DEFAULT FALSE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    appeal_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (assignment_id, student_id, attempt_number)
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(60) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_new_assignment BOOLEAN NOT NULL DEFAULT TRUE,
    app_new_assignment BOOLEAN NOT NULL DEFAULT TRUE,
    email_submission_graded BOOLEAN NOT NULL DEFAULT TRUE,
    app_submission_graded BOOLEAN NOT NULL DEFAULT TRUE,
    email_class_announcement BOOLEAN NOT NULL DEFAULT TRUE,
    app_class_announcement BOOLEAN NOT NULL DEFAULT TRUE,
    language VARCHAR(20) NOT NULL DEFAULT 'en',
    theme VARCHAR(20) NOT NULL DEFAULT 'system'
);

INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified)
VALUES
('admin@lms.local', '{noop}Password123!', 'System', 'Admin', 'ADMIN', 'ACTIVE', TRUE),
('teacher@lms.local', '{noop}Password123!', 'Demo', 'Teacher', 'TEACHER', 'ACTIVE', TRUE),
('student@lms.local', '{noop}Password123!', 'Demo', 'Student', 'STUDENT', 'ACTIVE', TRUE);

INSERT INTO classes (name, description, subject, teacher_id, class_code, start_date, end_date)
SELECT 'Full Stack Foundations', 'Demo course for the LMS workspace.', 'Software Engineering', id, 'FSF2026', CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days'
FROM users WHERE email = 'teacher@lms.local';

INSERT INTO class_enrollments (class_id, student_id)
SELECT c.id, u.id FROM classes c CROSS JOIN users u WHERE c.class_code = 'FSF2026' AND u.email = 'student@lms.local';

INSERT INTO assignments (class_id, title, description, due_date, publish_date, max_points, type, draft, rubric)
SELECT id, 'API Design Brief', 'Write a short REST API design brief.', now() + INTERVAL '7 days', now() - INTERVAL '1 day', 100, 'TEXT_ENTRY', FALSE, '{"criteria":["Completeness","Clarity","Validation"]}'::jsonb
FROM classes WHERE class_code = 'FSF2026';
