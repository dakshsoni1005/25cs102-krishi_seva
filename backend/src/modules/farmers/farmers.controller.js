const farmersService = require("./farmers.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await farmersService.getProfile(req.user.userId);
  return ApiResponse.success(res, { profile }, "Farmer profile retrieved");
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await farmersService.updateProfile(req.user.userId, req.body);
  return ApiResponse.success(res, { profile }, "Farmer profile context updated successfully");
});

module.exports = {
  getProfile,
  updateProfile
};
