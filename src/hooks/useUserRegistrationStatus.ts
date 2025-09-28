import { useEffect, useState } from 'react';
import { getUserEmail } from '@/utils/auth';
import axios from '@/lib/axios';
import { UserRegisterData } from '@/types/user.types';

export const useUserRegistrationStatus = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [userData, setUserData] = useState<UserRegisterData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRegistrationStatus = async () => {
            try {
                const email = getUserEmail();
                if (!email) {
                    setLoading(false);
                    return;
                }

                console.log('Checking registration for email:', email);
                console.log('API URL:', process.env.NEXT_PUBLIC_BACKEND_API_URL);
                console.log('Token:', localStorage.getItem('jwt'));
                
                const response = await axios.get(`/api/users/check-registration?email=${encodeURIComponent(email)}`);
                console.log('Response:', response);
                const { isRegistered, userData } = response.data;
                
                setIsRegistered(isRegistered);
                setUserData(userData);
            } catch (error) {
                console.error('Error checking registration status:', error);
                setIsRegistered(false);
            } finally {
                setLoading(false);
            }
        };

        checkRegistrationStatus();
    }, []);

    return { isRegistered, userData, loading };
};