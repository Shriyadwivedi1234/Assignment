const CompanyModel = require('../models/companyModel');
const { query } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');

// Create company profile
const createCompany = asyncHandler(async (req, res) => {
  const ownerId = req.user.id;

  // Check if user already has a company
  const existingCompany = await CompanyModel.findByOwnerId(ownerId);
  if (existingCompany) {
    throw new AppError('User already has a company profile', 409);
  }

  // Check if company name already exists
  const nameExists = await CompanyModel.nameExists(req.body.company_name);
  if (nameExists) {
    throw new AppError('Company name already exists', 409);
  }

  const company = await CompanyModel.create(ownerId, req.body);

  res.status(201).json({
    success: true,
    message: 'Company profile created successfully',
    data: {
      company
    }
  });
});

// Get company profile
const getCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const company = await CompanyModel.findWithOwner(id);
  if (!company) {
    throw new AppError('Company not found', 404);
  }

  res.json({
    success: true,
    data: {
      company
    }
  });
});

// Get current user's company
const getMyCompany = asyncHandler(async (req, res) => {
  const ownerId = req.user.id;
  
  const company = await CompanyModel.findByOwnerId(ownerId);
  if (!company) {
    throw new AppError('No company profile found', 404);
  }

  res.json({
    success: true,
    data: {
      company
    }
  });
});

// Update company profile
const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if company name is being changed and if it already exists
  if (req.body.company_name) {
    const nameExists = await CompanyModel.nameExists(req.body.company_name, id);
    if (nameExists) {
      throw new AppError('Company name already exists', 409);
    }
  }

  const company = await CompanyModel.update(id, req.body);
  if (!company) {
    throw new AppError('Company not found', 404);
  }

  res.json({
    success: true,
    message: 'Company profile updated successfully',
    data: {
      company
    }
  });
});

// Complete company registration
const completeRegistration = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await CompanyModel.completeRegistration(id);
  if (!company) {
    throw new AppError('Company not found', 404);
  }

  res.json({
    success: true,
    message: 'Company registration completed successfully',
    data: {
      company
    }
  });
});

// Get company dashboard data
const getDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const dashboardData = await CompanyModel.getDashboardData(id);
  if (!dashboardData) {
    throw new AppError('Company not found', 404);
  }

  res.json({
    success: true,
    data: {
      dashboard: dashboardData
    }
  });
});

// Get all companies (public, with pagination)
const getAllCompanies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, city, organization_type, company_type, team_size } = req.query;
  const offset = (page - 1) * limit;

  const filters = {};
  if (city) filters.city = city;
  if (organization_type) filters.organization_type = organization_type;
  if (company_type) filters.company_type = company_type;
  if (team_size) filters.team_size = team_size;

  const result = await CompanyModel.getPaginated(parseInt(limit), offset, filters);

  res.json({
    success: true,
    data: result
  });
});

// Search companies
const searchCompanies = asyncHandler(async (req, res) => {
  const { q: searchQuery, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  if (!searchQuery || searchQuery.trim().length < 2) {
    throw new AppError('Search query must be at least 2 characters', 400);
  }

  const companies = await CompanyModel.search(searchQuery.trim(), parseInt(limit), offset);

  res.json({
    success: true,
    data: {
      companies,
      search_query: searchQuery,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    }
  });
});

// Delete company
const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedCompany = await CompanyModel.delete(id);
  if (!deletedCompany) {
    throw new AppError('Company not found', 404);
  }

  res.json({
    success: true,
    message: 'Company deleted successfully'
  });
});

// Company Jobs Management

// Create job
const createJob = asyncHandler(async (req, res) => {
  const companyId = req.company.id;
  const { title, description, requirements, location, type, salary_min, salary_max, status } = req.body;

  const result = await query(
    `INSERT INTO jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [companyId, title, description, requirements, location, type, salary_min, salary_max, status]
  );

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: {
      job: result.rows[0]
    }
  });
});

// Get company jobs
const getCompanyJobs = asyncHandler(async (req, res) => {
  const companyId = req.company.id;
  const { page = 1, limit = 10, status, type } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE company_id = $1';
  let values = [companyId];
  let paramCount = 2;

  if (status) {
    whereClause += ` AND status = $${paramCount}`;
    values.push(status);
    paramCount++;
  }

  if (type) {
    whereClause += ` AND type = $${paramCount}`;
    values.push(type);
    paramCount++;
  }

  values.push(limit, offset);

  const jobsResult = await query(
    `SELECT j.*, 
            COUNT(c.id) as candidate_count,
            COUNT(c.id) FILTER (WHERE c.status = 'applied') as new_applications
     FROM jobs j
     LEFT JOIN candidates c ON j.id = c.job_id
     ${whereClause}
     GROUP BY j.id
     ORDER BY j.created_at DESC
     LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
    values
  );

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) FROM jobs ${whereClause}`,
    values.slice(0, -2)
  );

  const totalCount = parseInt(countResult.rows[0].count);

  res.json({
    success: true,
    data: {
      jobs: jobsResult.rows,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalCount / limit)
      }
    }
  });
});

// Get single job with candidates
const getJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const companyId = req.company.id;

  const jobResult = await query(
    'SELECT * FROM jobs WHERE id = $1 AND company_id = $2',
    [jobId, companyId]
  );

  if (jobResult.rows.length === 0) {
    throw new AppError('Job not found', 404);
  }

  const candidatesResult = await query(
    `SELECT c.*, COUNT(i.id) as interview_count
     FROM candidates c
     LEFT JOIN interviews i ON c.id = i.candidate_id
     WHERE c.job_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [jobId]
  );

  res.json({
    success: true,
    data: {
      job: jobResult.rows[0],
      candidates: candidatesResult.rows
    }
  });
});

// Update job
const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const companyId = req.company.id;

  // Verify job belongs to company
  const existingJob = await query(
    'SELECT id FROM jobs WHERE id = $1 AND company_id = $2',
    [jobId, companyId]
  );

  if (existingJob.rows.length === 0) {
    throw new AppError('Job not found', 404);
  }

  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(req.body[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new AppError('No fields to update', 400);
  }

  values.push(jobId);
  const result = await query(
    `UPDATE jobs SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  );

  res.json({
    success: true,
    message: 'Job updated successfully',
    data: {
      job: result.rows[0]
    }
  });
});

// Delete job
const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const companyId = req.company.id;

  const result = await query(
    'DELETE FROM jobs WHERE id = $1 AND company_id = $2 RETURNING id',
    [jobId, companyId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Job not found', 404);
  }

  res.json({
    success: true,
    message: 'Job deleted successfully'
  });
});

module.exports = {
  createCompany,
  getCompany,
  getMyCompany,
  updateCompany,
  completeRegistration,
  getDashboard,
  getAllCompanies,
  searchCompanies,
  deleteCompany,
  createJob,
  getCompanyJobs,
  getJob,
  updateJob,
  deleteJob
};