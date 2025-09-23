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
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {/* Modal de login */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 w-full max-w-md mx-auto hover-lift">
          {/* Logo y título */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <Image
                src="/logo-reservatec.png"
                alt="ReservaTec Logo"
                width={280}
                height={280}
                className="drop-shadow-lg"
              />
            </div>
            <p className="text-slate-600 text-base font-medium leading-relaxed tracking-wide">
              Sistema de Reservas de Áreas Deportivas
            </p>
          </div>

          {/* Botón de Google */}
          <Link href="/user-info">
            <button className="group w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-2xl py-4 px-6 flex items-center justify-center gap-4 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <GoogleIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-slate-700 font-semibold text-lg tracking-wide">Acceder con Google</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-10">
        <p className="text-center text-white/90 text-sm font-medium tracking-wide">
          © 2025 ReservaTec. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
