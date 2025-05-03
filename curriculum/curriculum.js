/**
 * EdPsych Connect Platform
 * Curriculum JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize curriculum functionality based on the current page
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/curriculum/planner.html')) {
        initializePlanner();
    } else if (currentPath.includes('/curriculum/standards.html')) {
        initializeStandards();
    } else if (currentPath.includes('/curriculum/lessons.html')) {
        initializeLessonPlanning();
    } else {
        // Index page or other curriculum pages
        initializeCommon();
    }
});

/**
 * Initialize common functionality for all curriculum pages
 */
function initializeCommon() {
    // Template card hover effects
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
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
    
    // Handle template usage (demo functionality)
    const templateButtons = document.querySelectorAll('.template-card .button');
    
    templateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const templateName = this.closest('.template-card').querySelector('h3').textContent;
            
            // In a real implementation, this would redirect to the planner with the template loaded
            // For demo purposes, show an alert
            alert(`Template "${templateName}" would be loaded in the Curriculum Planner.`);
            
            // Redirect to planner page
            window.location.href = '/curriculum/planner.html';
        });
    });
}

/**
 * Initialize curriculum planner functionality
 */
function initializePlanner() {
    console.log('Initializing Curriculum Planner...');
    
    // Demo data for curriculum planner
    const curriculumData = {
        terms: [
            {
                name: 'Autumn Term',
                units: [
                    {
                        title: 'Number and Place Value',
                        weeks: 3,
                        objectives: 'Understand place value, read and write numbers, compare and order numbers',
                        assessments: 'Formative quizzes, end of unit test'
                    },
                    {
                        title: 'Addition and Subtraction',
                        weeks: 4,
                        objectives: 'Add and subtract numbers, solve problems using addition and subtraction',
                        assessments: 'Problem-solving tasks, end of unit test'
                    },
                    {
                        title: 'Geometry: Properties of Shapes',
                        weeks: 3,
                        objectives: 'Identify and describe 2D and 3D shapes, compare and classify shapes',
                        assessments: 'Practical assessment, shape project'
                    }
                ]
            },
            {
                name: 'Spring Term',
                units: [
                    {
                        title: 'Multiplication and Division',
                        weeks: 4,
                        objectives: 'Recall multiplication facts, multiply and divide numbers, solve problems',
                        assessments: 'Times tables test, problem-solving assessment'
                    },
                    {
                        title: 'Fractions',
                        weeks: 3,
                        objectives: 'Recognize and use fractions, compare and order fractions, add and subtract fractions',
                        assessments: 'Fractions quiz, end of unit test'
                    },
                    {
                        title: 'Measurement',
                        weeks: 3,
                        objectives: 'Measure and compare lengths, mass, volume, and time',
                        assessments: 'Practical measurement tasks, end of unit assessment'
                    }
                ]
            },
            {
                name: 'Summer Term',
                units: [
                    {
                        title: 'Statistics',
                        weeks: 3,
                        objectives: 'Interpret and present data, solve problems using information in charts and graphs',
                        assessments: 'Data collection project, interpretation tasks'
                    },
                    {
                        title: 'Position and Direction',
                        weeks: 2,
                        objectives: 'Describe position, direction, and movement, including rotation',
                        assessments: 'Practical navigation tasks, coordinate grid assessment'
                    },
                    {
                        title: 'Problem Solving and Review',
                        weeks: 4,
                        objectives: 'Apply mathematical knowledge to solve problems, review key concepts',
                        assessments: 'End of year assessment, problem-solving project'
                    }
                ]
            }
        ]
    };
    
    // Render curriculum map
    renderCurriculumMap(curriculumData);
    
    // Initialize drag and drop for units
    initializeDragAndDrop();
    
    // Initialize unit editing
    initializeUnitEditing();
    
    // Initialize save and export functionality
    initializeSaveAndExport();
}

/**
 * Render the curriculum map based on provided data
 * @param {Object} data - The curriculum data to render
 */
