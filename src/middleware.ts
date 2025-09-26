/**
 * @file Middleware de Autenticación
 * @description Protege las rutas que requieren autenticación
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/user-info', '/reservas'];
// Rutas que solo son accesibles sin autenticación
const authRoutes = ['/'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');
  const { pathname } = request.nextUrl;

  // Redirige a login si intenta acceder a ruta protegida sin autenticación
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirige a user-info si intenta acceder a login estando autenticado
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/user-info', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};