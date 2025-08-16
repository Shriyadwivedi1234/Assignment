const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// Get all company profiles
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM company_profiles ORDER BY created_at DESC');
    res.json({
      success: true,
      companies: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
});

// Get company profile by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM company_profiles WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }
    
    res.json({
      success: true,
      company: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company profile',
      error: error.message
    });
  }
});

// Search companies by name
router.get('/search/:query', async (req, res) => {
  try {
    const { query: searchQuery } = req.params;
    const result = await query(
      'SELECT * FROM company_profiles WHERE company_name ILIKE $1 ORDER BY company_name',
      [`%${searchQuery}%`]
    );
    
    res.json({
      success: true,
      companies: result.rows,
      count: result.rows.length,
      searchQuery
    });
  } catch (error) {
    console.error('Error searching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search companies',
      error: error.message
    });
  }
});

// Get company statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalCompanies = await query('SELECT COUNT(*) as count FROM company_profiles');
    const byType = await query('SELECT company_type, COUNT(*) as count FROM company_profiles GROUP BY company_type');
    const bySize = await query('SELECT team_size, COUNT(*) as count FROM company_profiles GROUP BY team_size');
    const byCountry = await query('SELECT country, COUNT(*) as count FROM company_profiles GROUP BY country ORDER BY count DESC LIMIT 10');
    
    res.json({
      success: true,
      stats: {
        totalCompanies: totalCompanies.rows[0].count,
        byType: byType.rows,
        bySize: bySize.rows,
        byCountry: byCountry.rows
      }
    });
  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company statistics',
      error: error.message
    });
  }
});

// Update company profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Build dynamic update query
    const fields = Object.keys(updateData).filter(key => 
      key !== 'id' && key !== 'created_at' && key !== 'updated_at'
    );
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [id, ...fields.map(field => updateData[field])];
    
    const result = await query(
      `UPDATE company_profiles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Company profile updated successfully',
      company: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company profile',
      error: error.message
    });
  }
});

// Delete company profile
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM company_profiles WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Company profile deleted successfully',
      company: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete company profile',
      error: error.message
    });
  }
});

//complete-registration

router.post('/complete-registration', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID missing' });
    }

    const result = await query(
      `UPDATE users
       SET registration_complete = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [userId]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error completing registration' });
  }
});


module.exports = router;
