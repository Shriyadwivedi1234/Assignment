# CSV Database Integration Helper (PowerShell)
# Run this script in PowerShell as Administrator if needed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    CSV Database Integration Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check PostgreSQL installation
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $psqlPath = Get-Command psql -ErrorAction Stop
    Write-Host "PostgreSQL found at: $($psqlPath.Source)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: PostgreSQL not found in PATH" -ForegroundColor Red
    Write-Host "Please ensure PostgreSQL is installed and added to PATH" -ForegroundColor Red
    Write-Host "Typical PostgreSQL path: C:\Program Files\PostgreSQL\15\bin" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check CSV file
Write-Host "Checking CSV file..." -ForegroundColor Yellow
$csvPath = "C:\Users\shriy\Downloads\company_profile.csv"
if (-not (Test-Path $csvPath)) {
    Write-Host "ERROR: CSV file not found at $csvPath" -ForegroundColor Red
    Write-Host "Please ensure the file exists and is accessible" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "CSV file found!" -ForegroundColor Green
Write-Host ""

# Step 1: Create database
Write-Host "Step 1: Creating database 'users'..." -ForegroundColor Yellow
Write-Host "Please enter your PostgreSQL password when prompted:" -ForegroundColor Cyan
Write-Host ""

try {
    $result = & psql -U postgres -c "CREATE DATABASE users;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database 'users' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Database might already exist or there was an error" -ForegroundColor Yellow
        Write-Host "You can continue with the next step" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error creating database: $_" -ForegroundColor Red
}
Write-Host ""

# Step 2: Create table
Write-Host "Step 2: Creating company_profiles table..." -ForegroundColor Yellow
Write-Host "Please enter your PostgreSQL password when prompted:" -ForegroundColor Cyan
Write-Host ""

$createTableSQL = @"
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
"@

try {
    $result = & psql -U postgres -d users -c $createTableSQL 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Table 'company_profiles' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Table might already exist or there was an error" -ForegroundColor Yellow
        Write-Host "You can continue with the next step" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error creating table: $_" -ForegroundColor Red
}
Write-Host ""

# Step 3: Import CSV
Write-Host "Step 3: Importing CSV data..." -ForegroundColor Yellow
Write-Host "Please enter your PostgreSQL password when prompted:" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Make sure your CSV columns match the expected format" -ForegroundColor Red
Write-Host "Expected columns: company_name, about_us, logo_url, banner_url, organization_type, company_type, team_size, year_established, website, vision, address, city, state, zip_code, country, phone, email, contact_person, contact_title, facebook, twitter, instagram, linkedin, youtube" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue"

$copyCommand = "\copy company_profiles(company_name, about_us, logo_url, banner_url, organization_type, company_type, team_size, year_established, website, vision, address, city, state, zip_code, country, phone, email, contact_person, contact_title, facebook, twitter, instagram, linkedin, youtube) FROM '$csvPath' WITH (FORMAT csv, HEADER true);"

try {
    $result = & psql -U postgres -d users -c $copyCommand 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "CSV import completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "There was an error during CSV import" -ForegroundColor Red
        Write-Host "Check the error message above" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "- Column names don't match exactly" -ForegroundColor Yellow
        Write-Host "- CSV file has different encoding" -ForegroundColor Yellow
        Write-Host "- Data types are incompatible" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Press Enter to continue"
    }
} catch {
    Write-Host "Error importing CSV: $_" -ForegroundColor Red
}
Write-Host ""

# Step 4: Verification
Write-Host "Step 4: Verification" -ForegroundColor Yellow
Write-Host "Verifying database connection and data..." -ForegroundColor Yellow
Write-Host "Please enter your PostgreSQL password when prompted:" -ForegroundColor Cyan
Write-Host ""

try {
    $result = & psql -U postgres -d users -c "SELECT COUNT(*) as total_companies FROM company_profiles;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database connection successful!" -ForegroundColor Green
        Write-Host "Company count should be displayed above" -ForegroundColor Green
    } else {
        Write-Host "Could not connect to database" -ForegroundColor Red
        Write-Host "Please check your credentials and try again" -ForegroundColor Red
    }
} catch {
    Write-Host "Error verifying database: $_" -ForegroundColor Red
}
Write-Host ""

# Step 5: Environment setup
Write-Host "Step 5: Environment setup" -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env" -ErrorAction SilentlyContinue
    Write-Host ".env file created! Please edit it with your database credentials" -ForegroundColor Green
} else {
    Write-Host ".env file already exists" -ForegroundColor Green
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    CSV Integration Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your database credentials" -ForegroundColor White
Write-Host "2. Install backend dependencies: cd backend && npm install" -ForegroundColor White
Write-Host "3. Start backend server: npm run dev" -ForegroundColor White
Write-Host "4. Start frontend: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see CSV_INTEGRATION.md" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
