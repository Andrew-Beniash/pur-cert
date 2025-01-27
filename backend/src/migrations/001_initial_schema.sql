-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table first (since other tables depend on it)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    google_id VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create knowledge_areas table
CREATE TABLE IF NOT EXISTS knowledge_areas (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    knowledge_area_id INTEGER REFERENCES knowledge_areas(id),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'true_false'
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create exam_sessions table
CREATE TABLE IF NOT EXISTS exam_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    exam_id INTEGER REFERENCES exams(id),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    score DECIMAL,
    mode VARCHAR(50) NOT NULL -- 'full', 'half', 'quarter'
);