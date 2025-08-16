-- CSV Import Script for Company Profiles
-- Run this in your PostgreSQL database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create company_profiles table
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name VARCHAR(255),
    about_us TEXT,
    logo_url TEXT,
    banner_url TEXT,
    organization_type VARCHAR(100),
    company_type VARCHAR(100),
    team_size VARCHAR(50),
    year_established VARCHAR(10),
    website VARCHAR(255),
    vision TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    contact_person VARCHAR(255),
    contact_title VARCHAR(255),
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    instagram VARCHAR(255),
    linkedin VARCHAR(255),
    youtube VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on company_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_profiles_name ON company_profiles(company_name);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_profiles_updated_at 
    BEFORE UPDATE ON company_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Import CSV data (run this command in psql)
-- \copy company_profiles(company_name, about_us, logo_url, banner_url, organization_type, company_type, team_size, year_established, website, vision, address, city, state, zip_code, country, phone, email, contact_person, contact_title, facebook, twitter, instagram, linkedin, youtube) FROM 'C:\Users\shriy\Downloads\company_profile.csv' WITH (FORMAT csv, HEADER true);

-- Verify the import
-- SELECT COUNT(*) as total_companies FROM company_profiles;
-- SELECT * FROM company_profiles LIMIT 5;
