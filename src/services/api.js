import axios from 'axios';
import { API_CONFIG } from './config';

const createApi = (baseURL) => {
  const instance = axios.create({ baseURL });
  
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

export const authApi = createApi(API_CONFIG.AUTH_BASE);
export const resumeApi = createApi(API_CONFIG.RESUME_BASE);
export const sectionApi = createApi(API_CONFIG.SECTION_BASE);
export const templateApi = createApi(API_CONFIG.TEMPLATE_BASE);

export default resumeApi;
