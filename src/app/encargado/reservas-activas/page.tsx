/**
 * @page Reservas Activas - Encargado
 * @description Página para gestionar las reservas activas
 * @route /encargado/reservas-activas
 */

"use client";

import { useState } from 'react';
import SidebarEncargado from '@/components/Sidebar/SidebarEncargado';

export default function ReservasActivasPage() {
  const [currentPath] = useState('reservas-activas');

  // Datos de ejemplo basados en la imagen
  const reservasActivas = [
    {
      id: 1,
      area: 'Fútbol 1',
      horario: '10:00 - 11:00',
      usuario: 'Carlos Mendoza',
      fecha: 'sábado, 18 ene',
      estado: 'Activa'
    },
    {
      id: 2,
      area: 'Vóley/Básquet',
      horario: '14:00 - 15:00',
      usuario: 'María García',
      fecha: 'sábado, 18 ene',
      estado: 'Activa'
    },
    {
      id: 3,
      area: 'Frontón',
      horario: '16:00 - 17:00',
      usuario: 'Ana López',
      fecha: 'sábado, 18 ene',
      estado: 'Activa'
    },
    {
      id: 4,
      area: 'Fútbol 2',
      horario: '09:00 - 10:00',
      usuario: 'José Rodríguez',
      fecha: 'sábado, 18 ene',
      estado: 'Activa'
    }
  ];

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
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Reservas Activas</h1>
            <p className="text-gray-600">Visualiza las reservas actualmente en curso</p>
          </div>

          {/* Lista de reservas */}
          <div className="space-y-4">
            {reservasActivas.map((reserva) => (
              <div key={reserva.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{reserva.area}</h3>
                    <div className="text-gray-600 space-y-1">
                      <p className="text-sm">{reserva.horario} - {reserva.usuario}</p>
                      <p className="text-sm">{reserva.fecha}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {reserva.estado}
                    </span>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}