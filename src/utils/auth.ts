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

// Función para obtener el nombre del usuario desde las cookies
export const getUserName = (): string => {
    if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        const userDataCookie = cookies.find(cookie => cookie.trim().startsWith('userData='));
        
        if (userDataCookie) {
            try {
                const cookieValue = userDataCookie.split('=')[1];
                const decodedValue = decodeURIComponent(cookieValue);
                const userData = JSON.parse(decodedValue);
                return userData.nombre || '';
            } catch (error) {
                console.error('Error obteniendo nombre del usuario:', error);
            }
        }
    }
    return '';
};

// Función para obtener el apellido del usuario desde las cookies
export const getUserLastName = (): string => {
    if (typeof window !== 'undefined') {
        const cookies = document.cookie.split(';');
        const userDataCookie = cookies.find(cookie => cookie.trim().startsWith('userData='));
        
        if (userDataCookie) {
            try {
                const cookieValue = userDataCookie.split('=')[1];
                const decodedValue = decodeURIComponent(cookieValue);
                const userData = JSON.parse(decodedValue);
                return userData.apellido || '';
            } catch (error) {
                console.error('Error obteniendo apellido del usuario:', error);
            }
        }
    }
    return '';
};

// Función para obtener el nombre completo del usuario
export const getUserFullName = (): string => {
    const nombre = getUserName();
    const apellido = getUserLastName();
    
    if (nombre && apellido) {
        return `${nombre} ${apellido}`;
    } else if (nombre) {
        return nombre;
    } else if (apellido) {
        return apellido;
    }
    return 'Usuario';
};