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
  const queryOrBody = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
  const result = await smartKrishiService.getDatasetRecommendation(queryOrBody, req.user ? req.user.userId : "guest");
  return ApiResponse.success(res, result, "Smart Krishi decision recommendations retrieved successfully");
});

const refreshRecommendations = asyncHandler(async (req, res) => {
  const queryOrBody = (req.body && Object.keys(req.body).length > 0) ? req.body : req.query;
  const result = await smartKrishiService.getDatasetRecommendation(queryOrBody, req.user ? req.user.userId : "guest");
  return ApiResponse.success(res, result, "Smart Krishi decision recommendations refreshed successfully");
});

// Feature proxy controllers
const getCrops = asyncHandler(async (req, res) => {
  const data = await smartKrishiService.getCrops();
  return res.status(200).json(data);
});

const getDistricts = asyncHandler(async (req, res) => {
  const data = await smartKrishiService.getDistricts();
  return res.status(200).json(data);
});

const getCropsByDistrict = asyncHandler(async (req, res) => {
  const data = await smartKrishiService.getCropsByDistrict(req.params.district);
  return res.status(200).json(data);
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
  getCropsByDistrict,
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
