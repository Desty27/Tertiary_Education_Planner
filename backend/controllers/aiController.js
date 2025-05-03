const aiService = require('../services/aiService');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Optional: Create a model for tracking AI usage
// const AiUsage = require('../models/aiUsageModel');

/**
 * Generate curriculum content
 * @route   POST /api/ai/curriculum/generate
 * @access  Private (Teachers and Admins only)
 */
const generateCurriculumContent = async (req, res, next) => {
  try {
    const { subject, keyStage, topic, contentType } = req.body;
    
    // Validate required fields
    if (!subject || !keyStage || !topic || !contentType) {
      return next(new ApiError(400, 'Missing required fields'));
    }
    
    // Call AI service
    const result = await aiService.generateCurriculumContent({
      subject,
      keyStage,
      topic,
      contentType
    });
    
    // Track usage (optional)
    // await trackAiUsage(req.user._id, 'curriculum_generation', result.usage);
    
    // Return result
    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    logger.error(`Error generating curriculum content: ${error.message}`);
    next(error);
  }
};

/**
 * Generate assessment questions
 * @route   POST /api/ai/assessment/generate
 * @access  Private (Teachers and Admins only)
 */
const generateAssessmentQuestions = async (req, res, next) => {
  try {
    const { subject, keyStage, topic, questionType, count, difficulty } = req.body;
    
    // Validate required fields
    if (!subject || !keyStage || !topic || !questionType) {
      return next(new ApiError(400, 'Missing required fields'));
    }
    
    // Set defaults for optional fields
    const questionCount = count || 5;
    const questionDifficulty = difficulty || 'medium';
    
    // Call AI service
    const result = await aiService.generateAssessmentQuestions({
      subject,
      keyStage,
      topic,
      questionType,
      count: questionCount,
      difficulty: questionDifficulty
    });
    
    // Track usage (optional)
    // await trackAiUsage(req.user._id, 'assessment_generation', result.usage);
    
    // Return result
    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    logger.error(`Error generating assessment questions: ${error.message}`);
    next(error);
  }
};

/**
 * Analyze student response
 * @route   POST /api/ai/assessment/analyze
 * @access  Private
 */
const analyzeStudentResponse = async (req, res, next) => {
  try {
    const { subject, keyStage, question, studentResponse, correctAnswer } = req.body;
    
    // Validate required fields
    if (!subject || !keyStage || !question || !studentResponse || !correctAnswer) {
      return next(new ApiError(400, 'Missing required fields'));
    }
    
    // Call AI service
    const result = await aiService.analyzeStudentResponse({
      subject,
      keyStage,
      question,
      studentResponse,
      correctAnswer
    });
    
    // Track usage (optional)
    // await trackAiUsage(req.user._id, 'response_analysis', result.usage);
    
    // Return result
    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    logger.error(`Error analyzing student response: ${error.message}`);
    next(error);
  }
};

/**
 * Generate personalized learning recommendations
 * @route   POST /api/ai/recommendations
 * @access  Private
 */
const generatePersonalizedRecommendations = async (req, res, next) => {
  try {
    const { subject, keyStage, studentProfile, assessmentResults } = req.body;
    
    // Validate required fields
    if (!subject || !keyStage || !studentProfile || !assessmentResults) {
      return next(new ApiError(400, 'Missing required fields'));
    }
    
    // Call AI service
    const result = await aiService.generatePersonalizedRecommendations({
      subject,
      keyStage,
      studentProfile,
      assessmentResults
    });
    
    // Track usage (optional)
    // await trackAiUsage(req.user._id, 'recommendations', result.usage);
    
    // Return result
    res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    logger.error(`Error generating personalized recommendations: ${error.message}`);
    next(error);
  }
};

/**
 * Get AI usage statistics
 * @route   GET /api/ai/usage
 * @access  Private (Admins only)
 */
const getAiUsageStats = async (req, res, next) => {
  try {
    // This would typically query the database for AI usage statistics
    // For now, we'll return mock data
    
    const mockUsageStats = {
      totalRequests: 1250,
      totalTokensUsed: 3750000,
      requestsByType: {
        curriculum_generation: 350,
        assessment_generation: 450,
        response_analysis: 300,
        recommendations: 150
      },
      usageByUser: [
        { userId: 'user1', requests: 120, tokensUsed: 360000 },
        { userId: 'user2', requests: 85, tokensUsed: 255000 }
      ],
      costEstimate: 75.00 // in USD
    };
    
    res.status(200).json({
      success: true,
      data: mockUsageStats
    });
  } catch (error) {
    logger.error(`Error getting AI usage stats: ${error.message}`);
    next(error);
  }
};

/**
 * Submit feedback on AI-generated content
 * @route   POST /api/ai/feedback
 * @access  Private
 */
const submitAiFeedback = async (req, res, next) => {
  try {
    const { contentId, contentType, rating, feedback, improvements } = req.body;
    
    // Validate required fields
    if (!contentId || !contentType || !rating) {
      return next(new ApiError(400, 'Missing required fields'));
    }
    
    // This would typically store the feedback in the database
    // For now, we'll just log it
    logger.info('AI Feedback received', {
      userId: req.user._id,
      contentId,
      contentType,
      rating,
      feedback,
      improvements
    });
    
    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    logger.error(`Error submitting AI feedback: ${error.message}`);
    next(error);
  }
};

/**
 * Track AI usage (helper function)
 * @param {string} userId - User ID
 * @param {string} requestType - Type of AI request
 * @param {Object} usage - Usage data from AI service
 */
const trackAiUsage = async (userId, requestType, usage) => {
  try {
    // This would typically create a record in the database
    // For now, we'll just log it
    logger.info('AI Usage tracked', {
      userId,
      requestType,
      usage
    });
    
    // Example of how this might be implemented with a database model
    /*
    await AiUsage.create({
      user: userId,
      requestType,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      timestamp: Date.now()
    });
    */
  } catch (error) {
    logger.error(`Error tracking AI usage: ${error.message}`);
    // Don't throw the error, just log it
  }
};

module.exports = {
  generateCurriculumContent,
  generateAssessmentQuestions,
  analyzeStudentResponse,
  generatePersonalizedRecommendations,
  getAiUsageStats,
  submitAiFeedback
};