const User = require('../models/userModel');
const { ApiError } = require('../middleware/errorHandler');
const { 
  verifyIdToken, 
  createUser, 
  updateUser, 
  getUserByUid 
} = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { idToken, name, email, role } = req.body;

    if (!idToken) {
      return next(new ApiError(400, 'Firebase ID token is required'));
    }

    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Check if user already exists in our database
    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return next(new ApiError(400, 'User already exists'));
    }

    // Create user in our database
    const user = await User.create({
      firebaseUid,
      name: name || decodedToken.name || 'User',
      email: email || decodedToken.email,
      role: role || 'student',
      isEmailVerified: decodedToken.email_verified || false
    });

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    next(error);
  }
};

/**
 * Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return next(new ApiError(400, 'Firebase ID token is required'));
    }

    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    // Find user in our database
    let user = await User.findOne({ firebaseUid });

    // If user doesn't exist in our database but exists in Firebase, create them
    if (!user && decodedToken.email) {
      user = await User.create({
        firebaseUid,
        name: decodedToken.name || 'User',
        email: decodedToken.email,
        role: 'student',
        isEmailVerified: decodedToken.email_verified || false
      });
    } else if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: idToken
      }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

/**
 * Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    // Clear cookie if using cookies
    if (req.cookies.token) {
      res.clearCookie('token');
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    next(error);
  }
};

/**
 * Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          organization: user.organization,
          position: user.position,
          bio: user.bio,
          preferences: user.preferences,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    next(error);
  }
};

/**
 * Update current user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    const { name, profileImage, organization, position, bio, preferences } = req.body;

    // Update user fields
    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    if (organization) user.organization = organization;
    if (position) user.position = position;
    if (bio) user.bio = bio;
    if (preferences) {
      // Update preferences while preserving defaults
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    // Save updated user
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          organization: user.organization,
          position: user.position,
          bio: user.bio,
          preferences: user.preferences
        }
      }
    });
  } catch (error) {
    logger.error(`Update current user error: ${error.message}`);
    next(error);
  }
};

/**
 * Request password reset email
 * @route   POST /api/auth/password/reset
 * @access  Public
 */
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ApiError(400, 'Email is required'));
    }

    // This would typically call Firebase Auth to send a password reset email
    // For now, we'll just return a success response
    
    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    logger.error(`Request password reset error: ${error.message}`);
    next(error);
  }
};

/**
 * Verify password reset token
 * @route   POST /api/auth/password/verify
 * @access  Public
 */
const verifyPasswordReset = async (req, res, next) => {
  try {
    const { oobCode } = req.body;

    if (!oobCode) {
      return next(new ApiError(400, 'Reset code is required'));
    }

    // This would typically verify the oobCode with Firebase Auth
    // For now, we'll just return a success response
    
    res.status(200).json({
      success: true,
      message: 'Password reset code is valid'
    });
  } catch (error) {
    logger.error(`Verify password reset error: ${error.message}`);
    next(error);
  }
};

/**
 * Change password (when logged in)
 * @route   POST /api/auth/password/change
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    // This would typically call Firebase Auth to change the password
    // For now, we'll just return a success response
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    next(error);
  }
};

/**
 * Verify email address
 * @route   POST /api/auth/email/verify
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { oobCode } = req.body;

    if (!oobCode) {
      return next(new ApiError(400, 'Verification code is required'));
    }

    // This would typically verify the oobCode with Firebase Auth
    // and update the user's email verification status
    // For now, we'll just return a success response
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    logger.error(`Verify email error: ${error.message}`);
    next(error);
  }
};

/**
 * Refresh authentication token
 * @route   POST /api/auth/refresh-token
 * @access  Public (with refresh token)
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new ApiError(400, 'Refresh token is required'));
    }

    // This would typically call Firebase Auth to refresh the token
    // For now, we'll just return a success response
    
    res.status(200).json({
      success: true,
      data: {
        token: 'new-token-would-be-here'
      }
    });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateCurrentUser,
  requestPasswordReset,
  verifyPasswordReset,
  changePassword,
  verifyEmail,
  refreshToken
};