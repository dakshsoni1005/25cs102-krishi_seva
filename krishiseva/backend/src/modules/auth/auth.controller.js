const authService = require("./auth.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return ApiResponse.success(res, result, "Farmer registered successfully", 201);
});

const login = asyncHandler(async (req, res) => {
  const { mobileNumber, password } = req.body;
  const result = await authService.login(mobileNumber, password);
  return ApiResponse.success(res, result, "Logged in successfully");
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return ApiResponse.error(res, "Refresh token is required.", 400, "REFRESH_REQUIRED");
  }
  const result = await authService.refresh(refreshToken);
  return ApiResponse.success(res, result, "Access token refreshed successfully");
});

const logout = asyncHandler(async (req, res) => {
  // Stateless JWT logout is handled on the client side by discarding the token.
  // We can return a success confirmation.
  return ApiResponse.success(res, {}, "Logged out successfully");
});

const getMe = asyncHandler(async (req, res) => {
  const farmer = await authService.getMe(req.user.userId);
  return ApiResponse.success(res, { farmer }, "Profile context retrieved successfully");
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe
};
