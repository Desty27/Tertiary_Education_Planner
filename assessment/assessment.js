/**
 * EdPsych Connect Platform
 * Assessment JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize assessment functionality based on the current page
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/assessment/create.html')) {
        initializeAssessmentCreation();
    } else if (currentPath.includes('/assessment/take.html')) {
        initializeAssessmentTaking();
    } else if (currentPath.includes('/assessment/results.html')) {
        initializeResultsViewing();
    } else {
        // Index page or other assessment pages
        initializeCommon();
    }
});

/**
 * Initialize common functionality for all assessment pages
 */
function initializeCommon() {
    // Type card hover effects
    const typeCards = document.querySelectorAll('.type-card');
    
    typeCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // If the click is on the button, don't prevent default
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            // Otherwise, find the button in this card and click it
            const button = this.querySelector('.button');
            if (button) {
                e.preventDefault();
                button.click();
            }
        });
    });
}

/**
 * Initialize assessment creation functionality
 */
function initializeAssessmentCreation() {
    console.log('Initializing Assessment Creation...');
    
    // Question type selection
    const questionTypes = document.querySelectorAll('.question-type');
    
    questionTypes.forEach(type => {
        type.addEventListener('click', function() {
            addNewQuestion(this.dataset.type);
        });
    });
    
    // Initialize existing questions
    initializeQuestions();
    
    // Save assessment button
    const saveButton = document.querySelector('.save-assessment-button');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveAssessment();
        });
    }
    
    // Preview assessment button
    const previewButton = document.querySelector('.preview-assessment-button');
    
    if (previewButton) {
        previewButton.addEventListener('click', function() {
            previewAssessment();
        });
    }
    
    // AI generation button
    const generateButton = document.querySelector('.generate-questions-button');
    
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            generateQuestionsWithAI();
        });
    }
}

/**
 * Initialize existing questions in the assessment builder
 */
function initializeQuestions() {
    const questionItems = document.querySelectorAll('.question-item');
    
    questionItems.forEach(item => {
        // Edit button
        const editButton = item.querySelector('.question-action[data-action="edit"]');
        if (editButton) {
            editButton.addEventListener('click', function() {
                toggleQuestionEdit(item);
            });
        }
        
        // Delete button
        const deleteButton = item.querySelector('.question-action[data-action="delete"]');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                deleteQuestion(item);
            });
        }
        
        // Duplicate button
        const duplicateButton = item.querySelector('.question-action[data-action="duplicate"]');
        if (duplicateButton) {
            duplicateButton.addEventListener('click', function() {
                duplicateQuestion(item);
            });
        }
    });
}

/**
 * Add a new question to the assessment
 * @param {string} type - The type of question to add
 */
