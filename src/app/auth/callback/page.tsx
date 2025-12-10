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
    // Verificar si las cookies llegaron
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const userData = getCookie('userData');
    const jwt = getCookie('jwt');

    console.log('🔍 [CALLBACK] Cookies received:', { userData, jwt: jwt ? 'present' : 'missing' });

    if (userData && jwt) {
      try {
        const parsed = JSON.parse(decodeURIComponent(userData));
        console.log('🔍 [CALLBACK] User role:', parsed.role);
        
        // Redirigir según el rol
        if (parsed.role === 'encargado') {
          router.push('/encargado');
        } else {
          router.push('/user-info');
        }
      } catch (error) {
        console.error('🔍 [CALLBACK] Error parsing userData:', error);
        router.push('/');
      }
    } else {
      console.error('🔍 [CALLBACK] Missing cookies, redirecting to login');
      setTimeout(() => router.push('/?error=no_cookies'), 2000);
    }
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