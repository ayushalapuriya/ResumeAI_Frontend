import { sectionApi } from './api';

const sectionService = {
  // GET /sections/resume/{id}
  getByResume: async (resumeId) => {
    try {
      const response = await sectionApi.get(`/sections/resume/${resumeId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      return [];
    }
  },

  // POST /sections
  add: async (section) => {
    const response = await sectionApi.post('/sections', section);
    return response.data;
  },

  // PUT /sections/{id}
  update: async (id, section) => {
    const response = await sectionApi.put(`/sections/${id}`, section);
    return response.data;
  },

  // DELETE /sections/{id}
  delete: async (id) => {
    const response = await sectionApi.delete(`/sections/${id}`);
    return response.data;
  },

  /**
   * Upsert all sections for a resume using the bulk endpoint.
   * Backend endpoint: POST /sections/bulk/{resumeId}
   */
  upsertAll: async (resumeId, sections) => {
    try {
      // Align frontend payloads with backend ResumeSection entity
      const payloads = sections.map(s => ({
        sectionId: s.sectionId || null,
        resumeId,
        sectionType: s.sectionName, // Backend uses sectionType (enum)
        title: s.title || s.sectionName,
        content: s.content, // Send as object, Jackson handles Map conversion
        displayOrder: s.displayOrder,
        isVisible: true
      }));

      const response = await sectionApi.post(`/sections/bulk/${resumeId}`, payloads);
      return response.data;
    } catch (error) {
      console.error('Bulk sections save failed:', error);
      throw error;
    }
  },
};

export default sectionService;
