import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (phone, password) => api.post('/auth/login', new URLSearchParams({ username: phone, password })),
}

export const trustApi = {
  compute: () => api.post('/trust-score/compute'),
  getMyScore: () => api.get('/trust-score/me'),
  runAudit: () => api.post('/trust-score/fairness-audit'),
}

export const circleApi = {
  list: () => api.get('/circles/'),
  create: (data) => api.post('/circles/', data),
  get: (id) => api.get(`/circles/${id}`),
  join: (id) => api.post(`/circles/${id}/join`),
  contribute: (id, amount) => api.post(`/circles/${id}/contribute`, { amount }),
  getMembers: (id) => api.get(`/circles/${id}/members`),
}

export const consentApi = {
  list: () => api.get('/consent/'),
  update: (purpose, granted) => api.post('/consent/', { purpose, granted }),
  exportPassport: () => api.get('/consent/export', { responseType: 'blob' }),
}

export const facilitatorApi = {
  addMember: (data) => api.post('/facilitator/add-member', data),
  proxyContribute: (data) => api.post('/facilitator/proxy-contribution', data),
}

export const adminApi = {
  getStats: () => api.get('/trust-score/admin/stats'),
}

export default api;

