import axios from '@/lib/axios';
import { ApiResponse } from '@/types/user.types';
import { Reporte, CrearReporteDTO, SancionarReporteDTO, EstadoReporte } from '@/types/report.types';

export class ReportService {
  // Crear un nuevo reporte (usuario reporta una reserva)
  static async createReport(data: CrearReporteDTO): Promise<ApiResponse<{ id_reporte: number }>> {
    try {
      const response = await axios.post('/api/reports', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear reporte');
    }
  }

  // Obtener todos los reportes (para encargado)
  static async getAllReports(filtro?: EstadoReporte | 'todas'): Promise<ApiResponse<Reporte[]>> {
    try {
      const params = filtro ? { filtro } : {};
      const response = await axios.get('/api/reports', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reportes');
    }
  }

  // Obtener reportes de un usuario específico
  static async getReportsByUser(userId: number): Promise<ApiResponse<Reporte[]>> {
    try {
      const response = await axios.get(`/api/reports/usuario/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reportes del usuario');
    }
  }

  // Sancionar usuario desde un reporte
  static async sancionarDesdeReporte(reporteId: number, data: SancionarReporteDTO): Promise<ApiResponse<null>> {
    try {
      const response = await axios.put(`/api/reports/${reporteId}/sancionar`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al sancionar usuario');
    }
  }

  // Rechazar un reporte
  static async rechazarReporte(reporteId: number, data: SancionarReporteDTO): Promise<ApiResponse<null>> {
    try {
      const response = await axios.put(`/api/reports/${reporteId}/rechazar`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al rechazar reporte');
    }
  }

  // Marcar como revisado
  static async marcarRevisado(reporteId: number, comentario?: string): Promise<ApiResponse<null>> {
    try {
      const response = await axios.put(`/api/reports/${reporteId}/marcar-revisado`, { comentario });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al marcar como revisado');
    }
  }
}
