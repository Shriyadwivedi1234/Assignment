// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle specific PostgreSQL errors
const handleDatabaseError = (error) => {
  if (error.code === '23505') { // Unique violation
    const field = error.detail.match(/Key \((.+)\)=/)?.[1] || 'field';
    return new AppError(`A record with this ${field} already exists`, 409);
  }
  
  if (error.code === '23503') { // Foreign key violation
    return new AppError('Referenced record does not exist', 400);
  }
  
  if (error.code === '23502') { // Not null violation
    const field = error.column || 'field';
    return new AppError(`${field} is required`, 400);
  }
  
  if (error.code === '22001') { // String data too long
    return new AppError('Input data is too long', 400);
  }
  
  return new AppError('Database operation failed', 500);
};

// Handle JWT errors
const handleJWTError = (error) => {
  if (error.name === 'TokenExpiredError') {
    return new AppError('Token has expired', 401);
  }
  
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401);
  }
  
  if (error.name === 'NotBeforeError') {
    return new AppError('Token not active', 401);
  }
  
  return new AppError('Authentication failed', 401);
};

// Handle Multer errors
const handleMulterError = (error) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File size too large. Maximum size is 10MB', 400);
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files uploaded', 400);
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected field in file upload', 400);
  }
  
  return new AppError('File upload failed', 400);
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  console.error(`❌ Error: ${error.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  // Handle specific error types
  if (err.code && err.code.startsWith('23')) {
    error = handleDatabaseError(err);
  }
  
  if (err.name && err.name.includes('Token')) {
    error = handleJWTError(err);
  }
  
  if (err.code && err.code.startsWith('LIMIT_')) {
    error = handleMulterError(err);
  }

  // Send response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 Not Found handler
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
  notFound
};