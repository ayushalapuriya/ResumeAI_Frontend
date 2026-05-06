import { templateApi } from './api';

const mockTemplates = [
  { templateId: 1, name: 'Executive Pro',  category: 'Professional', isPremium: true,  isActive: true, usageCount: 12400, thumbnailUrl: '/assets/professional.png', htmlLayout: '', cssStyles: '', description: 'A polished executive layout.', createdAt: '' },
  { templateId: 2, name: 'Creative Edge',  category: 'Creative',     isPremium: false, isActive: true, usageCount: 9800,  thumbnailUrl: '/assets/creative.png', htmlLayout: '', cssStyles: '', description: 'Bold and creative.', createdAt: '' },
  { templateId: 3, name: 'Minimal Light',  category: 'Minimal',      isPremium: false, isActive: true, usageCount: 21000, thumbnailUrl: '/assets/minimal.png', htmlLayout: '', cssStyles: '', description: 'Clean and minimal.', createdAt: '' },
  { templateId: 4, name: 'Tech Stack',     category: 'Modern',       isPremium: false, isActive: true, usageCount: 5200,  thumbnailUrl: '/assets/modern.png', htmlLayout: '', cssStyles: '', description: 'Great for developers.', createdAt: new Date().toISOString() },
  { templateId: 5, name: 'Elegant Script', category: 'Executive',    isPremium: true,  isActive: true, usageCount: 7100,  thumbnailUrl: '/assets/professional.png', htmlLayout: '', cssStyles: '', description: 'Refined executive style.', createdAt: '' },
  { templateId: 6, name: 'Metro Grid',     category: 'Modern',       isPremium: false, isActive: true, usageCount: 15300, thumbnailUrl: '/assets/modern.png', htmlLayout: '', cssStyles: '', description: 'Grid-based modern layout.', createdAt: '' },
  { templateId: 7, name: 'Classic Clean',  category: 'Professional', isPremium: false, isActive: true, usageCount: 18900, thumbnailUrl: '/assets/professional.png', htmlLayout: '', cssStyles: '', description: 'Timeless professional design.', createdAt: '' },
  { templateId: 8, name: 'Bold Statement', category: 'Creative',     isPremium: true,  isActive: true, usageCount: 4400,  thumbnailUrl: '/assets/creative.png', htmlLayout: '', cssStyles: '', description: 'Make an impression.', createdAt: new Date().toISOString() },
];

const templateService = {
  getTemplates: async () => {
    try {
      const response = await templateApi.get('/templates');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch templates, using mocks', error);
      return mockTemplates;
    }
  },

  getTemplateById: async (id) => {
    try {
      const response = await templateApi.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch template ${id}, using mocks`, error);
      return mockTemplates.find(t => t.templateId === parseInt(id));
    }
  }
};

export default templateService;
