import axios from '@/lib/axios';
import { ApiResponse, Carrera, UserRegisterData } from '@/types/user.types';

export class UserService {
    static async registerUser(userData: UserRegisterData): Promise<ApiResponse> {
        try {
            const response = await axios.post('/users/register', userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al registrar usuario');
        }
    }

    static async updateUser(userId: number, userData: UserRegisterData): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
        }
    }

    static async getUserById(userId: number): Promise<ApiResponse<UserRegisterData>> {
        try {
            const response = await axios.get(`/users/${userId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener usuario');
        }
    }

    static async getCarreras(): Promise<ApiResponse<Carrera[]>> {
        try {
            const response = await axios.get('/users/carreras');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener carreras');
        }
    }

    // Obtener todos los usuarios
    static async getUsuarios(): Promise<ApiResponse<any[]>> {
        try {
            const response = await axios.get('/users/usuarios');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
        }
    }

    // Cambiar estado de usuario
    static async cambiarEstadoUsuario(userId: number, estado: 'activo' | 'suspendido'): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/users/usuarios/${userId}/estado`, { estado });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al cambiar estado del usuario');
        }
    }
}