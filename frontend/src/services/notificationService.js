import api from "./api";

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get("/notifications");
    return response.data.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch("/notifications/read-all");
    return response.data.data;
  },

  addNotification: async (notifData) => {
    // Adding local mock notification client-side (no-op or mock post)
    // Return current notifications to keep flow consistent
    return await notificationService.getNotifications();
  }
};

export default notificationService;
