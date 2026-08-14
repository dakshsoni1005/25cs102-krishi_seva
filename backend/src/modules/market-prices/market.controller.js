const marketService = require("./market.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getPrices = asyncHandler(async (req, res) => {
  const prices = await marketService.getMarketPrices(req.query);
  return ApiResponse.success(res, { prices }, "Market prices retrieved successfully");
});

const getTrends = asyncHandler(async (req, res) => {
  const { crop } = req.query;
  if (!crop) {
    return ApiResponse.error(res, "Crop name parameter 'crop' is required.", 400, "CROP_REQUIRED");
  }
  const trends = await marketService.getPriceTrends(crop);
  return ApiResponse.success(res, { trends }, `Trends retrieved for crop: ${crop}`);
});

const getWatchlist = asyncHandler(async (req, res) => {
  const watchlist = await marketService.getWatchlistKeys(req.user.userId);
  return ApiResponse.success(res, { watchlist }, "Watchlist retrieved successfully");
});

const toggleWatchlist = asyncHandler(async (req, res) => {
  const { marketPriceId } = req.body;
  if (!marketPriceId) {
    return ApiResponse.error(res, "Market price ID 'marketPriceId' is required.", 400, "ID_REQUIRED");
  }
  const watchlist = await marketService.toggleWatchlist(req.user.userId, marketPriceId);
  return ApiResponse.success(res, { watchlist }, "Watchlist updated successfully");
});

module.exports = {
  getPrices,
  getTrends,
  getWatchlist,
  toggleWatchlist
};
