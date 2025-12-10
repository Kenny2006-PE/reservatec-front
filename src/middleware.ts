/**
 * @file Middleware de Autenticación
 * @description Protege las rutas que requieren autenticación y verifica roles
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación de estudiante
const protectedStudentRoutes = ['/user-info', '/reservas', '/mis-reservas'];
// Rutas del encargado que requieren rol de encargado
const encargadoRoutes = ['/encargado'];
// Rutas que solo son accesibles sin autenticación
const authRoutes = ['/'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');
  const userData = request.cookies.get('userData');
  const { pathname } = request.nextUrl;

  // Si no hay token y está tratando de acceder a rutas protegidas
  if (!token || !userData) {
    if (protectedStudentRoutes.some(route => pathname.startsWith(route)) ||
        encargadoRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  try {
    // Obtener el rol del usuario desde la cookie userData (no verificamos el JWT aquí)
    const userDataParsed = JSON.parse(userData.value);
    const userRole = userDataParsed.role as string;

    console.log('🔍 Middleware - User role:', userRole, 'Path:', pathname);

    // Si está en la página de login y tiene token válido, redirigir según rol
    if (authRoutes.includes(pathname)) {
      if (userRole === 'encargado') {
        return NextResponse.redirect(new URL('/encargado', request.url));
      } else {
        return NextResponse.redirect(new URL('/user-info', request.url));
      }
    }

    // Proteger rutas del encargado - solo accesibles por encargados
    if (encargadoRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'encargado') {
        // Si no es encargado, redirigir a la vista de estudiante
        return NextResponse.redirect(new URL('/user-info', request.url));
      }
    }

    // Proteger rutas de estudiante - no accesibles por encargados
    if (protectedStudentRoutes.some(route => pathname.startsWith(route))) {
      if (userRole === 'encargado') {
        // Si es encargado tratando de acceder a rutas de estudiante, redirigir al panel
        return NextResponse.redirect(new URL('/encargado', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Si hay error parseando userData, limpiar cookies y redirigir al login
    console.error('Error en middleware:', error);
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('jwt');
    response.cookies.delete('userData');
    response.cookies.delete('userPicture');
    return response;
  }
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