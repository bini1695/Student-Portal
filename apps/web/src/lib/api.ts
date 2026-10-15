import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLoginRequest = err.config?.url?.replace(/\/+$/, '').endsWith('/auth/login');
    if (err.response?.status === 401 && typeof window !== 'undefined' && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;