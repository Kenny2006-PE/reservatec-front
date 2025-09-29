"use client";

import { useState, useEffect } from 'react';
import SidebarEncargado from '@/components/Sidebar/SidebarEncargado';
import { ReservationService, ReservationResponse } from '@/services/reservation.service';

export default function ReservasPendientesPage() {
  const [reservasPendientes, setReservasPendientes] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    loadPendingReservations();
  }, []);

  const loadPendingReservations = async () => {
    try {
      setLoading(true);
      const response = await ReservationService.getPendingReservations();
      if (response.success && response.data) {
        setReservasPendientes(response.data);
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setProcessing(id);
      await ReservationService.approveReservation(id);
      await loadPendingReservations();
    } catch (error) {
      console.error('Error al aprobar:', error);
      alert('Error al aprobar la reserva');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setProcessing(id);
      const comentario = prompt('Comentario de rechazo (opcional):');
      await ReservationService.rejectReservation(id, comentario || undefined);
      await loadPendingReservations();
    } catch (error) {
      console.error('Error al rechazar:', error);
      alert('Error al rechazar la reserva');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <SidebarEncargado currentPath="reservas-pendientes" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reservas pendientes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarEncargado currentPath="reservas-pendientes" />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Reservas Pendientes
          </h1>

          {reservasPendientes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No hay reservas pendientes
              </h3>
              <p className="text-gray-500">
                Todas las reservas han sido procesadas.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reservasPendientes.map((reserva) => (
                <div key={reserva.id_reserva} className="bg-white rounded-lg shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Área Deportiva</h3>
                      <p className="text-gray-900">{reserva.area_nombre}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Fecha</h3>
                      <p className="text-gray-900">{formatDate(reserva.fecha)}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Horario</h3>
                      <p className="text-gray-900">{reserva.hora_inicio} - {reserva.hora_fin}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Participantes</h3>
                      <p className="text-gray-900">{reserva.participantes}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Estudiante</h3>
                      <p className="text-gray-900">{reserva.usuario_nombre || 'Usuario'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">Material Deportivo</h3>
                      <p className="text-gray-900">{reserva.material ? 'Solicitado' : 'No solicitado'}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => handleApprove(reserva.id_reserva)}
                      disabled={processing === reserva.id_reserva}
                      className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {processing === reserva.id_reserva ? 'Procesando...' : '✓ Aprobar'}
                    </button>
                    <button
                      onClick={() => handleReject(reserva.id_reserva)}
                      disabled={processing === reserva.id_reserva}
                      className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {processing === reserva.id_reserva ? 'Procesando...' : '✗ Rechazar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
