'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Fechas Prohibidas
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Administra las fechas en las que no se permitirán reservas debido a eventos especiales
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-8">
          {!modoPreview ? (
            <>
              {/* Sección de carga */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cargar Eventos desde Excel
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Sube un archivo Excel con las columnas: <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">evento</span>, <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">fecha_inicio</span>, <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">fecha_fin</span>
                  </p>
                </div>
                <UploadExcel onUploadSuccess={handleUploadSuccess} />
              </div>

              {/* Tabla de eventos guardados */}
              <div className="bg-white rounded-lg shadow p-6">
                <TablaEventos refresh={refreshKey} />
              </div>
            </>
          ) : (
            /* Vista de preview */
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Vista Previa de Eventos
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Revisa los eventos extraídos del archivo. Puedes eliminar los que no desees guardar.
                </p>
              </div>
              {resultadoProcesamiento && (
                <PreviewEventos
                  eventos={resultadoProcesamiento.eventos}
                  errores={resultadoProcesamiento.errors}
                  onGuardarExito={handleGuardarExito}
                  onCancelar={handleCancelar}
                />
              )}
            </div>
          )}
        </div>

        {/* Instrucciones */}
        {!modoPreview && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">
              📋 Formato del archivo Excel
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Primera fila:</strong> Encabezados de columnas (evento/nombre, fecha_inicio/desde, fecha_fin/hasta)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Formato de fechas:</strong> Cualquier formato reconocible (DD/MM/YYYY, YYYY-MM-DD, etc.)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Validaciones:</strong> La fecha de fin debe ser posterior o igual a la fecha de inicio</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Duración máxima:</strong> 1 año por evento</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Tamaño máximo:</strong> 5MB</span>
              </li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>💡 Ejemplo de estructura:</strong>
              </p>
              <div className="mt-2 bg-white rounded p-3 font-mono text-xs">
                <div className="grid grid-cols-3 gap-4 font-bold mb-1">
                  <span>Evento</span>
                  <span>Fecha Inicio</span>
                  <span>Fecha Fin</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-gray-600">
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
        )}
      </div>
    </div>
  );
}
