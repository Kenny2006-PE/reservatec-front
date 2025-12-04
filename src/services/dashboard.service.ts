import axios from '@/lib/axios';
import { ApiResponse } from '@/types/user.types';

export interface ReservaReciente {
  id_reserva: number;
  fecha: string;
  fecha_formato: string;
  estado: string;
  estado_texto: string;
  area_nombre: string;
  usuario_nombre: string;
  usuario_apellido: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface ActividadSistema {
  accion: string;
  usuario: string;
  tiempo_relativo: string;
}

export interface DashboardStats {
  // Datos en tiempo real
  reservasActivas: number;
  reservasPendientes: number;
  totalUsuarios: number;
  areasDisponibles: number;
  
  // Actividad reciente
  reservasRecientes: ReservaReciente[];
  actividadSistema: ActividadSistema[];
  
  // Datos históricos
  reservasMensuales: {
    mes: string;
    cantidad: number;
  }[];
  
  // Métricas adicionales
  totalReservas?: number;
  variacionReservas?: number;
  usuariosActivos?: number;
  variacionUsuarios?: number;
  areaMasPopular?: {
    nombre: string;
    porcentaje: number;
  };
  reportes?: number;
  variacionReportes?: number;
  reservasSemanales?: {
    dia: string;
    cantidad: number;
  }[];
}

export class DashboardService {
  // Obtener todas las estadísticas del dashboard
  static async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await axios.get('/dashboard/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  }

  // Exportar estadísticas a Excel
  static async exportToExcel(): Promise<Blob> {
    try {
      const response = await axios.get('/dashboard/export/excel', {
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
      return new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
    } catch (error: any) {
      console.error('Error al exportar a Excel:', error);
      throw new Error('Error al exportar a Excel');
    }
  }

  // Exportar estadísticas a PDF
  static async exportToPDF(): Promise<Blob> {
    try {
      const response = await axios.get('/dashboard/export/pdf', {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      return new Blob([response.data], { type: 'application/pdf' });
    } catch (error: any) {
      console.error('Error al exportar a PDF:', error);
      throw new Error('Error al exportar a PDF');
    }
  }
}
