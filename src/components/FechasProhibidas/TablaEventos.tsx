'use client';

import { useState, useEffect } from 'react';
import type { FechaProhibida } from '@/types/fechasProhibidas';
import { obtenerFechasProhibidas, eliminarFechaProhibida } from '@/services/fechasProhibidas';

interface TablaEventosProps {
  refresh: number;
}

export default function TablaEventos({ refresh }: TablaEventosProps) {
  const [eventos, setEventos] = useState<FechaProhibida[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<FechaProhibida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [eventoAEliminar, setEventoAEliminar] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const cargarEventos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerFechasProhibidas();
      setEventos(data);
      setEventosFiltrados(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar los eventos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, [refresh]);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setEventosFiltrados(eventos);
    } else {
      const busquedaLower = busqueda.toLowerCase();
      const filtrados = eventos.filter(evento =>
        evento.nombre_evento.toLowerCase().includes(busquedaLower) ||
        evento.descripcion?.toLowerCase().includes(busquedaLower)
      );
      setEventosFiltrados(filtrados);
    }
  }, [busqueda, eventos]);

  const formatearFecha = (fecha: string): string => {
    const [year, month, day] = fecha.split('T')[0].split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calcularDias = (fechaInicio: string, fechaFin: string): number => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diff = fin.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const confirmarEliminacion = (id: number) => {
    setEventoAEliminar(id);
  };

  const handleEliminar = async () => {
    if (!eventoAEliminar) return;

    setIsDeleting(true);
    try {
      await eliminarFechaProhibida(eventoAEliminar);
      await cargarEventos();
      setEventoAEliminar(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar el evento');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelarEliminacion = () => {
    setEventoAEliminar(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header con búsqueda */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Eventos Registrados
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''} encontrado{eventosFiltrados.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar evento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Tabla */}
      {eventosFiltrados.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventosFiltrados.map((evento) => {
                const hoy = new Date();
                const fechaInicio = new Date(evento.fecha_inicio);
                const fechaFin = new Date(evento.fecha_fin);
                const estaActivo = hoy >= fechaInicio && hoy <= fechaFin;
                const esFuturo = hoy < fechaInicio;

                return (
                  <tr key={evento.id_fecha_prohibida} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {evento.nombre_evento}
                      </div>
                      {evento.descripcion && (
                        <div className="text-xs text-gray-500 mt-1">
                          {evento.descripcion}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatearFecha(evento.fecha_inicio)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatearFecha(evento.fecha_fin)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {calcularDias(evento.fecha_inicio, evento.fecha_fin)} días
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {estaActivo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          En curso
                        </span>
                      ) : esFuturo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Próximo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Finalizado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => confirmarEliminacion(evento.id_fecha_prohibida)}
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
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {busqueda ? 'No se encontraron eventos con ese término' : 'No hay eventos registrados'}
          </p>
        </div>
      )}

      {/* Modal de confirmación */}
      {eventoAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar eliminación
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarEliminacion}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={isDeleting}
                className={`
                  px-4 py-2 rounded-lg font-medium text-white
                  ${isDeleting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                  }
                `}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
