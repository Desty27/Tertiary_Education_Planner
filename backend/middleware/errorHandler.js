const logger = require('../utils/logger');

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error handler middleware
 * Handles all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errorDetails = {};
  
  // Log the error
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = Object.values(err.errors).map(val => val.message);
  } else if (err.name === 'CastError') {
    // Mongoose cast error (e.g., invalid ObjectId)
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate field value entered';
    errorDetails = err.keyValue;
  } else if (err.name === 'JsonWebTokenError') {
    // JWT error
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    // JWT expired
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Send response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.name,
      stack: err.stack,
      details: errorDetails
    })
  });
};

/**
 * Not found error handler
 * Handles 404 errors for routes that don't exist
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

module.exports = {
  ApiError,
  errorHandler,
  notFound
};