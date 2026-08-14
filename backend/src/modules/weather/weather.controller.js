const weatherService = require("./weather.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getWeather = asyncHandler(async (req, res) => {
  const data = await weatherService.getWeatherData(req.user.userId);
  return ApiResponse.success(res, data, "Weather data retrieved successfully");
});

const getAlerts = asyncHandler(async (req, res) => {
  const alerts = await weatherService.getWeatherAlerts(req.user.userId);
  return ApiResponse.success(res, { alerts }, "Weather alerts retrieved");
});

module.exports = {
  getWeather,
  getAlerts
};
