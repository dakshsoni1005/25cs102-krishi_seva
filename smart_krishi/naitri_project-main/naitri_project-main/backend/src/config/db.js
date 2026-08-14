const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Disable buffering so queries fail fast and trigger fallbacks immediately if disconnected
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/agri_db', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error during MongoDB connection: ${error.message}. Running server with local JSON dataset fallbacks.`);
  }
};

module.exports = connectDB;
