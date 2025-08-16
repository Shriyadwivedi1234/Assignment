const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { query } = require('../config/db');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = verifyToken(token);
    
    // Verify user still exists in database
    const userResult = await query(
      'SELECT id, email, full_name, is_email_verified, is_mobile_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add user info to request object
    req.user = {
      id: decoded.userId,
      email: userResult.rows[0].email,
      full_name: userResult.rows[0].full_name,
      is_email_verified: userResult.rows[0].is_email_verified,
      is_mobile_verified: userResult.rows[0].is_mobile_verified
    };

    next();
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    
    if (error.message === 'Token has expired') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};

// Middleware to check if user owns the company
const checkCompanyOwnership = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const companyId = req.params.companyId || req.params.id;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID required'
      });
    }

    const result = await query(
      'SELECT id FROM company_profiles WHERE id = $1 AND owner_id = $2',
      [companyId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this company profile.'
      });
    }

    req.company = { id: companyId };
    next();
  } catch (error) {
    console.error('❌ Company ownership check error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Middleware to check team member permissions
const checkTeamPermissions = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const companyId = req.params.companyId || req.params.id;

      // First check if user is company owner
      const ownerResult = await query(
        'SELECT id FROM company_profiles WHERE id = $1 AND owner_id = $2',
        [companyId, userId]
      );

      if (ownerResult.rows.length > 0) {
        req.company = { id: companyId, role: 'owner' };
        return next();
      }

      // Check team member permissions
      const teamResult = await query(
        'SELECT role, permissions, is_active FROM team_members WHERE company_id = $1 AND user_id = $2',
        [companyId, userId]
      );

      if (teamResult.rows.length === 0 || !teamResult.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You are not a member of this company.'
        });
      }

      const member = teamResult.rows[0];
      const userPermissions = member.permissions || {};

      // Check if user has required permissions
      const hasPermission = requiredPermissions.every(permission => 
        userPermissions[permission] === true
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
          required: requiredPermissions
        });
      }

      req.company = { 
        id: companyId, 
        role: member.role,
        permissions: userPermissions
      };
      
      next();
    } catch (error) {
      console.error('❌ Team permissions check error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyToken(token);
      
      const userResult = await query(
        'SELECT id, email, full_name FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (userResult.rows.length > 0) {
        req.user = {
          id: decoded.userId,
          email: userResult.rows[0].email,
          full_name: userResult.rows[0].full_name
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  checkCompanyOwnership,
  checkTeamPermissions,
  optionalAuth
};