import axios from '@/lib/axios';
import { ApiResponse } from '@/types/user.types';
import { 
    Reserva, 
    ReservaRequest, 
    ReservaResponse, 
    Horario, 
    HorarioDisponible,
    Area
} from '@/types/reservation.types';

export class ReservationService {
    // Obtener áreas disponibles
    static async getAreas(): Promise<ApiResponse<Area[]>> {
        try {
            const response = await axios.get('/api/reservations/areas');
            return response.data;
        } catch (error: any) {
            console.error('Error obteniendo áreas:', error);
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

    // Obtener horarios disponibles para una fecha y área específica
    static async getHorariosDisponibles(areaId: number, fecha: string): Promise<ApiResponse<HorarioDisponible[]>> {
        try {
            const response = await axios.get(`/api/reservations/horarios-disponibles?area_id=${areaId}&fecha=${fecha}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener horarios disponibles');
        }
    }

    // Crear una nueva reserva
    static async crearReserva(reservaData: ReservaRequest): Promise<ReservaResponse> {
        try {
            const response = await axios.post('/api/reservations/crear', reservaData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al crear reserva');
        }
    }

    // Obtener reservas pendientes (para encargado)
    static async getReservasPendientes(): Promise<ApiResponse<Reserva[]>> {
        try {
            const response = await axios.get('/api/reservations/pendientes');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener reservas pendientes');
        }
    }

    // Obtener reservas activas (para encargado)
    static async getReservasActivas(): Promise<ApiResponse<Reserva[]>> {
        try {
            const response = await axios.get('/api/reservations/activas');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener reservas activas');
        }
    }

    // Aceptar una reserva (encargado)
    static async aceptarReserva(reservaId: number): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/api/reservations/${reservaId}/aceptar`, {});
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al aceptar reserva');
        }
    }

    // Rechazar una reserva (encargado)
    static async rechazarReserva(reservaId: number, comentario: string): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/api/reservations/${reservaId}/rechazar`, { comentario });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al rechazar reserva');
        }
    }

    // Obtener reservas del usuario
    static async getMisReservas(): Promise<ApiResponse<Reserva[]>> {
        try {
            const response = await axios.get('/api/reservations/mis-reservas');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener mis reservas');
        }
    }

    // Cancelar una reserva propia
    static async cancelarReserva(reservaId: number): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/api/reservations/${reservaId}/cancelar`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al cancelar reserva');
        }
    }
}