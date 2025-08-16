const { query, getClient } = require('../config/db');

class CompanyModel {
  // Create a new company profile
  static async create(ownerId, companyData) {
    const {
      company_name,
      about_us,
      organization_type,
      company_type,
      team_size,
      year_established,
      website,
      vision,
      facebook_url,
      twitter_url,
      instagram_url,
      linkedin_url,
      youtube_url,
      address,
      city,
      state,
      zip_code,
      country,
      phone,
      contact_person,
      contact_title
    } = companyData;

    const result = await query(
      `INSERT INTO company_profiles (
        owner_id, company_name, about_us, organization_type, company_type,
        team_size, year_established, website, vision, facebook_url,
        twitter_url, instagram_url, linkedin_url, youtube_url,
        address, city, state, zip_code, country, phone,
        contact_person, contact_title
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *`,
      [
        ownerId, company_name, about_us, organization_type, company_type,
        team_size, year_established, website, vision, facebook_url,
        twitter_url, instagram_url, linkedin_url, youtube_url,
        address, city, state, zip_code, country, phone,
        contact_person, contact_title
      ]
    );

    return result.rows[0];
  }

  // Find company by ID
  static async findById(id) {
    const result = await query(
      'SELECT * FROM company_profiles WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Find company by owner ID
  static async findByOwnerId(ownerId) {
    const result = await query(
      'SELECT * FROM company_profiles WHERE owner_id = $1',
      [ownerId]
    );
    return result.rows[0];
  }

  // Find company with owner details
  static async findWithOwner(id) {
    const result = await query(
      `SELECT 
        cp.*,
        u.full_name as owner_name,
        u.email as owner_email,
        u.mobile_number as owner_mobile
      FROM company_profiles cp
      JOIN users u ON cp.owner_id = u.id
      WHERE cp.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Update company profile
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Build dynamic update query
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const result = await query(
      `UPDATE company_profiles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // Update logo URL
  static async updateLogo(id, logoUrl) {
    const result = await query(
      'UPDATE company_profiles SET logo_url = $1 WHERE id = $2 RETURNING id, logo_url',
      [logoUrl, id]
    );
    return result.rows[0];
  }

  // Update banner URL
  static async updateBanner(id, bannerUrl) {
    const result = await query(
      'UPDATE company_profiles SET banner_url = $1 WHERE id = $2 RETURNING id, banner_url',
      [bannerUrl, id]
    );
    return result.rows[0];
  }

  // Mark registration as complete
  static async completeRegistration(id) {
    const result = await query(
      'UPDATE company_profiles SET registration_complete = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  // Get company with job statistics
  static async findWithJobStats(id) {
    const result = await query(
      `SELECT 
        cp.*,
        COUNT(j.id) as total_jobs,
        COUNT(j.id) FILTER (WHERE j.status = 'active') as active_jobs,
        COUNT(j.id) FILTER (WHERE j.status = 'closed') as closed_jobs,
        COUNT(j.id) FILTER (WHERE j.status = 'draft') as draft_jobs
      FROM company_profiles cp
      LEFT JOIN jobs j ON cp.id = j.company_id
      WHERE cp.id = $1
      GROUP BY cp.id`,
      [id]
    );
    return result.rows[0];
  }

  // Search companies
  static async search(searchQuery, limit = 10, offset = 0) {
    const result = await query(
      `SELECT id, company_name, about_us, logo_url, city, state, country, 
              organization_type, company_type, team_size, website, created_at
       FROM company_profiles 
       WHERE company_name ILIKE $1 OR about_us ILIKE $1 OR city ILIKE $1
       AND registration_complete = true
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${searchQuery}%`, limit, offset]
    );
    return result.rows;
  }

  // Get paginated companies
  static async getPaginated(limit = 10, offset = 0, filters = {}) {
    let whereClause = 'WHERE registration_complete = true';
    let values = [];
    let paramCount = 1;

    // Add filters
    if (filters.city) {
      whereClause += ` AND city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.organization_type) {
      whereClause += ` AND organization_type = $${paramCount}`;
      values.push(filters.organization_type);
      paramCount++;
    }

    if (filters.company_type) {
      whereClause += ` AND company_type = $${paramCount}`;
      values.push(filters.company_type);
      paramCount++;
    }

    if (filters.team_size) {
      whereClause += ` AND team_size = $${paramCount}`;
      values.push(filters.team_size);
      paramCount++;
    }

    values.push(limit, offset);

    const result = await query(
      `SELECT id, company_name, about_us, logo_url, banner_url, city, state, country,
              organization_type, company_type, team_size, year_established, website, created_at
       FROM company_profiles 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM company_profiles ${whereClause}`,
      values.slice(0, -2) // Remove limit and offset
    );
    
    const totalCount = parseInt(countResult.rows[0].count);

    return {
      companies: result.rows,
      pagination: {
        total: totalCount,
        page: Math.floor(offset / limit) + 1,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  }

  // Get companies with job counts
  static async getWithJobCounts(limit = 10, offset = 0) {
    const result = await query(
      `SELECT 
        cp.id, cp.company_name, cp.about_us, cp.logo_url, cp.city, cp.state, cp.country,
        cp.organization_type, cp.company_type, cp.team_size, cp.website, cp.created_at,
        COUNT(j.id) as total_jobs,
        COUNT(j.id) FILTER (WHERE j.status = 'active') as active_jobs
      FROM company_profiles cp
      LEFT JOIN jobs j ON cp.id = j.company_id
      WHERE cp.registration_complete = true
      GROUP BY cp.id
      ORDER BY cp.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  // Delete company
  static async delete(id) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Delete related records first due to foreign key constraints
      await client.query('DELETE FROM team_members WHERE company_id = $1', [id]);
      await client.query('DELETE FROM analytics WHERE company_id = $1', [id]);
      
      // Delete jobs and their related records
      await client.query(`
        DELETE FROM interviews WHERE job_id IN (
          SELECT id FROM jobs WHERE company_id = $1
        )`, [id]);
      
      await client.query(`
        DELETE FROM candidates WHERE job_id IN (
          SELECT id FROM jobs WHERE company_id = $1
        )`, [id]);
      
      await client.query('DELETE FROM jobs WHERE company_id = $1', [id]);
      
      // Finally delete company profile
      const result = await client.query(
        'DELETE FROM company_profiles WHERE id = $1 RETURNING id',
        [id]
      );
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Check if company name exists
  static async nameExists(companyName, excludeId = null) {
    let queryText = 'SELECT id FROM company_profiles WHERE company_name = $1';
    let values = [companyName];

    if (excludeId) {
      queryText += ' AND id != $2';
      values.push(excludeId);
    }

    const result = await query(queryText, values);
    return result.rows.length > 0;
  }

  // Get company dashboard data
  static async getDashboardData(companyId) {
    const result = await query(
      `SELECT 
        cp.*,
        COUNT(DISTINCT j.id) as total_jobs,
        COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'active') as active_jobs,
        COUNT(DISTINCT c.id) as total_candidates,
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'applied') as new_applications,
        COUNT(DISTINCT i.id) as total_interviews,
        COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'scheduled' AND i.scheduled_at > NOW()) as upcoming_interviews,
        COUNT(DISTINCT tm.id) as team_members_count
      FROM company_profiles cp
      LEFT JOIN jobs j ON cp.id = j.company_id
      LEFT JOIN candidates c ON j.id = c.job_id
      LEFT JOIN interviews i ON c.id = i.candidate_id
      LEFT JOIN team_members tm ON cp.id = tm.company_id AND tm.is_active = true
      WHERE cp.id = $1
      GROUP BY cp.id`,
      [companyId]
    );
    return result.rows[0];
  }
}

module.exports = CompanyModel;