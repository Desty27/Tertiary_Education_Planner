/**
 * EdPsych Connect Authentication Module
 * Handles user authentication, registration, and profile management
 */

// DOM elements
let authNavElement;
let loginForm;
let registerForm;
let resetPasswordForm;
let resetConfirmForm;
let profileForm;

// Current user state
let currentUser = null;

/**
 * Initialize the authentication module
 */
const initAuth = async () => {
  // Get DOM elements
  authNavElement = document.querySelector('.auth-nav');
  
  // Find forms if they exist on the current page
  loginForm = document.getElementById('login-form');
  registerForm = document.getElementById('register-form');
  resetPasswordForm = document.getElementById('reset-password-form');
  resetConfirmForm = document.getElementById('reset-confirm-form');
  profileForm = document.getElementById('profile-form');
  
  // Add event listeners to forms if they exist
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', handleResetPassword);
  }
  
  if (resetConfirmForm) {
    resetConfirmForm.addEventListener('submit', handleResetConfirm);
  }
  
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileUpdate);
  }
  
  // Check if user is already logged in
  await checkAuthState();
  
  // Update the UI based on authentication state
  updateAuthUI();
};

/**
 * Check the current authentication state
 */
const checkAuthState = async () => {
  try {
    // Check if we have a token
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      currentUser = null;
      return;
    }
    
    // Get the current user profile
    const response = await window.api.auth.getCurrentUser();
    
    if (response.success) {
      currentUser = response.data.user;
    } else {
      // If there was an error, clear the token
      localStorage.removeItem('authToken');
      currentUser = null;
    }
  } catch (error) {
    console.error('Error checking auth state:', error);
    localStorage.removeItem('authToken');
    currentUser = null;
  }
};

/**
 * Update the UI based on authentication state
 */
const updateAuthUI = () => {
  if (!authNavElement) return;
  
  if (currentUser) {
    // User is logged in
    authNavElement.innerHTML = `
      <div class="user-menu">
        <button class="user-menu-button">
          <span class="user-name">${currentUser.name}</span>
          <img src="${currentUser.profileImage || '../images/default-avatar.png'}" alt="Profile" class="user-avatar">
        </button>
        <div class="user-dropdown">
          <a href="/dashboard.html">Dashboard</a>
          <a href="/profile.html">Profile</a>
          <button id="logout-button">Log Out</button>
        </div>
      </div>
    `;
    
    // Add event listener to logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout);
    }
    
    // Add event listener to user menu button
    const userMenuButton = document.querySelector('.user-menu-button');
    if (userMenuButton) {
      userMenuButton.addEventListener('click', toggleUserMenu);
    }
    
    // Check if we're on a page that requires authentication
    const requiresAuth = document.body.hasAttribute('data-requires-auth');
    if (requiresAuth) {
      // Show the page content
      document.querySelector('.auth-required-content')?.classList.remove('hidden');
      document.querySelector('.auth-required-message')?.classList.add('hidden');
    }
  } else {
    // User is not logged in
    authNavElement.innerHTML = `
      <a href="/auth/login.html" class="button button-secondary">Log In</a>
      <a href="/auth/register.html" class="button">Sign Up</a>
    `;
    
    // Check if we're on a page that requires authentication
    const requiresAuth = document.body.hasAttribute('data-requires-auth');
    if (requiresAuth) {
      // Hide the page content and show a message
      document.querySelector('.auth-required-content')?.classList.add('hidden');
      document.querySelector('.auth-required-message')?.classList.remove('hidden');
    }
  }
};

/**
 * Toggle the user dropdown menu
 */
const toggleUserMenu = () => {
  const dropdown = document.querySelector('.user-dropdown');
  dropdown.classList.toggle('active');
};

/**
 * Handle login form submission
 * @param {Event} event - The form submission event
 */
