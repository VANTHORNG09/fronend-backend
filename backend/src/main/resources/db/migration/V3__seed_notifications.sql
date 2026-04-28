INSERT INTO notifications (user_id, type, message)
SELECT id, 'WELCOME', 'Welcome to the LMS workspace.'
FROM users
WHERE deleted_at IS NULL;

