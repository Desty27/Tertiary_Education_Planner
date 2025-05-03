const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

const router = express.Router();

/**
 * @route   POST /api/ai/curriculum/generate
 * @desc    Generate curriculum content
 * @access  Private (Teachers and Admins only)
 */
router.post(
  '/curriculum/generate',
  protect,
  restrictTo('teacher', 'admin'),
  aiController.generateCurriculumContent
);

/**
 * @route   POST /api/ai/assessment/generate
 * @desc    Generate assessment questions
 * @access  Private (Teachers and Admins only)
 */
router.post(
  '/assessment/generate',
  protect,
  restrictTo('teacher', 'admin'),
  aiController.generateAssessmentQuestions
);

/**
 * @route   POST /api/ai/assessment/analyze
 * @desc    Analyze student responses
 * @access  Private
 */
router.post(
  '/assessment/analyze',
  protect,
  aiController.analyzeStudentResponse
);

/**
 * @route   POST /api/ai/recommendations
 * @desc    Generate personalized learning recommendations
 * @access  Private
 */
router.post(
  '/recommendations',
  protect,
  aiController.generatePersonalizedRecommendations
);

/**
 * @route   GET /api/ai/usage
 * @desc    Get AI usage statistics
 * @access  Private (Admins only)
 */
router.get(
  '/usage',
  protect,
  restrictTo('admin'),
  aiController.getAiUsageStats
);

/**
 * @route   POST /api/ai/feedback
 * @desc    Submit feedback on AI-generated content
 * @access  Private
 */
router.post(
  '/feedback',
  protect,
  aiController.submitAiFeedback
);

module.exports = router;