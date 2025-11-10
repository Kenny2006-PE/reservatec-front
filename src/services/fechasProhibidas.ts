import axios from '@/lib/axios';
import type {
  FechaProhibida,
  ResultadoProcesamiento,
  ValidacionFecha,
  FechaIndividual,
  ApiResponse,
  EventoPreview
} from '@/types/fechasProhibidas';

const BASE_URL = '/api/reservations/fechas-prohibidas';

/**
 * Subir archivo Excel para procesar fechas prohibidas
 */
export const subirExcelFechasProhibidas = async (
  archivo: File
): Promise<ResultadoProcesamiento> => {
  const formData = new FormData();
  formData.append('archivo', archivo);

  const { data } = await axios.post<ApiResponse<ResultadoProcesamiento>>(
    `${BASE_URL}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return data.data;
};

/**
 * Obtener todas las fechas prohibidas activas
 */
export const obtenerFechasProhibidas = async (): Promise<FechaProhibida[]> => {
  const { data } = await axios.get<ApiResponse<FechaProhibida[]>>(BASE_URL);
  return data.data;
};

/**
 * Guardar múltiples eventos (batch)
 */
export const guardarEventosBatch = async (
  eventos: EventoPreview[]
): Promise<{ id: number; nombre_evento: string }[]> => {
  const { data } = await axios.post<ApiResponse<{ id: number; nombre_evento: string }[]>>(
    `${BASE_URL}/batch`,
    { eventos }
  );
  return data.data;
};

/**
 * Eliminar una fecha prohibida
 */
export const eliminarFechaProhibida = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

/**
 * Validar si una fecha específica está prohibida
 */
export const validarFecha = async (fecha: string): Promise<ValidacionFecha> => {
  const { data } = await axios.get<ApiResponse<ValidacionFecha>>(
    `${BASE_URL}/validar`,
    {
      params: { fecha },
    }
  );
  return data.data;
};

/**
 * Obtener fechas prohibidas en un rango
 */
export const obtenerFechasEnRango = async (
  fechaInicio: string,
  fechaFin: string
): Promise<FechaProhibida[]> => {
  const { data } = await axios.get<ApiResponse<FechaProhibida[]>>(
    `${BASE_URL}/rango`,
    {
      params: { fechaInicio, fechaFin },
    }
  );
  return data.data;
};

/**
 * Obtener todas las fechas individuales prohibidas (expandidas desde rangos)
 */
export const obtenerTodasLasFechasIndividuales = async (): Promise<FechaIndividual[]> => {
  const { data } = await axios.get<ApiResponse<FechaIndividual[]>>(
    `${BASE_URL}/todas`
  );
  return data.data;
};
