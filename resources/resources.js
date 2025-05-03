/**
 * EdPsych Connect Platform
 * Resources JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize resource functionality
    initializeSearch();
    initializeFilters();
    initializeFavourites();
    initializePagination();
});

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('resource-search');
    const searchButton = document.getElementById('search-button');
    
    if (!searchInput || !searchButton) return;
    
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

/**
 * Perform search on resources
 * @param {string} query - The search query
 */
function performSearch(query) {
    console.log('Searching for:', query);
    
    // In a real implementation, this would make an API call or filter the resources
    // For now, we'll simulate a search with a timeout
    
    const resourcesGrid = document.querySelector('.resources-grid');
    if (!resourcesGrid) return;
    
    // Show loading state
    resourcesGrid.innerHTML = '<div class="loading-indicator">Searching resources...</div>';
    
    // Simulate API call
    setTimeout(() => {
        // Get current filter values
        const subjectFilter = document.getElementById('subject-filter').value;
        const ageFilter = document.getElementById('age-filter').value;
        const typeFilter = document.getElementById('type-filter').value;
        
        console.log('Filters:', { subject: subjectFilter, age: ageFilter, type: typeFilter });
        
        // In a real implementation, these would be used in the API call
        
        // For demo purposes, just reload the original content
        // In a real implementation, this would update with filtered results
        resourcesGrid.innerHTML = originalResourcesHTML;
        
        // Initialize favourites buttons again after content change
        initializeFavourites();
    }, 1000);
}

/**
 * Initialize filter functionality
 */
function initializeFilters() {
    const filters = document.querySelectorAll('.filter-group select');
    
    filters.forEach(filter => {
        filter.addEventListener('change', function() {
            // Get current search query
            const searchQuery = document.getElementById('resource-search').value;
            performSearch(searchQuery);
        });
    });
}

/**
 * Initialize favourites functionality
 */
function initializeFavourites() {
    const favouriteButtons = document.querySelectorAll('.add-favourite');
    
    favouriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resourceCard = this.closest('.resource-card');
            const resourceTitle = resourceCard.querySelector('h3').textContent;
            
            // Toggle favourite status
            if (this.classList.contains('favourited')) {
                this.classList.remove('favourited');
                this.textContent = 'Add to Favourites';
                showNotification(`Removed "${resourceTitle}" from favourites`);
            } else {
                this.classList.add('favourited');
                this.textContent = 'Remove from Favourites';
                showNotification(`Added "${resourceTitle}" to favourites`);
            }
            
            // In a real implementation, this would make an API call to update the user's favourites
        });
    });
}

/**
 * Initialize pagination functionality
 */
function initializePagination() {
    const prevButton = document.querySelector('.pagination-button:first-child');
    const nextButton = document.querySelector('.pagination-button:last-child');
    const paginationInfo = document.querySelector('.pagination-info');
    
    if (!prevButton || !nextButton || !paginationInfo) return;
    
    let currentPage = 1;
    const totalPages = 10; // This would come from the API in a real implementation
    
    updatePaginationState();
    
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePaginationState();
            // In a real implementation, this would fetch the previous page of results
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePaginationState();
            // In a real implementation, this would fetch the next page of results
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    function updatePaginationState() {
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }
}

/**
 * Show a notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles for the notification container
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .notification {
                background-color: #4a6cf7;
                color: white;
                padding: 12px 20px;
                margin-top: 10px;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
                max-width: 300px;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create and show the notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notificationContainer.appendChild(notification);
    
    // Trigger reflow to ensure transition works
    notification.offsetHeight;
    
    // Show the notification
    notification.classList.add('show');
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Remove from DOM after transition
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Store original resources HTML for demo purposes
let originalResourcesHTML;

// Capture original resources HTML after page load
window.addEventListener('load', function() {
    const resourcesGrid = document.querySelector('.resources-grid');
    if (resourcesGrid) {
        originalResourcesHTML = resourcesGrid.innerHTML;
    }
});