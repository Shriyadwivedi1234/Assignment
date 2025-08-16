# Backend Integration Guide

## 🏗️ Backend Architecture

### Technology Stack
- **Node.js 20.x (LTS)**: Server runtime
- **Express.js**: Web framework for API development
- **PostgreSQL 15**: Primary database
- **Redis**: Session storage and caching (optional)
- **JWT**: Authentication tokens (90-day validity)
- **bcrypt**: Password hashing
- **Cloudinary**: Image storage and management

### Project Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication, validation
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── config/         # Configuration files
├── database/
│   ├── migrations/     # Database schema changes
│   ├── seeds/          # Initial data
│   └── schema.sql      # Database structure
├── package.json
└── server.js
```

## 🗄️ Database Setup

### PostgreSQL Installation
1. **Windows**: Download from https://www.postgresql.org/download/windows/
2. **macOS**: `brew install postgresql`
3. **Linux**: `sudo apt-get install postgresql postgresql-contrib`

### Database Creation
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE company_registration_system;

-- Create user (optional)
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE company_registration_system TO app_user;

-- Connect to the database
\c company_registration_system
```

### Database Schema
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_mobile ON users(mobile_number);
CREATE INDEX idx_company_profiles_owner ON company_profiles(owner_id);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_candidates_job ON candidates(job_id);
CREATE INDEX idx_interviews_candidate ON interviews(candidate_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔧 Backend Setup

### 1. Initialize Node.js Project
```bash
mkdir backend
cd backend
npm init -y
```

### 2. Install Dependencies
```bash
npm install express cors helmet compression bcrypt jsonwebtoken pg express-validator sanitize-html libphonenumber-js cloudinary multer dotenv
npm install --save-dev nodemon @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken @types/pg
```

### 3. Package.json Scripts
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "tsc",
    "test": "jest"
  }
}
```

### 4. Environment Configuration (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration_system
DB_USER=app_user
DB_PASSWORD=secure_password
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=90d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase Configuration (if using Firebase auth)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
```

## 🚀 Server Implementation

### Main Server File (src/server.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const jobRoutes = require('./routes/jobs');
const candidateRoutes = require('./routes/candidates');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🔐 Authentication System

### JWT Middleware (src/middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists in database
    const result = await pool.query(
      'SELECT id, email, full_name FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

module.exports = { authenticateToken };
```

### Authentication Routes (src/routes/auth.js)
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// User Registration
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').trim().isLength({ min: 2 }),
  body('mobileNumber').isMobilePhone(),
  body('companyName').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, fullName, gender, mobileNumber, companyName } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, gender, mobile_number, signup_type)
       VALUES ($1, $2, $3, $4, $5, 'e')
       RETURNING id, email, full_name`,
      [email, passwordHash, fullName, gender, mobileNumber]
    );

    const user = userResult.rows[0];

    // Create company profile
    await pool.query(
      `INSERT INTO company_profiles (owner_id, company_name)
       VALUES ($1, $2)`,
      [user.id, companyName]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// User Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const userResult = await pool.query(
      'SELECT id, email, password_hash, full_name FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, email, full_name, gender, mobile_number, is_mobile_verified, is_email_verified FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: userResult.rows[0]
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
});

module.exports = router;
```

## 🏢 Company Profile Management

### Company Routes (src/routes/company.js)
```javascript
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');
const { uploadToCloudinary } = require('../services/cloudinary');

const router = express.Router();

// Get company profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM company_profiles WHERE owner_id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        company: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get company profile'
    });
  }
});

