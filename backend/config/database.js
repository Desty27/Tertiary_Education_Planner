const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB database
 * @returns {Promise} Mongoose connection promise
 */
const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+, but kept for clarity
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

/**
 * Close the database connection
 * @returns {Promise} Promise that resolves when connection is closed
 */
const closeDatabaseConnection = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error(`Error closing MongoDB connection: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectToDatabase,
  closeDatabaseConnection
};