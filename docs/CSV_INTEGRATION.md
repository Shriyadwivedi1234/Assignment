# CSV Database Integration Guide

This guide will help you integrate your CSV file (`company_profile.csv`) into the PostgreSQL database.

## Prerequisites
- ✅ PostgreSQL 15+ installed
- ✅ Your CSV file extracted at `C:\Users\shriy\Downloads\company_profile.csv`
- ✅ Access to PostgreSQL as a superuser

## Step-by-Step Integration

### 1. Create the Database

Open Command Prompt or PowerShell and run:

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# In the psql prompt, create the database:
CREATE DATABASE users;

# Verify the database was created:
\l

# Connect to the new database:
\c users

# Exit psql:
\q
```

### 2. Import CSV Data

**Option A: Using PostgreSQL COPY command (Recommended)**

```bash
# Connect to your database
psql -U postgres -d users

# First, create the table structure (if it doesn't exist)
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

# Import CSV data (adjust column names as needed)
\copy company_profiles(company_name, about_us, logo_url, banner_url, organization_type, company_type, team_size, year_established, website, vision, address, city, state, zip_code, country, phone, email, contact_person, contact_title, facebook, twitter, instagram, linkedin, youtube) FROM 'C:\Users\shriy\Downloads\company_profile.csv' WITH (FORMAT csv, HEADER true);

# Exit
\q
```

**Option B: Using pgAdmin (GUI)**

1. Open pgAdmin
2. Right-click on Databases → Create → Database
3. Name it `users`
4. Right-click on the new database → Query Tool
5. Run the CREATE TABLE command above
6. Right-click on Tables → Import/Export Data
7. Select your CSV file and map columns

### 3. Verify the Import

```bash
# Connect to your database
psql -U postgres -d users

# List all tables
\dt

# Check table structure
\d company_profiles

# Check if data exists
SELECT COUNT(*) FROM company_profiles;

# View sample data
SELECT * FROM company_profiles LIMIT 5;

# Exit
\q
```

### 4. Configure Environment Variables

1. Copy `env.example` to `.env`:
```bash
copy env.example .env
```

2. Edit `.env` with your actual database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=users
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

### 5. Test Database Connection

Run the backend server to test the connection:

```bash
# Install backend dependencies
cd backend
npm install

# Start the server
npm run dev
```

You should see: `Database connected successfully` in the console.

## CSV Column Mapping

Based on your project structure, here's the expected CSV column mapping:

| CSV Column | Database Column | Type |
|------------|----------------|------|
| company_name | company_name | VARCHAR(255) |
| about_us | about_us | TEXT |
| logo_url | logo_url | TEXT |
| banner_url | banner_url | TEXT |
| organization_type | organization_type | VARCHAR(100) |
| company_type | company_type | VARCHAR(100) |
| team_size | team_size | VARCHAR(50) |
| year_established | year_established | VARCHAR(10) |
| website | website | VARCHAR(255) |
| vision | vision | TEXT |
| address | address | TEXT |
| city | city | VARCHAR(100) |
| state | state | VARCHAR(100) |
| zip_code | zip_code | VARCHAR(20) |
| country | country | VARCHAR(100) |
| phone | phone | VARCHAR(20) |
| email | email | VARCHAR(255) |
| contact_person | contact_person | VARCHAR(255) |
| contact_title | contact_title | VARCHAR(255) |
| facebook | facebook | VARCHAR(255) |
| twitter | twitter | VARCHAR(255) |
| instagram | instagram | VARCHAR(255) |
| linkedin | linkedin | VARCHAR(255) |
| youtube | youtube | VARCHAR(255) |

## Troubleshooting

### Common Issues

**1. CSV Column Mismatch**
- Check your CSV headers match the expected columns
- Use `\copy` with explicit column names if needed

**2. Data Type Errors**
- Ensure numeric fields contain valid numbers
- Check date formats are consistent

**3. Permission Issues**
- Run as administrator if needed
- Check file permissions on CSV file

**4. Encoding Issues**
- Ensure CSV is saved as UTF-8
- Check for special characters

## Verification Checklist

- [ ] Database `users` created successfully
- [ ] `company_profiles` table created with correct structure
- [ ] CSV data imported successfully
- [ ] Row count matches expected
- [ ] Environment variables configured
- [ ] Backend connects to database
- [ ] API endpoints working

## Next Steps

After successful CSV integration:
1. Start the backend server: `npm run dev`
2. Start the frontend: `npm run dev`
3. Test company profile display in dashboard
4. Verify data appears correctly in UI

## Support

If you encounter issues:
1. Check CSV file format and encoding
2. Verify column names match exactly
3. Check PostgreSQL error messages
4. Ensure CSV file path is accessible
