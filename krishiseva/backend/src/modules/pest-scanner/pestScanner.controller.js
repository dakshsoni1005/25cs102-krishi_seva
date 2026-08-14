const pestScannerService = require("./pestScanner.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const analyzeLeaf = asyncHandler(async (req, res) => {
  // Multer populates req.file
  const result = await pestScannerService.analyzeLeaf(req.user.userId, req.file);
  return ApiResponse.success(res, { result }, "Leaf disease scan completed successfully");
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await pestScannerService.getScanHistory(req.user.userId);
  return ApiResponse.success(res, { history }, "Scan history retrieved");
});

module.exports = {
  analyzeLeaf,
  getHistory
};
