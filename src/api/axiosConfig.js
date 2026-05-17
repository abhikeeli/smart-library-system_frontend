import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smart-library-system-production.up.railway.app/api/', // Match your Spring Boot port
});

// This automatically attaches the JWT token to every request you make
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;