import { useState } from 'react';
import { UserRegisterData, UserFormState, Carrera } from '@/types/user.types';
import { UserService } from '@/services/user.service';

export const useUserForm = (initialUserId?: number) => {
    const [formState, setFormState] = useState<UserFormState>({
        isLoading: false,
        error: null,
        isSuccess: false
    });

    const [carreras, setCarreras] = useState<Carrera[]>([]);

    const loadCarreras = async () => {
        try {
            const response = await UserService.getCarreras();
            if (response.success && response.data) {
                setCarreras(response.data);
            }
        } catch (error: any) {
            console.error('Error loading carreras:', error);
        }
    };

    const loadUserData = async (userId: number) => {
        try {
            setFormState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await UserService.getUserById(userId);
            if (response.success && response.data) {
                return response.data;
            }
        } catch (error: any) {
            setFormState(prev => ({
                ...prev,
                error: error.message
            }));
        } finally {
            setFormState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const submitForm = async (data: UserRegisterData) => {
        try {
            setFormState({ isLoading: true, error: null, isSuccess: false });
            
            const response = initialUserId ?
                await UserService.updateUser(initialUserId, data) :
                await UserService.registerUser(data);

            setFormState({
                isLoading: false,
                error: null,
                isSuccess: true,
                userId: response.userId
            });

            return response;
        } catch (error: any) {
            setFormState({
                isLoading: false,
                error: error.message,
                isSuccess: false
            });
            throw error;
        }
    };

    return {
        formState,
        carreras,
        loadCarreras,
        loadUserData,
        submitForm
    };
};