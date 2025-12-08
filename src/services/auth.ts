/**
 * @file Servicio de Autenticación
 * @description Maneja la lógica de autenticación con Google y gestión de tokens
 */

export const AuthService = {
  /**
   * Inicia el proceso de login con Google
   */
  initiateGoogleLogin: () => {
    // Las rutas de autenticación están en /auth, no en /api
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace('/api', '') || 'http://localhost:5000';
    window.location.href = `${backendUrl}/auth/google`;
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
      // La ruta de logout está en /auth, no en /api
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL?.replace('/api', '') || 'http://localhost:5000';
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      // Limpiar cookies del lado del cliente
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'userPicture=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Limpiar cookies aunque falle el request
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'userPicture=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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