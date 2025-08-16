@echo off
echo ========================================
echo    Database Integration Helper
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

echo Step 2: Database file integration
echo.
echo Your database file location: C:\Users\shriy\Downloads\users
echo.
echo Please choose the import method:
echo 1. SQL file import (if file has .sql extension)
echo 2. Backup restore (if file has .backup, .dump, or .tar extension)
echo 3. Manual import (you'll handle this yourself)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Importing SQL file...
    echo Please enter your PostgreSQL password when prompted:
    psql -U postgres -d users -f "C:\Users\shriy\Downloads\users"
    if %errorlevel% equ 0 (
        echo SQL import completed successfully! ✓
    ) else (
        echo There was an error during import
        echo Check the error message above
    )
) else if "%choice%"=="2" (
    echo.
    echo Restoring backup file...
    echo Please enter your PostgreSQL password when prompted:
    pg_restore -U postgres -d users "C:\Users\shriy\Downloads\users"
    if %errorlevel% equ 0 (
        echo Backup restore completed successfully! ✓
    ) else (
        echo There was an error during restore
        echo Check the error message above
    )
) else if "%choice%"=="3" (
    echo.
    echo Manual import selected
    echo Please follow the instructions in DATABASE_INTEGRATION.md
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo Step 3: Verification
echo.
echo Verifying database connection and tables...
echo Please enter your PostgreSQL password when prompted:
psql -U postgres -d users -c "\dt" 2>nul
if %errorlevel% equ 0 (
    echo Database connection successful! ✓
    echo Tables should be listed above
) else (
    echo Could not connect to database
    echo Please check your credentials and try again
)

echo.
echo Step 4: Environment setup
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
echo    Integration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your database credentials
echo 2. Install backend dependencies: npm install
echo 3. Start backend server: npm run dev
echo 4. Start frontend: npm run dev
echo.
echo For detailed instructions, see DATABASE_INTEGRATION.md
echo.
pause
