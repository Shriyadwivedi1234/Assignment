const Joi = require('joi');

// User registration validation
const validateUserRegistration = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'any.required': 'Password is required'
    }),
    full_name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 255 characters',
      'any.required': 'Full name is required'
    }),
    gender: Joi.string().valid('male', 'female', 'other').messages({
      'any.only': 'Gender must be one of: male, female, other'
    }),
    mobile_number: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
      'string.pattern.base': 'Please provide a valid mobile number',
      'any.required': 'Mobile number is required'
    }),
    signup_type: Joi.string().valid('e', 'g', 'f').default('e').messages({
      'any.only': 'Signup type must be one of: e (email), g (google), f (facebook)'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Job validation
const validateJob = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Job title must be at least 2 characters',
      'string.max': 'Job title cannot exceed 255 characters',
      'any.required': 'Job title is required'
    }),
    description: Joi.string().min(10).required().messages({
      'string.min': 'Job description must be at least 10 characters',
      'any.required': 'Job description is required'
    }),
    requirements: Joi.string().allow('').messages({}),
    location: Joi.string().max(255).allow('').messages({
      'string.max': 'Location cannot exceed 255 characters'
    }),
    type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'remote').messages({
      'any.only': 'Job type must be one of: full-time, part-time, contract, internship, remote'
    }),
    salary_min: Joi.number().integer().min(0).messages({
      'number.base': 'Minimum salary must be a number',
      'number.integer': 'Minimum salary must be an integer',
      'number.min': 'Minimum salary cannot be negative'
    }),
    salary_max: Joi.number().integer().min(Joi.ref('salary_min')).messages({
      'number.base': 'Maximum salary must be a number',
      'number.integer': 'Maximum salary must be an integer',
      'number.min': 'Maximum salary must be greater than or equal to minimum salary'
    }),
    status: Joi.string().valid('active', 'closed', 'draft').default('draft').messages({
      'any.only': 'Status must be one of: active, closed, draft'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Candidate validation
const validateCandidate = (req, res, next) => {
  const schema = Joi.object({
    full_name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 255 characters',
      'any.required': 'Full name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow('').messages({
      'string.pattern.base': 'Phone must be a valid phone number'
    }),
    cover_letter: Joi.string().max(2000).allow('').messages({
      'string.max': 'Cover letter cannot exceed 2000 characters'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Interview validation
const validateInterview = (req, res, next) => {
  const schema = Joi.object({
    candidate_id: Joi.string().uuid().required().messages({
      'string.uuid': 'Candidate ID must be a valid UUID',
      'any.required': 'Candidate ID is required'
    }),
    scheduled_at: Joi.date().iso().greater('now').required().messages({
      'date.base': 'Scheduled date must be a valid date',
      'date.greater': 'Scheduled date must be in the future',
      'any.required': 'Scheduled date is required'
    }),
    duration_minutes: Joi.number().integer().min(15).max(480).default(60).messages({
      'number.base': 'Duration must be a number',
      'number.integer': 'Duration must be an integer',
      'number.min': 'Duration must be at least 15 minutes',
      'number.max': 'Duration cannot exceed 8 hours'
    }),
    type: Joi.string().valid('phone', 'video', 'in-person').required().messages({
      'any.only': 'Interview type must be one of: phone, video, in-person',
      'any.required': 'Interview type is required'
    }),
    notes: Joi.string().max(1000).allow('').messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Message validation
const validateMessage = (req, res, next) => {
  const schema = Joi.object({
    recipient_id: Joi.string().uuid().required().messages({
      'string.uuid': 'Recipient ID must be a valid UUID',
      'any.required': 'Recipient ID is required'
    }),
    subject: Joi.string().max(255).allow('').messages({
      'string.max': 'Subject cannot exceed 255 characters'
    }),
    content: Joi.string().min(1).max(5000).required().messages({
      'string.min': 'Message content cannot be empty',
      'string.max': 'Message content cannot exceed 5000 characters',
      'any.required': 'Message content is required'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Team member validation
const validateTeamMember = (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.string().uuid().required().messages({
      'string.uuid': 'User ID must be a valid UUID',
      'any.required': 'User ID is required'
    }),
    role: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Role must be at least 2 characters',
      'string.max': 'Role cannot exceed 100 characters',
      'any.required': 'Role is required'
    }),
    department: Joi.string().max(100).allow('').messages({
      'string.max': 'Department cannot exceed 100 characters'
    }),
    permissions: Joi.object().pattern(Joi.string(), Joi.boolean()).messages({
      'object.base': 'Permissions must be an object with boolean values'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// UUID parameter validation
const validateUUID = (paramName) => {
  return (req, res, next) => {
    const uuid = req.params[paramName];
    const schema = Joi.string().uuid().required();
    
    const { error } = schema.validate(uuid);
    if (error) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}. Must be a valid UUID.`
      });
    }
    next();
  };
};

// Pagination validation
const validatePagination = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort_by: Joi.string().valid('created_at', 'updated_at', 'name', 'title').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().max(255).allow('')
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  
  req.pagination = value;
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateCompanyProfile,
  validateJob,
  validateCandidate,
  validateInterview,
  validateMessage,
  validateTeamMember,
  validateUUID,
  validatePagination
  };

  details.map(detail => detail.message)

// User login validation
const validateUserLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

// Company profile validation
const validateCompanyProfile = (req, res, next) => {
  const schema = Joi.object({
    company_name: Joi.string().min(2).max(255).required().messages({
      'string.min': 'Company name must be at least 2 characters',
      'string.max': 'Company name cannot exceed 255 characters',
      'any.required': 'Company name is required'
    }),
    about_us: Joi.string().max(5000).allow('').messages({
      'string.max': 'About us cannot exceed 5000 characters'
    }),
    organization_type: Joi.string().max(100).allow('').messages({
      'string.max': 'Organization type cannot exceed 100 characters'
    }),
    company_type: Joi.string().max(100).allow('').messages({
      'string.max': 'Company type cannot exceed 100 characters'
    }),
    team_size: Joi.string().valid('1-10', '11-50', '51-200', '201-500', '500+').messages({
      'any.only': 'Team size must be one of: 1-10, 11-50, 51-200, 201-500, 500+'
    }),
    year_established: Joi.string().pattern(/^\d{4}$/).messages({
      'string.pattern.base': 'Year established must be a 4-digit year'
    }),
    website: Joi.string().uri().allow('').messages({
      'string.uri': 'Website must be a valid URL'
    }),
    vision: Joi.string().max(1000).allow('').messages({
      'string.max': 'Vision cannot exceed 1000 characters'
    }),
    facebook_url: Joi.string().uri().allow('').messages({
      'string.uri': 'Facebook URL must be valid'
    }),
    twitter_url: Joi.string().uri().allow('').messages({
      'string.uri': 'Twitter URL must be valid'
    }),
    instagram_url: Joi.string().uri().allow('').messages({
      'string.uri': 'Instagram URL must be valid'
    }),
    linkedin_url: Joi.string().uri().allow('').messages({
      'string.uri': 'LinkedIn URL must be valid'
    }),
    youtube_url: Joi.string().uri().allow('').messages({
      'string.uri': 'YouTube URL must be valid'
    }),
    address: Joi.string().max(500).allow('').messages({
      'string.max': 'Address cannot exceed 500 characters'
    }),
    city: Joi.string().max(100).allow('').messages({
      'string.max': 'City cannot exceed 100 characters'
    }),
    state: Joi.string().max(100).allow('').messages({
      'string.max': 'State cannot exceed 100 characters'
    }),
    zip_code: Joi.string().max(20).allow('').messages({
      'string.max': 'Zip code cannot exceed 20 characters'
    }),
    country: Joi.string().max(100).allow('').messages({
      'string.max': 'Country cannot exceed 100 characters'
    }),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow('').messages({
      'string.pattern.base': 'Phone must be a valid phone number'
    }),
    contact_person: Joi.string().max(255).allow('').messages({
      'string.max': 'Contact person cannot exceed 255 characters'
    }),
    contact_title: Joi.string().max(255).allow('').messages({
      'string.max': 'Contact title cannot exceed 255 characters'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error
      });
  }
  next(); 
  }