import axios from '@/lib/axios';
import { ApiResponse } from '@/types/user.types';
import { 
    Reserva, 
    ReservaRequest, 
    ReservaResponse, 
    Horario, 
    HorarioDisponible,
    Area,
    Sancion
} from '@/types/reservation.types';

export class ReservationService {
    // Obtener áreas disponibles
    static async getAreas(): Promise<ApiResponse<Area[]>> {
        try {
            const response = await axios.get('/reservations/areas');
            return response.data;
        } catch (error: any) {
            console.error('Error obteniendo áreas:', error);
            throw new Error(error.response?.data?.message || 'Error al obtener áreas');
        }
    }

    // Obtener horarios disponibles
    static async getHorarios(): Promise<ApiResponse<Horario[]>> {
        try {
            const response = await axios.get('/reservations/horarios');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener horarios');
        }
    }

    // Obtener horarios disponibles para una fecha y área específica
    static async getHorariosDisponibles(areaId: number, fecha: string): Promise<ApiResponse<HorarioDisponible[]>> {
        try {
            const response = await axios.get(`/reservations/horarios-disponibles?area_id=${areaId}&fecha=${fecha}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener horarios disponibles');
        }
    }

    // Crear una nueva reserva
    static async crearReserva(reservaData: ReservaRequest): Promise<ReservaResponse> {
        try {
            const response = await axios.post('/reservations/crear', reservaData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al crear reserva');
        }
    }

    // Obtener reservas pendientes (para encargado)
    static async getReservasPendientes(): Promise<ApiResponse<Reserva[]>> {
        try {
            const response = await axios.get('/reservations/pendientes');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener reservas pendientes');
        }
    }

    // Obtener reservas activas (para encargado)
    static async getReservasActivas(): Promise<ApiResponse<Reserva[]>> {
        try {
            const response = await axios.get('/reservations/activas');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener reservas activas');
        }
    }

    // Aceptar una reserva (encargado)
    static async aceptarReserva(reservaId: number): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/reservations/${reservaId}/aceptar`, {});
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al aceptar reserva');
        }
    }

    // Rechazar una reserva (encargado)
    static async rechazarReserva(reservaId: number, comentario: string): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/reservations/${reservaId}/rechazar`, { comentario });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al rechazar reserva');
        }
    }

    // Obtener reservas del usuario
    static async getMisReservas(): Promise<ApiResponse<Reserva[]>> {
        try {
            const response = await axios.get('/reservations/mis-reservas');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener mis reservas');
        }
    }

    // Cancelar una reserva propia
    static async cancelarReserva(reservaId: number): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/reservations/${reservaId}/cancelar`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al cancelar reserva');
        }
    }

    // ============================================================
    // NUEVAS FUNCIONALIDADES: Control de Devolución de Materiales
    // ============================================================

    // Obtener reservas con material (para encargado)
    static async getReservasConMaterial(filtro: 'todas' | 'pendientes' | 'devueltas' | 'no_devueltas' = 'todas'): Promise<ApiResponse<Reserva[]>> {
        try {
            const response = await axios.get(`/reservations/con-material?filtro=${filtro}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener reservas con material');
        }
    }

    // Marcar material como devuelto o no devuelto
    static async marcarDevuelto(reservaId: number, devuelto: boolean): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/reservations/${reservaId}/marcar-devuelto`, { devuelto });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al marcar devolución');
        }
    }

    // Marcar material como NO devuelto y suspender usuario automáticamente
    static async marcarNoDevueltoYSuspender(reservaId: number, descripcion?: string): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/reservations/${reservaId}/marcar-no-devuelto-suspender`, { descripcion });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al marcar como no devuelto');
        }
    }

    // Obtener historial de sanciones de un usuario
    static async getSancionesUsuario(userId: number): Promise<ApiResponse<Sancion[]>> {
        try {
            const response = await axios.get(`/reservations/usuario/${userId}/sanciones`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener sanciones');
        }
    }

    // Levantar suspensión de usuario
    static async levantarSuspension(userId: number): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/reservations/usuario/${userId}/levantar-suspension`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al levantar suspensión');
        }
    }

    // ============================================================
    // Obtener reservas por área y fecha
    // ============================================================
    static async getReservationsByAreaAndDate(areaId: number, fecha: string): Promise<any[]> {
        try {
            const response = await axios.get(`/reservations/area/${areaId}/fecha/${fecha}`);
            return response.data.data || [];
        } catch (error: any) {
            console.error('Error obteniendo reservas por área y fecha:', error);
            return [];
        }
    }
}