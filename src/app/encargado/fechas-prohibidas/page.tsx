'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UploadExcel from '@/components/FechasProhibidas/UploadExcel';
import PreviewEventos from '@/components/FechasProhibidas/PreviewEventos';
import TablaEventos from '@/components/FechasProhibidas/TablaEventos';
import { useUserName } from '@/hooks/useUserName';
import { useUserPicture } from '@/hooks/useUserPicture';
import type { ResultadoProcesamiento } from '@/types/fechasProhibidas';

export default function FechasProhibidasPage() {
  const userName = useUserName();
  const userPicture = useUserPicture();
  const [modoPreview, setModoPreview] = useState(false);
  const [resultadoProcesamiento, setResultadoProcesamiento] = useState<ResultadoProcesamiento | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = (resultado: ResultadoProcesamiento) => {
    setResultadoProcesamiento(resultado);
    setModoPreview(true);
  };

  const handleGuardarExito = () => {
    setModoPreview(false);
    setResultadoProcesamiento(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancelar = () => {
    setModoPreview(false);
    setResultadoProcesamiento(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar currentPath="fechas-prohibidas" userType="encargado" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col w-full lg:w-auto overflow-hidden">
        <Header 
          title="Gestión de Fechas Prohibidas"
          description="Administra las fechas en las que no se permitirán reservas"
          userName={userName}
          userImage={userPicture}
          userType="encargado"
        />

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-4">
            {!modoPreview ? (
              <>
                {/* Sección de carga */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 sm:px-6 lg:px-8 py-4 sm:py-5 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-poppins">Cargar Eventos desde Excel</h2>
                      </div>
                      <p className="text-slate-200 text-xs sm:text-sm font-medium">
                        Sube un archivo Excel con las columnas: <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">evento</span>, <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">fecha_inicio</span>, <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">fecha_fin</span>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 lg:p-6">
                    <UploadExcel onUploadSuccess={handleUploadSuccess} />
                  </div>
                </div>

                {/* Tabla de eventos guardados */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 sm:px-6 lg:px-8 py-4 sm:py-5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-poppins">Eventos Registrados</h2>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 lg:p-6">
                    <TablaEventos refresh={refreshKey} />
                  </div>
                </div>

                {/* Instrucciones compactas */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 lg:p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-blue-900 mb-2">
                        Formato requerido del Excel
                      </h3>
                      <p className="text-xs text-blue-800 mb-3">
                        Columnas: <span className="font-mono bg-white/60 px-1.5 py-0.5 rounded">evento</span>, <span className="font-mono bg-white/60 px-1.5 py-0.5 rounded">fecha_inicio</span>, <span className="font-mono bg-white/60 px-1.5 py-0.5 rounded">fecha_fin</span>
                      </p>
                      
                      <div className="bg-white rounded-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">💡 Ejemplo de estructura:</p>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-1 px-2 font-semibold text-gray-700">Evento</th>
                              <th className="text-left py-1 px-2 font-semibold text-gray-700">Fecha Inicio</th>
                              <th className="text-left py-1 px-2 font-semibold text-gray-700">Fecha Fin</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600">
                            <tr className="border-b border-gray-100">
                              <td className="py-1 px-2">Mantenimiento</td>
                              <td className="py-1 px-2">01/12/2024</td>
                              <td className="py-1 px-2">15/12/2024</td>
                            </tr>
                            <tr>
                              <td className="py-1 px-2">Torneo Nacional</td>
                              <td className="py-1 px-2">20/01/2025</td>
                              <td className="py-1 px-2">22/01/2025</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600">✓</span>
                          <span>Duración máx: 1 año</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-blue-600">✓</span>
                          <span>Tamaño máx: 5MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Vista de preview */
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins">Vista Previa de Eventos</h2>
                      <p className="text-slate-200 text-sm mt-1">Revisa los eventos extraídos del archivo</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 lg:p-10">
                  {resultadoProcesamiento && (
                    <PreviewEventos
                      eventos={resultadoProcesamiento.eventos}
                      errores={resultadoProcesamiento.errors}
                      onGuardarExito={handleGuardarExito}
                      onCancelar={handleCancelar}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
