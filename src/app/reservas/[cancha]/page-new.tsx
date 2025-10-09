/**
 * @page Reserva Individual
 * @description Página para realizar reserva de un área específica
 * @route /reservas/[cancha]
 * @protected Requiere autenticación
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useUserPicture } from '@/hooks/useUserPicture';
import { CalendarIcon, ClockIcon, UsersIcon, CheckCircleIcon } from '@/components/Icons';
import { ReservationService } from '@/services/reservation.service';
import { HorarioDisponible, ReservaRequest } from '@/types/reservation.types';

export default function ReservaIndividualPage() {
  const params = useParams();
  const router = useRouter();
  const userPicture = useUserPicture();
  const cancha = params.cancha as string;

  // Estados
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [horarios, setHorarios] = useState<HorarioDisponible[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<number | null>(null);
  const [participantes, setParticipantes] = useState<number>(1);
  const [includeMaterial, setIncludeMaterial] = useState(false);
  const [acceptConditions, setAcceptConditions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Información de las áreas
  const areasInfo = {
    futbol1: {
      name: "Fútbol 1",
      description: "Cancha principal de fútbol",
      color: "#10b981",
      maxParticipants: 22,
      id_area: 1
    },
    futbol2: {
      name: "Fútbol 2", 
      description: "Cancha secundaria de fútbol",
      color: "#3b82f6",
      maxParticipants: 22,
      id_area: 2
    },
    fronton: {
      name: "Frontón",
      description: "Cancha de frontón/squash",
      color: "#8b5cf6",
      maxParticipants: 4,
      id_area: 3
    },
    voley: {
      name: "Futsal/Vóley/Básket",
      description: "Cancha multiuso deportiva",
      color: "#f59e0b",
      maxParticipants: 12,
      id_area: 4
    },
    ludo: {
      name: "Ludoteca",
      description: "Área de juegos de mesa",
      color: "#ec4899",
      maxParticipants: 8,
      id_area: 5
    },
    pingpong: {
      name: "Ping Pong",
      description: "Mesa de ping pong",
      color: "#14b8a6",
      maxParticipants: 4,
      id_area: 6
    }
  };

  const currentArea = areasInfo[cancha as keyof typeof areasInfo];

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  // Cargar horarios cuando se selecciona una fecha
  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setShowModal(true);
    setLoading(true);
    setError(null);

    try {
      const response = await ReservationService.getHorariosDisponibles(currentArea.id_area, date);
      if (response.success && response.data) {
        setHorarios(response.data);
      }
    } catch (error) {
      setError('Error al cargar horarios disponibles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Crear reserva
  const handleReserva = async () => {
    if (!selectedHorario || !acceptConditions) return;

    setLoading(true);
    setError(null);

    try {
      const reservaData: ReservaRequest = {
        id_area: currentArea.id_area,
        id_horario: selectedHorario,
        fecha: selectedDate,
        participantes,
        material: includeMaterial
      };

      const response = await ReservationService.crearReserva(reservaData);
      
      if (response.success) {
        // Mostrar mensaje de éxito y redirigir
        alert('¡Reserva creada exitosamente! Está pendiente de aprobación.');
        router.push('/reservas');
      }
    } catch (error) {
      setError('Error al crear la reserva');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentArea) {
    return <div>Área no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="reservas" userType="estudiante" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title={`Reservar ${currentArea.name}`}
          description={currentArea.description}
          userImage={userPicture}
        />

        {/* Contenido */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            
            {/* Card principal */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              
              {/* Header del área */}
              <div 
                className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${currentArea.color} 0%, ${currentArea.color}dd 100%)` }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins">{currentArea.name}</h2>
                  </div>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium">
                    Selecciona la fecha para ver horarios disponibles y realizar tu reserva
                  </p>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 sm:p-8 lg:p-10">
                
                {/* Información del área */}
                <div className="mb-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 font-poppins">Información del Área</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-slate-600" />
                      <span className="text-slate-700">Máximo {currentArea.maxParticipants} participantes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700">Material deportivo disponible</span>
                    </div>
                  </div>
                </div>

                {/* Selector de fecha */}
                <div className="mb-8">
                  <label className="block text-lg font-bold text-slate-900 mb-4 font-poppins">
                    Selecciona la fecha de tu reserva
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-lg"
                  />
                </div>

                {/* Botón volver */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-300 font-poppins"
                  >
                    Volver al Mapa
                  </button>
                  
                  {selectedDate && (
                    <p className="text-slate-600 font-medium">
                      Fecha seleccionada: <span className="font-bold">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de horarios y detalles */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Header del modal */}
            <div 
              className="px-6 py-4 text-white rounded-t-2xl"
              style={{ background: `linear-gradient(135deg, ${currentArea.color} 0%, ${currentArea.color}dd 100%)` }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-poppins">Detalles de la Reserva</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">Cargando horarios disponibles...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : (
                <>
                  {/* Horarios disponibles */}
                  <div className="mb-6">
                    <label className="block text-lg font-bold text-slate-900 mb-4 font-poppins">
                      Horarios Disponibles
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {horarios.map((horario) => (
                        <button
                          key={horario.id_horario}
                          disabled={!horario.disponible}
                          onClick={() => setSelectedHorario(horario.id_horario)}
                          className={`p-3 rounded-xl border-2 font-medium transition-all duration-300 ${
                            !horario.disponible
                              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                              : selectedHorario === horario.id_horario
                              ? 'border-blue-500 bg-blue-50 text-blue-900'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <ClockIcon className="w-4 h-4 mx-auto mb-1" />
                          {horario.hora_inicio} - {horario.hora_fin}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Número de participantes */}
                  <div className="mb-6">
                    <label className="block text-lg font-bold text-slate-900 mb-4 font-poppins">
                      Número de Participantes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={currentArea.maxParticipants}
                      value={participantes}
                      onChange={(e) => setParticipantes(parseInt(e.target.value) || 1)}
                      className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300"
                    />
                    <p className="text-sm text-slate-500 mt-2">Máximo {currentArea.maxParticipants} participantes</p>
                  </div>

                  {/* Material deportivo */}
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeMaterial}
                        onChange={(e) => setIncludeMaterial(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-lg font-medium text-slate-900 font-poppins">
                        Incluir material deportivo
                      </span>
                    </label>
                  </div>

                  {/* Condiciones */}
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptConditions}
                        onChange={(e) => setAcceptConditions(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <span className="text-sm text-slate-700 leading-relaxed">
                        <strong>Entiendo y acepto</strong> que al reservar, tengo la obligación de mantener el área limpia y en buenas condiciones después de su uso para mantener la disponibilidad de la cancha para los próximos usuarios.
                      </span>
                    </label>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-300 font-poppins"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleReserva}
                      disabled={!selectedHorario || !acceptConditions || loading}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 font-poppins"
                    >
                      {loading ? 'Reservando...' : 'Confirmar Reserva'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}