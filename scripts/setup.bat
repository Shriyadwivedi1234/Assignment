@echo off
chcp 65001 >nul
echo 🚀 Setting up Company Registration ^& Login System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 🔧 Creating .env file...
    (
        echo # Environment Configuration
        echo NODE_ENV=development
        echo.
        echo # Supabase Configuration
        echo VITE_SUPABASE_URL=your_supabase_url
        echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
        echo.
        echo # Firebase Configuration ^(if using Firebase auth^)
        echo VITE_FIREBASE_API_KEY=your_firebase_api_key
        echo VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
        echo VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
        echo.
        echo # API Configuration
        echo VITE_API_BASE_URL=http://localhost:5000
    ) > .env
    echo ✅ .env file created. Please update with your actual values.
) else (
    echo ✅ .env file already exists
)

REM Check if PostgreSQL is running (optional check)
psql --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 🔍 Checking PostgreSQL connection...
    pg_isready -q
    if %errorlevel% equ 0 (
        echo ✅ PostgreSQL is running
    ) else (
        echo ⚠️  PostgreSQL is not running. Please start PostgreSQL service.
    )
) else (
    echo ⚠️  PostgreSQL client not found. Please install PostgreSQL 15+
)

echo.
echo 📋 Database Setup Instructions:
echo 1. Install PostgreSQL 15+ if not already installed
echo 2. Create a new database: CREATE DATABASE company_registration_system;
echo 3. Import the schema: psql -d company_registration_system -f database/schema.sql
echo 4. Update your .env file with database credentials

echo.
echo 🎉 Setup complete! Next steps:
echo 1. Update .env file with your configuration
echo 2. Set up your database using the schema file
echo 3. Run 'npm run dev' to start the development server
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 For detailed setup instructions, see:
echo    - README.md
echo    - BACKEND_INTEGRATION.md
echo    - database/schema.sql

pause
