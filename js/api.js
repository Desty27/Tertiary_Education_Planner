/**
 * EdPsych Connect API Client
 * Handles all API calls to the backend server
 */

// API base URL - will be different in development vs production
const API_BASE_URL = 'https://api.edpsychconnect.com/api';

// Default headers for API requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Get the authentication token from local storage
 * @returns {string|null} The authentication token or null if not found
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Set the authentication token in local storage
 * @param {string} token - The authentication token
 */
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Remove the authentication token from local storage
 */
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Add authentication headers to the request if a token exists
 * @param {Object} headers - The headers object to add authentication to
 * @returns {Object} The headers object with authentication added if a token exists
 */
const addAuthHeaders = (headers = {}) => {
  const token = getAuthToken();
  if (token) {
    return Object.assign({}, headers, {
      'Authorization': `Bearer ${token}`,
    });
  }
  return headers;
};

/**
 * Make an API request
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - The fetch options
 * @returns {Promise<Object>} The API response
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Add default headers and auth headers
    const headers = addAuthHeaders(Object.assign({}, DEFAULT_HEADERS, options.headers));
    
    const response = await fetch(url, Object.assign({}, options, { headers }));
    
    // Parse the response
    const data = await response.json();
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Authentication API
 */
const auth = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} The API response
   */
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} The API response
   */
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Save the token if login was successful
    if (response.data && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },
  
  /**
   * Logout the current user
   * @returns {Promise<Object>} The API response
   */
  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
    });
    
    // Remove the token on logout
    removeAuthToken();
    
    return response;
  },
  
  /**
   * Get the current user's profile
   * @returns {Promise<Object>} The API response
   */
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
  
  /**
   * Update the current user's profile
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} The API response
   */
  updateCurrentUser: async (userData) => {
    return apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  /**
   * Request a password reset email
   * @param {Object} data - Password reset data
   * @returns {Promise<Object>} The API response
   */
  requestPasswordReset: async (data) => {
    return apiRequest('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Verify a password reset token
   * @param {Object} data - Password reset verification data
   * @returns {Promise<Object>} The API response
   */
  verifyPasswordReset: async (data) => {
    return apiRequest('/auth/password/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Change the current user's password
   * @param {Object} data - Password change data
   * @returns {Promise<Object>} The API response
   */
  changePassword: async (data) => {
    return apiRequest('/auth/password/change', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * AI API
 */
const ai = {
  /**
   * Generate curriculum content
   * @param {Object} params - Parameters for content generation
   * @returns {Promise<Object>} The API response
   */
  generateCurriculumContent: async (params) => {
    return apiRequest('/ai/curriculum/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  
  /**
   * Generate assessment questions
   * @param {Object} params - Parameters for question generation
   * @returns {Promise<Object>} The API response
   */
  generateAssessmentQuestions: async (params) => {
    return apiRequest('/ai/assessment/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  
  /**
   * Analyze student response
   * @param {Object} params - Parameters for analysis
   * @returns {Promise<Object>} The API response
   */
  analyzeStudentResponse: async (params) => {
    return apiRequest('/ai/assessment/analyze', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  
  /**
   * Generate personalized learning recommendations
   * @param {Object} params - Parameters for recommendations
   * @returns {Promise<Object>} The API response
   */
  generatePersonalizedRecommendations: async (params) => {
    return apiRequest('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
  
  /**
   * Submit feedback on AI-generated content
   * @param {Object} feedback - Feedback data
   * @returns {Promise<Object>} The API response
   */
  submitFeedback: async (feedback) => {
    return apiRequest('/ai/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  },
};

/**
 * Curriculum API
 */
const curriculum = {
  /**
   * Get all curriculum plans
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} The API response
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/curriculum?${queryString}`);
  },
  
  /**
   * Get a specific curriculum plan
   * @param {string} id - Curriculum plan ID
   * @returns {Promise<Object>} The API response
   */
  getById: async (id) => {
    return apiRequest(`/curriculum/${id}`);
  },
  
  /**
   * Create a new curriculum plan
   * @param {Object} data - Curriculum plan data
   * @returns {Promise<Object>} The API response
   */
  create: async (data) => {
    return apiRequest('/curriculum', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update a curriculum plan
   * @param {string} id - Curriculum plan ID
   * @param {Object} data - Curriculum plan data
   * @returns {Promise<Object>} The API response
   */
  update: async (id, data) => {
    return apiRequest(`/curriculum/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete a curriculum plan
   * @param {string} id - Curriculum plan ID
   * @returns {Promise<Object>} The API response
   */
  delete: async (id) => {
    return apiRequest(`/curriculum/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Assessment API
 */
const assessment = {
  /**
   * Get all assessments
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} The API response
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/assessment?${queryString}`);
  },
  
  /**
   * Get a specific assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<Object>} The API response
   */
  getById: async (id) => {
    return apiRequest(`/assessment/${id}`);
  },
  
  /**
   * Create a new assessment
   * @param {Object} data - Assessment data
   * @returns {Promise<Object>} The API response
   */
  create: async (data) => {
    return apiRequest('/assessment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update an assessment
   * @param {string} id - Assessment ID
   * @param {Object} data - Assessment data
   * @returns {Promise<Object>} The API response
   */
  update: async (id, data) => {
    return apiRequest(`/assessment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete an assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<Object>} The API response
   */
  delete: async (id) => {
    return apiRequest(`/assessment/${id}`, {
      method: 'DELETE',
    });
  },
  
  /**
   * Submit assessment responses
   * @param {string} id - Assessment ID
   * @param {Object} responses - Assessment responses
   * @returns {Promise<Object>} The API response
   */
  submitResponses: async (id, responses) => {
    return apiRequest(`/assessment/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(responses),
    });
  },
  
  /**
   * Get assessment results
   * @param {string} id - Assessment ID
   * @returns {Promise<Object>} The API response
   */
  getResults: async (id) => {
    return apiRequest(`/assessment/${id}/results`);
  },
};

/**
 * Resources API
 */
const resources = {
  /**
   * Get all resources
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} The API response
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/resources?${queryString}`);
  },
  
  /**
   * Get a specific resource
   * @param {string} id - Resource ID
   * @returns {Promise<Object>} The API response
   */
  getById: async (id) => {
    return apiRequest(`/resources/${id}`);
  },
  
  /**
   * Create a new resource
   * @param {Object} data - Resource data
   * @returns {Promise<Object>} The API response
   */
  create: async (data) => {
    return apiRequest('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Update a resource
   * @param {string} id - Resource ID
   * @param {Object} data - Resource data
   * @returns {Promise<Object>} The API response
   */
  update: async (id, data) => {
    return apiRequest(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  /**
   * Delete a resource
   * @param {string} id - Resource ID
   * @returns {Promise<Object>} The API response
   */
  delete: async (id) => {
    return apiRequest(`/resources/${id}`, {
      method: 'DELETE',
    });
  },
};

// Create the API client
const api = {
  auth,
  ai,
  curriculum,
  assessment,
  resources,
};

// Make the API client available globally
window.api = api;