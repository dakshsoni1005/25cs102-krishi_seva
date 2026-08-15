const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/database");
const logger = require("./utils/logger");

const startServer = async () => {
  // 1. Establish MongoDB connection
  await connectDB();

  // 2. Start HTTP Listener
  const server = app.listen(env.PORT, () => {
    logger.info(`KrishiSeva Backend Server running in [${env.NODE_ENV}] mode on port: ${env.PORT}`);
  });

  // Handle unhandled promise rejections without crashing server
  process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled Rejection Error logged: ${err.message}`);
  });
};

startServer();
