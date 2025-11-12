'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Solo ejecutar en el cliente y si el Service Worker está soportado
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Esperar un poco para que el DOM esté completamente cargado
      const timer = setTimeout(() => {
        // Registrar el Service Worker al cargar la página
        navigator.serviceWorker
          .register('/sw.js', { 
            scope: '/',
            updateViaCache: 'none' // No cachear el Service Worker
          })
          .then((registration) => {
            console.log('✅ Service Worker registrado correctamente');
            console.log('   Scope:', registration.scope);
            console.log('   Active:', registration.active);
            
            // Actualizar si hay una nueva versión
            registration.update();
          })
          .catch((error) => {
            console.error('❌ Error al registrar Service Worker:', error);
            console.error('   Detalles:', error.message);
          });
      }, 100); // Pequeño delay para evitar problemas de timing

      return () => clearTimeout(timer);
    } else {
      console.warn('⚠️ Service Workers no están soportados en este navegador');
    }
  }, []);

  return null; // Este componente no renderiza nada
}
