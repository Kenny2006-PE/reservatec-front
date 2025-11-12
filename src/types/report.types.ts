// Tipos para el sistema de reportes/denuncias

export type EstadoReporte = 'pendiente' | 'revisado' | 'sancionado' | 'rechazado';

export interface Reporte {
  id_reporte: number;
  razon: string;
  descripcion: string;
  estado: EstadoReporte;
  fecha_reporte: string;
  fecha_revision?: string | null;
  comentario_admin?: string | null;
  
  // Usuario que reporta
  reporta_nombre: string;
  reporta_apellido: string;
  
  // Usuario reportado
  reportado_nombre: string;
  reportado_apellido: string;
  reportado_dni: string;
  reportado_activo: boolean;
  
  // Reserva relacionada
  id_reserva: number;
  reserva_fecha: string;
  participantes: number;
  reserva_estado: string;
  
  // Área
  area_nombre: string;
  
  // Horario
  hora_inicio: string;
  hora_fin: string;
  
  // Admin que revisó
  admin_nombre?: string | null;
  admin_apellido?: string | null;
}

export interface CrearReporteDTO {
  id_reserva: number;
  id_usuario_reporta: number;
  razon: string;
  descripcion: string;
}

export interface SancionarReporteDTO {
  comentario: string;
}
