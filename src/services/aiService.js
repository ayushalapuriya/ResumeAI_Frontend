import { aiApi } from './api';

const getUserId = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.error('No user found in localStorage');
    return null;
  }
  try {
    const user = JSON.parse(userStr);
    const id = user.userId || user.id;
    if (!id) console.error('User object found but missing userId/id:', user);
    return id;
  } catch (e) {
    console.error('Failed to parse user from localStorage:', e);
    return null;
  }
};

const aiService = {
  generateSummary: async (resumeData, jobDesc) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await aiApi.post('/ai/summary', {
      userId: Number(userId),
      resume: JSON.stringify(resumeData),
      jobDesc: jobDesc || ''
    });
    return response.data;
  },

  generateBullets: async (exp, jobDesc) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await aiApi.post('/ai/bullets', {
      userId: Number(userId),
      exp: JSON.stringify(exp),
      jobDesc: jobDesc || ''
    });
    return response.data;
  },

  checkAts: async (resumeData) => {
    const userId = getUserId();
    if (!userId) throw new Error('User not logged in');

    const response = await aiApi.post('/ai/ats', {
      userId: Number(userId),
      resume: JSON.stringify(resumeData)
    });
    return response.data;
  },

  getQuota: async () => {
    const userId = getUserId();
    if (!userId) return { remaining: 0 };

    const response = await aiApi.get(`/ai/quota/${userId}`);
    return response.data;
  }
};

export default aiService;
