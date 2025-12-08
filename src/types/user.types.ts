export interface Carrera {
    id_carrera: number;
    nombre: string;
}

export interface UserRegisterData {
    id_usuario: number;
    nombre: string;
    apellido: string;
    dni: string;
    id_carrera: number;
    condicion_med?: string;
    correo: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    userId?: number;
}

export interface UserFormState {
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
    userId?: number;
}