-- Company Registration & Login System Database Schema
-- PostgreSQL 15+ compatible

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    mobile_number VARCHAR(20) NOT NULL,
    signup_type VARCHAR(10) DEFAULT 'e',
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company profiles table
CREATE TABLE company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    about_us TEXT,
    logo_url TEXT,
    banner_url TEXT,
    organization_type VARCHAR(100),
    company_type VARCHAR(100),
    team_size VARCHAR(50),
    year_established VARCHAR(4),
    website VARCHAR(255),
    vision TEXT,
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    youtube_url VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    phone VARCHAR(20),
    contact_person VARCHAR(255),
    contact_title VARCHAR(255),
    registration_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(255),
    type VARCHAR(50), -- full-time, part-time, contract
    salary_min INTEGER,
    salary_max INTEGER,
    status VARCHAR(20) DEFAULT 'active', -- active, closed, draft
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates table
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    resume_url TEXT,
    cover_letter TEXT,
    status VARCHAR(20) DEFAULT 'applied', -- applied, reviewing, interviewed, hired, rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews table
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    type VARCHAR(50), -- phone, video, in-person
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table for tracking dashboard metrics
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value JSONB NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile_number);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_company_profiles_owner ON company_profiles(owner_id);
CREATE INDEX idx_company_profiles_name ON company_profiles(company_name);
CREATE INDEX idx_company_profiles_complete ON company_profiles(registration_complete);

CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

CREATE INDEX idx_candidates_job ON candidates(job_id);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_email ON candidates(email);

CREATE INDEX idx_interviews_candidate ON interviews(candidate_id);
CREATE INDEX idx_interviews_job ON interviews(job_id);
CREATE INDEX idx_interviews_scheduled ON interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON interviews(status);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_team_members_company ON team_members(company_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_active ON team_members(is_active);

CREATE INDEX idx_analytics_company ON analytics(company_id);
CREATE INDEX idx_analytics_metric ON analytics(metric_name);
CREATE INDEX idx_analytics_recorded ON analytics(recorded_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at 
    BEFORE UPDATE ON company_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at 
    BEFORE UPDATE ON interviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create sample data for testing
INSERT INTO users (email, password_hash, full_name, gender, mobile_number, is_mobile_verified, is_email_verified) VALUES
('admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8mG', 'Admin User', 'male', '+1234567890', true, true),
('demo@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8mG', 'Demo Company', 'other', '+1987654321', true, true);

-- Create sample company profile
INSERT INTO company_profiles (owner_id, company_name, about_us, organization_type, company_type, team_size, year_established, website, vision, city, state, country, registration_complete) VALUES
((SELECT id FROM users WHERE email = 'demo@company.com'), 'TechCorp Solutions', 'Leading technology solutions provider', 'Corporation', 'Technology', '50-100', '2015', 'https://techcorp.com', 'To revolutionize the tech industry', 'San Francisco', 'California', 'United States', true);

-- Create sample jobs
INSERT INTO jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status) VALUES
((SELECT id FROM company_profiles WHERE company_name = 'TechCorp Solutions'), 'Senior Software Engineer', 'We are looking for a talented software engineer to join our team.', '5+ years experience, React, Node.js, PostgreSQL', 'San Francisco, CA', 'full-time', 120000, 180000, 'active'),
((SELECT id FROM company_profiles WHERE company_name = 'TechCorp Solutions'), 'UI/UX Designer', 'Creative designer to help shape our product experience.', '3+ years experience, Figma, Adobe Creative Suite', 'Remote', 'full-time', 80000, 120000, 'active');

-- Create sample candidates
INSERT INTO candidates (job_id, full_name, email, phone, status) VALUES
((SELECT id FROM jobs WHERE title = 'Senior Software Engineer'), 'John Doe', 'john.doe@email.com', '+1555123456', 'applied'),
((SELECT id FROM jobs WHERE title = 'UI/UX Designer'), 'Jane Smith', 'jane.smith@email.com', '+1555987654', 'reviewing');

-- Create sample interviews
INSERT INTO interviews (candidate_id, job_id, scheduled_at, type, status) VALUES
((SELECT id FROM candidates WHERE email = 'john.doe@email.com'), (SELECT id FROM jobs WHERE title = 'Senior Software Engineer'), NOW() + INTERVAL '2 days', 'video', 'scheduled'),
((SELECT id FROM candidates WHERE email = 'jane.smith@email.com'), (SELECT id FROM jobs WHERE title = 'UI/UX Designer'), NOW() + INTERVAL '1 week', 'phone', 'scheduled');

-- Grant permissions to application user (if exists)
-- DO $$
-- BEGIN
--     IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
--         GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
--         GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
--         GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO app_user;
--     END IF;
-- END
-- $$;

-- Display table information
SELECT 
    table_name,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count,
    (SELECT count(*) FROM information_schema.indexes WHERE table_name = t.table_name) as index_count
FROM information_schema.tables t 
WHERE table_schema = 'public' 
ORDER BY table_name;
