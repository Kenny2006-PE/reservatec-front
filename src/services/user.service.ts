import axios from '@/lib/axios';
import { ApiResponse, Carrera, UserRegisterData } from '@/types/user.types';

export class UserService {
    static async registerUser(userData: UserRegisterData): Promise<ApiResponse> {
        try {
            const response = await axios.post('/api/users/register', userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al registrar usuario');
        }
    }

    static async updateUser(userId: number, userData: UserRegisterData): Promise<ApiResponse> {
        try {
            const response = await axios.put(`/api/users/${userId}`, userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
        }
    }

    static async getUserById(userId: number): Promise<ApiResponse<UserRegisterData>> {
        try {
            const response = await axios.get(`/api/users/${userId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener usuario');
        }
    }

    static async getCarreras(): Promise<ApiResponse<Carrera[]>> {
        try {
            const response = await axios.get('/api/users/carreras');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Error al obtener carreras');
        }
    }
}