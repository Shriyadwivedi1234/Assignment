const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Generic validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    throw new AppError('Validation failed', 400, errorMessages);
  }
  
  next();
};

// Common validation rules
const validationRules = {
  // User validation rules
  userRegistration: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('full_name')
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Full name must be between 2 and 255 characters'),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('Gender must be one of: male, female, other'),
    body('mobile_number')
      .isMobilePhone()
      .withMessage('Please provide a valid mobile number'),
    body('signup_type')
      .optional()
      .isIn(['e', 'g', 'f'])
      .withMessage('Signup type must be one of: e, g, f')
  ],

  userLogin: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Company validation rules
  companyProfile: [
    body('company_name')
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Company name must be between 2 and 255 characters'),
    body('about_us')
      .optional()
      .isLength({ max: 5000 })
      .withMessage('About us cannot exceed 5000 characters'),
    body('website')
      .optional()
      .isURL()
      .withMessage('Website must be a valid URL'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('year_established')
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage('Year established must be a valid year'),
    body('team_size')
      .optional()
      .isIn(['1-10', '11-50', '51-200', '201-500', '500+'])
      .withMessage('Team size must be one of the predefined ranges')
  ],

  // Job validation rules
  job: [
    body('title')
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Job title must be between 2 and 255 characters'),
    body('description')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Job description must be at least 10 characters'),
    body('location')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Location cannot exceed 255 characters'),
    body('type')
      .optional()
      .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
      .withMessage('Job type must be one of: full-time, part-time, contract, internship, remote'),
    body('salary_min')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Minimum salary must be a positive number'),
    body('salary_max')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Maximum salary must be a positive number')
      .custom((value, { req }) => {
        if (req.body.salary_min && value < req.body.salary_min) {
          throw new Error('Maximum salary must be greater than or equal to minimum salary');
        }
        return true;
      })
  ],

  // Candidate validation rules
  candidate: [
    body('full_name')
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage('Full name must be between 2 and 255 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('cover_letter')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Cover letter cannot exceed 2000 characters')
  ],

  // Interview validation rules
  interview: [
    body('candidate_id')
      .isUUID()
      .withMessage('Candidate ID must be a valid UUID'),
    body('scheduled_at')
      .isISO8601()
      .withMessage('Scheduled date must be a valid ISO date')
      .custom(value => {
        if (new Date(value) <= new Date()) {
          throw new Error('Scheduled date must be in the future');
        }
        return true;
      }),
    body('duration_minutes')
      .optional()
      .isInt({ min: 15, max: 480 })
      .withMessage('Duration must be between 15 and 480 minutes'),
    body('type')
      .isIn(['phone', 'video', 'in-person'])
      .withMessage('Interview type must be one of: phone, video, in-person'),
    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters')
  ],

  // Parameter validation rules
  uuidParam: (paramName) => [
    param(paramName)
      .isUUID()
      .withMessage(`${paramName} must be a valid UUID`)
  ],

  // Query validation rules
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sort_by')
      .optional()
      .isIn(['created_at', 'updated_at', 'name', 'title'])
      .withMessage('Sort by must be one of: created_at, updated_at, name, title'),
    query('sort_order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be either asc or desc'),
    query('search')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Search query cannot exceed 255 characters')
  ]
};

// Middleware factory functions
const validate = (rules) => {
  return [...rules, handleValidationErrors];
};

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Recursively sanitize all string inputs
  const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
      return obj.trim();
    } else if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        obj[key] = sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};

module.exports = {
  validationRules,
  validate,
  handleValidationErrors,
  sanitizeInput
};