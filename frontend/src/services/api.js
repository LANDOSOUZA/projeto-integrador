// 📂 src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000
});

// Interceptor para incluir o token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // 👈 pega direto do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api; // 👈 agora exporta como default
