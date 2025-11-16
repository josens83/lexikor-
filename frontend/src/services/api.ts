import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/api/v1/auth/register', data),
  login: (data: any) => api.post('/api/v1/auth/login', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getMe: () => api.get('/api/v1/auth/me'),
  logout: () => api.post('/api/v1/auth/logout'),
  updateProfile: (data: any) => api.put('/api/v1/auth/me', data),
  changePassword: (data: any) => api.post('/api/v1/auth/change-password', data),
  toggleMFA: () => api.post('/api/v1/auth/toggle-mfa'),
  deleteAccount: () => api.delete('/api/v1/auth/me'),
}

// Chat API
export const chatAPI = {
  sendMessage: (data: any) => api.post('/api/v1/chat/send', data),
  getConversations: (params?: any) => api.get('/api/v1/chat/conversations', { params }),
  getMessages: (conversationId: number) =>
    api.get(`/api/v1/chat/conversations/${conversationId}/messages`),
  deleteConversation: (conversationId: number) =>
    api.delete(`/api/v1/chat/conversations/${conversationId}`),
}

// Documents API
export const documentsAPI = {
  upload: (formData: FormData) =>
    api.post('/api/v1/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getDocuments: (params?: any) => api.get('/api/v1/documents/', { params }),
  getDocument: (id: number) => api.get(`/api/v1/documents/${id}`),
  analyzeDocument: (id: number) => api.get(`/api/v1/documents/${id}/analyze`),
  deleteDocument: (id: number) => api.delete(`/api/v1/documents/${id}`),
}

// Research API
export const researchAPI = {
  searchCases: (data: any) => api.post('/api/v1/research/cases/search', data),
  getCaseDetail: (id: number) => api.get(`/api/v1/research/cases/${id}`),
  searchStatutes: (data: any) => api.post('/api/v1/research/statutes/search', data),
  getStatuteDetail: (id: number) => api.get(`/api/v1/research/statutes/${id}`),
}

// Templates API
export const templatesAPI = {
  getTemplates: (params?: any) => api.get('/api/v1/templates/', { params }),
  getTemplate: (templateType: string, templateSubtype: string) =>
    api.get(`/api/v1/templates/${templateType}/${templateSubtype}`),
  generateDocument: (data: any) => api.post('/api/v1/templates/generate', data),
}

// Billing API
export const billingAPI = {
  getSubscription: () => api.get('/api/v1/billing/subscription'),
  upgradeSubscription: (data: any) => api.post('/api/v1/billing/upgrade', data),
  createCheckout: (plan: string) =>
    api.post('/api/v1/billing/checkout/create', null, { params: { plan } }),
  cancelSubscription: () => api.post('/api/v1/billing/cancel'),
  getUsage: () => api.get('/api/v1/billing/usage'),
}

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/api/v1/analytics/dashboard'),
  getActivity: (params?: any) => api.get('/api/v1/analytics/activity', { params }),
  getPopularTopics: () => api.get('/api/v1/analytics/popular-topics'),
}

export default api