function renderCurriculumMap(data) {
    const curriculumMapElement = document.querySelector('.curriculum-map');
    
    if (!curriculumMapElement) return;
    
    let html = '';
    
    data.terms.forEach(term => {
        html += `
            <div class="term-section">
                <div class="term-header">${term.name}</div>
                <div class="units-container">
        `;
        
        term.units.forEach(unit => {
            html += `
                <div class="unit-row" draggable="true" data-unit-id="${unit.title.replace(/\s+/g, '-').toLowerCase()}">
                    <div class="unit-cell unit-title-cell">
                        <div class="unit-title">${unit.title}</div>
                        <div class="unit-details">${unit.weeks} weeks</div>
                    </div>
                    <div class="unit-cell">
                        <div class="unit-objectives">${unit.objectives}</div>
                    </div>
                    <div class="unit-cell">
                        <div class="unit-assessments">${unit.assessments}</div>
                    </div>
                    <div class="unit-cell unit-actions">
                        <button class="edit-unit-button" data-unit-id="${unit.title.replace(/\s+/g, '-').toLowerCase()}">Edit</button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    curriculumMapElement.innerHTML = html;
}

/**
 * Initialize drag and drop functionality for curriculum units
 */
function initializeDragAndDrop() {
    // This would implement drag and drop for reordering units
    // For demo purposes, this is a simplified implementation
    
    let draggedUnit = null;
    
    // Get all draggable units
    const units = document.querySelectorAll('.unit-row[draggable="true"]');
    
    units.forEach(unit => {
        // Drag start event
        unit.addEventListener('dragstart', function(e) {
            draggedUnit = this;
            this.classList.add('dragging');
            
            // Set data for drag operation
            e.dataTransfer.setData('text/plain', this.dataset.unitId);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        // Drag end event
        unit.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedUnit = null;
        });
        
        // Drag over event
        unit.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (draggedUnit !== this) {
                this.classList.add('drag-over');
            }
        });
        
        // Drag leave event
        unit.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        // Drop event
        unit.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedUnit !== this) {
                // In a real implementation, this would reorder the units
                // For demo purposes, just show a message
                const unitName = draggedUnit.querySelector('.unit-title').textContent;
                const targetName = this.querySelector('.unit-title').textContent;
                
                console.log(`Moved "${unitName}" to position of "${targetName}"`);
                
                // Swap the units in the DOM for visual feedback
                const parent = this.parentNode;
                const draggedIndex = Array.from(parent.children).indexOf(draggedUnit);
                const targetIndex = Array.from(parent.children).indexOf(this);
                
                if (draggedIndex < targetIndex) {
                    parent.insertBefore(draggedUnit, this.nextSibling);
                } else {
                    parent.insertBefore(draggedUnit, this);
                }
            }
        });
    });
    
    // Make the units container droppable as well
    const unitsContainers = document.querySelectorAll('.units-container');
    
    unitsContainers.forEach(container => {
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        container.addEventListener('drop', function(e) {
            e.preventDefault();
            
            // Only handle if not dropped on a unit
            if (e.target === this) {
                // In a real implementation, this would move the unit to the end of this container
                // For demo purposes, just append the dragged unit to this container
                if (draggedUnit && draggedUnit.parentNode !== this) {
                    const unitName = draggedUnit.querySelector('.unit-title').textContent;
                    const termName = this.previousElementSibling.textContent;
                    
                    console.log(`Moved "${unitName}" to "${termName}"`);
                    
                    this.appendChild(draggedUnit);
                }
            }
        });
    });
}

/**
 * Initialize unit editing functionality
 */
function initializeUnitEditing() {
    // This would implement editing of curriculum units
    // For demo purposes, this is a simplified implementation
    
    // Get all edit buttons
    const editButtons = document.querySelectorAll('.edit-unit-button');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const unitId = this.dataset.unitId;
            const unitRow = document.querySelector(`.unit-row[data-unit-id="${unitId}"]`);
            
            if (unitRow) {
                const unitTitle = unitRow.querySelector('.unit-title').textContent;
                const unitWeeks = unitRow.querySelector('.unit-details').textContent.replace(' weeks', '');
                const unitObjectives = unitRow.querySelector('.unit-objectives').textContent;
                const unitAssessments = unitRow.querySelector('.unit-assessments').textContent;
                
                // In a real implementation, this would open a modal or form for editing
                // For demo purposes, just show an alert with the unit details
                alert(`Editing Unit: ${unitTitle}\nWeeks: ${unitWeeks}\nObjectives: ${unitObjectives}\nAssessments: ${unitAssessments}`);
            }
        });
    });
}

/**
 * Initialize save and export functionality
 */
function initializeSaveAndExport() {
    // This would implement saving and exporting the curriculum plan
    // For demo purposes, this is a simplified implementation
    
    const saveButton = document.querySelector('.save-plan-button');
    const exportButton = document.querySelector('.export-plan-button');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // In a real implementation, this would save the curriculum plan to the server
            // For demo purposes, just show a success message
            alert('Curriculum plan saved successfully!');
        });
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // In a real implementation, this would generate a PDF or other export format
            // For demo purposes, just show a success message
            alert('Curriculum plan exported successfully!');
        });
    }
}

/**
 * Initialize standards browser functionality
 */
function initializeStandards() {
    console.log('Initializing Standards Browser...');
    
    // Toggle standards categories
    const categoryHeaders = document.querySelectorAll('.standards-category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const category = this.closest('.standards-category');
            const subcategories = category.querySelector('.standards-subcategories');
            
            if (subcategories) {
                subcategories.classList.toggle('collapsed');
                this.classList.toggle('collapsed');
            }
        });
    });
    
    // Handle standards search
    const searchInput = document.querySelector('.standards-search input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const standardItems = document.querySelectorAll('.standard-item');
            
            standardItems.forEach(item => {
                const code = item.querySelector('.standard-code').textContent.toLowerCase();
                const description = item.querySelector('.standard-description').textContent.toLowerCase();
                
                if (code.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Handle standards filtering by subject and key stage
    const subjectFilter = document.querySelector('#subject-filter');
    const keyStageFilter = document.querySelector('#key-stage-filter');
    
    function applyFilters() {
        const subject = subjectFilter ? subjectFilter.value : '';
        const keyStage = keyStageFilter ? keyStageFilter.value : '';
        
        const standardItems = document.querySelectorAll('.standard-item');
        
        standardItems.forEach(item => {
            const itemSubject = item.dataset.subject;
            const itemKeyStage = item.dataset.keyStage;
            
            const subjectMatch = !subject || itemSubject === subject;
            const keyStageMatch = !keyStage || itemKeyStage === keyStage;
            
            if (subjectMatch && keyStageMatch) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    if (subjectFilter) {
        subjectFilter.addEventListener('change', applyFilters);
    }
    
    if (keyStageFilter) {
        keyStageFilter.addEventListener('change', applyFilters);
    }
}

/**
 * Initialize lesson planning functionality
 */
function initializeLessonPlanning() {
    console.log('Initializing Lesson Planning...');
    
    // Handle lesson plan form submission
    const lessonForm = document.querySelector('.lesson-form');
    
    if (lessonForm) {
        lessonForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.querySelector('#lesson-title').value;
            const subject = document.querySelector('#lesson-subject').value;
            const keyStage = document.querySelector('#lesson-key-stage').value;
            const duration = document.querySelector('#lesson-duration').value;
            const objectives = document.querySelector('#lesson-objectives').value;
            
            // In a real implementation, this would save the lesson plan to the server
            // For demo purposes, just show the preview
            generateLessonPreview({
                title,
                subject,
                keyStage,
                duration,
                objectives
            });
        });
    }
    
    // Handle AI generation button
    const generateButton = document.querySelector('.generate-activities-button');
    
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            // In a real implementation, this would call an AI API to generate activities
            // For demo purposes, just show a loading state and then add some demo activities
            this.textContent = 'Generating...';
            this.disabled = true;
            
            setTimeout(() => {
                const activitiesContainer = document.querySelector('.lesson-activities');
                
                if (activitiesContainer) {
                    const demoActivities = [
                        {
                            title: 'Warm-up Discussion',
                            description: 'Begin with a class discussion about real-world applications of the topic. Ask students to share their prior knowledge and experiences.',
                            time: '10 minutes'
                        },
                        {
                            title: 'Concept Introduction',
                            description: 'Present the key concepts using visual aids and interactive examples. Encourage questions and clarifications throughout.',
                            time: '15 minutes'
                        },
                        {
                            title: 'Group Investigation',
                            description: 'Divide students into small groups to investigate a specific aspect of the topic. Provide worksheets and resources for guidance.',
                            time: '20 minutes'
                        },
                        {
                            title: 'Presentation and Discussion',
                            description: 'Have groups present their findings to the class. Facilitate a discussion about the different aspects and how they connect.',
                            time: '15 minutes'
                        },
                        {
                            title: 'Individual Reflection',
                            description: 'Students complete a short written reflection on what they learned and how it connects to previous knowledge.',
                            time: '10 minutes'
                        }
                    ];
                    
                    let activitiesHTML = '';
                    
                    demoActivities.forEach(activity => {
                        activitiesHTML += `
                            <div class="activity-item">
                                <div class="activity-title">${activity.title}</div>
                                <div class="activity-description">${activity.description}</div>
                                <div class="activity-time">${activity.time}</div>
                            </div>
                        `;
                    });
                    
                    activitiesContainer.innerHTML = activitiesHTML;
                }
                
                this.textContent = 'Generate Activities';
                this.disabled = false;
            }, 2000);
        });
    }
    
    // Handle preview button
    const previewButton = document.querySelector('.preview-lesson-button');
    
    if (previewButton) {
        previewButton.addEventListener('click', function() {
            // Get form values
            const title = document.querySelector('#lesson-title').value;
            const subject = document.querySelector('#lesson-subject').value;
            const keyStage = document.querySelector('#lesson-key-stage').value;
            const duration = document.querySelector('#lesson-duration').value;
            const objectives = document.querySelector('#lesson-objectives').value;
            
            // Generate preview
            generateLessonPreview({
                title,
                subject,
                keyStage,
                duration,
                objectives
            });
        });
    }
}

/**
 * Generate a lesson plan preview
 * @param {Object} lessonData - The lesson plan data
 */
function generateLessonPreview(lessonData) {
    const previewContainer = document.querySelector('.lesson-preview-container');
    
    if (!previewContainer) return;
    
    // Make the preview container visible
    previewContainer.style.display = 'block';
    
    // Scroll to the preview
    previewContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Generate the preview HTML
    const previewHTML = `
        <div class="lesson-header">
            <h2 class="lesson-title">${lessonData.title}</h2>
            <div class="lesson-meta">
                <span>${lessonData.subject} | ${lessonData.keyStage} | ${lessonData.duration} minutes</span>
            </div>
        </div>
        
        <div class="lesson-section">
            <h3>Learning Objectives</h3>
            <p>${lessonData.objectives}</p>
        </div>
        
        <div class="lesson-section">
            <h3>Activities</h3>
            <div class="lesson-activities">
                <!-- Activities will be added here by the AI generation -->
                <p>Click "Generate Activities" to create AI-suggested activities for this lesson.</p>
            </div>
        </div>
        
        <div class="lesson-section">
            <h3>Resources</h3>
            <ul>
                <li>Presentation slides</li>
                <li>Student worksheets</li>
                <li>Assessment materials</li>
            </ul>
        </div>
        
        <div class="lesson-section">
            <h3>Assessment</h3>
            <p>Formative assessment through observation and questioning during activities. Summative assessment through end-of-lesson exit ticket.</p>
        </div>
        
        <div class="lesson-section">
            <h3>Differentiation</h3>
            <p>Support: Provide scaffolded worksheets and additional visual aids.</p>
            <p>Extension: Offer more complex problems and independent research opportunities.</p>
        </div>
    `;
    
    // Update the preview container
    const previewElement = previewContainer.querySelector('.lesson-preview');
    
    if (previewElement) {
        previewElement.innerHTML = previewHTML;
    }
}