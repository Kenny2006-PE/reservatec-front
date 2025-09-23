import Image from "next/image";
import Link from "next/link";
import { GoogleIcon } from "@/components/Icons";

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

          {/* Botón de Google */}
          <Link href="/user-info">
            <button className="group w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl sm:rounded-2xl py-4 sm:py-5 lg:py-6 px-6 sm:px-8 flex items-center justify-center gap-4 sm:gap-5 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <GoogleIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-slate-700 font-semibold text-lg sm:text-xl lg:text-2xl tracking-wide">Acceder con Google</span>
            </button>
          </Link>
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
