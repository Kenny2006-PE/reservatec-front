/**
 * @page Reservas Pendientes - Encargado
 * @description Página para gestionar las solicitudes de reserva pendientes
 * @route /encargado/reservas-pendientes
 */

"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ReservationService } from '@/services/reservation.service';
import { Reserva } from '@/types/reservation.types';
import { CheckCircleIcon, XCircleIcon } from '@/components/Icons';

export default function ReservasPendientesPage() {
  const [reservasPendientes, setReservasPendientes] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<number | null>(null);
  const [comentarioRechazo, setComentarioRechazo] = useState('');

  // Cargar reservas pendientes al montar el componente
  useEffect(() => {
    cargarReservasPendientes();
  }, []);

  const cargarReservasPendientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ReservationService.getReservasPendientes();
      setReservasPendientes(response.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al cargar reservas');
      console.error('Error cargando reservas pendientes:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleAceptar = async (reservaId: number) => {
    try {
      await ReservationService.aceptarReserva(reservaId);
      
      // Remover la reserva de la lista de pendientes
      setReservasPendientes(prev => prev.filter(r => r.id_reserva !== reservaId));
      alert('Reserva aceptada exitosamente');
    } catch (error) {
      alert('Error al aceptar la reserva: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      console.error(error);
    }
  };

  const handleRechazar = (reservaId: number) => {
    setSelectedReserva(reservaId);
    setShowRejectModal(true);
  };

  const confirmarRechazo = async () => {
    if (!selectedReserva || !comentarioRechazo.trim()) return;

    try {
      await ReservationService.rechazarReserva(selectedReserva, comentarioRechazo);
      
      // Remover la reserva de la lista de pendientes
      setReservasPendientes(prev => prev.filter(r => r.id_reserva !== selectedReserva));
      setShowRejectModal(false);
      setSelectedReserva(null);
      setComentarioRechazo('');
      alert('Reserva rechazada exitosamente');
    } catch (error) {
      alert('Error al rechazar la reserva: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      console.error(error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="reservas-pendientes" userType="encargado" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Reservas Pendientes"
          description="Gestiona las solicitudes de reserva de los usuarios"
        />

        {/* Contenido */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            {/* Estado de carga */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Cargando reservas pendientes...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Lista de reservas pendientes */}
            {!loading && !error && (
              <div className="space-y-6">
                {reservasPendientes.length === 0 ? (
                  <div className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 p-6 sm:p-8 lg:p-12 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <CheckCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 font-poppins">No hay reservas pendientes</h3>
                    <p className="text-slate-600 text-sm sm:text-base">Todas las reservas han sido procesadas.</p>
                  </div>
                ) : (
                  reservasPendientes.map((reserva) => (
                    <div key={reserva.id_reserva} className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                      
                      {/* Header de la reserva */}
                      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold font-poppins mb-1 sm:mb-2 truncate">{reserva.area_nombre}</h3>
                            <p className="text-slate-200 text-xs sm:text-sm lg:text-base break-words">
                              <span className="block sm:inline">{formatearFecha(reserva.fecha)}</span>
                              <span className="hidden sm:inline mx-1">•</span>
                              <span className="block sm:inline">{reserva.horario_inicio} - {reserva.horario_fin}</span>
                            </p>
                          </div>
                          <span className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shrink-0">
                            Pendiente
                          </span>
                        </div>
                      </div>

                      {/* Contenido de la reserva */}
                      <div className="p-4 sm:p-6 lg:p-8">
                        
                        {/* Información del estudiante */}
                        <div className="mb-6 sm:mb-8">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 font-poppins">Información del Estudiante</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200">
                              <p className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">Estudiante</p>
                              <p className="font-bold text-slate-900 font-poppins text-sm sm:text-base truncate">
                                {reserva.usuario_nombre} {reserva.usuario_apellido}
                              </p>
                            </div>
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200">
                              <p className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">DNI</p>
                              <p className="font-bold text-slate-900 font-poppins text-sm sm:text-base">{reserva.usuario_dni}</p>
                            </div>
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200">
                              <p className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">Participantes</p>
                              <p className="font-bold text-slate-900 font-poppins text-sm sm:text-base">{reserva.participantes}</p>
                            </div>
                          </div>
                        </div>

                        {/* Material deportivo */}
                        <div className="mb-6 sm:mb-8">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 font-poppins">Material Deportivo</h4>
                          <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold ${
                            reserva.material 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {reserva.material ? 'Solicitado' : 'No solicitado'}
                          </span>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <button 
                            onClick={() => handleRechazar(reserva.id_reserva)}
                            className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-poppins"
                          >
                            <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="truncate">Rechazar Solicitud</span>
                          </button>
                          <button 
                            onClick={() => handleAceptar(reserva.id_reserva)}
                            className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-poppins"
                          >
                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="truncate">Aceptar Reserva</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-3 sm:py-4 text-white rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-xl font-bold font-poppins truncate pr-2">Rechazar Reserva</h3>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 flex-shrink-0"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-slate-700 mb-3 sm:mb-4 text-sm sm:text-base">
                Por favor, proporciona un comentario explicando el motivo del rechazo:
              </p>
              
              <textarea
                value={comentarioRechazo}
                onChange={(e) => setComentarioRechazo(e.target.value)}
                placeholder="Escribe el motivo del rechazo..."
                className="w-full p-3 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-red-500 focus:outline-none transition-all duration-300 resize-none text-sm sm:text-base"
                rows={3}
              />

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 font-poppins text-sm sm:text-base"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarRechazo}
                  disabled={!comentarioRechazo.trim()}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 font-poppins text-sm sm:text-base"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}