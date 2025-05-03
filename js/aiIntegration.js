/**
 * EdPsych Connect AI Integration Module
 * Handles integration with AI services for curriculum generation, assessment creation, and personalized learning
 */

// Import the API client
import api from './api.js';

// DOM elements for AI buttons
let aiGenerateButtons;
let aiLoadingIndicators;

// Track ongoing AI requests
let activeAiRequests = 0;

/**
 * Initialize the AI integration module
 */
const initAiIntegration = () => {
  // Find all AI generate buttons
  aiGenerateButtons = document.querySelectorAll('.ai-generate-button');
  aiLoadingIndicators = document.querySelectorAll('.ai-loading');
  
  // Add event listeners to AI generate buttons
  aiGenerateButtons.forEach(button => {
    // Get the button's purpose from its class or data attribute
    const purpose = button.dataset.aiPurpose || getAiPurposeFromClass(button);
    
    // Add click event listener
    button.addEventListener('click', (event) => {
      event.preventDefault();
      handleAiGenerate(button, purpose);
    });
  });
};

/**
 * Get the AI purpose from the button's class
 * @param {HTMLElement} button - The AI generate button
 * @returns {string} The AI purpose
 */
const getAiPurposeFromClass = (button) => {
  if (button.classList.contains('generate-curriculum-button')) {
    return 'curriculum';
  } else if (button.classList.contains('generate-activities-button')) {
    return 'activities';
  } else if (button.classList.contains('generate-questions-button')) {
    return 'questions';
  } else if (button.classList.contains('generate-recommendations-button')) {
    return 'recommendations';
  } else {
    return 'general';
  }
};

/**
 * Handle AI generate button click
 * @param {HTMLElement} button - The AI generate button
 * @param {string} purpose - The AI purpose
 */
const handleAiGenerate = async (button, purpose) => {
  try {
    // Show loading state
    setButtonLoading(button, true);
    
    // Get parameters based on the purpose
    const params = getAiParameters(purpose);
    
    // Call the appropriate AI service
    let result;
    switch (purpose) {
      case 'curriculum':
        result = await api.ai.generateCurriculumContent(params);
        break;
      case 'activities':
        result = await api.ai.generateCurriculumContent({
          ...params,
          contentType: 'lesson activities'
        });
        break;
      case 'questions':
        result = await api.ai.generateAssessmentQuestions(params);
        break;
      case 'recommendations':
        result = await api.ai.generatePersonalizedRecommendations(params);
        break;
      default:
        throw new Error('Unknown AI purpose');
    }
    
    // Process the result
    if (result.success) {
      processAiResult(purpose, result.data);
    } else {
      showAiError(button, result.message || 'AI generation failed');
    }
  } catch (error) {
    console.error(`AI generation error (${purpose}):`, error);
    showAiError(button, error.message || 'AI generation failed');
  } finally {
    // Reset button state
    setButtonLoading(button, false);
  }
};

/**
 * Get AI parameters based on the purpose and form inputs
 * @param {string} purpose - The AI purpose
 * @returns {Object} The AI parameters
 */
const getAiParameters = (purpose) => {
  // Common parameters
  const params = {
    subject: getFormValue('#curriculum-subject, #assessment-subject, #subject-filter'),
    keyStage: getFormValue('#curriculum-key-stage, #assessment-key-stage, #key-stage-filter')
  };
  
  // Purpose-specific parameters
  switch (purpose) {
    case 'curriculum':
      params.topic = getFormValue('#curriculum-title') || 'General curriculum';
      params.contentType = 'curriculum plan';
      break;
    case 'activities':
      params.topic = getFormValue('#lesson-title') || getFormValue('#curriculum-title') || 'General lesson';
      params.contentType = 'lesson activities';
      break;
    case 'questions':
      params.topic = getFormValue('#assessment-title') || 'General assessment';
      params.questionType = getFormValue('#assessment-type') || 'multiple choice';
      params.count = parseInt(getFormValue('#question-count') || '5');
      params.difficulty = getFormValue('#question-difficulty') || 'medium';
      break;
    case 'recommendations':
      // For recommendations, we need student profile and assessment results
      params.studentProfile = getStudentProfile();
      params.assessmentResults = getAssessmentResults();
      break;
  }
  
  return params;
};

