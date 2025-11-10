'use client';

import { useState } from 'react';
import type { EventoPreview, ErrorEvento } from '@/types/fechasProhibidas';
import { guardarEventosBatch } from '@/services/fechasProhibidas';

interface PreviewEventosProps {
  eventos: EventoPreview[];
  errores: ErrorEvento[];
  onGuardarExito: () => void;
  onCancelar: () => void;
}

export default function PreviewEventos({
  eventos: eventosIniciales,
  errores,
  onGuardarExito,
  onCancelar
}: PreviewEventosProps) {
  const [eventos, setEventos] = useState<EventoPreview[]>(eventosIniciales);
  const [isGuardando, setIsGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calcularDias = (fechaInicio: string, fechaFin: string): number => {
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const fin = new Date(fechaFin + 'T00:00:00');
    const diff = fin.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const eliminarEvento = (index: number) => {
    setEventos(eventos.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    if (eventos.length === 0) {
      setError('No hay eventos para guardar');
      return;
    }

    setIsGuardando(true);
    setError(null);

    try {
      await guardarEventosBatch(eventos);
      onGuardarExito();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al guardar los eventos');
    } finally {
      setIsGuardando(false);
    }
  };

  return (
    <div className="w-full">
      {/* Resumen */}
      <div className="mb-4 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-6">
          <div>
            <p className="text-sm text-gray-600">Eventos válidos</p>
            <p className="text-2xl font-bold text-blue-600">{eventos.length}</p>
          </div>
          {errores.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">Errores encontrados</p>
              <p className="text-2xl font-bold text-red-600">{errores.length}</p>
            </div>
          )}
        </div>
      </div>

      {/* Errores */}
      {errores.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-semibold text-red-800 mb-2">
            Errores en el archivo:
          </h3>
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {errores.map((err, index) => (
              <li key={index} className="text-xs text-red-600">
                <span className="font-medium">Fila {err.fila}:</span> {err.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabla de eventos */}
      {eventos.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Días
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventos.map((evento, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {evento.nombre_evento}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatearFecha(evento.fecha_inicio)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatearFecha(evento.fecha_fin)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {calcularDias(evento.fecha_inicio, evento.fecha_fin)} días
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => eliminarEvento(index)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      title="Eliminar evento"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No hay eventos válidos para mostrar
        </div>
      )}

      {/* Error al guardar */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onCancelar}
          disabled={isGuardando}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={isGuardando || eventos.length === 0}
          className={`
            px-6 py-2 rounded-lg font-medium text-white
            ${isGuardando || eventos.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
            }
          `}
        >
          {isGuardando ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Guardando...
            </span>
          ) : (
            `Guardar ${eventos.length} evento${eventos.length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  );
}
