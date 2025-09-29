'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useUserPicture } from '@/hooks/useUserPicture';
import { ReservationService, ReservationResponse } from '@/services/reservation.service';

export default function MisReservasPage() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userPicture = useUserPicture();

  useEffect(() => {
    const loadMyReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        // Por ahora usamos userId hardcodeado - en producción vendría del JWT
        const userId = 1;
        const response = await ReservationService.getMyReservations(userId);
        
        if (response.success && response.data) {
          setReservations(response.data);
        }
      } catch (error: any) {
        console.error('Error al cargar reservas:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMyReservations();
  }, []);

  const getStatusConfig = (estado: string) => {
    switch (estado) {
      case 'aceptado':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Aceptado',
          icon: '✓',
          bgColor: 'bg-green-50'
        };
      case 'pendiente':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Pendiente',
          icon: '⏱',
          bgColor: 'bg-yellow-50'
        };
      case 'cancelado':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          text: 'Rechazado',
          icon: '✗',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: estado,
          icon: '?',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
        <Sidebar currentPath="mis-reservas" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando tus reservas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="mis-reservas" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Mis Reservas"
          description="Visualiza el estado de todas tus reservas deportivas"
          userImage={userPicture}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {reservations.length === 0 && !loading && !error && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-gray-400 mb-6">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes reservas</h3>
                <p className="text-gray-600 mb-6">Aún no has realizado ninguna reserva deportiva.</p>
                <button 
                  onClick={() => window.location.href = '/reservas'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Hacer mi primera reserva
                </button>
              </div>
            )}

            {reservations.length > 0 && (
              <div className="space-y-6">
                {reservations.map((reservation) => {
                  const statusConfig = getStatusConfig(reservation.estado);
                  
                  return (
                    <div 
                      key={reservation.id_reserva}
                      className={`${statusConfig.bgColor} rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900 uppercase">
                                {reservation.area_nombre.replace('-', ' ')}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                                {statusConfig.icon} {statusConfig.text}
                              </span>
                            </div>
                            <p className="text-gray-600 capitalize">
                              {formatDate(reservation.fecha)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white/70 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Horario</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatTime(reservation.hora_inicio)} - {formatTime(reservation.hora_fin)}
                            </p>
                          </div>

                          <div className="bg-white/70 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Participantes</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {reservation.participantes} personas
                            </p>
                          </div>

                          <div className="bg-white/70 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span className="text-sm font-medium text-gray-600">Material deportivo</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {reservation.material ? 'Solicitado' : 'No solicitado'}
                            </p>
                          </div>
                        </div>

                        {reservation.comentario && (
                          <div className="bg-white/70 rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                              <span className="text-sm font-medium text-blue-700">Comentario del encargado</span>
                            </div>
                            <p className="text-gray-700">{reservation.comentario}</p>
                          </div>
                        )}

                        {reservation.estado === 'pendiente' && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-700">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium">Tu reserva está siendo revisada por el encargado.</span>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}