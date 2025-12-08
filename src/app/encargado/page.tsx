/**
 * @page Dashboard del Encargado
 * @description Página principal del panel del encargado
 * @route /encargado
 */

"use client";

import { useState, useEffect } from 'react';
import SidebarEncargado from '@/components/Sidebar/SidebarEncargado';
import { DashboardService, DashboardStats } from '@/services/dashboard.service';

export default function EncargadoDashboard() {
  const [currentPath] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadStats();
    // Refrescar cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await DashboardService.getStats();
      if (response.data) {
        setStats(response.data);
      }
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error al cargar estadísticas:', error);
      setError(error.message || 'Error al cargar las estadísticas del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarEncargado currentPath={currentPath} />
      
      {/* Contenido principal */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Panel de Control</h1>
              <p className="text-gray-600 mt-1">Gestiona las reservas y áreas deportivas</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Hola,</p>
                <p className="font-semibold text-gray-900">Encargado</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 lg:p-8">
          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button 
                    onClick={loadStats}
                    className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas Activas</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats?.reservasActivas || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas Pendientes</p>
                  {loading ? (
                    <div className="h-9 w-12 bg-gray-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.reservasPendientes || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                  {loading ? (
                    <div className="h-9 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.totalUsuarios || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Áreas Disponibles</p>
                  {loading ? (
                    <div className="h-9 w-12 bg-gray-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.areasDisponibles || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Secciones principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reservas recientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Reservas Recientes</h2>
                <p className="text-gray-600 mt-1">Últimas reservas realizadas</p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : stats?.reservasRecientes && stats.reservasRecientes.length > 0 ? (
                  <div className="space-y-4">
                    {stats.reservasRecientes.map((reserva, index) => (
                      <div key={reserva.id_reserva} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{reserva.area_nombre}</p>
                            <p className="text-sm text-gray-600">
                              Usuario: {reserva.usuario_nombre} {reserva.usuario_apellido}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {reserva.fecha_formato} {reserva.hora_inicio}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            reserva.estado === 'aceptado' 
                              ? 'bg-green-100 text-green-800' 
                              : reserva.estado === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {reserva.estado_texto}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">No hay reservas recientes</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actividad del sistema */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Actividad del Sistema</h2>
                <p className="text-gray-600 mt-1">Registro de actividades recientes</p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : stats?.actividadSistema && stats.actividadSistema.length > 0 ? (
                  <div className="space-y-4">
                    {stats.actividadSistema.map((activity, index) => {
                      const getActivityColor = (accion: string) => {
                        if (accion.includes('Nueva reserva') || accion.includes('aprobada')) return 'bg-green-500';
                        if (accion.includes('cancelada') || accion.includes('Reserva cancelada')) return 'bg-red-500';
                        if (accion.includes('Usuario registrado')) return 'bg-blue-500';
                        return 'bg-purple-500';
                      };
                      
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.accion)}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.accion}</p>
                            <p className="text-xs text-gray-600">{activity.usuario}</p>
                            <p className="text-xs text-gray-500">{activity.tiempo_relativo}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">No hay actividad reciente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
