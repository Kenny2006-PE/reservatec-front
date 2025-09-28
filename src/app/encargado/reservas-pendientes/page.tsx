/**
 * @page Reservas Pendientes - Encargado
 * @description Página para gestionar las solicitudes de reserva pendientes
 * @route /encargado/reservas-pendientes
 */

"use client";

import { useState } from 'react';
import SidebarEncargado from '@/components/Sidebar/SidebarEncargado';

export default function ReservasPendientesPage() {
  const [currentPath] = useState('reservas-pendientes');

  // Datos de ejemplo basados en la imagen
  const reservasPendientes = [
    {
      id: 1,
      area: 'Fútbol 1',
      fecha: 'domingo, 19 de enero de 2025',
      horario: '10:00 - 11:00',
      estudiante: 'Carlos Mendoza',
      dni: '12345678',
      codigoInstitucional: 'EST001',
      participantes: 8,
      materialDeportivo: 'Solicitado',
      estado: 'Pendiente'
    },
    {
      id: 2,
      area: 'Frontón',
      fecha: 'lunes, 20 de enero de 2025',
      horario: '14:00 - 15:00',
      estudiante: 'María García',
      dni: '87654321',
      codigoInstitucional: 'EST002',
      participantes: 4,
      materialDeportivo: 'No solicitado',
      estado: 'Pendiente'
    }
  ];

  const handleAceptar = (id: number) => {
    console.log('Aceptar reserva:', id);
    // Aquí iría la lógica para aceptar la reserva
  };

  const handleRechazar = (id: number) => {
    console.log('Rechazar reserva:', id);
    // Aquí iría la lógica para rechazar la reserva
  };

  const handleVerDetalle = (id: number) => {
    console.log('Ver detalle:', id);
    // Aquí iría la lógica para ver más detalles
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarEncargado currentPath={currentPath} />
      
      {/* Contenido principal */}
      <div className="flex-1 lg:ml-0">
        {/* Contenido */}
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Reservas Pendientes</h1>
            <p className="text-gray-600">Gestiona las solicitudes de reserva de los usuarios</p>
          </div>

          {/* Lista de reservas pendientes */}
          <div className="space-y-6">
            {reservasPendientes.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Header de la card */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{reserva.area}</h3>
                    <p className="text-gray-600 text-sm">{reserva.fecha} - {reserva.horario}</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {reserva.estado}
                  </span>
                </div>

                {/* Información del estudiante */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estudiante:</p>
                    <p className="font-medium text-gray-900">{reserva.estudiante}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">DNI:</p>
                    <p className="font-medium text-gray-900">{reserva.dni}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Código Institucional:</p>
                    <p className="font-medium text-gray-900">{reserva.codigoInstitucional}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Participantes:</p>
                    <p className="font-medium text-gray-900">{reserva.participantes}</p>
                  </div>
                </div>

                {/* Material deportivo */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Material deportivo:</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    reserva.materialDeportivo === 'Solicitado' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reserva.materialDeportivo}
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleVerDetalle(reserva.id)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
                  >
                    Ver Detalle
                  </button>
                  <div className="flex gap-3 ml-auto">
                    <button 
                      onClick={() => handleRechazar(reserva.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 min-w-[100px]"
                    >
                      Rechazar
                    </button>
                    <button 
                      onClick={() => handleAceptar(reserva.id)}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 min-w-[100px]"
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay reservas pendientes */}
          {reservasPendientes.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reservas pendientes</h3>
              <p className="text-gray-600">Todas las solicitudes han sido procesadas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}