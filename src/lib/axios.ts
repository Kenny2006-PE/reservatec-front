/**
 * @file Configuración de Axios para las peticiones HTTP
 * @description Configura instancia de Axios con interceptores para manejo de autenticación
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      window.location.href = '/';
    }
    return Promise.reject(error);
});

export default axiosInstance;