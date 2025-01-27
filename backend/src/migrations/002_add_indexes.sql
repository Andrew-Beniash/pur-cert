-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Questions index
CREATE INDEX IF NOT EXISTS idx_questions_knowledge_area ON questions(knowledge_area_id);

-- Exam sessions indexes
CREATE INDEX IF NOT EXISTS idx_exam_sessions_user ON exam_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_exam ON exam_sessions(exam_id);

-- Knowledge areas index
CREATE INDEX IF NOT EXISTS idx_knowledge_areas_exam ON knowledge_areas(exam_id);