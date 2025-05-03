/**
 * EdPsych Connect Platform
 * Navigation JavaScript
 * Using UK spelling standards
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }
    
    // Dropdown functionality for mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        // For mobile: toggle dropdown on click
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            
            // Reset hamburger icon
            if (hamburger) {
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }
        }
    });
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (href !== '/' && currentPage.includes(href))) {
            item.classList.add('active');
            
            // If in dropdown, also highlight parent
            const parentLi = item.closest('.dropdown');
            if (parentLi) {
                const parentLink = parentLi.querySelector(':scope > a');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });
    
    // Generate breadcrumbs based on current path
    const breadcrumbContainer = document.querySelector('.breadcrumb');
    if (breadcrumbContainer && currentPage !== '/') {
        generateBreadcrumbs(breadcrumbContainer, currentPage);
    }
});

/**
 * Generates breadcrumb navigation based on current path
 * @param {HTMLElement} container - The breadcrumb container element
 * @param {string} path - The current page path
 */
function generateBreadcrumbs(container, path) {
    // Remove trailing slash if present
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    
    // Split path into segments
    const segments = path.split('/').filter(segment => segment !== '');
    
    // Always start with home
    let breadcrumbHTML = '<li><a href="/">Home</a></li>';
    
    // Build path progressively
    let currentPath = '';
    
    segments.forEach((segment, index) => {
        currentPath += '/' + segment;
        
        // Format segment for display (replace hyphens with spaces, capitalize)
        const displayName = segment
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
        
        // Last segment is current page (not clickable)
        if (index === segments.length - 1) {
            breadcrumbHTML += `<li><a>${displayName}</a></li>`;
        } else {
            breadcrumbHTML += `<li><a href="${currentPath}">${displayName}</a></li>`;
        }
    });
    
    container.innerHTML = breadcrumbHTML;
}