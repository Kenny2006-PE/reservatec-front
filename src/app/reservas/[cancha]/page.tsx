"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ReservationService } from '@/services/reservation.service';

export default function CanchaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const canchaId = params.cancha as string;
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participantes, setParticipantes] = useState(1);
  const [materialDeportivo, setMaterialDeportivo] = useState(false);
  const [loading, setLoading] = useState(false);

  const areas: Record<string, any> = {
    'futbol-1': { name: 'Fútbol 1', capacity: 22 },
    'futbol-2': { name: 'Fútbol 2', capacity: 22 },
    'voley-basquet': { name: 'Vóley/Básquet', capacity: 12 },
    'fronton': { name: 'Frontón', capacity: 4 }
  };

  const area = areas[canchaId];
  
  const horarios = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('es-ES', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        })
      });
    }
    return days;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona fecha y horario');
      return;
    }

    try {
      setLoading(true);
      
      const reservationData = {
        id_usuario: 1, // This should come from user context
        id_area: 1, // This should be mapped from the area slug
        id_horario: 1, // This should be mapped from selectedTime
        fecha: selectedDate,
        participantes: participantes,
        material: materialDeportivo
      };

      const response = await ReservationService.createReservation(reservationData);
      
      if (response.success) {
        alert('Reserva creada exitosamente. Pendiente de aprobación.');
        router.push('/mis-reservas');
      } else {
        alert('Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (!area) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar currentPath="reservas" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Área no encontrada</h2>
            <button
              onClick={() => router.push('/reservas')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Volver al mapa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPath="reservas" />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/reservas')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Volver al mapa
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Reservar {area.name}
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecciona la fecha
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getNextDays().map((day) => (
                    <label
                      key={day.value}
                      className={`relative flex cursor-pointer rounded-lg border p-4 ${
                        selectedDate === day.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="date"
                        value={day.value}
                        checked={selectedDate === day.value}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {day.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecciona el horario
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {horarios.map((horario) => (
                    <label
                      key={horario}
                      className={`relative flex cursor-pointer rounded-lg border p-3 ${
                        selectedTime === horario
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="time"
                        value={horario}
                        checked={selectedTime === horario}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {horario}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de participantes
                </label>
                <select
                  value={participantes}
                  onChange={(e) => setParticipantes(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                >
                  {Array.from({ length: area.capacity }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'participante' : 'participantes'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={materialDeportivo}
                    onChange={(e) => setMaterialDeportivo(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Solicitar material deportivo
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedDate || !selectedTime}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Procesando...' : 'Crear Reserva'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}