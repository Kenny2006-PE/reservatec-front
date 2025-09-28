// Función para obtener el email del usuario desde las cookies
export const getUserEmail = (): string => {
    // En un entorno de cliente, podemos acceder a document
    if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        console.log('Cookies encontradas:', cookies);
        
        const userDataCookie = cookies.find(cookie => cookie.trim().startsWith('userData='));
        console.log('Cookie de usuario encontrada:', userDataCookie);
        
        if (userDataCookie) {
            try {
                const cookieValue = userDataCookie.split('=')[1];
                console.log('Valor de la cookie:', cookieValue);
                
                const decodedValue = decodeURIComponent(cookieValue);
                console.log('Valor decodificado:', decodedValue);
                
                const userData = JSON.parse(decodedValue);
                console.log('Datos de usuario parseados:', userData);
                
                if (!userData.email) {
                    console.error('No se encontró email en los datos del usuario');
                }
                
                return userData.email || '';
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error procesando datos del usuario:', error.message);
                    console.error('Stack trace:', error.stack);
                } else {
                    console.error('Error desconocido procesando datos del usuario:', error);
                }
            }
        } else {
            console.error('No se encontró la cookie userData');
        }
    } else {
        console.error('No estamos en el navegador');
    }
    return '';
};