const mongoose = require("mongoose");
const connectDB = require("../../config/database");
const runSeeder = require("./seeder");
const logger = require("../../utils/logger");

const resetDatabase = async () => {
  try {
    logger.info("WARNING: Initiating DESTRUCTIVE database reset...");
    
    // Connect to database
    await connectDB();

    const collections = Object.keys(mongoose.connection.collections);
    
    logger.info(`Dropping ${collections.length} collections...`);
    for (const collectionName of collections) {
      await mongoose.connection.collections[collectionName].drop();
      logger.info(`Collection dropped: ${collectionName}`);
    }

    logger.info("Database drop completed successfully.");

    // Run seeder to rebuild baseline data
    await runSeeder(true);

    logger.info("Database reset and rebuild completed successfully.");
    process.exit(0);
  } catch (error) {
    logger.error(`Database Reset Failed: ${error.message}`);
    process.exit(1);
  }
};

resetDatabase();
