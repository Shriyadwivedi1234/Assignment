# Database Integration Guide

This guide will help you integrate your PostgreSQL database file (`users`) into the project.

## Prerequisites
- ✅ PostgreSQL 15+ installed
- ✅ Your database file extracted at `C:\Users\shriy\Downloads\users`
- ✅ Access to PostgreSQL as a superuser

## Step-by-Step Integration

### 1. Determine Your Database File Type

First, check what type of file you have:
```bash
# Check file extension
dir "C:\Users\shriy\Downloads\users"
```

Common PostgreSQL file types:
- `.sql` - SQL script file
- `.backup` - pg_dump backup file
- `.dump` - pg_dump format file
- `.tar` - tar archive format

### 2. Create the Database

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

### 3. Import Your Database File

**For .sql files:**
```bash
psql -U postgres -d users -f "C:\Users\shriy\Downloads\users"
```

**For .backup/.dump files:**
```bash
pg_restore -U postgres -d users "C:\Users\shriy\Downloads\users"
```

**For .tar files:**
```bash
pg_restore -U postgres -d users -F t "C:\Users\shriy\Downloads\users"
```

### 4. Verify the Import

```bash
# Connect to your database
psql -U postgres -d users

# List all tables
\dt

# Check table structure (example for users table)
\d users

# Check if data exists
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM company_profiles;

# Exit
\q
```

### 5. Configure Environment Variables

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

### 6. Test Database Connection

Run the backend server to test the connection:

```bash
# Install backend dependencies
npm install

# Start the server
npm run dev
```

You should see: `Database connected successfully` in the console.

## Troubleshooting

### Common Issues

**1. Permission Denied**
```bash
# Run as administrator or check PostgreSQL user permissions
```

**2. Database Already Exists**
```bash
# Drop and recreate if needed
DROP DATABASE IF EXISTS users;
CREATE DATABASE users;
```

**3. Import Errors**
- Check file format compatibility
- Ensure PostgreSQL version matches
- Verify file integrity

**4. Connection Refused**
- Check if PostgreSQL service is running
- Verify port 5432 is not blocked
- Check firewall settings

### Alternative Import Methods

**Using pgAdmin (GUI):**
1. Open pgAdmin
2. Right-click on Databases → Create → Database
3. Name it `users`
4. Right-click on the new database → Restore
5. Select your file and restore

**Using Windows PowerShell:**
```powershell
# Set PostgreSQL path (adjust as needed)
$env:PATH += ";C:\Program Files\PostgreSQL\15\bin"

# Then run import commands
psql -U postgres -d users -f "C:\Users\shriy\Downloads\users"
```

## Verification Checklist

- [ ] Database `users` created successfully
- [ ] Tables imported with correct structure
- [ ] Sample data present in tables
- [ ] Environment variables configured
- [ ] Backend connects to database
- [ ] API endpoints working

## Next Steps

After successful database integration:
1. Start the backend server: `npm run dev`
2. Start the frontend: `npm run dev`
3. Test user registration and login
4. Verify company profile creation

## Support

If you encounter issues:
1. Check PostgreSQL logs
2. Verify file permissions
3. Ensure PostgreSQL service is running
4. Check the troubleshooting section above
