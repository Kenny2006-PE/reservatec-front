import axios from '@/lib/axios';

export interface ReservationData {
  id_usuario: number;
  id_area: number;
  id_horario: number;
  fecha: string;
  participantes: number;
  material: boolean;
}

export interface ReservationResponse {
  id_reserva: number;
  id_usuario: number;
  id_area: number;
  id_horario: number;
  fecha: string;
  participantes: number;
  material: boolean;
  estado: 'pendiente' | 'aceptado' | 'cancelado' | 'finalizado';
  id_comentario?: number;
  area_nombre: string;
  hora_inicio: string;
  hora_fin: string;
  usuario_nombre: string;
  usuario_apellido: string;
  usuario_correo: string;
  usuario_codigo: string;
  usuario_dni: string;
  comentario?: string;
}

export interface Area {
  id_area: number;
  nombre: string;
}

export interface Horario {
  id_horario: number;
  hora_inicio: string;
  hora_fin: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  available?: boolean;
  reservationId?: number;
}

export class ReservationService {
  // Crear nueva reserva
  static async createReservation(reservationData: ReservationData): Promise<ApiResponse> {
    try {
      const response = await axios.post('/api/reservations', reservationData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear reserva');
    }
  }

  // Obtener mis reservas
  static async getMyReservations(userId: number): Promise<ApiResponse<ReservationResponse[]>> {
    try {
      const response = await axios.get(`/api/reservations/my-reservations?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reservas');
    }
  }

  // Obtener reservas pendientes (para encargados)
  static async getPendingReservations(): Promise<ApiResponse<ReservationResponse[]>> {
    try {
      const response = await axios.get('/api/reservations/admin/pending');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reservas pendientes');
    }
  }

  // Obtener reservas activas del día (para encargados)
  static async getActiveReservationsToday(): Promise<ApiResponse<ReservationResponse[]>> {
    try {
      const response = await axios.get('/api/reservations/admin/active-today');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reservas activas');
    }
  }

  // Aprobar reserva
  static async approveReservation(reservationId: number, comentario?: string): Promise<ApiResponse> {
    try {
      const response = await axios.put(`/api/reservations/${reservationId}/approve`, {
        comentario
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al aprobar reserva');
    }
  }

  // Rechazar reserva
  static async rejectReservation(reservationId: number, comentario?: string): Promise<ApiResponse> {
    try {
      const response = await axios.put(`/api/reservations/${reservationId}/reject`, {
        comentario
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al rechazar reserva');
    }
  }

  // Cancelar reserva
  static async cancelReservation(reservationId: number, comentario?: string): Promise<ApiResponse> {
    try {
      const response = await axios.put(`/api/reservations/${reservationId}/cancel`, {
        comentario
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cancelar reserva');
    }
  }

  // Obtener áreas disponibles
  static async getAreas(): Promise<ApiResponse<Area[]>> {
    try {
      const response = await axios.get('/api/reservations/areas');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener áreas');
    }
  }

  // Obtener horarios disponibles
  static async getHorarios(): Promise<ApiResponse<Horario[]>> {
    try {
      const response = await axios.get('/api/reservations/horarios');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener horarios');
    }
  }

  // Verificar disponibilidad
  static async checkAvailability(areaId: number, horarioId: number, fecha: string): Promise<ApiResponse> {
    try {
      const response = await axios.get('/api/reservations/check-availability', {
        params: { areaId, horarioId, fecha }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al verificar disponibilidad');
    }
  }

  // Obtener horarios disponibles para una fecha y área
  static async getAvailableTimeSlots(areaId: number, fecha: string): Promise<ApiResponse<Horario[]>> {
    try {
      const response = await axios.get('/api/reservations/available-slots', {
        params: { areaId, fecha }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener horarios disponibles');
    }
  }

  // Obtener detalle de reserva
  static async getReservationDetail(reservationId: number): Promise<ApiResponse<ReservationResponse>> {
    try {
      const response = await axios.get(`/api/reservations/${reservationId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener detalle de reserva');
    }
  }

  // Utilidades para el frontend
  static getStatusColor(estado: string): string {
    switch (estado) {
      case 'aceptado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  static getStatusText(estado: string): string {
    switch (estado) {
      case 'aceptado':
        return 'Aceptado';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      case 'finalizado':
        return 'Finalizado';
      default:
        return estado;
    }
  }

  static formatTime(time: string): string {
    return time.substring(0, 5); // "08:00:00" -> "08:00"
  }

  static formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  }
}