import { sectionApi } from './api';

const sectionService = {
  // GET /sections?resumeId={id}
  getByResume: async (resumeId) => {
    try {
      const response = await sectionApi.get('/sections', { params: { resumeId } });
      return response.data;
    } catch (error) {
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
   * Upsert all sections for a resume: create new ones, update existing ones.
   * Backend has no bulk endpoint — do it one-by-one.
   *
   * Each payload: { sectionId?, resumeId, sectionName, content (JSON string), displayOrder }
   */
  upsertAll: async (resumeId, sections) => {
    const results = [];
    for (const s of sections) {
      try {
        const body = {
          resumeId,
          sectionName: s.sectionName,
          content: typeof s.content === 'string' ? s.content : JSON.stringify(s.content),
          displayOrder: s.displayOrder,
        };
        if (s.sectionId) {
          const r = await sectionApi.put(`/sections/${s.sectionId}`, body);
          results.push(r.data);
        } else {
          const r = await sectionApi.post('/sections', body);
          results.push(r.data);
        }
      } catch (err) {
        console.warn(`Section "${s.sectionName}" save failed:`, err);
      }
    }
    return results;
  },
};

export default sectionService;
