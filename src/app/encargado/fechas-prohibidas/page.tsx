'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UploadExcel from '@/components/FechasProhibidas/UploadExcel';
import PreviewEventos from '@/components/FechasProhibidas/PreviewEventos';
import TablaEventos from '@/components/FechasProhibidas/TablaEventos';
import type { ResultadoProcesamiento } from '@/types/fechasProhibidas';

export default function FechasProhibidasPage() {
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
        />

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {!modoPreview ? (
              <>
                {/* Sección de carga */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins">Cargar Eventos desde Excel</h2>
                      </div>
                      <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-medium">
                        Sube un archivo Excel con las columnas: <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">evento</span>, <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">fecha_inicio</span>, <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">fecha_fin</span>
                      </p>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 lg:p-10">
                    <UploadExcel onUploadSuccess={handleUploadSuccess} />
                  </div>
                </div>

                {/* Tabla de eventos guardados */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins">Eventos Registrados</h2>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 lg:p-10">
                    <TablaEventos refresh={refreshKey} />
                  </div>
                </div>

                {/* Instrucciones */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 lg:p-8">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Formato del archivo Excel
                  </h3>
                  <ul className="space-y-3 text-sm text-blue-800">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><strong>Primera fila:</strong> Encabezados de columnas (evento/nombre, fecha_inicio/desde, fecha_fin/hasta)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><strong>Formato de fechas:</strong> Cualquier formato reconocible (DD/MM/YYYY, YYYY-MM-DD, etc.)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><strong>Validaciones:</strong> La fecha de fin debe ser posterior o igual a la fecha de inicio</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><strong>Duración máxima:</strong> 1 año por evento</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><strong>Tamaño máximo:</strong> 5MB</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-blue-200">
                    <p className="text-sm text-blue-900 font-semibold mb-3">
                      💡 Ejemplo de estructura:
                    </p>
                    <div className="bg-white rounded-lg p-4 font-mono text-xs">
                      <div className="grid grid-cols-3 gap-4 font-bold mb-2 text-gray-700">
                        <span>Evento</span>
                        <span>Fecha Inicio</span>
                        <span>Fecha Fin</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-gray-600 mb-1">
                        <span>Mantenimiento</span>
                        <span>01/12/2024</span>
                        <span>15/12/2024</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-gray-600">
                        <span>Torneo Nacional</span>
                        <span>20/01/2025</span>
                        <span>22/01/2025</span>
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
