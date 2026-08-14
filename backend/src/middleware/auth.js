const { verifyAccessToken } = require("../utils/jwt");
const ApiResponse = require("../utils/apiResponse");
const User = require("../database/models/User");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.error(res, "Access denied. No authorization token provided.", 401, "UNAUTHORIZED");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return ApiResponse.error(res, "Access denied. Invalid or expired token.", 401, "INVALID_TOKEN");
    }

    // Attach user credentials to request
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(res, "Forbidden. You do not have permissions to access this resource.", 403, "FORBIDDEN");
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
