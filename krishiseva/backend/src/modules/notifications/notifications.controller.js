const Notification = require("../../database/models/Notification");
const ApiResponse = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ farmerId: req.user.userId })
    .sort({ createdAt: -1 })
    .lean();

  const formatted = notifications.map((n) => ({
    id: n._id.toString(),
    category: n.type.charAt(0).toUpperCase() + n.type.slice(1), // capitalize for UI representation
    title: n.title,
    description: n.message,
    timestamp: n.createdAt,
    read: n.isRead,
    priority: n.priority
  }));

  return ApiResponse.success(res, formatted, "Notifications retrieved");
});

const markAsRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, farmerId: req.user.userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!notif) {
    return ApiResponse.error(res, "Notification not found or unauthorized.", 404, "NOT_FOUND");
  }

  // Return full updated list for frontend re-sync compatibility
  const list = await Notification.find({ farmerId: req.user.userId }).sort({ createdAt: -1 }).lean();
  const formatted = list.map((n) => ({
    id: n._id.toString(),
    category: n.type.charAt(0).toUpperCase() + n.type.slice(1),
    title: n.title,
    description: n.message,
    timestamp: n.createdAt,
    read: n.isRead,
    priority: n.priority
  }));

  return ApiResponse.success(res, formatted, "Notification marked as read");
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { farmerId: req.user.userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  const list = await Notification.find({ farmerId: req.user.userId }).sort({ createdAt: -1 }).lean();
  const formatted = list.map((n) => ({
    id: n._id.toString(),
    category: n.type.charAt(0).toUpperCase() + n.type.slice(1),
    title: n.title,
    description: n.message,
    timestamp: n.createdAt,
    read: n.isRead,
    priority: n.priority
  }));

  return ApiResponse.success(res, formatted, "All notifications marked as read");
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
