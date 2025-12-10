/**
 * @page Auth Callback
 * @description Página de callback para procesar la autenticación de Google
 * @route /auth/callback
 */

"use client";

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';

function AuthCallbackContent() {
  const router = useRouter();
  
  useEffect(() => {
    const processAuth = () => {
      // Obtener parámetros de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userDataStr = urlParams.get('userData');

      console.log('🔍 [CALLBACK] URL params:', { token: token ? 'present' : 'missing', userData: userDataStr ? 'present' : 'missing' });

      if (token && userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          console.log('🔍 [CALLBACK] User data:', userData);

          // Establecer cookies en el dominio del frontend
          // Cookie HttpOnly para el JWT (aunque no es verdaderamente HttpOnly desde JS, es lo mejor que podemos hacer)
          document.cookie = `jwt=${token}; path=/; max-age=3600; secure; samesite=strict`;
          
          // Cookie con los datos del usuario
          document.cookie = `userData=${encodeURIComponent(JSON.stringify({
            email: userData.email,
            role: userData.role,
            nombre: userData.nombre,
            apellido: userData.apellido
          }))}; path=/; max-age=3600; secure; samesite=strict`;
          
          // Cookie con la foto del usuario
          if (userData.picture) {
            document.cookie = `userPicture=${encodeURIComponent(userData.picture)}; path=/; max-age=3600; secure; samesite=strict`;
          }

          console.log('🔍 [CALLBACK] Cookies set successfully');

          // Redirigir según el rol
          setTimeout(() => {
            if (userData.role === 'encargado') {
              router.push('/encargado');
            } else {
              router.push('/user-info');
            }
          }, 500);
          
        } catch (error) {
          console.error('🔍 [CALLBACK] Error processing auth data:', error);
          router.push('/?error=auth_error');
        }
      } else {
        console.error('🔍 [CALLBACK] Missing token or userData in URL');
        setTimeout(() => router.push('/?error=no_token'), 2000);
      }
    };

    processAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Procesando autenticación...</h2>
        <p className="text-gray-600">Por favor espere...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Cargando...</h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}