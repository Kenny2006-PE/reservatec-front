export interface Horario {
    id_horario: number;
    hora_inicio: string;
    hora_fin: string;
}

export interface Area {
    id_area: number;
    nombre: string;
}

export interface Reserva {
    id_reserva: number;
    id_usuario: number;
    id_area: number;
    id_horario: number;
    fecha: string;
    participantes: number;
    material: boolean;
    estado: 'pendiente' | 'aceptado' | 'cancelado' | 'finalizado' | 'rechazado';
    id_comentario?: number;
    comentario_encargado?: string;
    // Datos del usuario (para vistas del encargado)
    usuario_nombre?: string;
    usuario_apellido?: string;
    usuario_dni?: string;
    usuario_codigo?: string;
    usuario_correo?: string;
    // Datos del área
    area_nombre?: string;
    // Datos del horario
    horario_inicio?: string;
    horario_fin?: string;
    // Comentario (si existe)
    comentario?: string;
    
    // Propiedades adicionales para compatibilidad con la vista
    id?: number;
    area?: string;
    horario?: string;
    estudiante?: string;
    dni?: string;
    codigoInstitucional?: string;
    materialDeportivo?: string;
}

export interface ReservaRequest {
    id_area: number;
    id_horario: number;
    fecha: string;
    participantes: number;
    material: boolean;
}

export interface ReservaResponse extends Reserva {
    success: boolean;
    message?: string;
}

export interface HorarioDisponible extends Horario {
    disponible: boolean;
    reservado?: boolean;
}