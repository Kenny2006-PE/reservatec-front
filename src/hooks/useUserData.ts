/**
 * @file Hook para obtener información del usuario
 * @description Hook que obtiene el email, rol y datos del usuario desde las cookies
 */

'use client';

import { useState, useEffect } from 'react';

interface UserData {
  email: string;
  role: 'estudiante' | 'encargado';
  nombre?: string;
  apellido?: string;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Obtener userData desde las cookies
      const userDataCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('userData='));
      
      if (userDataCookie) {
        const data = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]));
        setUserData(data);
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    userData,
    isLoading,
    isEncargado: userData?.role === 'encargado',
    isEstudiante: userData?.role === 'estudiante',
  };
};

export default useUserData;