function addNewQuestion(type) {
    console.log('Adding new question of type:', type);
    
    // Get the question list
    const questionList = document.querySelector('.question-list');
    
    if (!questionList) return;
    
    // Get the current number of questions
    const questionCount = questionList.querySelectorAll('.question-item').length;
    
    // Create a new question based on the type
    let questionHTML = '';
    
    switch (type) {
        case 'multiple-choice':
            questionHTML = createMultipleChoiceQuestion(questionCount + 1);
            break;
        case 'true-false':
            questionHTML = createTrueFalseQuestion(questionCount + 1);
            break;
        case 'short-answer':
            questionHTML = createShortAnswerQuestion(questionCount + 1);
            break;
        case 'essay':
            questionHTML = createEssayQuestion(questionCount + 1);
            break;
        case 'matching':
            questionHTML = createMatchingQuestion(questionCount + 1);
            break;
        default:
            questionHTML = createMultipleChoiceQuestion(questionCount + 1);
    }
    
    // Create a new question element
    const questionElement = document.createElement('div');
    questionElement.className = 'question-item';
    questionElement.innerHTML = questionHTML;
    
    // Add the question to the list
    questionList.appendChild(questionElement);
    
    // Initialize the new question
    initializeQuestions();
    
    // Scroll to the new question
    questionElement.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Create HTML for a multiple choice question
 * @param {number} number - The question number
 * @returns {string} - The HTML for the question
 */
function createMultipleChoiceQuestion(number) {
    return `
        <div class="question-header">
            <div class="question-number">Question ${number}</div>
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
        <div class="question-content">
            <div class="question-text">What is the capital of France?</div>
            <div class="answer-options">
                <div class="answer-option">
                    <div class="option-marker">A</div>
                    <div class="option-text">London</div>
                </div>
                <div class="answer-option">
                    <div class="option-marker correct">B</div>
                    <div class="option-text">Paris</div>
                </div>
                <div class="answer-option">
                    <div class="option-marker">C</div>
                    <div class="option-text">Berlin</div>
                </div>
                <div class="answer-option">
                    <div class="option-marker">D</div>
                    <div class="option-text">Madrid</div>
                </div>
            </div>
        </div>
        <div class="question-settings">
            <div class="settings-header">Question Settings</div>
            <div class="settings-grid">
                <div class="setting-item">
                    <span class="setting-label">Type:</span>
                    <span>Multiple Choice</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Points:</span>
                    <span>1</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Difficulty:</span>
                    <span>Medium</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Standards:</span>
                    <span>Geography KS3</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create HTML for a true/false question
 * @param {number} number - The question number
 * @returns {string} - The HTML for the question
 */
function createTrueFalseQuestion(number) {
    return `
        <div class="question-header">
            <div class="question-number">Question ${number}</div>
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
        <div class="question-content">
            <div class="question-text">The Earth is flat.</div>
            <div class="answer-options">
                <div class="answer-option">
                    <div class="option-marker">A</div>
                    <div class="option-text">True</div>
                </div>
                <div class="answer-option">
                    <div class="option-marker correct">B</div>
                    <div class="option-text">False</div>
                </div>
            </div>
        </div>
        <div class="question-settings">
            <div class="settings-header">Question Settings</div>
            <div class="settings-grid">
                <div class="setting-item">
                    <span class="setting-label">Type:</span>
                    <span>True/False</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Points:</span>
                    <span>1</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Difficulty:</span>
                    <span>Easy</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Standards:</span>
                    <span>Science KS2</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create HTML for a short answer question
 * @param {number} number - The question number
 * @returns {string} - The HTML for the question
 */
function createShortAnswerQuestion(number) {
    return `
        <div class="question-header">
            <div class="question-number">Question ${number}</div>
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
        <div class="question-content">
            <div class="question-text">Name the first three planets in our solar system.</div>
            <div class="answer-field">
                <div class="field-placeholder">Short answer text field</div>
            </div>
            <div class="answer-key">
                <div class="key-header">Answer Key:</div>
                <div class="key-content">Mercury, Venus, Earth</div>
            </div>
        </div>
        <div class="question-settings">
            <div class="settings-header">Question Settings</div>
            <div class="settings-grid">
                <div class="setting-item">
                    <span class="setting-label">Type:</span>
                    <span>Short Answer</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Points:</span>
                    <span>3</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Difficulty:</span>
                    <span>Medium</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Standards:</span>
                    <span>Science KS3</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create HTML for an essay question
 * @param {number} number - The question number
 * @returns {string} - The HTML for the question
 */
function createEssayQuestion(number) {
    return `
        <div class="question-header">
            <div class="question-number">Question ${number}</div>
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
        <div class="question-content">
            <div class="question-text">Explain the causes and effects of climate change. Provide examples and discuss potential solutions.</div>
            <div class="answer-field">
                <div class="field-placeholder">Essay response field</div>
            </div>
            <div class="answer-key">
                <div class="key-header">Rubric:</div>
                <div class="key-content">
                    <p><strong>4 points:</strong> Comprehensive explanation of causes and effects, multiple accurate examples, thoughtful discussion of solutions.</p>
                    <p><strong>3 points:</strong> Clear explanation of causes and effects, some examples, basic discussion of solutions.</p>
                    <p><strong>2 points:</strong> Partial explanation, few examples, limited discussion of solutions.</p>
                    <p><strong>1 point:</strong> Minimal explanation, no examples, no discussion of solutions.</p>
                </div>
            </div>
        </div>
        <div class="question-settings">
            <div class="settings-header">Question Settings</div>
            <div class="settings-grid">
                <div class="setting-item">
                    <span class="setting-label">Type:</span>
                    <span>Essay</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Points:</span>
                    <span>4</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Difficulty:</span>
                    <span>Hard</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Standards:</span>
                    <span>Science KS4</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create HTML for a matching question
 * @param {number} number - The question number
 * @returns {string} - The HTML for the question
 */
function createMatchingQuestion(number) {
    return `
        <div class="question-header">
            <div class="question-number">Question ${number}</div>
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
        <div class="question-content">
            <div class="question-text">Match each country with its capital city.</div>
            <div class="matching-items">
                <div class="matching-item">
                    <div class="matching-left">France</div>
                    <div class="matching-right">Paris</div>
                </div>
                <div class="matching-item">
                    <div class="matching-left">Germany</div>
                    <div class="matching-right">Berlin</div>
                </div>
                <div class="matching-item">
                    <div class="matching-left">Spain</div>
                    <div class="matching-right">Madrid</div>
                </div>
                <div class="matching-item">
                    <div class="matching-left">Italy</div>
                    <div class="matching-right">Rome</div>
                </div>
            </div>
        </div>
        <div class="question-settings">
            <div class="settings-header">Question Settings</div>
            <div class="settings-grid">
                <div class="setting-item">
                    <span class="setting-label">Type:</span>
                    <span>Matching</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Points:</span>
                    <span>4</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Difficulty:</span>
                    <span>Medium</span>
                </div>
                <div class="setting-item">
                    <span class="setting-label">Standards:</span>
                    <span>Geography KS3</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Toggle question edit mode
 * @param {HTMLElement} questionItem - The question item element
 */
function toggleQuestionEdit(questionItem) {
    // In a real implementation, this would show an edit form
    // For demo purposes, just show an alert
    const questionText = questionItem.querySelector('.question-text').textContent;
    alert(`Editing question: ${questionText}`);
}

/**
 * Delete a question
 * @param {HTMLElement} questionItem - The question item element
 */
function deleteQuestion(questionItem) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this question?')) {
        // Remove the question
        questionItem.remove();
        
        // Renumber the remaining questions
        renumberQuestions();
    }
}

/**
 * Duplicate a question
 * @param {HTMLElement} questionItem - The question item element
 */
function duplicateQuestion(questionItem) {
    // Clone the question
    const clone = questionItem.cloneNode(true);
    
    // Insert after the original
    questionItem.parentNode.insertBefore(clone, questionItem.nextSibling);
    
    // Renumber the questions
    renumberQuestions();
    
    // Initialize the new question
    initializeQuestions();
    
    // Scroll to the new question
    clone.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Renumber the questions
 */
function renumberQuestions() {
    const questionItems = document.querySelectorAll('.question-item');
    
    questionItems.forEach((item, index) => {
        const numberElement = item.querySelector('.question-number');
        if (numberElement) {
            numberElement.textContent = `Question ${index + 1}`;
        }
    });
}

/**
 * Save the assessment
 */
function saveAssessment() {
    // In a real implementation, this would save the assessment to the server
    // For demo purposes, just show a success message
    alert('Assessment saved successfully!');
}

/**
 * Preview the assessment
 */
function previewAssessment() {
    // In a real implementation, this would open a preview of the assessment
    // For demo purposes, just show a message
    alert('Assessment preview would open here.');
}

/**
 * Generate questions with AI
 */
function generateQuestionsWithAI() {
    // In a real implementation, this would call an AI API to generate questions
    // For demo purposes, just show a loading state and then add some demo questions
    const generateButton = document.querySelector('.generate-questions-button');
    
    if (!generateButton) return;
    
    generateButton.textContent = 'Generating...';
    generateButton.disabled = true;
    
    setTimeout(() => {
        // Add some demo questions
        addNewQuestion('multiple-choice');
        addNewQuestion('true-false');
        addNewQuestion('short-answer');
        
        generateButton.textContent = 'Generate Questions with AI';
        generateButton.disabled = false;
    }, 2000);
}

/**
 * Initialize assessment taking functionality
 */
function initializeAssessmentTaking() {
    console.log('Initializing Assessment Taking...');
    
    // Question navigation
    const navItems = document.querySelectorAll('.question-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navigateToQuestion(this.dataset.questionId);
        });
    });
    
    // Next and previous buttons
    const nextButton = document.querySelector('.next-question-button');
    const prevButton = document.querySelector('.prev-question-button');
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            navigateToNextQuestion();
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            navigateToPrevQuestion();
        });
    }
    
    // Submit assessment button
    const submitButton = document.querySelector('.submit-assessment-button');
    
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            submitAssessment();
        });
    }
    
    // Initialize answer tracking
    initializeAnswerTracking();
    
    // Update progress
    updateProgress();
}

/**
 * Navigate to a specific question
 * @param {string} questionId - The ID of the question to navigate to
 */
function navigateToQuestion(questionId) {
    // Hide all questions
    const questions = document.querySelectorAll('.assessment-question');
    questions.forEach(question => {
        question.style.display = 'none';
    });
    
    // Show the selected question
    const selectedQuestion = document.querySelector(`.assessment-question[data-question-id="${questionId}"]`);
    if (selectedQuestion) {
        selectedQuestion.style.display = 'block';
    }
    
    // Update the active nav item
    const navItems = document.querySelectorAll('.question-nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.questionId === questionId) {
            item.classList.add('active');
        }
    });
    
    // Update next/prev button states
    updateNavigationButtons(questionId);
}

/**
 * Navigate to the next question
 */
function navigateToNextQuestion() {
    const activeNavItem = document.querySelector('.question-nav-item.active');
    
    if (activeNavItem && activeNavItem.nextElementSibling && activeNavItem.nextElementSibling.classList.contains('question-nav-item')) {
        navigateToQuestion(activeNavItem.nextElementSibling.dataset.questionId);
    }
}

/**
 * Navigate to the previous question
 */
function navigateToPrevQuestion() {
    const activeNavItem = document.querySelector('.question-nav-item.active');
    
    if (activeNavItem && activeNavItem.previousElementSibling && activeNavItem.previousElementSibling.classList.contains('question-nav-item')) {
        navigateToQuestion(activeNavItem.previousElementSibling.dataset.questionId);
    }
}

/**
 * Update the next and previous button states
 * @param {string} questionId - The ID of the current question
 */
function updateNavigationButtons(questionId) {
    const navItems = document.querySelectorAll('.question-nav-item');
    const navItemsArray = Array.from(navItems);
    const currentIndex = navItemsArray.findIndex(item => item.dataset.questionId === questionId);
    
    const nextButton = document.querySelector('.next-question-button');
    const prevButton = document.querySelector('.prev-question-button');
    
    if (nextButton) {
        nextButton.disabled = currentIndex === navItemsArray.length - 1;
    }
    
    if (prevButton) {
        prevButton.disabled = currentIndex === 0;
    }
}

/**
 * Initialize answer tracking
 */
function initializeAnswerTracking() {
    // Track multiple choice answers
    const multipleChoiceOptions = document.querySelectorAll('.multiple-choice-option');
    
    multipleChoiceOptions.forEach(option => {
        option.addEventListener('change', function() {
            const questionId = this.closest('.assessment-question').dataset.questionId;
            const navItem = document.querySelector(`.question-nav-item[data-question-id="${questionId}"]`);
            
            if (navItem) {
                navItem.classList.add('answered');
            }
            
            updateProgress();
        });
    });
    
    // Track text input answers
    const textInputs = document.querySelectorAll('.text-answer');
    
    textInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                const questionId = this.closest('.assessment-question').dataset.questionId;
                const navItem = document.querySelector(`.question-nav-item[data-question-id="${questionId}"]`);
                
                if (navItem) {
                    navItem.classList.add('answered');
                }
                
                updateProgress();
            }
        });
    });
}

/**
 * Update the progress display
 */
function updateProgress() {
    const totalQuestions = document.querySelectorAll('.question-nav-item').length;
    const answeredQuestions = document.querySelectorAll('.question-nav-item.answered').length;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${(answeredQuestions / totalQuestions) * 100}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${answeredQuestions} of ${totalQuestions} questions answered`;
    }
}

/**
 * Submit the assessment
 */
function submitAssessment() {
    // Check if all questions are answered
    const totalQuestions = document.querySelectorAll('.question-nav-item').length;
    const answeredQuestions = document.querySelectorAll('.question-nav-item.answered').length;
    
    if (answeredQuestions < totalQuestions) {
        if (!confirm(`You have only answered ${answeredQuestions} of ${totalQuestions} questions. Are you sure you want to submit?`)) {
            return;
        }
    }
    
    // In a real implementation, this would submit the assessment to the server
    // For demo purposes, just redirect to the results page
    alert('Assessment submitted successfully! Redirecting to results page...');
    window.location.href = '/assessment/results.html';
}

/**
 * Initialize results viewing functionality
 */
function initializeResultsViewing() {
    console.log('Initializing Results Viewing...');
    
    // Results tabs
    const resultsTabs = document.querySelectorAll('.results-tab');
    
    resultsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            resultsTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show the corresponding content
            const contentId = this.dataset.contentId;
            showResultsContent(contentId);
        });
    });
    
    // Initialize charts (in a real implementation)
    // initializeCharts();
}

/**
 * Show the specified results content
 * @param {string} contentId - The ID of the content to show
 */
function showResultsContent(contentId) {
    // Hide all content sections
    const contentSections = document.querySelectorAll('.results-content-section');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected content section
    const selectedContent = document.querySelector(`#${contentId}`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
}