const handleLogin = async (event) => {
  event.preventDefault();
  
  try {
    // Show loading state
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    
    // Get form data
    const email = loginForm.querySelector('#email').value;
    const password = loginForm.querySelector('#password').value;
    
    // Call Firebase Authentication API (this would be implemented in a real app)
    // For now, we'll simulate getting an ID token
    const idToken = 'simulated-firebase-id-token';
    
    // Call our backend API
    const response = await window.api.auth.login({ idToken });
    
    if (response.success) {
      // Update current user
      currentUser = response.data.user;
      
      // Update UI
      updateAuthUI();
      
      // Redirect to dashboard or home page
      window.location.href = '/dashboard.html';
    } else {
      // Show error message
      showFormError(loginForm, response.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    showFormError(loginForm, error.message || 'Login failed');
  } finally {
    // Reset button state
    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
};

/**
 * Handle registration form submission
 * @param {Event} event - The form submission event
 */
const handleRegister = async (event) => {
  event.preventDefault();
  
  try {
    // Show loading state
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Creating account...';
    submitButton.disabled = true;
    
    // Get form data
    const name = registerForm.querySelector('#name').value;
    const email = registerForm.querySelector('#email').value;
    const password = registerForm.querySelector('#password').value;
    const role = registerForm.querySelector('#role').value;
    
    // Call Firebase Authentication API (this would be implemented in a real app)
    // For now, we'll simulate getting an ID token
    const idToken = 'simulated-firebase-id-token';
    
    // Call our backend API
    const response = await window.api.auth.register({ 
      idToken,
      name,
      email,
      role
    });
    
    if (response.success) {
      // Show success message
      showFormSuccess(registerForm, 'Account created successfully! Redirecting to login...');
      
      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = '/auth/login.html';
      }, 2000);
    } else {
      // Show error message
      showFormError(registerForm, response.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showFormError(registerForm, error.message || 'Registration failed');
  } finally {
    // Reset button state
    const submitButton = registerForm.querySelector('button[type="submit"]');
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
};

/**
 * Handle password reset request form submission
 * @param {Event} event - The form submission event
 */
const handleResetPassword = async (event) => {
  event.preventDefault();
  
  try {
    // Show loading state
    const submitButton = resetPasswordForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Get form data
    const email = resetPasswordForm.querySelector('#email').value;
    
    // Call our backend API
    const response = await window.api.auth.requestPasswordReset({ email });
    
    if (response.success) {
      // Show success message
      showFormSuccess(resetPasswordForm, 'Password reset email sent! Check your inbox.');
    } else {
      // Show error message
      showFormError(resetPasswordForm, response.message || 'Failed to send reset email');
    }
  } catch (error) {
    console.error('Password reset error:', error);
    showFormError(resetPasswordForm, error.message || 'Failed to send reset email');
  } finally {
    // Reset button state
    const submitButton = resetPasswordForm.querySelector('button[type="submit"]');
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
};

/**
 * Handle password reset confirmation form submission
 * @param {Event} event - The form submission event
 */
const handleResetConfirm = async (event) => {
  event.preventDefault();
  
  try {
    // Show loading state
    const submitButton = resetConfirmForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Resetting...';
    submitButton.disabled = true;
    
    // Get form data
    const password = resetConfirmForm.querySelector('#password').value;
    const confirmPassword = resetConfirmForm.querySelector('#confirm-password').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      showFormError(resetConfirmForm, 'Passwords do not match');
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      return;
    }
    
    // Get the oobCode from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');
    
    if (!oobCode) {
      showFormError(resetConfirmForm, 'Invalid reset link');
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
      return;
    }
    
    // Call our backend API
    const response = await window.api.auth.verifyPasswordReset({ oobCode, password });
    
    if (response.success) {
      // Show success message
      showFormSuccess(resetConfirmForm, 'Password reset successfully! Redirecting to login...');
      
      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = '/auth/login.html';
      }, 2000);
    } else {
      // Show error message
      showFormError(resetConfirmForm, response.message || 'Failed to reset password');
    }
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    showFormError(resetConfirmForm, error.message || 'Failed to reset password');
  } finally {
    // Reset button state
    const submitButton = resetConfirmForm.querySelector('button[type="submit"]');
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
};

/**
 * Handle profile update form submission
 * @param {Event} event - The form submission event
 */
const handleProfileUpdate = async (event) => {
  event.preventDefault();
  
  try {
    // Show loading state
    const submitButton = profileForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Saving...';
    submitButton.disabled = true;
    
    // Get form data
    const name = profileForm.querySelector('#name').value;
    const organization = profileForm.querySelector('#organization').value;
    const position = profileForm.querySelector('#position').value;
    const bio = profileForm.querySelector('#bio').value;
    
    // Get preferences
    const theme = profileForm.querySelector('#theme').value;
    const emailNotifications = profileForm.querySelector('#email-notifications').checked;
    const pushNotifications = profileForm.querySelector('#push-notifications').checked;
    const fontSize = profileForm.querySelector('#font-size').value;
    const highContrast = profileForm.querySelector('#high-contrast').checked;
    
    // Call our backend API
    const response = await window.api.auth.updateCurrentUser({
      name,
      organization,
      position,
      bio,
      preferences: {
        theme,
        notifications: {
          email: emailNotifications,
          push: pushNotifications
        },
        accessibility: {
          fontSize,
          highContrast
        }
      }
    });
    
    if (response.success) {
      // Update current user
      currentUser = response.data.user;
      
      // Update UI
      updateAuthUI();
      
      // Show success message
      showFormSuccess(profileForm, 'Profile updated successfully!');
    } else {
      // Show error message
      showFormError(profileForm, response.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Profile update error:', error);
    showFormError(profileForm, error.message || 'Failed to update profile');
  } finally {
    // Reset button state
    const submitButton = profileForm.querySelector('button[type="submit"]');
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
  }
};

/**
 * Handle logout button click
 */
const handleLogout = async () => {
  try {
    // Call our backend API
    await window.api.auth.logout();
    
    // Clear current user
    currentUser = null;
    
    // Update UI
    updateAuthUI();
    
    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, we should still clear the local state
    localStorage.removeItem('authToken');
    currentUser = null;
    updateAuthUI();
    window.location.href = '/';
  }
};

/**
 * Show an error message on a form
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The error message
 */
const showFormError = (form, message) => {
  // Find or create error message element
  let errorElement = form.querySelector('.form-error');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    form.appendChild(errorElement);
  }
  
  // Set error message
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  
  // Hide success message if it exists
  const successElement = form.querySelector('.form-success');
  if (successElement) {
    successElement.style.display = 'none';
  }
};

/**
 * Show a success message on a form
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The success message
 */
const showFormSuccess = (form, message) => {
  // Find or create success message element
  let successElement = form.querySelector('.form-success');
  
  if (!successElement) {
    successElement = document.createElement('div');
    successElement.className = 'form-success';
    form.appendChild(successElement);
  }
  
  // Set success message
  successElement.textContent = message;
  successElement.style.display = 'block';
  
  // Hide error message if it exists
  const errorElement = form.querySelector('.form-error');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
};

// Initialize the authentication module when the DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Make auth functions available globally
window.auth = {
  initAuth,
  checkAuthState,
  updateAuthUI,
  getCurrentUser: () => currentUser
};