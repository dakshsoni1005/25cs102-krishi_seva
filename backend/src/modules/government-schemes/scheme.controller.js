const schemeService = require("./scheme.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getSchemes = asyncHandler(async (req, res) => {
  const schemes = await schemeService.getSchemesList(req.query);
  return ApiResponse.success(res, { schemes }, "Schemes retrieved successfully");
});

const getRecommended = asyncHandler(async (req, res) => {
  const schemes = await schemeService.getRecommendedSchemes(req.user.userId);
  return ApiResponse.success(res, { schemes }, "Recommended schemes retrieved");
});

const checkEligibility = asyncHandler(async (req, res) => {
  const schemeId = req.params.id;
  const eligibility = await schemeService.checkEligibility(req.user.userId, schemeId);
  return ApiResponse.success(res, eligibility, "Eligibility check completed");
});

module.exports = {
  getSchemes,
  getRecommended,
  checkEligibility
};
