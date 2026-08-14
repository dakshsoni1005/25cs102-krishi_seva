const env = require("../config/env");
const logger = require("../utils/logger");
const ApiResponse = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} \n ${err.stack}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected server error occurred.";
  let errorCode = err.code || "SERVER_ERROR";

  // 1. Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
    errorCode = "VALIDATION_ERROR";
  }

  // 2. Mongoose Cast Error (Invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field ${err.path}: ${err.value}`;
    errorCode = "INVALID_ID";
  }

  // 3. MongoDB Duplicate Key Code 11000
  if (err.code === 11000) {
    statusCode = 400;
    const key = Object.keys(err.keyValue)[0];
    message = `A record with this ${key} already exists.`;
    errorCode = "DUPLICATE_KEY";
  }

  // 4. JWT Expiration / Signature errors
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your authorization token has expired. Please log in again.";
    errorCode = "TOKEN_EXPIRED";
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authorization token signature.";
    errorCode = "INVALID_TOKEN";
  }

  // 5. Multer File Upload Errors
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File upload exceeds maximum allowed size (5MB).";
    errorCode = "FILE_TOO_LARGE";
  }

  // 6. Zod Validation Errors
  if (err.name === "ZodError" || (err.issues && Array.isArray(err.issues))) {
    statusCode = 400;
    message = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    errorCode = "VALIDATION_ERROR";
  }

  // Send Sanitize response payload
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      ...(env.NODE_ENV === "development" && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
