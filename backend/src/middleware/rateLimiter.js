const rateLimit = require("express-rate-limit");
const ApiResponse = require("../utils/apiResponse");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
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

module.exports = {
  apiLimiter,
  authLimiter
};
