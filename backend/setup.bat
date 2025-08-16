@echo off
echo ========================================
echo    Backend Setup Helper
echo ========================================
echo.

echo Installing backend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully! ✓
echo.

echo Checking environment file...
if not exist ".env" (
    echo Creating .env file from template...
    copy "..\env.example" ".env" >nul
    echo.
    echo IMPORTANT: Please edit .env file with your database credentials
    echo.
    echo Required fields:
    echo - DB_PASSWORD: Your PostgreSQL password
    echo - JWT_SECRET: A random secret key
    echo - Other Firebase and Cloudinary credentials
    echo.
    pause
) else (
    echo .env file already exists
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your credentials
echo 2. Ensure PostgreSQL is running
echo 3. Run: npm run dev
echo.
echo The server will start on port 5000
echo.
pause
