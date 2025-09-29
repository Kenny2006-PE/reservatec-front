/**
 * @file Middleware de Autenticación
 * @description Protege las rutas que requieren autenticación
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación de estudiante
const protectedStudentRoutes = ['/user-info', '/reservas', '/mis-reservas'];
// Rutas del encargado (por ahora permitidas sin autenticación específica)
const encargadoRoutes = ['/encargado'];
// Rutas que solo son accesibles sin autenticación
const authRoutes = ['/'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');
  const { pathname } = request.nextUrl;

  // Permitir acceso a rutas del encargado (sin autenticación por ahora)
  if (encargadoRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirige a login si intenta acceder a ruta protegida de estudiante sin autenticación
  if (protectedStudentRoutes.some(route => pathname.startsWith(route)) && !token) {
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