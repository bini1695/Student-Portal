ALTER TABLE assignment_submissions
  ADD COLUMN submission_text TEXT NULL,
  ADD COLUMN status ENUM('submitted', 'graded') NOT NULL DEFAULT 'submitted',
  MODIFY COLUMN score DECIMAL(6,2) NULL;
