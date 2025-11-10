/**
 * @file Configuración de Axios para las peticiones HTTP
 * @description Configura instancia de Axios con interceptores para manejo de autenticación
 */

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true, // Esto permite que las cookies se envíen automáticamente
  headers: {
    'Content-Type': 'application/json'
  }
});

// No necesitamos interceptor de request ya que las cookies se manejan automáticamente
axiosInstance.interceptors.request.use((config) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo redirigir si no estamos en rutas del encargado o admin
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/encargado') && !currentPath.startsWith('/admin')) {
        // Redirigir al login si hay error de autenticación
        window.location.href = '/';
      }
      // Si estamos en rutas del encargado, solo loguear el error pero no redirigir
      console.warn('Error 401 en ruta del encargado - autenticación pendiente de implementar');
    }
    return Promise.reject(error);
});

export default axiosInstance;