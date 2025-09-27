/**
 * @page User Info Page
 * @description Página de información y perfil del usuario
 * @route /user-info
 * @protected Requiere autenticación
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SaveIcon, InfoIcon, UserIcon, CalendarIcon } from "@/components/Icons";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useUserPicture } from "@/hooks/useUserPicture";

export default function userinfo() {
  const router = useRouter();
  const userPicture = useUserPicture();
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
    
    // Aquí iría la lógica para guardar la información en el backend
    // Por ahora simularemos que se guardó correctamente
    
    // Mostrar mensaje de éxito (opcional)
    alert("¡Información guardada exitosamente! Ahora puedes realizar tus reservas.");
    
    // Redirigir a la página de reservas
    router.push("/reservas");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="user-info" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Mi Información Personal"
          description="Gestiona y actualiza tu perfil personal de forma segura"
          userImage={userPicture}
        />

        {/* Contenido del formulario */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Header del formulario */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins">Completa tu perfil</h2>
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-medium">Por favor completa tu información personal para acceder a todas las funcionalidades</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                  {/* Información Personal y Académica */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
                    {/* Información Personal */}
                    <div className="space-y-6 sm:space-y-8">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-poppins">Información Personal</h3>
                      </div>
                      
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3 font-poppins tracking-wide">
                            Nombre Completo
                          </label>
                          <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Ingresa tu nombre completo"
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3 font-poppins tracking-wide">
                            Apellidos
                          </label>
                          <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleInputChange}
                            placeholder="Ingresa tus apellidos"
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3 font-poppins tracking-wide">
                            Documento de Identidad (DNI)
                          </label>
                          <input
                            type="text"
                            name="dni"
                            value={formData.dni}
                            onChange={handleInputChange}
                            placeholder="12345678"
                            maxLength={8}
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Información Académica */}
                    <div className="space-y-6 sm:space-y-8">
                      <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-poppins">Información Académica</h3>
                      </div>
                      
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3 font-poppins tracking-wide">
                            Código Institucional
                          </label>
                          <input
                            type="text"
                            name="codigoInstitucional"
                            value={formData.codigoInstitucional}
                            onChange={handleInputChange}
                            placeholder="T12345678"
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2 sm:mb-3 font-poppins tracking-wide">
                            Carrera Profesional
                          </label>
                          <select
                            name="carrera"
                            value={formData.carrera}
                            onChange={handleInputChange}
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-sm hover:shadow-md appearance-none font-medium text-slate-900 text-sm sm:text-base"
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
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl lg:rounded-3xl p-6 sm:p-8 border-2 border-blue-100/60 shadow-lg">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 font-poppins">Información Médica</h3>
                    </div>
                    
                    <div className="space-y-6 sm:space-y-8">
                      <div>
                        <label className="block text-sm sm:text-base font-bold text-slate-700 mb-4 sm:mb-6 font-poppins">
                          ¿Tiene alguna condición médica que debamos considerar para las actividades deportivas?
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="condicionMedica"
                              value="Si"
                              checked={formData.condicionMedica === "Si"}
                              onChange={handleInputChange}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-blue-500 border-gray-300 mr-3 sm:mr-4"
                            />
                            <span className="text-sm sm:text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Sí, tengo una condición médica</span>
                          </label>
                          <label className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="condicionMedica"
                              value="No"
                              checked={formData.condicionMedica === "No"}
                              onChange={handleInputChange}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-blue-500 border-gray-300 mr-3 sm:mr-4"
                            />
                            <span className="text-sm sm:text-base font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">No tengo condiciones médicas</span>
                          </label>
                        </div>
                      </div>

                      {formData.condicionMedica === "Si" && (
                        <div className="animate-fadeIn">
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-3 sm:mb-4 font-poppins tracking-wide">
                            Describe detalladamente tu condición médica:
                          </label>
                          <textarea
                            name="tipoCondicion"
                            value={formData.tipoCondicion}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Por favor, describe brevemente tu condición médica, medicamentos que tomas, restricciones de actividad física, etc. Esta información nos ayudará a brindarte el mejor servicio y garantizar tu seguridad..."
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-none font-medium text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de guardar */}
                  <div className="flex justify-end pt-6 sm:pt-8 border-t-2 border-gray-100">
                    <button
                      type="submit"
                      className="group bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white py-4 sm:py-5 px-6 sm:px-10 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3 sm:gap-4 font-poppins"
                    >
                      <SaveIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
                      <span className="hidden sm:inline">Guardar Información Completa</span>
                      <span className="sm:hidden">Guardar</span>
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