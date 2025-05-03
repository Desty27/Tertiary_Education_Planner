const OpenAI = require('openai');
const axios = require('axios');
const logger = require('../utils/logger');

// Initialize OpenAI client
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  logger.error(`Error initializing OpenAI client: ${error.message}`);
}

/**
 * Generate curriculum content using OpenAI
 * @param {Object} params - Parameters for content generation
 * @param {string} params.subject - Subject area (e.g., "Mathematics", "English")
 * @param {string} params.keyStage - Key stage (e.g., "Key Stage 2")
 * @param {string} params.topic - Specific topic (e.g., "Fractions", "Shakespeare")
 * @param {string} params.contentType - Type of content to generate (e.g., "lesson plan", "assessment", "objectives")
 * @returns {Promise<Object>} Generated content
 */
const generateCurriculumContent = async (params) => {
  try {
    const { subject, keyStage, topic, contentType } = params;
    
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }
    
    // Create a detailed prompt based on parameters
    const prompt = `
      Create a detailed ${contentType} for ${subject} at ${keyStage} level on the topic of ${topic}.
      
      The content should:
      - Be aligned with UK curriculum standards
      - Include clear learning objectives
      - Be structured and organized
      - Include appropriate assessment methods
      - Be suitable for the age group
      
      Format the response as JSON with appropriate sections based on the content type.
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator with deep knowledge of UK curriculum standards and educational psychology."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });
    
    // Parse and return the generated content
    const generatedContent = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      data: generatedContent,
      usage: response.usage
    };
  } catch (error) {
    logger.error(`Error generating curriculum content: ${error.message}`);
    throw error;
  }
};

/**
 * Generate assessment questions using OpenAI
 * @param {Object} params - Parameters for question generation
 * @param {string} params.subject - Subject area
 * @param {string} params.keyStage - Key stage
 * @param {string} params.topic - Specific topic
 * @param {string} params.questionType - Type of questions (e.g., "multiple choice", "short answer")
 * @param {number} params.count - Number of questions to generate
 * @param {string} params.difficulty - Difficulty level (e.g., "easy", "medium", "hard")
 * @returns {Promise<Object>} Generated questions
 */
const generateAssessmentQuestions = async (params) => {
  try {
    const { subject, keyStage, topic, questionType, count, difficulty } = params;
    
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }
    
    // Create a detailed prompt based on parameters
    const prompt = `
      Create ${count} ${difficulty} ${questionType} questions for ${subject} at ${keyStage} level on the topic of ${topic}.
      
      Each question should:
      - Be clearly worded and appropriate for the age group
      - Include the correct answer and explanation
      - Be aligned with UK curriculum standards
      - Be at the ${difficulty} difficulty level
      
      Format the response as a JSON array of question objects, each with:
      - question: the question text
      - options: array of possible answers (for multiple choice)
      - correctAnswer: the correct answer
      - explanation: explanation of why the answer is correct
      - difficulty: the difficulty level
      - standards: relevant curriculum standards
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational assessment creator with deep knowledge of UK curriculum standards and educational psychology."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });
    
    // Parse and return the generated questions
    const generatedQuestions = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      data: generatedQuestions,
      usage: response.usage
    };
  } catch (error) {
    logger.error(`Error generating assessment questions: ${error.message}`);
    throw error;
  }
};

/**
 * Analyze student responses using OpenAI
 * @param {Object} params - Parameters for analysis
 * @param {string} params.subject - Subject area
 * @param {string} params.keyStage - Key stage
 * @param {string} params.question - The question that was asked
 * @param {string} params.studentResponse - The student's response
 * @param {string} params.correctAnswer - The correct answer
 * @returns {Promise<Object>} Analysis of the response
 */
const analyzeStudentResponse = async (params) => {
  try {
    const { subject, keyStage, question, studentResponse, correctAnswer } = params;
    
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }
    
    // Create a detailed prompt based on parameters
    const prompt = `
      Analyze this student response for ${subject} at ${keyStage} level:
      
      Question: ${question}
      Correct Answer: ${correctAnswer}
      Student Response: ${studentResponse}
      
      Provide:
      1. An assessment of correctness (correct, partially correct, incorrect)
      2. Identification of misconceptions or knowledge gaps
      3. Specific feedback for the student
      4. Suggestions for improvement
      5. Next steps for learning
      
      Format the response as JSON with these sections.
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational assessor with deep knowledge of UK curriculum standards and educational psychology."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });
    
    // Parse and return the analysis
    const analysis = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      data: analysis,
      usage: response.usage
    };
  } catch (error) {
    logger.error(`Error analyzing student response: ${error.message}`);
    throw error;
  }
};

/**
 * Generate personalized learning recommendations using OpenAI
 * @param {Object} params - Parameters for recommendations
 * @param {string} params.subject - Subject area
 * @param {string} params.keyStage - Key stage
 * @param {Object} params.studentProfile - Student profile with strengths, weaknesses, interests
 * @param {Object} params.assessmentResults - Recent assessment results
 * @returns {Promise<Object>} Personalized recommendations
 */
const generatePersonalizedRecommendations = async (params) => {
  try {
    const { subject, keyStage, studentProfile, assessmentResults } = params;
    
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }
    
    // Create a detailed prompt based on parameters
    const prompt = `
      Generate personalized learning recommendations for a student in ${subject} at ${keyStage} level.
      
      Student Profile:
      ${JSON.stringify(studentProfile)}
      
      Recent Assessment Results:
      ${JSON.stringify(assessmentResults)}
      
      Provide:
      1. Strengths identified from the assessment
      2. Areas for improvement
      3. Specific learning resources recommended
      4. Suggested learning activities
      5. Long-term learning goals
      
      Format the response as JSON with these sections.
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational advisor with deep knowledge of UK curriculum standards, educational psychology, and personalized learning."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });
    
    // Parse and return the recommendations
    const recommendations = JSON.parse(response.choices[0].message.content);
    
    return {
      success: true,
      data: recommendations,
      usage: response.usage
    };
  } catch (error) {
    logger.error(`Error generating personalized recommendations: ${error.message}`);
    throw error;
  }
};

// Azure Cognitive Services integration could be added here

module.exports = {
  generateCurriculumContent,
  generateAssessmentQuestions,
  analyzeStudentResponse,
  generatePersonalizedRecommendations
};