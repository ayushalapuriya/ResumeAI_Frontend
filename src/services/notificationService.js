import axios from 'axios';
import { authApi } from './api';

const notificationService = {
  getNotifications: async (userId) => {
    const response = await authApi.get(`/notifications/recipient/${userId}`);
    return response.data;
  },

  getUnreadCount: async (userId) => {
    const response = await authApi.get(`/notifications/recipient/${userId}/unread-count`);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    await authApi.put(`/notifications/${notificationId}/read`);
  },

  markAllRead: async (userId) => {
    await authApi.put(`/notifications/recipient/${userId}/read-all`);
  },

  deleteNotification: async (notificationId) => {
    await authApi.delete(`/notifications/${notificationId}`);
  }
};

export default notificationService;
