import { authApi } from './api';

const authService = {
  login: async (email, password) => {
    const response = await authApi.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await authApi.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  updateProfile: async (userId, profileData) => {
    const response = await authApi.put(`/auth/profile/${userId}`, profileData);
    // Update stored user data
    const currentUser = authService.getCurrentUser();
    const updatedUser = { ...currentUser, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
