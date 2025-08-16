const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// Test database connection
router.get('/test', async (req, res) => {
  try {
    const result = await query('SELECT COUNT(*) as user_count FROM users');
    res.json({
      success: true,
      message: 'Database connection successful',
      userCount: result.rows[0].user_count
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Get database info
router.get('/db-info', async (req, res) => {
  try {
    // Get table information
    const tablesResult = await query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    // Get user count
    const userCountResult = await query('SELECT COUNT(*) as count FROM users');
    
    res.json({
      success: true,
      tables: tablesResult.rows,
      userCount: userCountResult.rows[0].count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get database info',
      error: error.message
    });
  }
});

module.exports = router;
