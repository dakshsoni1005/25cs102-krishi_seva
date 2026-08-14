const aiGuruService = require("./aiGuru.service");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await aiGuruService.getConversationsList(req.user.userId);
  return ApiResponse.success(res, { conversations }, "Conversations retrieved");
});

const getDetails = asyncHandler(async (req, res) => {
  const convo = await aiGuruService.getConversationDetails(req.user.userId, req.params.id);
  return ApiResponse.success(res, { conversation: convo }, "Conversation details retrieved");
});

const chat = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;
  if (!message) {
    return ApiResponse.error(res, "Message parameter 'message' is required.", 400, "MESSAGE_REQUIRED");
  }
  const result = await aiGuruService.handleChat(req.user.userId, message, conversationId);
  return ApiResponse.success(res, result, "AI response generated successfully");
});

const deleteConvo = asyncHandler(async (req, res) => {
  await aiGuruService.deleteConversation(req.user.userId, req.params.id);
  return ApiResponse.success(res, {}, "Conversation deleted successfully");
});

module.exports = {
  getConversations,
  getDetails,
  chat,
  deleteConvo
};
