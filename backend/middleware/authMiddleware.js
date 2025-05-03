const { verifyIdToken } = require('../config/firebase');
const { ApiError } = require('./errorHandler');
const User = require('../models/userModel');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes
 * Verifies the Firebase ID token in the Authorization header
 * Sets req.user with the authenticated user data
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check if token exists in cookies (for web clients)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return next(new ApiError(401, 'Not authorized, no token provided'));
    }

    // Verify token
    const decodedToken = await verifyIdToken(token);
    
    // Get user from database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    // Check if user exists in our database
    if (!user) {
      // User authenticated with Firebase but not in our database
      // This could happen if Firebase auth is set up but user record not created in MongoDB
      logger.warn(`User with Firebase UID ${decodedToken.uid} authenticated but not found in database`);
      return next(new ApiError(401, 'User not found in system'));
    }

    // Set user in request object
    req.user = user;
    req.firebaseUser = decodedToken;
    
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return next(new ApiError(401, 'Not authorized, invalid token'));
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...String} roles - Roles allowed to access the route
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    
    next();
  };
};

/**
 * Optional authentication middleware
 * Tries to authenticate the user but doesn't fail if no token is provided
 * Useful for routes that can be accessed by both authenticated and unauthenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check if token exists in cookies (for web clients)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    // Verify token
    const decodedToken = await verifyIdToken(token);
    
    // Get user from database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    // If user exists, set in request object
    if (user) {
      req.user = user;
      req.firebaseUser = decodedToken;
    }
    
    next();
  } catch (error) {
    // If token verification fails, continue without authentication
    logger.warn(`Optional authentication failed: ${error.message}`);
    next();
  }
};

module.exports = {
  protect,
  restrictTo,
  optionalAuth
};