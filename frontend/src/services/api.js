import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const scanAPI = {
  create: (data) => api.post('/scans', data),
  list: (params) => api.get('/scans', { params }),
  get: (id) => api.get(`/scans/${id}`),
  getFindings: (id) => api.get(`/scans/${id}/findings`),
  cancel: (id) => api.delete(`/scans/${id}`),
  generateReport: (scanId, format) => 
    api.post('/reports/generate', { scanId, format }, { responseType: format === 'html' || format === 'csv' ? 'blob' : 'json' }),
  getAnalytics: () => api.get('/analytics/dashboard'),
};

export const reconAPI = {
  runRecon: (data) => api.post('/recon/run', data),
  enumerateSubdomains: (domain) => api.get(`/recon/subdomains/${domain}`),
  detectTechs: (url) => api.get(`/recon/technologies/${encodeURIComponent(url)}`),
};

export const codeAnalysisAPI = {
  analyzeRepository: (data) => api.post('/code-analysis/analyze', data),
  analyzeCodeQuality: (repoUrl) => api.get(`/code-analysis/quality/${encodeURIComponent(repoUrl)}`),
  scanDependencies: (repoUrl) => api.get(`/code-analysis/dependencies/${encodeURIComponent(repoUrl)}`),
};

export const reportAPI = {
  generate: (data) => api.post('/reports/generate', data),
  list: () => api.get('/reports'),
  get: (reportId) => api.get(`/reports/${reportId}`),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

export default api;
