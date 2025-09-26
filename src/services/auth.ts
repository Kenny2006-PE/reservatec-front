/**
 * @file Servicio de Autenticación
 * @description Maneja la lógica de autenticación con Google y gestión de tokens
 */

import axios from '@/lib/axios';

export const AuthService = {
  /**
   * Inicia el proceso de login con Google
   */
  initiateGoogleLogin: () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/google`;
  },

  /**
   * Maneja el callback después de la autenticación exitosa
   * Ya no necesitamos manejar el token aquí ya que se maneja con cookies
   */
  handleAuthCallback: async () => {
    return true;
  },

  /**
   * Cierra la sesión del usuario
   */
  logout: async () => {
    try {
      await axios.post('/auth/logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      window.location.href = '/';
    }
  },

  /**
   * Verifica si el usuario está autenticado
   * Esto será manejado por el middleware de Next.js usando cookies
   */
  isAuthenticated: () => {
    return true; // El middleware se encarga de la verificación
  }
};

export default AuthService;