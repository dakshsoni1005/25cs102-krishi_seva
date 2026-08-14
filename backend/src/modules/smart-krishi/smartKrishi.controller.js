const smartKrishiService = require("./smartKrishi.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getOverview = asyncHandler(async (req, res) => {
  const stats = await smartKrishiService.getOverviewStats(req.user.userId);
  return ApiResponse.success(res, stats, "Dashboard overview statistics retrieved");
});

const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await smartKrishiService.getRecommendations(req.user.userId);
  return ApiResponse.success(res, { recommendations }, "Smart recommendations retrieved");
});

const refreshRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await smartKrishiService.refreshRecommendations(req.user.userId);
  return ApiResponse.success(res, { recommendations }, "Agronomy advisory refreshed successfully");
});

module.exports = {
  getOverview,
  getRecommendations,
  refreshRecommendations
};
