const farmsService = require("./farms.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getFarms = asyncHandler(async (req, res) => {
  const farms = await farmsService.getFarms(req.user.userId);
  return ApiResponse.success(res, { farms }, "Farms retrieved successfully");
});

const createFarm = asyncHandler(async (req, res) => {
  const farm = await farmsService.createFarm(req.user.userId, req.body);
  return ApiResponse.success(res, { farm }, "Farm registered successfully", 201);
});

const deleteFarm = asyncHandler(async (req, res) => {
  const farmId = req.params.id;
  await farmsService.deleteFarm(req.user.userId, farmId);
  return ApiResponse.success(res, {}, "Farm deleted successfully");
});

module.exports = {
  getFarms,
  createFarm,
  deleteFarm
};
