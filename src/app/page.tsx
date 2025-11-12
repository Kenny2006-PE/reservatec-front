/**
 * @page Login Page
 * @description Página principal de autenticación con Google
 * @route / (root)
 * @public Acceso público
 */

"use client";

import Image from "next/image";
import { GoogleIcon } from "@/components/Icons";
import { AuthService } from "@/services/auth";

export default function Home() {
  return (
    <div className="min-h-screen relative font-inter">
      {/* Fondo de imagen */}
      <div className="absolute inset-0">
        <Image
          src="/bg-reservatec.jpeg"
          alt="Campus background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-blue-900/70" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Modal de login */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 lg:p-12 w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto hover-lift">
          {/* Logo y título */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Image
                src="/logo-reservatec.png"
                alt="ReservaTec Logo"
                width={500}
                height={120}
                className="drop-shadow-lg object-contain max-w-full h-auto"
              />
            </div>
            <p className="text-slate-600 text-base sm:text-lg lg:text-xl font-medium leading-relaxed tracking-wide px-4">
              Sistema de Reservas de Áreas Deportivas
            </p>
          </div>

          {/* Acceso con Google */}
          <div className="space-y-4 sm:space-y-5">
            {/* Título */}
            <div className="text-center mb-6">
              <h3 className="text-slate-700 font-semibold text-lg sm:text-xl mb-2">Iniciar Sesión</h3>
              <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>

            {/* Botón de Acceso con Google */}
            <button 
              onClick={() => AuthService.initiateGoogleLogin()}
              className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-2 border-blue-600 hover:border-blue-700 rounded-xl sm:rounded-2xl py-5 sm:py-6 lg:py-7 px-6 sm:px-8 flex items-center justify-center gap-4 sm:gap-5 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-white"
            >
              <GoogleIcon className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-left">
                <div className="font-semibold text-xl sm:text-2xl lg:text-3xl tracking-wide">Acceder con Google</div>
                <div className="text-blue-100 text-sm sm:text-base">Estudiantes y encargados</div>
              </div>
            </button>

            {/* Nota informativa */}
            <div className="text-center mt-6 px-4">
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Utiliza tu cuenta institucional de Google para acceder al sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-10 px-4">
        <p className="text-center text-white/90 text-xs sm:text-sm font-medium tracking-wide">
          © 2025 ReservaTec. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
