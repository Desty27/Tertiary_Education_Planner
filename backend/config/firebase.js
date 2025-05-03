const admin = require('firebase-admin');
const logger = require('../utils/logger');

/**
 * Initialize Firebase Admin SDK
 * This function sets up Firebase Admin with credentials from environment variables
 */
const setupFirebaseAdmin = () => {
  try {
    // Check if Firebase Admin is already initialized
    if (admin.apps.length === 0) {
      // For production, use environment variables to store credentials
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Parse the service account JSON from environment variable
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL
        });
        
        logger.info('Firebase Admin SDK initialized with service account');
      } else {
        // For development, can use application default credentials
        admin.initializeApp({
          credential: admin.credential.applicationDefault()
        });
        
        logger.info('Firebase Admin SDK initialized with application default credentials');
      }
    } else {
      logger.info('Firebase Admin SDK already initialized');
    }
  } catch (error) {
    logger.error(`Error initializing Firebase Admin SDK: ${error.message}`);
    throw error;
  }
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - The Firebase ID token to verify
 * @returns {Promise<Object>} The decoded token
 */
const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error(`Error verifying Firebase ID token: ${error.message}`);
    throw error;
  }
};

/**
 * Get user by UID
 * @param {string} uid - The user's Firebase UID
 * @returns {Promise<Object>} The user record
 */
const getUserByUid = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    logger.error(`Error getting user by UID: ${error.message}`);
    throw error;
  }
};

/**
 * Create a new user in Firebase
 * @param {Object} userData - User data including email and password
 * @returns {Promise<Object>} The created user record
 */
const createUser = async (userData) => {
  try {
    const userRecord = await admin.auth().createUser(userData);
    return userRecord;
  } catch (error) {
    logger.error(`Error creating user in Firebase: ${error.message}`);
    throw error;
  }
};

/**
 * Update a user in Firebase
 * @param {string} uid - The user's Firebase UID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} The updated user record
 */
const updateUser = async (uid, userData) => {
  try {
    const userRecord = await admin.auth().updateUser(uid, userData);
    return userRecord;
  } catch (error) {
    logger.error(`Error updating user in Firebase: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a user from Firebase
 * @param {string} uid - The user's Firebase UID
 * @returns {Promise<void>}
 */
const deleteUser = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);
    logger.info(`User ${uid} deleted from Firebase`);
  } catch (error) {
    logger.error(`Error deleting user from Firebase: ${error.message}`);
    throw error;
  }
};

module.exports = {
  setupFirebaseAdmin,
  verifyIdToken,
  getUserByUid,
  createUser,
  updateUser,
  deleteUser
};