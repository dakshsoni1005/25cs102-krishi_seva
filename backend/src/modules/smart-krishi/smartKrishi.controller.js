const smartKrishiAdapter = require("../../integrations/smart-krishi/smartKrishi.adapter");
const smartKrishiClient = require("../../integrations/smart-krishi/smartKrishi.client");
const smartKrishiService = require("./smartKrishi.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getOverview = asyncHandler(async (req, res) => {
  const stats = await smartKrishiService.getOverviewStats(req.user.userId);
  return ApiResponse.success(res, stats, "Smart Krishi overview stats retrieved");
});

const getRecommendations = asyncHandler(async (req, res) => {
  // Try calling integrated Smart Krishi adapter pipeline first
  try {
    const data = await smartKrishiAdapter.getRecommendations(req.user.userId, req.body || req.query);
    return ApiResponse.success(res, data, "Smart Krishi recommendations retrieved");
  } catch (err) {
    // If Smart Krishi standalone service is offline/unconfigured, fallback to local agronomy rule engine
    if (err.code === "SMART_KRISHI_UNAVAILABLE" || err.statusCode === 503) {
      const recs = await smartKrishiService.getRecommendations(req.user.userId);
      return ApiResponse.success(res, {
        source: "local_rule_engine",
        recommendations: recs
      }, "Local agronomy recommendations retrieved (Smart Krishi fallback)");
    }
    throw err;
  }
});

const refreshRecommendations = asyncHandler(async (req, res) => {
  try {
    const data = await smartKrishiAdapter.getRecommendations(req.user.userId, req.body || {});
    return ApiResponse.success(res, data, "Smart Krishi recommendations refreshed");
  } catch (err) {
    if (err.code === "SMART_KRISHI_UNAVAILABLE" || err.statusCode === 503) {
      const recs = await smartKrishiService.refreshRecommendations(req.user.userId);
      const formatted = await smartKrishiService.getRecommendations(req.user.userId);
      return ApiResponse.success(res, {
        source: "local_rule_engine",
        recommendations: formatted
      }, "Local agronomy recommendations refreshed (Smart Krishi fallback)");
    }
    throw err;
  }
});

// Feature proxy controllers
const getCrops = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getCrops();
  return ApiResponse.success(res, data, "Crops list retrieved from Smart Krishi");
});

const getDistricts = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getDistricts();
  return ApiResponse.success(res, data, "Districts list retrieved from Smart Krishi");
});

const getSoil = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getSoil(req.params.district);
  return ApiResponse.success(res, data, "District soil profile retrieved from Smart Krishi");
});

const getFertilizers = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getFertilizers(req.params.crop);
  return ApiResponse.success(res, data, "Fertilizer advisory retrieved from Smart Krishi");
});

const getIrrigation = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getIrrigation(req.params.crop);
  return ApiResponse.success(res, data, "Irrigation advisory retrieved from Smart Krishi");
});

const getDiseases = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getDiseases(req.params.crop);
  return ApiResponse.success(res, data, "Disease profiles retrieved from Smart Krishi");
});

const getPests = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getPests(req.params.crop);
  return ApiResponse.success(res, data, "Pest profiles retrieved from Smart Krishi");
});

const getCropCalendar = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getCropCalendar(req.params.crop);
  return ApiResponse.success(res, data, "Crop calendar retrieved from Smart Krishi");
});

const getWeather = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getWeather(req.params.district);
  return ApiResponse.success(res, data, "District weather forecast retrieved from Smart Krishi");
});

const getMarketPrices = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getMarketPrices(req.params.crop);
  return ApiResponse.success(res, data, "Crop market prices retrieved from Smart Krishi");
});

const getGovernmentAdvisories = asyncHandler(async (req, res) => {
  const data = await smartKrishiClient.getGovernmentAdvisories();
  return ApiResponse.success(res, data, "Government advisories retrieved from Smart Krishi");
});

const getHealth = asyncHandler(async (req, res) => {
  try {
    await smartKrishiClient.checkHealth();
    return ApiResponse.success(res, {
      service: "smart-krishi",
      status: "healthy"
    }, "Smart Krishi integration status healthy");
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: "Smart Krishi service is temporarily unavailable.",
      code: "SMART_KRISHI_UNAVAILABLE"
    });
  }
});

module.exports = {
  getOverview,
  getRecommendations,
  refreshRecommendations,
  getCrops,
  getDistricts,
  getSoil,
  getFertilizers,
  getIrrigation,
  getDiseases,
  getPests,
  getCropCalendar,
  getWeather,
  getMarketPrices,
  getGovernmentAdvisories,
  getHealth
};
