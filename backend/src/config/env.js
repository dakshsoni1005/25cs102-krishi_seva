require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/krishiseva",
  
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "krishiseva_access_token_secret_string_123!",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "krishiseva_refresh_token_secret_string_456!",
  JWT_ACCESS_EXPIRY: "15m", // 15 minutes
  JWT_REFRESH_EXPIRY: "7d", // 7 days

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  WEATHER_API_URL: process.env.WEATHER_API_URL || "https://api.open-meteo.com",
  
  MARKET_API_URL: process.env.MARKET_API_URL || "",
  PEST_AI_SERVICE_URL: process.env.PEST_AI_SERVICE_URL || "",
  
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || ""
};
