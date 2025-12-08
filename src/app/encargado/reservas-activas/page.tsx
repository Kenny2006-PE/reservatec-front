"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ReservationService } from '@/services/reservation.service';
import { useUserName } from '@/hooks/useUserName';
import { useUserPicture } from '@/hooks/useUserPicture';
import { Reserva } from '@/types/reservation.types';
import { CheckCircleIcon, CalendarIcon, ClockIcon, UsersIcon } from '@/components/Icons';

export default function ReservasActivasPage() {
  const userName = useUserName();
  const userPicture = useUserPicture();
  const [reservasActivas, setReservasActivas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarReservasActivas();
  }, []);

  const cargarReservasActivas = async () => {
    try {
      setLoading(true);
      const response = await ReservationService.getReservasActivas();
      setReservasActivas(response.data || []);
    } catch (error) {
      console.error('Error al cargar reservas activas:', error);
    } finally {
      setLoading(false);
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

  const getAreaColor = (areaNombre: string) => {
    const colores = {
      'Fútbol 1': '#10b981',
      'Fútbol 2': '#3b82f6',
      'Frontón': '#8b5cf6',
      'Futsal/Vóley/Básket': '#f59e0b'
    };
    return colores[areaNombre as keyof typeof colores] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="reservas-activas" userType="encargado" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Reservas Activas"
          description="Visualiza todas las reservas aprobadas y en curso"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-slate-900 font-poppins">{reservasActivas.length}</p>
                    <p className="text-slate-600 text-sm">Reservas Activas</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">Cargando reservas activas...</h3>
                  <p className="text-slate-600">Por favor espera un momento.</p>
                </div>
              ) : reservasActivas.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 p-12 text-center">
                  <CheckCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-poppins">No hay reservas activas</h3>
                  <p className="text-slate-600">Las reservas aprobadas aparecerán aquí.</p>
                </div>
              ) : (
                reservasActivas.map((reserva) => (
                  <div key={reserva.id_reserva} className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
                    <div 
                      className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white"
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
                        <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                          Activa
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-10">
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-slate-900 mb-4 font-poppins">Información del Estudiante</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-500 mb-1">Estudiante</p>
                            <p className="font-bold text-slate-900 font-poppins">
                              {reserva.usuario_nombre} {reserva.usuario_apellido}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}