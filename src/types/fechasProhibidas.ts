/**
 * Tipos para el sistema de fechas prohibidas
 */

export interface FechaProhibida {
  id_fecha_prohibida: number;
  nombre_evento: string;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string; // YYYY-MM-DD
  descripcion?: string;
  activo: boolean;
  fecha_creacion?: string;
}

export interface EventoPreview {
  nombre_evento: string;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion?: string;
  fila?: number;
}

export interface ErrorEvento {
  fila: number;
  error: string;
}

export interface ResultadoProcesamiento {
  eventos: EventoPreview[];
  errors: ErrorEvento[];
  total: number;
  errores: number;
}

export interface ValidacionFecha {
  esProhibida: boolean;
  evento: {
    id_fecha_prohibida: number;
    nombre_evento: string;
    fecha_inicio: string;
    fecha_fin: string;
  } | null;
}

export interface FechaIndividual {
  fecha: string; // YYYY-MM-DD
  evento: string;
}

// Respuestas de la API
export interface ApiResponse<T> {
  mensaje: string;
  data: T;
  total?: number;
}

export interface ApiError {
  error: string;
}
