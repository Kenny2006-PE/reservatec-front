/**
 * @page Auth Callback
 * @description Página de callback para procesar la autenticación de Google
 * @route /auth/callback
 */

"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/services/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    AuthService.handleAuthCallback()
      .then(() => router.push('/user-info'))
      .catch(() => router.push('/'));
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