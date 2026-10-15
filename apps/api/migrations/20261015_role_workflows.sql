ALTER TABLE grades
  ADD COLUMN approval_status ENUM('draft', 'submitted', 'approved', 'rejected')
    NOT NULL DEFAULT 'approved',
  ADD COLUMN submitted_at DATETIME NULL,
  ADD COLUMN approved_by INT NULL,
  ADD COLUMN approved_at DATETIME NULL;

ALTER TABLE payments
  ADD COLUMN verification_status ENUM('pending', 'verified', 'rejected')
    NOT NULL DEFAULT 'verified',
  ADD COLUMN verified_by INT NULL,
  ADD COLUMN verified_at DATETIME NULL;

ALTER TABLE course_sections
  ADD COLUMN offering_status ENUM('submitted', 'approved', 'rejected')
    NOT NULL DEFAULT 'approved';

ALTER TABLE students
  MODIFY COLUMN status ENUM('pending', 'active', 'rejected', 'graduated', 'withdrawn', 'suspended')
    NULL DEFAULT 'active';

INSERT INTO students (user_id, student_code, admission_date, current_semester, status)
SELECT u.id, CONCAT('STU-', LPAD(u.id, 6, '0')), CURRENT_DATE, 1, 'active'
FROM users u
JOIN roles r ON r.id = u.role_id AND r.name = 'student'
LEFT JOIN students s ON s.user_id = u.id
WHERE s.id IS NULL;

CREATE TABLE financial_holds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by INT NOT NULL,
  resolved_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  UNIQUE KEY uq_financial_holds_student (student_id),
  CONSTRAINT fk_financial_holds_student
    FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_financial_holds_created_by
    FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT fk_financial_holds_resolved_by
    FOREIGN KEY (resolved_by) REFERENCES users(id)
);
