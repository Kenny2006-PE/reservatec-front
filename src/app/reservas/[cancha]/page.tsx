'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { LogOutIcon, ChevronRightIcon, CalendarIcon, ClockIcon, UsersIcon } from '@/components/Icons';

export default function ReservaCanchaPage() {
  const params = useParams();
  const cancha = params.cancha as string;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [participants, setParticipants] = useState<number>(1);
  const [includeMaterial, setIncludeMaterial] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Información de las canchas
  const canchasInfo = {
    'futbol1': {
      name: 'Fútbol 1',
      description: 'Revisa los horarios disponibles y reserva',
      color: '#10b981'
    },
    'futbol2': {
      name: 'Fútbol 2',
      description: 'Revisa los horarios disponibles y reserva',
      color: '#3b82f6'
    },
    'fronton': {
      name: 'Frontón',
      description: 'Revisa los horarios disponibles y reserva',
      color: '#8b5cf6'
    },
    'voley': {
      name: 'Futsal/Vóley/Básket',
      description: 'Revisa los horarios disponibles y reserva',
      color: '#f59e0b'
    }
  };

  // Horarios disponibles
  const timeSlots = [
    { time: '08:00-09:00', available: true },
    { time: '09:00-10:00', available: true },
    { time: '10:00-11:00', available: true },
    { time: '11:00-12:00', available: true },
    { time: '12:00-13:00', available: true },
    { time: '14:00-15:00', available: false }, // Ocupado
    { time: '15:00-16:00', available: false }, // Ocupado
    { time: '16:00-17:00', available: true }
  ];

  const canchaInfo = canchasInfo[cancha as keyof typeof canchasInfo] || canchasInfo.futbol1;

  // Generar fechas de la semana actual
  const generateWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);

    const weekDays = [];
    const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    for (let i = 0; i < 6; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      
      weekDays.push({
        name: dayNames[i],
        date: day.getDate(),
        month: monthNames[day.getMonth()],
        fullDate: day.toISOString().split('T')[0],
        isToday: day.toDateString() === today.toDateString()
      });
    }
    return weekDays;
  };

  const weekDays = generateWeekDays();

  // Reservas actuales de ejemplo
  const reservasActuales = [
    {
      id: 1,
      usuario: 'John Pérez',
      fecha: 'lunes, 16 de junio de 2025',
      hora: '14:00-15:00',
      participantes: 10,
      materialDeportivo: 'Sí',
      color: '#e5e7eb'
    },
    {
      id: 2,
      usuario: 'Jane Doe',
      fecha: 'lunes, 16 de junio de 2025',
      hora: '15:00-16:00',
      participantes: 8,
      materialDeportivo: 'Sí',
      color: '#fef3c7'
    }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleContinueReservation = () => {
    if (selectedDate) {
      setShowModal(true);
    }
  };

  const handleConfirmReservation = () => {
    if (selectedDate && selectedTime && participants > 0 && acceptTerms) {
      console.log('Reserva confirmada:', { 
        cancha, 
        fecha: selectedDate, 
        hora: selectedTime, 
        participantes: participants,
        material: includeMaterial 
      });
      // Aquí iría la lógica para enviar la reserva al backend
      setShowModal(false);
      // Resetear el formulario
      setSelectedDate('');
      setSelectedTime('');
      setParticipants(1);
      setIncludeMaterial(false);
      setAcceptTerms(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTime('');
    setParticipants(1);
    setIncludeMaterial(false);
    setAcceptTerms(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20 lg:w-20' : 'w-full lg:w-80'} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700/50 lg:min-h-screen transition-all duration-300 ease-in-out`}>
        {/* Header del sidebar */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center justify-center ${sidebarCollapsed ? 'w-full' : ''}`}>
              {!sidebarCollapsed && (
                <Image
                  src="/logo-blanco-dashboard.png"
                  alt="ReservaTec Logo"
                  width={160}
                  height={55}
                  className="object-contain drop-shadow-lg sm:w-48 sm:h-16 lg:w-52 lg:h-17"
                />
              )}
              {sidebarCollapsed && (
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
              )}
            </div>
            {/* Toggle button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
            >
              <svg 
                className={`w-5 h-5 text-slate-300 group-hover:text-white transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {!sidebarCollapsed && (
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 sm:mb-6 lg:mb-8 font-poppins">
                Navegación Principal
              </div>
            )}
            
            <Link href="/reservas" className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl bg-gradient-to-r from-slate-700/70 to-slate-600/60 border border-slate-600/50 shadow-xl backdrop-blur-sm`}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-white font-poppins text-sm sm:text-base truncate">Reservas</span>
                    <span className="text-xs sm:text-sm text-blue-300 font-medium hidden sm:block">Gestiona tus reservas deportivas</span>
                  </div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full shadow-lg"></div>
                </>
              )}
            </Link>
            
            <Link href="/user-info" className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:bg-slate-700/60 transition-all duration-300 border border-transparent hover:border-slate-600/40 hover:shadow-lg`}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:from-emerald-400 group-hover:to-emerald-500 transition-all duration-300 shadow-lg">
                <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-slate-100 group-hover:text-white font-poppins text-sm sm:text-base truncate">Mi Información</span>
                    <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 font-medium hidden sm:block">Perfil personal y configuración</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
                </>
              )}
            </Link>
          </div>
        </nav>

        {/* Cerrar sesión */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 lg:py-8 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30 mt-auto">
          <Link href="/">
            <button className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 sm:gap-4 lg:gap-5'} px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:bg-red-500/10 transition-all duration-300 w-full text-left border border-transparent hover:border-red-500/30 hover:shadow-lg`}>
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-slate-700/80 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-all duration-300">
                <LogOutIcon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-300 group-hover:text-red-400" />
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-slate-100 group-hover:text-red-400 font-poppins text-sm sm:text-base truncate">Cerrar Sesión</span>
                    <span className="text-xs sm:text-sm text-slate-400 group-hover:text-red-300 font-medium hidden sm:block">Salir del sistema de forma segura</span>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-200 hidden sm:block" />
                </>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 font-poppins">{canchaInfo.name}</h1>
              <p className="text-slate-600 font-medium tracking-wide text-sm sm:text-base">{canchaInfo.description}</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm sm:text-base font-semibold text-slate-900 font-poppins">Usuario Demo</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Estudiante Activo</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-lg font-poppins">
                UD
              </div>
            </div>
          </div>
        </header>

        {/* Contenido del formulario de reserva */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Sección: Hacer una reserva */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins">Hacer una reserva</h2>
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-medium">Selecciona la fecha y horario para tu reserva</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                {/* Selector de día */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 font-poppins">Selecciona un día</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
                    {weekDays.map((day) => (
                      <button
                        key={day.fullDate}
                        onClick={() => setSelectedDate(day.fullDate)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedDate === day.fullDate
                            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-xs font-semibold text-slate-500 mb-1">{day.name}</div>
                          <div className={`text-2xl font-bold mb-1 ${
                            selectedDate === day.fullDate ? 'text-blue-600' : 'text-slate-900'
                          }`}>{day.date}</div>
                          <div className="text-xs text-slate-400">{day.month}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botón continuar */}
                <div className="flex justify-center">
                  <button
                    onClick={handleContinueReservation}
                    disabled={!selectedDate}
                    className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-poppins ${
                      selectedDate
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Continuar con la reserva
                  </button>
                </div>
              </div>
            </div>

            {/* Sección: Reservas actuales */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 lg:px-10 py-6 sm:py-8 text-white">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-poppins">Reservas actuales</h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {reservasActuales.map((reserva) => (
                    <div
                      key={reserva.id}
                      className="p-6 rounded-2xl border-2 border-slate-200 shadow-lg transition-all duration-300 hover:shadow-xl"
                      style={{ backgroundColor: reserva.color }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-slate-900 font-poppins">{reserva.usuario}</h4>
                        <button className="text-slate-600 hover:text-slate-800 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="19" cy="12" r="1"/>
                            <circle cx="5" cy="12" r="1"/>
                          </svg>
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">{reserva.fecha}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Hora</div>
                            <div className="font-semibold text-slate-900">{reserva.hora}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">Participantes</div>
                            <div className="font-semibold text-slate-900">{reserva.participantes}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-slate-500 mb-1">Material deportivo</div>
                          <div className="font-semibold text-slate-900">{reserva.materialDeportivo}</div>
                        </div>
                      </div>

                      {reserva.id === 1 && (
                        <div className="mt-4 pt-4 border-t border-slate-300">
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Reportar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Reserva */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-slate-900 font-poppins">
                Reserva para {canchaInfo.name}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Fecha seleccionada */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Fecha seleccionada:</p>
                <p className="font-semibold text-slate-900">
                  {weekDays.find(day => day.fullDate === selectedDate)?.name}, {weekDays.find(day => day.fullDate === selectedDate)?.date} de {weekDays.find(day => day.fullDate === selectedDate)?.month.toLowerCase()}
                </p>
              </div>

              {/* Seleccionar horario */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-4">Selecciona un horario</h4>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        !slot.available
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-gray-300 hover:border-slate-400 hover:bg-gray-50'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Número de participantes */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Número de participantes</h4>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-slate-700 hover:bg-gray-200 transition-colors text-xl font-bold"
                  >
                    -
                  </button>
                  <div className="w-16 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white">
                    <span className="text-xl font-bold text-slate-900">{participants}</span>
                  </div>
                  <button
                    onClick={() => setParticipants(Math.min(20, participants + 1))}
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-slate-700 hover:bg-gray-200 transition-colors text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Material deportivo */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="material"
                  checked={includeMaterial}
                  onChange={(e) => setIncludeMaterial(e.target.checked)}
                  className="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-500"
                />
                <label htmlFor="material" className="text-sm text-slate-700 font-medium">
                  Incluir material deportivo
                </label>
              </div>

              {/* Términos y condiciones */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-5 h-5 text-slate-900 border-gray-300 rounded focus:ring-slate-500 mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-700">
                    <span className="font-medium">Entiendo que al reservar, tengo la obligación de mantener el área limpia y en buenas condiciones después de su uso para mantener la disponibilidad de la cancha para los próximos usuarios.</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReservation}
                disabled={!selectedTime || !acceptTerms}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  selectedTime && acceptTerms
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirmar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}