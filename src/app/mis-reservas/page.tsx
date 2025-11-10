/**
 * @page Mis Reservas - Estudiante
 * @description Página para ver todas las reservas del estudiante con sus estados
 * @route /mis-reservas
 * @protected Requiere autenticación de estudiante
 */

"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useUserPicture } from '@/hooks/useUserPicture';
import { ReservationService } from '@/services/reservation.service';
import { Reserva } from '@/types/reservation.types';
import { CalendarIcon, ClockIcon, UsersIcon, XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@/components/Icons';

export default function MisReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<number | null>(null);
  const userPicture = useUserPicture();

  useEffect(() => {
    cargarMisReservas();
  }, []);

  const cargarMisReservas = async () => {
    try {
      setLoading(true);
      const response = await ReservationService.getMisReservas();
      setReservas(response.data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarReserva = async (reservaId: number) => {
    try {
      await ReservationService.cancelarReserva(reservaId);
      setShowCancelModal(false);
      setSelectedReserva(null);
      // Recargar las reservas para mostrar el cambio
      await cargarMisReservas();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'Fecha no disponible';
    // Manejo de fecha en formato YYYY-MM-DD desde MySQL
    const [year, month, day] = fecha.split('T')[0].split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEstadoConfig = (estado: string) => {
    const configs = {
      'pendiente': {
        color: '#f59e0b',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        icon: ClockIcon,
        texto: 'Pendiente'
      },
      'aceptado': {
        color: '#10b981',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        icon: CheckCircleIcon,
        texto: 'Aceptada'
      },
      'cancelado': {
        color: '#ef4444',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: XCircleIcon,
        texto: 'Cancelada'
      },
      'rechazado': {
        color: '#ef4444',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        icon: XCircleIcon,
        texto: 'Rechazada'
      },
      'finalizado': {
        color: '#374151',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
        icon: CheckCircleIcon,
        texto: 'Finalizada'
      }
    };
    return configs[estado as keyof typeof configs] || configs.pendiente;
  };

  const getAreaColor = (areaNombre: string) => {
    const colores = {
      'Fútbol 1': '#10b981',
      'Fútbol 2': '#3b82f6',
      'Frontón': '#8b5cf6',
      'Futsal/Vóley/Básket': '#f59e0b',
      'Ludoteca': '#ec4899',
      'Ping Pong': '#14b8a6'
    };
    return colores[areaNombre as keyof typeof colores] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
        <Sidebar currentPath="mis-reservas" userType="estudiante" />
        <div className="flex-1 flex flex-col">
          <Header title="Mis Reservas" description="Gestiona tus reservas deportivas" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Cargando mis reservas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="mis-reservas" userType="estudiante" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Mis Reservas"
          description="Gestiona todas tus reservas deportivas"
          userImage={userPicture}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {['pendiente', 'aceptado', 'cancelado', 'finalizado'].map((estado) => {
                const count = reservas.filter(r => r.estado === estado).length;
                const config = getEstadoConfig(estado);
                const IconComponent = config.icon;
                
                return (
                  <div key={estado} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${config.textColor.replace('text-', 'text-').replace('-800', '-600')}`} />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900 font-poppins">{count}</p>
                        <p className="text-slate-600 text-sm">{config.texto}s</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lista de reservas */}
            <div className="space-y-6">
              {reservas.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">No tienes reservas</h3>
                  <p className="text-slate-600">Haz tu primera reserva para empezar a usar las instalaciones deportivas.</p>
                </div>
              ) : (
                reservas.map((reserva) => {
                  const estadoConfig = getEstadoConfig(reserva.estado);
                  const IconEstado = estadoConfig.icon;
                  
                  return (
                    <div key={reserva.id_reserva} className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover-lift">
                      
                      {/* Header de la reserva */}
                      <div 
                        className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white relative"
                        style={{ 
                          background: `linear-gradient(135deg, ${getAreaColor(reserva.area_nombre || '')} 0%, ${getAreaColor(reserva.area_nombre || '')}dd 100%)` 
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold font-poppins mb-2">{reserva.area_nombre}</h3>
                            <p className="text-white/90 text-sm sm:text-base">
                              {formatearFecha(reserva.fecha)} • {reserva.horario_inicio} - {reserva.horario_fin}
                            </p>
                          </div>
                          <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${estadoConfig.bgColor} ${estadoConfig.textColor} border ${estadoConfig.borderColor}`}>
                            <IconEstado className="w-4 h-4 mr-2" />
                            {estadoConfig.texto}
                          </div>
                        </div>
                      </div>

                      {/* Contenido de la reserva */}
                      <div className="p-6 sm:p-8 lg:p-10">
                        
                        {/* Información de la reserva */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-500 mb-1">Participantes</p>
                            <div className="flex items-center">
                              <UsersIcon className="w-4 h-4 text-slate-600 mr-2" />
                              <p className="font-bold text-slate-900 font-poppins">{reserva.participantes}</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-500 mb-1">Material Deportivo</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                              reserva.material 
                                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {reserva.material ? 'Solicitado' : 'No solicitado'}
                            </span>
                          </div>

                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-500 mb-1">Fecha de la Reserva</p>
                            <p className="font-bold text-slate-900 font-poppins text-sm">
                              {formatearFecha(reserva.fecha)}
                            </p>
                          </div>
                        </div>

                        {/* Comentario del encargado (si existe) */}
                        {reserva.comentario_encargado && (
                          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <h4 className="text-sm font-bold text-amber-800 mb-2">Comentario del Encargado:</h4>
                            <p className="text-sm text-amber-700">{reserva.comentario_encargado}</p>
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex items-center justify-end">
                          {reserva.estado === 'pendiente' && (
                            <button
                              onClick={() => {
                                setSelectedReserva(reserva.id_reserva);
                                setShowCancelModal(true);
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center"
                            >
                              <XCircleIcon className="w-4 h-4 mr-2" />
                              Cancelar Reserva
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Confirmar Cancelación</h3>
              <p className="text-slate-600 mb-6">
                ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedReserva(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  No, mantener
                </button>
                <button
                  onClick={() => selectedReserva && handleCancelarReserva(selectedReserva)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}