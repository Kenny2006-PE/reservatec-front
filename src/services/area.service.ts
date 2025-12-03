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
  // Obtener todas las áreas (lista simple)
  static async getAreas(): Promise<ApiResponse<{ id_area: number; nombre: string; habilitada: boolean }[]>> {
    try {
      const response = await axios.get('/reservations/areas');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener áreas:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener áreas');
    }
  }

  // Obtener todas las áreas con su configuración
  static async getAreasConfig(): Promise<ApiResponse<AreaConfig[]>> {
    try {
      const response = await axios.get('/areas/config');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener configuración de áreas:', error);
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

  // Verificar si un área está disponible para una fecha
  static async checkAvailability(areaId: number, fecha: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await axios.get(`/areas/check-availability`, {
        params: { area_id: areaId, fecha }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error verificando disponibilidad:', error);
      throw new Error(error.response?.data?.message || 'Error al verificar disponibilidad');
    }
  }
}