// Update company profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      companyName,
      aboutUs,
      organizationType,
      companyType,
      teamSize,
      yearEstablished,
      website,
      vision,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      contactPerson,
      contactTitle
    } = req.body;

    const result = await pool.query(
      `UPDATE company_profiles 
       SET company_name = $1, about_us = $2, organization_type = $3, company_type = $4,
           team_size = $5, year_established = $6, website = $7, vision = $8,
           facebook_url = $9, twitter_url = $10, instagram_url = $11, linkedin_url = $12,
           youtube_url = $13, address = $14, city = $15, state = $16, zip_code = $17,
           country = $18, phone = $19, contact_person = $20, contact_title = $21,
           updated_at = CURRENT_TIMESTAMP
       WHERE owner_id = $22
       RETURNING *`,
      [
        companyName, aboutUs, organizationType, companyType, teamSize, yearEstablished,
        website, vision, facebookUrl, twitterUrl, instagramUrl, linkedinUrl, youtubeUrl,
        address, city, state, zipCode, country, phone, contactPerson, contactTitle,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        company: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update company profile'
    });
  }
});

// Upload company logo
router.post('/logo', authenticateToken, async (req, res) => {
  try {
    const { imageData } = req.body; // Base64 encoded image

    if (!imageData) {
      return res.status(400).json({
        success: false,
        error: 'Image data required'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageData, 'company_logos');

    // Update database
    await pool.query(
      `UPDATE company_profiles SET logo_url = $1 WHERE owner_id = $2`,
      [uploadResult.secure_url, req.user.id]
    );

    res.json({
      success: true,
      data: {
        logoUrl: uploadResult.secure_url
      }
    });

  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload logo'
    });
  }
});

// Upload company banner
router.post('/banner', authenticateToken, async (req, res) => {
  try {
    const { imageData } = req.body; // Base64 encoded image

    if (!imageData) {
      return res.status(400).json({
        success: false,
        error: 'Image data required'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageData, 'company_banners');

    // Update database
    await pool.query(
      `UPDATE company_profiles SET banner_url = $1 WHERE owner_id = $2`,
      [uploadResult.secure_url, req.user.id]
    );

    res.json({
      success: true,
      data: {
        bannerUrl: uploadResult.secure_url
      }
    });

  } catch (error) {
    console.error('Banner upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload banner'
    });
  }
});

// Complete registration
router.post('/complete', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE company_profiles 
       SET registration_complete = true, updated_at = CURRENT_TIMESTAMP
       WHERE owner_id = $1
       RETURNING *`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        company: result.rows[0]
      }
    });

  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete registration'
    });
  }
});

module.exports = router;
```

## 📁 File Upload Service

### Cloudinary Service (src/services/cloudinary.js)
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (imageData, folder) => {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

module.exports = { uploadToCloudinary };
```

## 🗄️ Database Connection

### Database Configuration (src/config/database.js)
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = { pool };
```

## 🔒 Security Features

### Input Validation
- **express-validator**: Request validation
- **sanitize-html**: HTML sanitization
- **libphonenumber-js**: Phone number validation

### Security Headers
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **compression**: Response compression

### Authentication
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing
- **Rate limiting**: API abuse prevention

## 🚀 Deployment

### Environment Variables
```bash
# Production environment
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
```

### PM2 Process Manager
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name "company-registration-api"

# Monitor
pm2 monit

# Restart
pm2 restart company-registration-api
```

### Docker Deployment
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Company Endpoints
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/profile` - Update company profile
- `POST /api/company/logo` - Upload company logo
- `POST /api/company/banner` - Upload company banner
- `POST /api/company/complete` - Complete registration

### Job Endpoints
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Candidate Endpoints
- `GET /api/candidates` - List candidates
- `POST /api/candidates` - Create candidate
- `PUT /api/candidates/:id` - Update candidate status

## 🔧 Testing

### API Testing with Postman
1. Import the provided Postman collection
2. Set environment variables
3. Test all endpoints with proper authentication

### Database Testing
```bash
# Connect to database
psql -U app_user -d company_registration_system

# Test queries
SELECT * FROM users LIMIT 5;
SELECT * FROM company_profiles LIMIT 5;
```

## 📈 Monitoring & Logging

### Application Logs
```javascript
// Add logging middleware
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Database Monitoring
```sql
-- Check active connections
SELECT * FROM pg_stat_activity;

-- Check table sizes
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE tablename = 'users';
```

---

This backend integration guide provides everything needed to set up a production-ready backend for the Company Registration & Login System. The system is designed to be scalable, secure, and maintainable.
