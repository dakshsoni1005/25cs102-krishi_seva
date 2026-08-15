const rateLimit = require("express-rate-limit");
const ApiResponse = require("../utils/apiResponse");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.error(
      res,
      "Too many requests from this IP. Please try again after 15 minutes.",
      429,
      "TOO_MANY_REQUESTS"
    );
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login/register requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.error(
      res,
      "Too many login attempts. Please try again after 15 minutes.",
      429,
      "AUTH_RATE_LIMIT"
    );
  }
});

const aiGuruLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit AI chats to 30 queries per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.error(
      res,
      "AI Guru rate limit exceeded. Please wait a few minutes before asking more questions.",
      429,
      "AI_RATE_LIMIT"
    );
  }
});

const pestScannerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit image scans to 15 per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponse.error(
      res,
      "Pest scanning rate limit exceeded. Please wait a few minutes before analyzing more leaf photos.",
      429,
      "SCANNER_RATE_LIMIT"
    );
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiGuruLimiter,
  pestScannerLimiter
};
