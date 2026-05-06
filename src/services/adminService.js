import { authApi } from './api';

const adminService = {
  getUsers: async () => {
    const response = await authApi.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const endpoint = status ? `/admin/users/${userId}/reactivate` : `/admin/users/${userId}/suspend`;
    const response = await authApi.put(endpoint);
    return response.data;
  },

  updateUserPlan: async (userId, plan) => {
    const response = await authApi.put(`/admin/users/${userId}/subscription`, { plan });
    return response.data;
  },

  deleteUser: async (userId) => {
    await authApi.delete(`/admin/users/${userId}`);
  },

  getTemplates: async () => {
    const response = await authApi.get('/admin/templates');
    return response.data;
  },

  createTemplate: async (templateData) => {
    const response = await authApi.post('/admin/templates', templateData);
    return response.data;
  },

  updateTemplate: async (templateId, templateData) => {
    const response = await authApi.put(`/admin/templates/${templateId}`, templateData);
    return response.data;
  },

  deleteTemplate: async (templateId) => {
    await authApi.delete(`/admin/templates/${templateId}`);
  },

  getStats: async () => {
    const response = await authApi.get('/admin/stats');
    return response.data;
  },

  getPlatformAnalytics: async () => {
    const response = await authApi.get('/admin/analytics/platform');
    return response.data;
  },

  getAiUsageStats: async () => {
    const response = await authApi.get('/admin/analytics/ai-usage');
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await authApi.get('/admin/audit-logs');
    return response.data;
  },

  sendBroadcast: async (messageData) => {
    await authApi.post('/admin/notifications/broadcast', messageData);
  }
};

export default adminService;
