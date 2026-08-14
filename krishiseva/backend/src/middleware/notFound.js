const ApiResponse = require("../utils/apiResponse");

const notFound = (req, res, next) => {
  ApiResponse.error(
    res,
    `Cannot resolve requested endpoint: ${req.method} ${req.originalUrl}`,
    404,
    "ENDPOINT_NOT_FOUND"
  );
};

module.exports = notFound;
