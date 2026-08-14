const soilService = require("./soil.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getSoil = asyncHandler(async (req, res) => {
  const data = await soilService.getSoilData(req.user.userId);
  return ApiResponse.success(res, data, "Soil health parameters retrieved");
});

const getSoilByRegion = asyncHandler(async (req, res) => {
  const { region } = req.params;
  const data = await soilService.getSoilByRegion(req.user.userId, region);
  return ApiResponse.success(res, data, `Soil health parameters retrieved for ${region}`);
});

const retestSoil = asyncHandler(async (req, res) => {
  const { region } = req.body;
  if (!region) {
    return ApiResponse.error(res, "Region parameter 'region' is required.", 400, "REGION_REQUIRED");
  }
  const data = await soilService.triggerRetest(req.user.userId, region);
  return ApiResponse.success(res, data, "Soil sample re-tested successfully");
});

module.exports = {
  getSoil,
  getSoilByRegion,
  retestSoil
};
