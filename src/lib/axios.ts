import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    if (status === 401) {
      if (!currentPath.startsWith('/encargado') && !currentPath.startsWith('/admin')) {
        console.warn('Sesión expirada. Redirigiendo...');
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else {
        console.warn('Error 401 - verifica tu autenticación');
      }
    }

    if (status === 403) {
      console.error('Acceso prohibido');
    }

    if (status === 404) {
      console.error('Recurso no encontrado:', error.config?.url);
    }

    if (status === 500) {
      console.error('Error del servidor:', error.response?.data?.message || 'Error interno');
    }

    if (!error.response) {
      console.error('Error de red: No se pudo conectar con el servidor');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
