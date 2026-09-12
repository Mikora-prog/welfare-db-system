import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-store');
  if (token) {
    try {
      const authStore = JSON.parse(token);
      if (authStore.state?.token) {
        config.headers.Authorization = `Bearer ${authStore.state.token}`;
      }
    } catch (e) {
      console.error('Error parsing auth token', e);
    }
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-store');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, firstName, lastName, role) =>
    api.post('/auth/register', { email, password, firstName, lastName, role }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

export const memberService = {
  getAll: (page = 1, limit = 20, filters = {}) =>
    api.get('/members', { params: { page, limit, ...filters } }),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  bulkImport: (members) => api.post('/members/import/bulk', { members })
};

export const dependantService = {
  getAll: (page = 1, limit = 20, filters = {}) =>
    api.get('/dependants', { params: { page, limit, ...filters } }),
  getById: (id) => api.get(`/dependants/${id}`),
  create: (data) => api.post('/dependants', data),
  update: (id, data) => api.put(`/dependants/${id}`, data),
  delete: (id) => api.delete(`/dependants/${id}`),
  getByMember: (memberId) => api.get(`/dependants/member/${memberId}`)
};

export const paymentService = {
  getAll: (page = 1, limit = 20, filters = {}) =>
    api.get('/payments', { params: { page, limit, ...filters } }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
  verify: (id) => api.post(`/payments/${id}/verify`),
  getMemberHistory: (memberId) => api.get(`/payments/member/${memberId}`),
  getReceipt: (id) => api.get(`/payments/${id}/receipt`)
};

export const benefitService = {
  getAll: (page = 1, limit = 20, filters = {}) =>
    api.get('/dependant-benefits', { params: { page, limit, ...filters } }),
  getById: (id) => api.get(`/dependant-benefits/${id}`),
  create: (data) => api.post('/dependant-benefits', data),
  update: (id, data) => api.put(`/dependant-benefits/${id}`, data),
  delete: (id) => api.delete(`/dependant-benefits/${id}`),
  getByDependant: (dependantId) => api.get(`/dependant-benefits/dependant/${dependantId}`)
};

export const reportService = {
  getFinancial: (filters = {}) => api.get('/reports/financial', { params: filters }),
  getMembers: () => api.get('/reports/members'),
  getPayments: (filters = {}) => api.get('/reports/payments', { params: filters }),
  getOutstanding: () => api.get('/reports/outstanding'),
  exportPDF: (filters = {}) => api.get('/reports/export/pdf', { params: filters }),
  exportExcel: (filters = {}) => api.get('/reports/export/excel', { params: filters })
};

export const dashboardService = {
  getOverview: () => api.get('/dashboard/overview'),
  getMetrics: () => api.get('/dashboard/metrics'),
  getCharts: () => api.get('/dashboard/charts')
};

export default api;
