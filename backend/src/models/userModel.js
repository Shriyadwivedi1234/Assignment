const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  // Create a new user
  static async create(userData) {
    const {
      email,
      password,
      full_name,
      gender,
      mobile_number,
      signup_type = 'e'
    } = userData;

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, gender, mobile_number, signup_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, gender, mobile_number, signup_type, is_mobile_verified, is_email_verified, created_at`,
      [email, password_hash, full_name, gender, mobile_number, signup_type]
    );

    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await query(
      'SELECT id, email, full_name, gender, mobile_number, signup_type, is_mobile_verified, is_email_verified, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Find user by mobile number
  static async findByMobile(mobile_number) {
    const result = await query(
      'SELECT * FROM users WHERE mobile_number = $1',
      [mobile_number]
    );
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
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
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, full_name, gender, mobile_number, signup_type, is_mobile_verified, is_email_verified, created_at, updated_at`,
      values
    );

    return result.rows[0];
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    const result = await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, email, full_name',
      [password_hash, id]
    );

    return result.rows[0];
  }

  // Verify email
  static async verifyEmail(id) {
    const result = await query(
      'UPDATE users SET is_email_verified = true WHERE id = $1 RETURNING id, email, is_email_verified',
      [id]
    );
    return result.rows[0];
  }

  // Verify mobile
  static async verifyMobile(id) {
    const result = await query(
      'UPDATE users SET is_mobile_verified = true WHERE id = $1 RETURNING id, mobile_number, is_mobile_verified',
      [id]
    );
    return result.rows[0];
  }

  // Delete user
  static async delete(id) {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  // Get user statistics
  static async getStats() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE is_email_verified = true) as verified_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as recent_users,
        COUNT(*) FILTER (WHERE signup_type = 'e') as email_signups,
        COUNT(*) FILTER (WHERE signup_type = 'g') as google_signups,
        COUNT(*) FILTER (WHERE signup_type = 'f') as facebook_signups
      FROM users
    `);
    return result.rows[0];
  }

  // Search users
  static async search(searchQuery, limit = 10, offset = 0) {
    const result = await query(
      `SELECT id, email, full_name, gender, mobile_number, signup_type, is_email_verified, is_mobile_verified, created_at
       FROM users 
       WHERE full_name ILIKE $1 OR email ILIKE $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [`%${searchQuery}%`, limit, offset]
    );
    return result.rows;
  }

  // Get paginated users
  static async getPaginated(limit = 10, offset = 0, sortBy = 'created_at', sortOrder = 'DESC') {
    const allowedSortFields = ['created_at', 'updated_at', 'full_name', 'email'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const result = await query(
      `SELECT id, email, full_name, gender, mobile_number, signup_type, is_email_verified, is_mobile_verified, created_at, updated_at
       FROM users 
       ORDER BY ${sortField} ${order}
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM users');
    const totalCount = parseInt(countResult.rows[0].count);

    return {
      users: result.rows,
      pagination: {
        total: totalCount,
        page: Math.floor(offset / limit) + 1,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  }

  // Check if email exists
  static async emailExists(email, excludeId = null) {
    let queryText = 'SELECT id FROM users WHERE email = $1';
    let values = [email];

    if (excludeId) {
      queryText += ' AND id != $2';
      values.push(excludeId);
    }

    const result = await query(queryText, values);
    return result.rows.length > 0;
  }

  // Check if mobile exists
  static async mobileExists(mobile_number, excludeId = null) {
    let queryText = 'SELECT id FROM users WHERE mobile_number = $1';
    let values = [mobile_number];

    if (excludeId) {
      queryText += ' AND id != $2';
      values.push(excludeId);
    }

    const result = await query(queryText, values);
    return result.rows.length > 0;
  }
}

module.exports = UserModel;