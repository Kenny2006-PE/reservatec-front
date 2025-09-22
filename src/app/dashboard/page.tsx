"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarIcon, UserIcon, LogOutIcon, SaveIcon, InfoIcon, ChevronRightIcon } from "@/components/Icons";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    codigoInstitucional: "",
    carrera: "",
    condicionMedica: "No",
    tipoCondicion: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    // Aquí iría la lógica para guardar la información
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex font-inter">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700/50">
        {/* Header del sidebar */}
        <div className="p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          <div className="flex items-center justify-center">
            <Image
              src="/logo-blanco-dashboard.png"
              alt="ReservaTec Logo"
              width={200}
              height={65}
              className="object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 px-6 py-8">
          <div className="space-y-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-8 font-poppins">
              Navegación Principal
            </div>
            
            <Link href="#" className="group flex items-center gap-5 px-6 py-5 rounded-2xl hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-300 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-base">Reservas</span>
                <span className="text-sm text-slate-400 group-hover:text-slate-300 font-medium">Gestiona tus reservas deportivas</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
            </Link>
            
            <Link href="#" className="group flex items-center gap-5 px-6 py-5 rounded-2xl bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-white font-poppins text-base">Mi Información</span>
                <span className="text-sm text-emerald-300 font-medium">Perfil personal y configuración</span>
              </div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg"></div>
            </Link>
          </div>
        </nav>

        {/* Cerrar sesión */}
        <div className="px-6 py-8 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30 mt-auto">
          <Link href="/">
            <button className="group flex items-center gap-5 px-6 py-5 rounded-2xl hover:bg-red-500/10 transition-all duration-300 w-full text-left border border-transparent hover:border-red-500/30 hover:shadow-lg">
              <div className="w-12 h-12 bg-slate-700/80 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-all duration-300">
                <LogOutIcon className="w-6 h-6 text-slate-300 group-hover:text-red-400" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-semibold text-slate-100 group-hover:text-red-400 font-poppins text-base">Cerrar Sesión</span>
                <span className="text-sm text-slate-400 group-hover:text-red-300 font-medium">Salir del sistema de forma segura</span>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-200" />
            </button>
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 font-poppins">Mi Información Personal</h1>
              <p className="text-slate-600 font-medium tracking-wide">Gestiona y actualiza tu perfil personal de forma segura</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-base font-semibold text-slate-900 font-poppins">Usuario Demo</p>
                <p className="text-sm text-slate-500 font-medium">Estudiante Activo</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg font-poppins">
                UD
              </div>
            </div>
          </div>
        </header>

        {/* Contenido del formulario */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Header del formulario */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-10 py-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <InfoIcon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold font-poppins">Completa tu perfil</h2>
                  </div>
                  <p className="text-slate-200 text-lg font-medium">Por favor completa tu información personal para acceder a todas las funcionalidades</p>
                </div>
              </div>

              <div className="p-10">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Información Personal y Académica */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Información Personal */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 font-poppins">Información Personal</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 font-poppins tracking-wide">
                            Nombre Completo
                          </label>
                          <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu nombre completo"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 font-poppins tracking-wide">
                            Apellidos
                          </label>
                          <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleInputChange}
                            placeholder="Ingresa tus apellidos"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 font-poppins tracking-wide">
                            Documento de Identidad (DNI)
                          </label>
                          <input
                            type="text"
                            name="dni"
                            value={formData.dni}
                            onChange={handleInputChange}
                            placeholder="12345678"
                            maxLength={8}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información Académica */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 font-poppins">Información Académica</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 font-poppins tracking-wide">
                            Código Institucional
                          </label>
                          <input
                            type="text"
                            name="codigoInstitucional"
                            value={formData.codigoInstitucional}
                            onChange={handleInputChange}
                            placeholder="T12345678"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 font-poppins tracking-wide">
                            Carrera Profesional
                          </label>
                          <select
                            name="carrera"
                            value={formData.carrera}
                            onChange={handleInputChange}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md appearance-none font-medium text-slate-900"
                          >
                            <option value="" className="text-slate-400">Selecciona tu carrera profesional</option>
                            <option value="sistemas" className="text-slate-900">Ingeniería de Sistemas</option>
                            <option value="industrial" className="text-slate-900">Ingeniería Industrial</option>
                            <option value="civil" className="text-slate-900">Ingeniería Civil</option>
                            <option value="electronica" className="text-slate-900">Ingeniería Electrónica</option>
                            <option value="mecanica" className="text-slate-900">Ingeniería Mecánica</option>
                            <option value="mecatronica" className="text-slate-900">Ingeniería Mecatrónica</option>
                            <option value="software" className="text-slate-900">Ingeniería de Software</option>
                            <option value="otros" className="text-slate-900">Otras Carreras</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información Médica */}
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-100/60 shadow-lg">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 font-poppins">Información Médica</h3>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="block text-base font-bold text-slate-700 mb-6 font-poppins">
                          ¿Tiene alguna condición médica que debamos considerar para las actividades deportivas?
                        </label>
                        <div className="flex gap-8">
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="condicionMedica"
                              value="Si"
                              checked={formData.condicionMedica === "Si"}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 mr-4"
                            />
                            <span className="text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Sí, tengo una condición médica</span>
                          </label>
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="condicionMedica"
                              value="No"
                              checked={formData.condicionMedica === "No"}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 mr-4"
                            />
                            <span className="text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">No tengo condiciones médicas</span>
                          </label>
                        </div>
                      </div>

                      {formData.condicionMedica === "Si" && (
                        <div className="animate-fadeIn">
                          <label className="block text-sm font-bold text-slate-700 mb-4 font-poppins tracking-wide">
                            Describe detalladamente tu condición médica:
                          </label>
                          <textarea
                            name="tipoCondicion"
                            value={formData.tipoCondicion}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Por favor, describe brevemente tu condición médica, medicamentos que tomas, restricciones de actividad física, etc. Esta información nos ayudará a brindarte el mejor servicio y garantizar tu seguridad..."
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-none font-medium text-slate-900 placeholder:text-slate-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de guardar */}
                  <div className="flex justify-end pt-8 border-t-2 border-gray-100">
                    <button
                      type="submit"
                      className="group bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white py-5 px-10 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-4 font-poppins"
                    >
                      <SaveIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      Guardar Información Completa
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}