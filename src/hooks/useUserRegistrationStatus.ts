import { useEffect, useState, useRef, useMemo } from 'react';
import { getUserEmail } from '@/utils/auth';
import axios from '@/lib/axios';
import { UserRegisterData } from '@/types/user.types';

interface UseUserRegistrationStatusReturn {
    isRegistered: boolean;
    userData: UserRegisterData | null;
    loading: boolean;
}

export const useUserRegistrationStatus = (): UseUserRegistrationStatusReturn => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [userData, setUserData] = useState<UserRegisterData | null>(null);
    const [loading, setLoading] = useState(true);
    const hasCheckedRef = useRef(false);

    console.log('[useUserRegistrationStatus] HOOK LLAMADO');

    useEffect(() => {
        const checkRegistrationStatus = async () => {
            console.log('[useUserRegistrationStatus] useEffect ejecutado, hasCheckedRef:', hasCheckedRef.current);
            if (hasCheckedRef.current) return;
            hasCheckedRef.current = true;

            try {
                const email = getUserEmail();
                if (!email) {
                    setLoading(false);
                    setIsRegistered(false);
                    setUserData(null);
                    return;
                }

                const response = await axios.get(`/users/check-registration?email=${encodeURIComponent(email)}`);
                const { isRegistered, userData } = response.data;
                
                console.log('[useUserRegistrationStatus] Respuesta recibida:', { isRegistered, userData });
                
                setIsRegistered(!!isRegistered);
                setUserData(userData || null);
            } catch (error: any) {
                console.error('[useUserRegistrationStatus] Error:', error.response?.status, error.message);
                setIsRegistered(false);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        checkRegistrationStatus();
    }, []);

    const memoizedUserData = useMemo<UserRegisterData | null>(() => {
        if (!userData) return null;
        return { ...userData };
    }, [
        userData?.id_usuario,
        userData?.dni, 
        userData?.nombre, 
        userData?.apellido, 
        userData?.correo,
        userData?.id_carrera, 
        userData?.condicion_med
    ]);

    return useMemo(() => ({
        isRegistered,
        userData: memoizedUserData,
        loading
    }), [isRegistered, memoizedUserData, loading]);
};