/**
 * Get a form value by selector
 * @param {string} selector - The CSS selector for the form element
 * @returns {string} The form value or empty string if not found
 */
const getFormValue = (selector) => {
  const element = document.querySelector(selector);
  return element ? element.value : '';
};

/**
 * Get the student profile from the page
 * @returns {Object} The student profile
 */
const getStudentProfile = () => {
  // This would typically come from the user's profile or a specific form
  // For now, we'll return a mock profile
  return {
    strengths: ['Visual learning', 'Problem solving'],
    weaknesses: ['Writing', 'Time management'],
    interests: ['Science', 'Technology'],
    learningStyle: 'Visual'
  };
};

/**
 * Get assessment results from the page
 * @returns {Object} The assessment results
 */
const getAssessmentResults = () => {
  // This would typically come from the user's assessment history
  // For now, we'll return mock results
  return {
    recentScores: [
      { subject: 'Mathematics', topic: 'Fractions', score: 85 },
      { subject: 'Mathematics', topic: 'Geometry', score: 70 },
      { subject: 'English', topic: 'Grammar', score: 90 }
    ],
    averageScore: 82,
    areasForImprovement: ['Geometry', 'Algebra'],
    completedAssessments: 5
  };
};

/**
 * Process the AI result based on the purpose
 * @param {string} purpose - The AI purpose
 * @param {Object} data - The AI result data
 */
const processAiResult = (purpose, data) => {
  switch (purpose) {
    case 'curriculum':
      processCurriculumResult(data);
      break;
    case 'activities':
      processActivitiesResult(data);
      break;
    case 'questions':
      processQuestionsResult(data);
      break;
    case 'recommendations':
      processRecommendationsResult(data);
      break;
  }
  
  // Show feedback form for AI-generated content
  showAiFeedbackForm(purpose, data);
};

/**
 * Process curriculum generation result
 * @param {Object} data - The curriculum data
 */
const processCurriculumResult = (data) => {
  // Find the curriculum container
  const container = document.querySelector('.curriculum-map');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Check if data has terms
  if (data.terms && Array.isArray(data.terms)) {
    // Create term sections
    data.terms.forEach(term => {
      const termSection = document.createElement('div');
      termSection.className = 'term-section';
      
      // Add term header
      const termHeader = document.createElement('div');
      termHeader.className = 'term-header';
      termHeader.textContent = term.name;
      termSection.appendChild(termHeader);
      
      // Add units container
      const unitsContainer = document.createElement('div');
      unitsContainer.className = 'units-container';
      
      // Add units
      if (term.units && Array.isArray(term.units)) {
        term.units.forEach(unit => {
          const unitRow = document.createElement('div');
          unitRow.className = 'unit-row';
          unitRow.setAttribute('draggable', 'true');
          unitRow.setAttribute('data-unit-id', unit.id || generateUniqueId());
          
          // Add unit content
          unitRow.innerHTML = `
            <div class="unit-cell unit-title-cell">
              <div class="unit-title">${unit.title}</div>
              <div class="unit-details">${unit.duration || '2 weeks'}</div>
            </div>
            <div class="unit-cell">
              <div class="unit-objectives">${unit.objectives || 'No objectives specified'}</div>
            </div>
            <div class="unit-cell">
              <div class="unit-assessments">${unit.assessments || 'No assessments specified'}</div>
            </div>
            <div class="unit-cell unit-actions">
              <button class="edit-unit-button" data-unit-id="${unit.id || ''}">Edit</button>
            </div>
          `;
          
          unitsContainer.appendChild(unitRow);
        });
      }
      
      termSection.appendChild(unitsContainer);
      container.appendChild(termSection);
    });
  } else {
    // If data doesn't have the expected structure, display it as JSON
    container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
};

/**
 * Process activities generation result
 * @param {Object} data - The activities data
 */
const processActivitiesResult = (data) => {
  // Find the activities container
  const container = document.querySelector('.lesson-activities');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Check if data has activities
  if (data.activities && Array.isArray(data.activities)) {
    // Create activity items
    data.activities.forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.className = 'activity-item';
      
      // Add activity content
      activityItem.innerHTML = `
        <div class="activity-title">${activity.title}</div>
        <div class="activity-description">${activity.description}</div>
        <div class="activity-time">${activity.duration || '15 minutes'}</div>
      `;
      
      container.appendChild(activityItem);
    });
  } else {
    // If data doesn't have the expected structure, display it as JSON
    container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
  
  // Show the preview if it's hidden
  const previewContainer = document.querySelector('.lesson-preview-container');
  if (previewContainer) {
    previewContainer.style.display = 'block';
  }
};

