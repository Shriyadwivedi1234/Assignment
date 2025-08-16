require('dotenv').config({ path: __dirname + '/../.env' });
console.log("Loaded DB_PASSWORD from env:", process.env.DB_PASSWORD);
const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'myapp',
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('📊 Connected to PostgreSQL database');
    
    // Test query to verify connection
    const result = await client.query('SELECT NOW()');
    console.log(`⏰ Database time: ${result.rows[0].now}`);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

// Get a client from the pool
async function getClient() {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Error getting database client:', error);
    throw error;
  }
}

// Execute a query with automatic client management
async function query(text, params) {
  const client = await getClient();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Close the pool (for graceful shutdown)
async function closePool() {
  try {
    await pool.end();
    console.log('🔒 Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
}

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  connectDB,
  getClient,
  query,
  closePool,
  pool
};
