#!/bin/bash

# Company Registration & Login System Setup Script
# This script helps set up the development environment

echo "🚀 Setting up Company Registration & Login System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
# Environment Configuration
NODE_ENV=development

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase Configuration (if using Firebase auth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id

# API Configuration
VITE_API_BASE_URL=http://localhost:5000
EOF
    echo "✅ .env file created. Please update with your actual values."
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is running (optional check)
if command -v psql &> /dev/null; then
    echo "🔍 Checking PostgreSQL connection..."
    if pg_isready -q; then
        echo "✅ PostgreSQL is running"
    else
        echo "⚠️  PostgreSQL is not running. Please start PostgreSQL service."
    fi
else
    echo "⚠️  PostgreSQL client not found. Please install PostgreSQL 15+"
fi

# Create database setup instructions
echo "📋 Database Setup Instructions:"
echo "1. Install PostgreSQL 15+ if not already installed"
echo "2. Create a new database: CREATE DATABASE company_registration_system;"
echo "3. Import the schema: psql -d company_registration_system -f database/schema.sql"
echo "4. Update your .env file with database credentials"

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Set up your database using the schema file"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed setup instructions, see:"
echo "   - README.md"
echo "   - BACKEND_INTEGRATION.md"
echo "   - database/schema.sql"
