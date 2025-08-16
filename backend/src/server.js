const express = require('express');
const cors = require('cors');
const path = require('path');
const { query } = require('./config/database');
const db = require('./config/database'); // no .js needed


const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for development (replace with database in production)
const users = new Map();
const companyProfiles = new Map();

// Authentication routes
app.post('/auth/register', async (req, res) => {
  try {
    const { companyName, email, password } = req.body;

    // Validate input
    if (!companyName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists in DB
    const checkUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        error: 'Registration failed: Email already registered'
      });
    }

    // Insert user into DB
    const insertQuery = `
      INSERT INTO users (email, company_name, password, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, email, company_name
    `;

    const result = await query(insertQuery, [email, companyName, password]);

    res.json({
      message: 'User registered successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Fetch user from DB
    const loginQuery = `SELECT * FROM users WHERE email = $1`;
    const result = await query(loginQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found. Please register first.' });
    }

    const userData = result.rows[0];

    // Verify password (plain-text comparison for now — hashing is recommended later)
    if (userData.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Return minimal safe data
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userData.id,
        email: userData.email,
        companyName: userData.company_name,
        createdAt: userData.created_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Company profile routes
app.get('/company/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const email = authHeader.replace('Bearer ', '');
    
    // Get user profile from storage
    const userData = users.get(email);
    
    if (!userData) {
      // Create default profile
      const defaultProfile = {
        companyInfo: {
          companyName: '',
          aboutUs: ''
        },
        foundingInfo: {
          organizationType: '',
          companyType: '',
          teamSize: '',
          yearEstablished: '',
          website: '',
          vision: ''
        },
        socialInfo: {},
        contactInfo: {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phone: '',
          email: email,
          contactPerson: '',
          contactTitle: ''
        },
        registrationComplete: false
      };
      
      return res.json({ company: defaultProfile });
    }

    res.json({ company: userData.profile || userData });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/company/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    const email = authHeader.replace('Bearer ', '');
    const profileData = req.body;
    
    // Get existing user data
    let userData = users.get(email) || {};
    
    // Update profile
    userData.profile = profileData;
    userData.updatedAt = new Date().toISOString();
    
    // Save back to storage
    users.set(email, userData);
    
    res.json({ company: profileData });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/company/complete-registration', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const email = authHeader.replace('Bearer ', '');
    
    // Get existing user data
    let userData = users.get(email) || {};
    
    // Mark registration as complete
    if (userData.profile) {
      userData.profile.registrationComplete = true;
    }
    userData.completedAt = new Date().toISOString();
    
    // Save back to storage
    users.set(email, userData);
    
    res.json({ company: userData.profile });
  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OTP verification routes (simplified for demo)
app.post('/auth/send-email-otp', (req, res) => {
  res.json({ message: 'OTP sent successfully' });
});

app.post('/auth/verify-email-otp', (req, res) => {
  const { otp } = req.body;
  if (otp === '123456') {
    res.json({ message: 'Email verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

app.post('/auth/send-phone-otp', (req, res) => {
  res.json({ message: 'OTP sent successfully' });
});

app.post('/auth/verify-phone-otp', (req, res) => {
  const { otp } = req.body;
  if (otp === '123456') {
    res.json({ message: 'Phone verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

// CSV export routes
app.get('/csv/users', (req, res) => {
  try {
    const usersArray = Array.from(users.values()).map(user => [
      user.email,
      user.companyName,
      user.createdAt
    ]);
    
    const csvContent = [
      ['Email', 'Company Name', 'Created At'],
      ...usersArray
    ].map(row => row.join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export users' });
  }
});

app.get('/csv/company_profiles', (req, res) => {
  try {
    const profilesArray = Array.from(users.values())
      .filter(user => user.profile)
      .map(user => [
        user.profile.companyInfo?.companyName || '',
        user.profile.companyInfo?.aboutUs || '',
        user.profile.foundingInfo?.companyType || '',
        user.profile.contactInfo?.email || ''
      ]);
    
    const csvContent = [
      ['Company Name', 'About Us', 'Company Type', 'Email'],
      ...profilesArray
    ].map(row => row.join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=company_profiles.csv');
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export company profiles' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  const db = require('./config/database');
(async () => {
  const { rows } = await db.query('SELECT COUNT(*) AS count FROM users');
  console.log(`👥 Users registered: ${rows[0].count}`);
})();

});
