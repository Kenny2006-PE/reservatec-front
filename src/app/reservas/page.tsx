"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function ReservasPage() {
  const router = useRouter();

  const areas = [
    { id: 'futbol-1', name: 'Fútbol 1', available: true },
    { id: 'futbol-2', name: 'Fútbol 2', available: true },
    { id: 'voley-basquet', name: 'Vóley/Básquet', available: true },
    { id: 'fronton', name: 'Frontón', available: false }
  ];

  const handleAreaClick = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    if (area && area.available) {
      router.push(`/reservas/${areaId}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPath="reservas" />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Polideportivo ReservaTec
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-2 gap-6">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    area.available
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => handleAreaClick(area.id)}
                >
                  <h3 className="text-xl font-bold mb-2">{area.name}</h3>
                  <p className={`text-sm ${
                    area.available ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {area.available ? '✓ Disponible' : '✗ No disponible'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}