import { useState, useCallback, useRef, useMemo } from 'react';
import { UserRegisterData, UserFormState, Carrera } from '@/types/user.types';
import { UserService } from '@/services/user.service';

export const useUserForm = (initialUserId?: number) => {
    const [formState, setFormState] = useState<UserFormState>({
        isLoading: false,
        error: null,
        isSuccess: false
    });

    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const carrerasLoadedRef = useRef(false);

    console.log('[useUserForm] HOOK LLAMADO');

    const loadCarreras = useCallback(async () => {
        console.log('[useUserForm] loadCarreras ejecutado, carrerasLoadedRef:', carrerasLoadedRef.current);
        if (carrerasLoadedRef.current) return;
        // SIEMPRE marcar como loaded, incluso si falla, para evitar bucle infinito
        carrerasLoadedRef.current = true;
        try {
            const response = await UserService.getCarreras();
            if (response.success && response.data) {
                setCarreras(response.data);
            }
        } catch (error: any) {
            console.error('[useUserForm] Error loading carreras:', error);
            // NO resetear carrerasLoadedRef para evitar bucle
            setCarreras([]); // Dejar vacío en caso de error
        }
    }, []);

    const loadUserData = useCallback(async (userId: number) => {
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
    }, []);

    const submitForm = useCallback(async (data: UserRegisterData) => {
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
    }, [initialUserId]);

    // Memoizar el objeto de retorno completo para evitar re-renders innecesarios
    return useMemo(() => ({
        formState,
        carreras,
        loadCarreras,
        loadUserData,
        submitForm
    }), [formState, carreras, loadCarreras, loadUserData, submitForm]);
};