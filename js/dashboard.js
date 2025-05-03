/**
 * EdPsych Connect Platform
 * Dashboard JavaScript
 * Using UK spelling standards
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!Auth.isLoggedIn()) {
        // Show auth required message
        document.querySelector('.dashboard-container').style.display = 'none';
        document.querySelector('.auth-required-message').style.display = 'flex';
        return;
    }
    
    // Get current user data
    const currentUser = Auth.getCurrentUser();
    
    // Update user name in greeting
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
    }
    
    // Initialize dashboard components
    initializeDashboardStats();
    initializeActivityFeed();
    initializeUpcomingEvents();
    
    // Add event listeners for dashboard interactions
    addDashboardEventListeners();
});

/**
 * Initialize dashboard statistics with user data
 */
function initializeDashboardStats() {
    // In a real implementation, this would fetch actual user statistics from an API
    // For now, we'll use mock data
    
    // Example of how to update stats dynamically
    // const statsData = {
    //     resources: 12,
    //     assessments: 5,
    //     lessons: 8,
    //     courses: 3
    // };
    
    // Update stats display if needed
    // This is already handled with static data in the HTML for the demo
}

/**
 * Initialize activity feed with recent user activities
 */
function initializeActivityFeed() {
    // In a real implementation, this would fetch actual user activities from an API
    // For now, we'll use the mock data already in the HTML
    
    // Example of how to add a new activity dynamically
    // const activityList = document.querySelector('.activity-list');
    // if (activityList) {
    //     const newActivity = document.createElement('div');
    //     newActivity.className = 'activity-item';
    //     newActivity.innerHTML = `
    //         <div class="activity-icon">🔍</div>
    //         <div class="activity-content">
    //             <p class="activity-title">Searched for resources</p>
    //             <p class="activity-time">Just now</p>
    //         </div>
    //     `;
    //     activityList.prepend(newActivity);
    // }
}

/**
 * Initialize upcoming events section
 */
function initializeUpcomingEvents() {
    // In a real implementation, this would fetch actual events from an API
    // For now, we'll use the mock data already in the HTML
    
    // Example of how to add a new event dynamically
    // const eventsList = document.querySelector('.events-list');
    // if (eventsList) {
    //     const newEvent = document.createElement('div');
    //     newEvent.className = 'event-item';
    //     newEvent.innerHTML = `
    //         <div class="event-date">
    //             <span class="event-month">MAY</span>
    //             <span class="event-day">10</span>
    //         </div>
    //         <div class="event-content">
    //             <p class="event-title">New Teacher Training</p>
    //             <p class="event-time">9:00 AM - 11:00 AM</p>
    //         </div>
    //     `;
    //     eventsList.appendChild(newEvent);
    // }
}

/**
 * Add event listeners for dashboard interactions
 */
function addDashboardEventListeners() {
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // In a real implementation, you might want to track clicks or perform additional actions
            console.log('Quick action clicked:', this.querySelector('span:last-child').textContent);
        });
    });
    
    // Tool items
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // In a real implementation, you might want to track clicks or perform additional actions
            console.log('Tool clicked:', this.querySelector('.tool-title').textContent);
        });
    });
}

/**
 * Refresh dashboard data
 * This would be called periodically or when needed to update the dashboard
 */
function refreshDashboard() {
    // In a real implementation, this would fetch fresh data from the server
    console.log('Refreshing dashboard data...');
    
    // Reinitialize components with fresh data
    initializeDashboardStats();
    initializeActivityFeed();
    initializeUpcomingEvents();
}