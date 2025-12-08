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
import Modal from '@/components/Modal';
import { useUserPicture } from '@/hooks/useUserPicture';
import { useUserName } from '@/hooks/useUserName';
import { useUserRegistrationStatus } from '@/hooks/useUserRegistrationStatus';
import { CalendarIcon, ClockIcon, UsersIcon, CheckCircleIcon } from '@/components/Icons';
import { ReservationService } from '@/services/reservation.service';
import { ReportService } from '@/services/report.service';
import { obtenerTodasLasFechasIndividuales } from '@/services/fechasProhibidas';
import type { FechaIndividual } from '@/types/fechasProhibidas';

export default function ReservaIndividualPage() {
  const params = useParams();
  const router = useRouter();
  const userPicture = useUserPicture();
  const userName = useUserName();
  const { userData } = useUserRegistrationStatus();
  const cancha = params.cancha as string;

  // Estados
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [participantes, setParticipantes] = useState<number>(1);
  const [includeMaterial, setIncludeMaterial] = useState(false);
  const [acceptConditions, setAcceptConditions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal de error/información
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalTitle, setErrorModalTitle] = useState('');
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [errorModalType, setErrorModalType] = useState<'error' | 'warning' | 'info' | 'success'>('error');

  // Estados para reservas del día
  const [reservasDelDia, setReservasDelDia] = useState<any[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);

  // Estados para modal de reporte
  const [showReportModal, setShowReportModal] = useState(false);
  const [reservaAReportar, setReservaAReportar] = useState<any>(null);
  const [motivoReporte, setMotivoReporte] = useState('');
  const [descripcionReporte, setDescripcionReporte] = useState('');

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
    },
    ludo: {
      name: "Ludoteca",
      description: "Revisa los horarios disponibles y reserva",
      color: "#ec4899"
    },
    pingpong: {
      name: "Ping Pong",
      description: "Revisa los horarios disponibles y reserva",
      color: "#14b8a6"
    }
  };

  // Horarios disponibles (se cargan dinámicamente)
  const [timeSlots, setTimeSlots] = useState<{id: number, time: string, available: boolean}[]>([]);
  
  // Fechas prohibidas
  const [fechasProhibidas, setFechasProhibidas] = useState<Map<string, string>>(new Map());
  const [loadingFechas, setLoadingFechas] = useState(true);

  const canchaInfo = canchasInfo[cancha as keyof typeof canchasInfo] || canchasInfo.futbol1;

  // Cargar fechas prohibidas al montar el componente
  useEffect(() => {
    const cargarFechasProhibidas = async () => {
      try {
        const fechas = await obtenerTodasLasFechasIndividuales();
        const mapa = new Map<string, string>();
        fechas.forEach(f => {
          mapa.set(f.fecha, f.evento);
        });
        setFechasProhibidas(mapa);
      } catch (error) {
        console.error('Error cargando fechas prohibidas:', error);
      } finally {
        setLoadingFechas(false);
      }
    };

    cargarFechasProhibidas();
  }, []);

  // Cargar reservas cuando cambia la fecha seleccionada
  useEffect(() => {
    const cargarReservasDelDia = async () => {
      if (!selectedDate || !cancha) {
        setReservasDelDia([]);
        return;
      }
      
      setLoadingReservas(true);
      try {
        // Obtener el ID del área desde el parámetro cancha
        const areaMap: Record<string, number> = {
          'futbol1': 1,
          'futbol2': 2,
          'fronton': 3,
          'voley': 4,
          'ludo': 5,
          'pingpong': 6
        };
        
        const areaId = areaMap[cancha as keyof typeof areaMap];
        if (!areaId) {
          console.warn('ID de área no encontrado para:', cancha);
          setReservasDelDia([]);
          return;
        }

        // Verificar que el método existe antes de llamarlo
        if (typeof ReservationService.getReservationsByAreaAndDate !== 'function') {
          console.error('El método getReservationsByAreaAndDate no está disponible');
          setReservasDelDia([]);
          return;
        }

        // Llamar al servicio para obtener reservas del día
        const reservas = await ReservationService.getReservationsByAreaAndDate(areaId, selectedDate);
        
        // Validar que reservas sea un array
        if (!Array.isArray(reservas)) {
          console.warn('Las reservas no son un array:', reservas);
          setReservasDelDia([]);
          return;
        }
        
        // Obtener la hora actual
        const ahora = new Date();
        const horaActual = ahora.getHours();
        const minutoActual = ahora.getMinutes();
        const fechaHoy = new Date().toISOString().split('T')[0];
        
        // Filtrar reservas: si es hoy, solo mostrar desde la hora actual en adelante
        const reservasFiltradas = reservas.filter((reserva: any) => {
          try {
            // Validar que la reserva tenga horario
            if (!reserva?.horario) return false;
            
            // Si no es el día de hoy, mostrar todas las reservas
            if (selectedDate !== fechaHoy) {
              return true;
            }
            
            // Si es hoy, filtrar por hora
            // Extraer hora de inicio del horario (formato "14:00-15:00")
            const horaInicio = reserva.horario.split('-')[0]?.trim();
            if (!horaInicio) return false;
            
            const [hora, minuto] = horaInicio.split(':').map(Number);
            
            // Validar que hora y minuto sean números válidos
            if (isNaN(hora) || isNaN(minuto)) return false;
            
            // Solo mostrar si la hora de inicio es mayor o igual a la hora actual
            if (hora > horaActual) return true;
            if (hora === horaActual && minuto >= minutoActual) return true;
            
            return false;
          } catch (err) {
            console.error('Error filtrando reserva:', err, reserva);
            return false;
          }
        });
        
        setReservasDelDia(reservasFiltradas);
      } catch (error: any) {
        console.error('Error cargando reservas del día:', error);
        
        // Mostrar error al usuario si es necesario
        if (error?.message && !error.message.includes('not a function')) {
          setErrorModalTitle('Error al Cargar Reservas');
          setErrorModalMessage('No se pudieron cargar las reservas del día. Por favor, intenta nuevamente.');
          setErrorModalType('error');
          setShowErrorModal(true);
        }
        
        setReservasDelDia([]);
      } finally {
        setLoadingReservas(false);
      }
    };

    cargarReservasDelDia();
  }, [selectedDate, cancha]);

  // Generar fechas desde hoy hacia adelante (solo días hábiles: Lunes a Viernes de la semana actual)
  const generateWeekDays = () => {
    const today = new Date();
    const weekDays = [];
    const dayNames = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

    // Si hoy es sábado o domingo, comenzar desde el lunes siguiente
    const startDate = new Date(today);
    const currentDayOfWeek = startDate.getDay();
    
    if (currentDayOfWeek === 0) { // Domingo
      startDate.setDate(startDate.getDate() + 1); // Ir al lunes
    } else if (currentDayOfWeek === 6) { // Sábado
      startDate.setDate(startDate.getDate() + 2); // Ir al lunes
    }
    
    // Generar solo los días hábiles desde hoy hasta el viernes de la semana actual
    let i = 0;
    while (i < 7) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dayOfWeek = day.getDay();
      
      // Solo agregar días de lunes (1) a viernes (5)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        weekDays.push({
          name: dayNames[dayOfWeek],
          date: day.getDate(),
          month: monthNames[day.getMonth()],
          fullDate: day.toISOString().split('T')[0],
          isToday: day.toDateString() === today.toDateString()
        });
      }
      
      // Si llegamos al viernes, terminar
      if (dayOfWeek === 5 && weekDays.length > 0) {
        break;
      }
      
      i++;
    }
    
    return weekDays;
  };

  const weekDays = generateWeekDays();

  // Cargar horarios disponibles cuando se selecciona una fecha
  const cargarHorariosDisponibles = async (fecha: string, areaId: number) => {
    try {
      const response = await ReservationService.getHorariosDisponibles(areaId, fecha);
      
      // Obtener la fecha y hora actuales
      const ahora = new Date();
      const horaActual = ahora.getHours();
      const minutoActual = ahora.getMinutes();
      const fechaHoy = ahora.toISOString().split('T')[0];
      const esHoy = fecha === fechaHoy;
      
      const horariosFormateados = (response.data || []).map((horario: any) => {
        let disponible = horario.disponible;
        
        // Si es hoy, verificar que el horario no haya pasado
        if (esHoy && disponible) {
          // Extraer la hora de inicio del horario
          const horaInicio = horario.hora_inicio.slice(0, 5); // "14:00"
          const [hora, minuto] = horaInicio.split(':').map(Number);
          
          // Marcar como no disponible si el horario ya pasó o está en curso
          if (hora < horaActual || (hora === horaActual && minuto <= minutoActual)) {
            disponible = false;
          }
        }
        
        return {
          id: horario.id_horario,
          time: `${horario.hora_inicio.slice(0, 5)}-${horario.hora_fin.slice(0, 5)}`,
          available: disponible
        };
      });
      
      setTimeSlots(horariosFormateados);
    } catch (error) {
      console.error('Error cargando horarios:', error);
      setTimeSlots([]);
    }
  };

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

  const handleContinueReservation = () => {
    if (selectedDate) {
      const areaMap: { [key: string]: number } = {
        'futbol-1': 1,
        'futbol-2': 2,
        'fronton': 3,
        'pingpong': 4,
        'ludo': 5,
        'voley-basquet': 6
      };
      
      const areaId = areaMap[cancha] || 1;
      cargarHorariosDisponibles(selectedDate, areaId);
      setShowModal(true);
    }
  };

  const handleConfirmReservation = async () => {
    if (selectedDate && selectedHorario && participantes > 0 && acceptConditions) {
      setLoading(true);
      setError(null);
      
      try {
        // Mapear nombre de cancha al ID del área
        const areaMap: { [key: string]: number } = {
          'futbol-1': 1,
          'futbol-2': 2,
          'fronton': 3,
          'pingpong': 4,
          'ludo': 5,
          'voley-basquet': 6
        };

        // Extraer ID del horario del string selectedHorario (formato: "id:hora")
        const horarioId = parseInt(selectedHorario.split(':')[0]);
        
        const reservaData = {
          id_area: areaMap[cancha] || 1,
          id_horario: horarioId,
          fecha: selectedDate,
          participantes: participantes,
          material: includeMaterial
        };

        await ReservationService.crearReserva(reservaData);
        
        // Mostrar mensaje de éxito con modal
        setErrorModalTitle('¡Reserva Exitosa!');
        setErrorModalMessage('Tu reserva ha sido creada exitosamente. Está pendiente de aprobación por el encargado del polideportivo.');
        setErrorModalType('success');
        setShowErrorModal(true);
        
        // Resetear el formulario
        setShowModal(false);
        setSelectedDate('');
        setSelectedHorario(null);
        setParticipantes(1);
        setIncludeMaterial(false);
        setAcceptConditions(false);
        
      } catch (error: any) {
        console.error('Error completo creando reserva:', error);
        
        // Extraer el mensaje de error de diferentes fuentes posibles
        let errorMessage = 'Error al crear la reserva';
        
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        console.log('Mensaje de error procesado:', errorMessage);
        
        // Verificar si es un error de cuenta suspendida
        if (errorMessage.toLowerCase().includes('suspend') || errorMessage.toLowerCase().includes('suspendida')) {
          setErrorModalTitle('Cuenta Suspendida');
          setErrorModalMessage('Tu cuenta está suspendida. Por favor, contacta con el encargado del polideportivo para más información.');
          setErrorModalType('warning');
        }
        // Verificar si es un error de día deshabilitado
        else if (errorMessage.toLowerCase().includes('no está disponible los días') || errorMessage.toLowerCase().includes('días deshabilitados')) {
          setErrorModalTitle('Día No Disponible');
          setErrorModalMessage(errorMessage);
          setErrorModalType('warning');
        }
        // Verificar si es un error de horario deshabilitado
        else if (errorMessage.toLowerCase().includes('horario') && errorMessage.toLowerCase().includes('no está disponible')) {
          setErrorModalTitle('Horario No Disponible');
          setErrorModalMessage(errorMessage);
          setErrorModalType('warning');
        }
        // Verificar si es un error de área deshabilitada
        else if (errorMessage.toLowerCase().includes('área') && errorMessage.toLowerCase().includes('no está disponible')) {
          setErrorModalTitle('Área No Disponible');
          setErrorModalMessage(errorMessage);
          setErrorModalType('warning');
        }
        // Error genérico
        else {
          setErrorModalTitle('Error al Crear Reserva');
          setErrorModalMessage(errorMessage);
          setErrorModalType('error');
        }
        
        setShowErrorModal(true);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHorario(null);
    setParticipantes(1);
    setIncludeMaterial(false);
    setAcceptConditions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="cancha" userType="estudiante" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title={canchaInfo.name}
          description={canchaInfo.description}
          userImage={userPicture}
          userName={userName}
        />

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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                    {weekDays.map((day) => {
                      const estaProhibido = fechasProhibidas.has(day.fullDate);
                      const nombreEvento = fechasProhibidas.get(day.fullDate);
                      
                      return (
                        <div key={day.fullDate} className="relative group">
                          <button
                            onClick={() => !estaProhibido && setSelectedDate(day.fullDate)}
                            disabled={estaProhibido}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                              estaProhibido
                                ? 'border-red-200 bg-red-50 opacity-60 cursor-not-allowed'
                                : selectedDate === day.fullDate
                                  ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-xs font-semibold text-slate-500 mb-1">{day.name}</div>
                              <div className={`text-2xl font-bold mb-1 ${
                                estaProhibido
                                  ? 'text-red-600'
                                  : selectedDate === day.fullDate
                                    ? 'text-blue-600'
                                    : 'text-slate-900'
                              }`}>{day.date}</div>
                              <div className="text-xs text-slate-400">{day.month}</div>
                              {estaProhibido && (
                                <div className="mt-1">
                                  <span className="text-xs font-semibold text-red-600">🚫 No disponible</span>
                                </div>
                              )}
                            </div>
                          </button>
                          
                          {/* Tooltip con nombre del evento */}
                          {estaProhibido && nombreEvento && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              {nombreEvento}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                <div className="border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                {loadingReservas ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-slate-600 mt-2">Cargando reservas...</p>
                  </div>
                ) : reservasDelDia.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <ClockIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-slate-600 font-medium">
                      {selectedDate 
                        ? 'No hay reservas programadas para esta fecha en el horario seleccionado'
                        : 'Selecciona una fecha para ver las reservas del día'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {reservasDelDia.map((reserva) => {
                      // Determinar si es la reserva del usuario actual (comparar por nombre)
                      const esReservaPropia = reserva.nombre_usuario?.toLowerCase().includes(userName.toLowerCase()) || 
                                              userName.toLowerCase().includes(reserva.nombre_usuario?.toLowerCase() || '');
                      
                      return (
                        <div
                          key={reserva.id_reserva}
                          className={`p-6 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
                            esReservaPropia 
                              ? 'bg-blue-50 border-blue-300' 
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              <h4 className="text-lg font-bold text-slate-900 font-poppins">
                                {esReservaPropia ? 'Tu reserva' : (reserva.nombre_usuario || 'Usuario')}
                              </h4>
                              {esReservaPropia && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  Propia
                                </span>
                              )}
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              reserva.estado === 'Confirmada' 
                                ? 'bg-green-100 text-green-800' 
                                : reserva.estado === 'Pendiente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reserva.estado}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="text-sm text-slate-600">
                              <span className="font-medium">
                                {new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-slate-500 mb-1">Hora</div>
                                <div className="font-semibold text-slate-900 flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  {reserva.horario}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 mb-1">Participantes</div>
                                <div className="font-semibold text-slate-900 flex items-center gap-1">
                                  <UsersIcon className="w-4 h-4" />
                                  {reserva.num_participantes}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs text-slate-500 mb-1">Material deportivo</div>
                              <div className="font-semibold text-slate-900 flex items-center gap-1">
                                {reserva.material_deportivo ? (
                                  <>
                                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                    <span className="text-green-600">Sí</span>
                                  </>
                                ) : (
                                  <span className="text-gray-500">No</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Botón de reportar solo para reservas de otros usuarios */}
                            {!esReservaPropia && (
                              <div className="pt-3 border-t border-gray-200">
                                <button
                                  onClick={() => {
                                    console.log('🔴 Click en reportar - Reserva:', reserva);
                                    console.log('🔴 userData:', userData);
                                    setReservaAReportar(reserva);
                                    setShowReportModal(true);
                                  }}
                                  className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  Reportar esta reserva
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Reserva */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
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
                      onClick={() => slot.available && setSelectedHorario(`${slot.id}:${slot.time}`)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        !slot.available
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : selectedHorario === `${slot.id}:${slot.time}`
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
                    onClick={() => setParticipantes(Math.max(1, participantes - 1))}
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-slate-700 hover:bg-gray-200 transition-colors text-xl font-bold"
                  >
                    -
                  </button>
                  <div className="w-16 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white">
                    <span className="text-xl font-bold text-slate-900">{participantes}</span>
                  </div>
                  <button
                    onClick={() => setParticipantes(Math.min(20, participantes + 1))}
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
                    checked={acceptConditions}
                    onChange={(e) => setAcceptConditions(e.target.checked)}
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
                disabled={!selectedHorario || !acceptConditions}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  selectedHorario && acceptConditions
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

      {/* Modal de reporte */}
      {showReportModal && reservaAReportar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-slate-900">Reportar reserva</h3>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReservaAReportar(null);
                  setMotivoReporte('');
                  setDescripcionReporte('');
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Información de la reserva */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-semibold text-slate-700">Usuario:</span>
                  <span className="text-slate-900">{reservaAReportar.nombre_usuario}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold text-slate-700">Fecha:</span>
                  <span className="text-slate-900">{reservaAReportar.fecha}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-slate-700">Horario:</span>
                  <span className="text-slate-900">{reservaAReportar.horario}</span>
                </div>
              </div>

              {/* Motivo del reporte */}
              <div>
                <label htmlFor="motivo-reporte" className="block text-sm font-semibold text-slate-700 mb-2">
                  Motivo del reporte <span className="text-red-500">*</span>
                </label>
                <select
                  id="motivo-reporte"
                  value={motivoReporte}
                  onChange={(e) => setMotivoReporte(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900 bg-white"
                  required
                >
                  <option value="" className="text-slate-400">Selecciona un motivo</option>
                  <option value="no_asistio" className="text-slate-900">No asistió a la reserva</option>
                  <option value="comportamiento_inadecuado" className="text-slate-900">Comportamiento inadecuado</option>
                  <option value="dano_material" className="text-slate-900">Daño al material deportivo</option>
                  <option value="dano_instalaciones" className="text-slate-900">Daño a las instalaciones</option>
                  <option value="uso_indebido" className="text-slate-900">Uso indebido del área</option>
                  <option value="incumplimiento_normas" className="text-slate-900">Incumplimiento de normas</option>
                  <option value="otro" className="text-slate-900">Otro</option>
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion-reporte" className="block text-sm font-semibold text-slate-700 mb-2">
                  Descripción detallada
                </label>
                <textarea
                  id="descripcion-reporte"
                  value={descripcionReporte}
                  onChange={(e) => setDescripcionReporte(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Describe lo sucedido con más detalle..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none text-slate-900 bg-white placeholder:text-slate-400"
                />
                <div className="text-right text-xs text-slate-500 mt-1">
                  {descripcionReporte.length}/500 caracteres
                </div>
              </div>

              {/* Advertencia */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-amber-800">
                  Los reportes falsos o malintencionados pueden resultar en sanciones. Asegúrate de reportar solo situaciones reales.
                </p>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex gap-3 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReservaAReportar(null);
                  setMotivoReporte('');
                  setDescripcionReporte('');
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!motivoReporte) {
                    setErrorModalTitle('Campo requerido');
                    setErrorModalMessage('Debes seleccionar un motivo para el reporte.');
                    setErrorModalType('error');
                    setShowErrorModal(true);
                    return;
                  }

                  try {
                    // Validar que tengamos los datos necesarios
                    if (!userData?.id_usuario) {
                      setErrorModalTitle('Error');
                      setErrorModalMessage('No se pudo identificar tu usuario. Por favor, recarga la página e intenta de nuevo.');
                      setErrorModalType('error');
                      setShowErrorModal(true);
                      return;
                    }

                    if (!reservaAReportar.id_reserva) {
                      setErrorModalTitle('Error');
                      setErrorModalMessage('No se pudo identificar la reserva a reportar.');
                      setErrorModalType('error');
                      setShowErrorModal(true);
                      return;
                    }

                    // Enviar reporte al backend
                    console.log('📝 Enviando reporte:', {
                      id_reserva: reservaAReportar.id_reserva,
                      id_usuario_reporta: userData.id_usuario,
                      razon: motivoReporte,
                      descripcion: descripcionReporte
                    });

                    const response = await ReportService.createReport({
                      id_reserva: reservaAReportar.id_reserva,
                      id_usuario_reporta: userData.id_usuario,
                      razon: motivoReporte,
                      descripcion: descripcionReporte || ''
                    });

                    console.log('✅ Reporte enviado exitosamente:', response);

                    // Cerrar modal y limpiar estados
                    setShowReportModal(false);
                    setReservaAReportar(null);
                    setMotivoReporte('');
                    setDescripcionReporte('');

                    // Mostrar mensaje de éxito
                    setErrorModalTitle('Reporte enviado');
                    setErrorModalMessage('Tu reporte ha sido enviado correctamente. El equipo de encargados lo revisará pronto.');
                    setErrorModalType('success');
                    setShowErrorModal(true);
                  } catch (error: any) {
                    console.error('❌ Error enviando reporte:', error);
                    // Mostrar mensaje de error
                    setErrorModalTitle('Error');
                    setErrorModalMessage(error.message || 'No se pudo enviar el reporte. Inténtalo de nuevo.');
                    setErrorModalType('error');
                    setShowErrorModal(true);
                  }
                }}
                disabled={!motivoReporte}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  motivoReporte
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Enviar reporte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de error/información/éxito */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalTitle}
        message={errorModalMessage}
        type={errorModalType}
      />
    </div>
  );
}