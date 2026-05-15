import { resumeApi } from './api';

const resumeService = {
  getByUser: async (userId) => {
    try {
      const response = await resumeApi.get(`/resumes/user/${userId}`);
      return response.data;
    } catch (error) {
      return [];
    }
  },

  getById: async (id) => {
    const response = await resumeApi.get(`/resumes/${id}`);
    return response.data;
  },

  create: async (dto) => {
    const response = await resumeApi.post('/resumes', dto);
    return response.data;
  },

  update: async (id, dto) => {
    const response = await resumeApi.put(`/resumes/${id}`, dto);
    return response.data;
  },

  delete: async (id) => {
    const response = await resumeApi.delete(`/resumes/${id}`);
    return response.data;
  },

  duplicate: async (id) => {
    const response = await resumeApi.post(`/resumes/${id}/duplicate`);
    return response.data;
  },

  getPublic: async () => {
    try {
      const response = await resumeApi.get('/resumes/public');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  publish: async (id) => {
    const response = await resumeApi.put(`/resumes/${id}/publish`);
    return response.data;
  },

  unpublish: async (id) => {
    const response = await resumeApi.put(`/resumes/${id}/unpublish`);
    return response.data;
  },

  updateAts: async (id, score) => {
    const response = await resumeApi.patch(`/resumes/${id}/ats`, null, {
      params: { score }
    });
    return response.data;
  },

  incrementView: async (id) => {
    const response = await resumeApi.patch(`/resumes/${id}/view`);
    return response.data;
  }
};

export default resumeService;
