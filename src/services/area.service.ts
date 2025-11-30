import axios from '@/lib/axios';
import { ApiResponse } from '@/types/user.types';

export interface AreaConfig {
  id_area: number;
  nombre: string;
  descripcion: string;
  habilitada: boolean;
  diasDeshabilitados: string[];
  horariosDeshabilitados: number[];
  stock: number;
}

export class AreaService {
  // Obtener todas las áreas con su configuración
  static async getAreasConfig(): Promise<ApiResponse<AreaConfig[]>> {
    try {
      const response = await axios.get('/areas/config');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener áreas');
    }
  }

  // Actualizar configuración de un área
  static async updateAreaConfig(areaId: number, config: Partial<AreaConfig>): Promise<ApiResponse> {
    try {
      const response = await axios.put(`/areas/config/${areaId}`, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar área');
    }
  }

  // Verificar si un área está disponible para una fecha y horario
  static async checkAreaAvailability(areaId: number, fecha: string, horarioId: number): Promise<boolean> {
    try {
      const response = await axios.get(`/api/areas/check-availability`, {
        params: { areaId, fecha, horarioId }
      });
      return response.data.available;
    } catch (error: any) {
      console.error('Error verificando disponibilidad:', error);
      return false;
    }
  }
}
