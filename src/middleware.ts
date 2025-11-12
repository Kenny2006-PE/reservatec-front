/**
 * @file Middleware de Autenticación
 * @description Protege las rutas que requieren autenticación y verifica roles
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Rutas que requieren autenticación de estudiante
const protectedStudentRoutes = ['/user-info', '/reservas', '/mis-reservas'];
// Rutas del encargado que requieren rol de encargado
const encargadoRoutes = ['/encargado'];
// Rutas que solo son accesibles sin autenticación
const authRoutes = ['/'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');
  const { pathname } = request.nextUrl;

  // Si no hay token y está tratando de acceder a rutas protegidas
  if (!token) {
    if (protectedStudentRoutes.some(route => pathname.startsWith(route)) ||
        encargadoRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  try {
    // Verificar el token y extraer el rol
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
    const { payload } = await jwtVerify(token.value, secret);
    const userRole = payload.role as string;

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
    // Si el token es inválido, limpiar cookies y redirigir al login
    console.error('Error verificando token:', error);
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