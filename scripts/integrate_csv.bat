@echo off
echo ========================================
echo    CSV Database Integration Helper
echo ========================================
echo.

echo Checking PostgreSQL installation...
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL not found in PATH
    echo Please ensure PostgreSQL is installed and added to PATH
    echo.
    echo Typical PostgreSQL path: C:\Program Files\PostgreSQL\15\bin
    echo.
    pause
    exit /b 1
)

echo PostgreSQL found! ✓
echo.

echo Checking CSV file...
if not exist "C:\Users\shriy\Downloads\company_profile.csv" (
    echo ERROR: CSV file not found at C:\Users\shriy\Downloads\company_profile.csv
    echo Please ensure the file exists and is accessible
    echo.
    pause
    exit /b 1
)

echo CSV file found! ✓
echo.

echo Step 1: Creating database 'users'...
echo.
echo Please enter your PostgreSQL password when prompted:
psql -U postgres -c "CREATE DATABASE users;" 2>nul
if %errorlevel% equ 0 (
    echo Database 'users' created successfully! ✓
) else (
    echo Database might already exist or there was an error
    echo You can continue with the next step
)
echo.

echo Step 2: Creating company_profiles table...
echo.
echo Please enter your PostgreSQL password when prompted:
psql -U postgres -d users -c "CREATE TABLE IF NOT EXISTS company_profiles (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, company_name VARCHAR(255), about_us TEXT, logo_url TEXT, banner_url TEXT, organization_type VARCHAR(100), company_type VARCHAR(100), team_size VARCHAR(50), year_established VARCHAR(10), website VARCHAR(255), vision TEXT, address TEXT, city VARCHAR(100), state VARCHAR(100), zip_code VARCHAR(20), country VARCHAR(100), phone VARCHAR(20), email VARCHAR(255), contact_person VARCHAR(255), contact_title VARCHAR(255), facebook VARCHAR(255), twitter VARCHAR(255), instagram VARCHAR(255), linkedin VARCHAR(255), youtube VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);" 2>nul
if %errorlevel% equ 0 (
    echo Table 'company_profiles' created successfully! ✓
) else (
    echo Table might already exist or there was an error
    echo You can continue with the next step
)
echo.

echo Step 3: Importing CSV data...
echo.
echo Please enter your PostgreSQL password when prompted:
echo.
echo IMPORTANT: Make sure your CSV columns match the expected format
echo Expected columns: company_name, about_us, logo_url, banner_url, organization_type, company_type, team_size, year_established, website, vision, address, city, state, zip_code, country, phone, email, contact_person, contact_title, facebook, twitter, instagram, linkedin, youtube
echo.
pause

psql -U postgres -d users -c "\copy company_profiles(company_name, about_us, logo_url, banner_url, organization_type, company_type, team_size, year_established, website, vision, address, city, state, zip_code, country, phone, email, contact_person, contact_title, facebook, twitter, instagram, linkedin, youtube) FROM 'C:\Users\shriy\Downloads\company_profile.csv' WITH (FORMAT csv, HEADER true);" 2>nul
if %errorlevel% equ 0 (
    echo CSV import completed successfully! ✓
) else (
    echo There was an error during CSV import
    echo Check the error message above
    echo.
    echo Common issues:
    echo - Column names don't match exactly
    echo - CSV file has different encoding
    echo - Data types are incompatible
    echo.
    pause
)
echo.

echo Step 4: Verification
echo.
echo Verifying database connection and data...
echo Please enter your PostgreSQL password when prompted:
psql -U postgres -d users -c "SELECT COUNT(*) as total_companies FROM company_profiles;" 2>nul
if %errorlevel% equ 0 (
    echo Database connection successful! ✓
    echo Company count should be displayed above
) else (
    echo Could not connect to database
    echo Please check your credentials and try again
)

echo.
echo Step 5: Environment setup
echo.
if not exist ".env" (
    echo Creating .env file from template...
    copy "env.example" ".env" >nul
    echo .env file created! Please edit it with your database credentials
) else (
    echo .env file already exists
)

echo.
echo ========================================
echo    CSV Integration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your database credentials
echo 2. Install backend dependencies: cd backend && npm install
echo 3. Start backend server: npm run dev
echo 4. Start frontend: npm run dev
echo.
echo For detailed instructions, see CSV_INTEGRATION.md
echo.
pause
