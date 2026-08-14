const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    logger.info("Connecting to MongoDB Database...");
    
    // Configure connection settings with timeouts
    const options = {
      serverSelectionTimeoutMS: 5000, // Fail quickly (5s) instead of looping
      autoIndex: true
    };

    mongoose.connection.on("connected", () => {
      logger.info("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB connection disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB connection reconnected successfully");
    });

    await mongoose.connect(env.MONGODB_URI, options);
  } catch (error) {
    logger.error("MongoDB connection failed");
    logger.error(`Initialization Error: ${error.message}`);
    process.exit(1);
  }
};

// Graceful shutdown listener hooks
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Gracefully closing Mongoose database connections...`);
  try {
    await mongoose.connection.close();
    logger.info("Mongoose connections closed successfully. Exiting process.");
    process.exit(0);
  } catch (err) {
    logger.error(`Error closing Mongoose connections: ${err.message}`);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

module.exports = connectDB;
