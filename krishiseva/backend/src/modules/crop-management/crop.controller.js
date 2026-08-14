const cropService = require("./crop.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getCrops = asyncHandler(async (req, res) => {
  const crops = await cropService.getActiveCrops(req.user.userId);
  return ApiResponse.success(res, { crops }, "Active crops retrieved successfully");
});

const addCrop = asyncHandler(async (req, res) => {
  const crop = await cropService.addNewCrop(req.user.userId, req.body);
  return ApiResponse.success(res, { crop }, "Crop cycle registered successfully", 201);
});

const updateStage = asyncHandler(async (req, res) => {
  const cropId = req.params.id;
  const { currentStage } = req.body;
  if (!currentStage) {
    return ApiResponse.error(res, "Stage parameter currentStage is required.", 400, "STAGE_REQUIRED");
  }
  const crop = await cropService.updateCropStage(req.user.userId, cropId, currentStage);
  return ApiResponse.success(res, { crop }, "Crop lifecycle stage advanced successfully");
});

const toggleTask = asyncHandler(async (req, res) => {
  const { id: cropId, taskId } = req.params;
  const crop = await cropService.toggleTaskStatus(req.user.userId, cropId, taskId);
  return ApiResponse.success(res, { crop }, "Task status toggled successfully");
});

const addTask = asyncHandler(async (req, res) => {
  const cropId = req.params.id;
  const crop = await cropService.addTask(req.user.userId, cropId, req.body);
  return ApiResponse.success(res, { crop }, "Task registered successfully", 201);
});

module.exports = {
  getCrops,
  addCrop,
  updateStage,
  toggleTask,
  addTask
};