/**
 * Process questions generation result
 * @param {Object} data - The questions data
 */
const processQuestionsResult = (data) => {
  // Find the questions container
  const container = document.querySelector('.question-list');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Check if data has questions
  if (data.questions && Array.isArray(data.questions)) {
    // Create question items
    data.questions.forEach((question, index) => {
      const questionItem = document.createElement('div');
      questionItem.className = 'question-item';
      
      // Determine question type
      const questionType = question.type || 'multiple-choice';
      
      // Create question content based on type
      let questionContent = '';
      let questionSettings = '';
      
      // Question header
      questionContent = `
        <div class="question-header">
          <div class="question-number">Question ${index + 1}</div>
          <div class="question-actions">
            <button class="question-action" data-action="edit" title="Edit Question">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="question-action" data-action="duplicate" title="Duplicate Question">
              <i class="fas fa-copy"></i> Duplicate
            </button>
            <button class="question-action" data-action="delete" title="Delete Question">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
      
      // Question content based on type
      questionContent += `<div class="question-content">
        <div class="question-text">${question.question}</div>
      `;
      
      if (questionType === 'multiple-choice') {
        questionContent += `<div class="answer-options">`;
        
        if (question.options && Array.isArray(question.options)) {
          question.options.forEach((option, optIndex) => {
            const isCorrect = question.correctAnswer === option || 
                             (question.correctAnswer === optIndex) ||
                             (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option));
            
            questionContent += `
              <div class="answer-option">
                <div class="option-marker ${isCorrect ? 'correct' : ''}">${String.fromCharCode(65 + optIndex)}</div>
                <div class="option-text">${option}</div>
              </div>
            `;
          });
        }
        
        questionContent += `</div>`;
      } else if (questionType === 'true-false') {
        questionContent += `
          <div class="answer-options">
            <div class="answer-option">
              <div class="option-marker ${question.correctAnswer === true ? 'correct' : ''}">A</div>
              <div class="option-text">True</div>
            </div>
            <div class="answer-option">
              <div class="option-marker ${question.correctAnswer === false ? 'correct' : ''}">B</div>
              <div class="option-text">False</div>
            </div>
          </div>
        `;
      } else if (questionType === 'short-answer' || questionType === 'essay') {
        questionContent += `
          <div class="answer-field">
            <div class="field-placeholder">${questionType === 'short-answer' ? 'Short answer text field' : 'Essay response field'}</div>
          </div>
          <div class="answer-key">
            <div class="key-header">Answer Key:</div>
            <div class="key-content">${question.correctAnswer || question.rubric || 'No answer key provided'}</div>
          </div>
        `;
      }
      
      questionContent += `</div>`;
      
      // Question settings
      questionSettings = `
        <div class="question-settings">
          <div class="settings-header">Question Settings</div>
          <div class="settings-grid">
            <div class="setting-item">
              <span class="setting-label">Type:</span>
              <span>${questionType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">Points:</span>
              <span>${question.points || (questionType === 'essay' ? 3 : 1)}</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">Difficulty:</span>
              <span>${question.difficulty || 'Medium'}</span>
            </div>
            <div class="setting-item">
              <span class="setting-label">Standards:</span>
              <span>${question.standards || 'Not specified'}</span>
            </div>
          </div>
        </div>
      `;
      
      // Combine all parts
      questionItem.innerHTML = questionContent + questionSettings;
      
      container.appendChild(questionItem);
    });
  } else {
    // If data doesn't have the expected structure, display it as JSON
    container.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
};

/**
 * Process recommendations result
 * @param {Object} data - The recommendations data
 */
const processRecommendationsResult = (data) => {
  // Find the recommendations container
  const container = document.querySelector('.recommendations-container');
  if (!container) return;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Create recommendations content
  let recommendationsContent = `
    <div class="recommendations-header">
      <h3>Personalized Learning Recommendations</h3>
    </div>
  `;
  
  // Add strengths section
  if (data.strengths) {
    recommendationsContent += `
      <div class="recommendation-section">
        <h4>Strengths</h4>
        <div class="recommendation-content">
          ${Array.isArray(data.strengths) 
            ? `<ul>${data.strengths.map(item => `<li>${item}</li>`).join('')}</ul>`
            : `<p>${data.strengths}</p>`
          }
        </div>
      </div>
    `;
  }
  
  // Add areas for improvement section
  if (data.areasForImprovement || data.weaknesses) {
    const improvements = data.areasForImprovement || data.weaknesses;
    recommendationsContent += `
      <div class="recommendation-section">
        <h4>Areas for Improvement</h4>
        <div class="recommendation-content">
          ${Array.isArray(improvements) 
            ? `<ul>${improvements.map(item => `<li>${item}</li>`).join('')}</ul>`
            : `<p>${improvements}</p>`
          }
        </div>
      </div>
    `;
  }
  
  // Add recommended resources section
  if (data.recommendedResources || data.resources) {
    const resources = data.recommendedResources || data.resources;
    recommendationsContent += `
      <div class="recommendation-section">
        <h4>Recommended Resources</h4>
        <div class="recommendation-content">
          ${Array.isArray(resources) 
            ? `<ul>${resources.map(item => `<li>${typeof item === 'string' ? item : item.title || item.name}</li>`).join('')}</ul>`
            : `<p>${resources}</p>`
          }
        </div>
      </div>
    `;
  }
  
  // Add suggested activities section
  if (data.suggestedActivities || data.activities) {
    const activities = data.suggestedActivities || data.activities;
    recommendationsContent += `
      <div class="recommendation-section">
        <h4>Suggested Activities</h4>
        <div class="recommendation-content">
          ${Array.isArray(activities) 
            ? `<ul>${activities.map(item => `<li>${typeof item === 'string' ? item : item.title || item.name}</li>`).join('')}</ul>`
            : `<p>${activities}</p>`
          }
        </div>
      </div>
    `;
  }
  
  // Add learning goals section
  if (data.learningGoals || data.goals) {
    const goals = data.learningGoals || data.goals;
    recommendationsContent += `
      <div class="recommendation-section">
        <h4>Learning Goals</h4>
        <div class="recommendation-content">
          ${Array.isArray(goals) 
            ? `<ul>${goals.map(item => `<li>${typeof item === 'string' ? item : item.title || item.description}</li>`).join('')}</ul>`
            : `<p>${goals}</p>`
          }
        </div>
      </div>
    `;
  }
  
  // If data doesn't have any of the expected sections, display it as JSON
  if (!data.strengths && !data.areasForImprovement && !data.weaknesses && 
      !data.recommendedResources && !data.resources && 
      !data.suggestedActivities && !data.activities && 
      !data.learningGoals && !data.goals) {
    recommendationsContent += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  }
  
  // Set the container content
  container.innerHTML = recommendationsContent;
  
  // Show the container if it's hidden
  container.style.display = 'block';
};

/**
 * Show AI feedback form
 * @param {string} purpose - The AI purpose
 * @param {Object} data - The AI result data
 */
const showAiFeedbackForm = (purpose, data) => {
  // Create a unique ID for this content
  const contentId = generateUniqueId();
  
  // Create feedback form
  const feedbackForm = document.createElement('div');
  feedbackForm.className = 'ai-feedback-form';
  feedbackForm.innerHTML = `
    <div class="feedback-header">
      <h4>How was this AI-generated content?</h4>
    </div>
    <div class="feedback-rating">
      <button class="rating-button" data-rating="1">1</button>
      <button class="rating-button" data-rating="2">2</button>
      <button class="rating-button" data-rating="3">3</button>
      <button class="rating-button" data-rating="4">4</button>
      <button class="rating-button" data-rating="5">5</button>
    </div>
    <div class="feedback-comment">
      <textarea placeholder="Any suggestions for improvement?"></textarea>
    </div>
    <div class="feedback-actions">
      <button class="button button-secondary submit-feedback-button">Submit Feedback</button>
    </div>
  `;
  
  // Find a suitable container for the feedback form
  let container;
  switch (purpose) {
    case 'curriculum':
      container = document.querySelector('.curriculum-map').parentNode;
      break;
    case 'activities':
      container = document.querySelector('.lesson-preview-container');
      break;
    case 'questions':
      container = document.querySelector('.question-list').parentNode;
      break;
    case 'recommendations':
      container = document.querySelector('.recommendations-container').parentNode;
      break;
    default:
      return; // No suitable container found
  }
  
  // Add the feedback form to the container
  if (container) {
    // Remove any existing feedback forms
    const existingForm = container.querySelector('.ai-feedback-form');
    if (existingForm) {
      existingForm.remove();
    }
    
    container.appendChild(feedbackForm);
    
    // Add event listeners to rating buttons
    const ratingButtons = feedbackForm.querySelectorAll('.rating-button');
    ratingButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        ratingButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
      });
    });
    
    // Add event listener to submit button
    const submitButton = feedbackForm.querySelector('.submit-feedback-button');
    submitButton.addEventListener('click', () => {
      // Get the rating
      const activeButton = feedbackForm.querySelector('.rating-button.active');
      const rating = activeButton ? parseInt(activeButton.dataset.rating) : 0;
      
      // Get the comment
      const comment = feedbackForm.querySelector('textarea').value;
      
      // Submit the feedback
      submitAiFeedback(contentId, purpose, rating, comment, data);
      
      // Remove the feedback form
      feedbackForm.remove();
    });
  }
};

/**
 * Submit AI feedback
 * @param {string} contentId - The content ID
 * @param {string} contentType - The content type
 * @param {number} rating - The rating (1-5)
 * @param {string} feedback - The feedback comment
 * @param {Object} data - The original AI result data
 */
const submitAiFeedback = async (contentId, contentType, rating, feedback, data) => {
  try {
    // Call the API
    await api.ai.submitFeedback({
      contentId,
      contentType,
      rating,
      feedback,
      improvements: feedback, // Use the same text for both fields
      originalContent: data
    });
    
    // Show a thank you message
    showNotification('Thank you for your feedback!', 'success');
  } catch (error) {
    console.error('Error submitting AI feedback:', error);
    showNotification('Failed to submit feedback', 'error');
  }
};

/**
 * Set button loading state
 * @param {HTMLElement} button - The button element
 * @param {boolean} isLoading - Whether the button is loading
 */
const setButtonLoading = (button, isLoading) => {
  if (isLoading) {
    // Increment active requests counter
    activeAiRequests++;
    
    // Store original text
    button.dataset.originalText = button.textContent;
    
    // Update button text and disable
    button.textContent = 'Generating...';
    button.disabled = true;
    
    // Show loading indicators
    aiLoadingIndicators.forEach(indicator => {
      indicator.style.display = 'block';
    });
  } else {
    // Decrement active requests counter
    activeAiRequests--;
    
    // Restore original text and enable
    button.textContent = button.dataset.originalText || 'Generate';
    button.disabled = false;
    
    // Hide loading indicators if no active requests
    if (activeAiRequests <= 0) {
      aiLoadingIndicators.forEach(indicator => {
        indicator.style.display = 'none';
      });
      activeAiRequests = 0;
    }
  }
};

/**
 * Show AI error
 * @param {HTMLElement} button - The button element
 * @param {string} message - The error message
 */
const showAiError = (button, message) => {
  // Find or create error message element
  let errorElement = button.parentNode.querySelector('.ai-error');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'ai-error';
    button.parentNode.appendChild(errorElement);
  }
  
  // Set error message
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  // Hide after 5 seconds
  setTimeout(() => {
    errorElement.style.display = 'none';
  }, 5000);
};

/**
 * Show notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
const showNotification = (message, type = 'info') => {
  // Find or create notification container
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'notification-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    notification.remove();
  });
  
  notification.appendChild(closeButton);
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
};

/**
 * Generate a unique ID
 * @returns {string} A unique ID
 */
const generateUniqueId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 9);
};

// Initialize the AI integration module when the DOM is loaded
document.addEventListener('DOMContentLoaded', initAiIntegration);

// Export the AI integration module
export default {
  initAiIntegration,
  generateCurriculumContent: (params) => api.ai.generateCurriculumContent(params),
  generateAssessmentQuestions: (params) => api.ai.generateAssessmentQuestions(params),
  analyzeStudentResponse: (params) => api.ai.analyzeStudentResponse(params),
  generatePersonalizedRecommendations: (params) => api.ai.generatePersonalizedRecommendations(params)
};