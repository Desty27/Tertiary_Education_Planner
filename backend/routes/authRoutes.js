const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear cookies
 * @access  Private
 */
router.post('/logout', protect, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, authController.getCurrentUser);

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', protect, authController.updateCurrentUser);

/**
 * @route   POST /api/auth/password/reset
 * @desc    Request password reset email
 * @access  Public
 */
router.post('/password/reset', authController.requestPasswordReset);

/**
 * @route   POST /api/auth/password/verify
 * @desc    Verify password reset token
 * @access  Public
 */
router.post('/password/verify', authController.verifyPasswordReset);

/**
 * @route   POST /api/auth/password/change
 * @desc    Change password (when logged in)
 * @access  Private
 */
router.post('/password/change', protect, authController.changePassword);

/**
 * @route   POST /api/auth/email/verify
 * @desc    Verify email address
 * @access  Public
 */
router.post('/email/verify', authController.verifyEmail);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh authentication token
 * @access  Public (with refresh token)
 */
router.post('/refresh-token', authController.refreshToken);

module.exports = router;