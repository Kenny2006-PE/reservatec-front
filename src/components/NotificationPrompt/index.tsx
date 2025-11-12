"use client";

import { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationPrompt() {
  const { isSupported, isSubscribed, permission, isLoading, subscribe } = useNotifications();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // DESHABILITADO TEMPORALMENTE - Las notificaciones push están en desarrollo
    // Para activarlas manualmente, el usuario puede ir a la página /notificaciones
    
    // if (isSupported && !isSubscribed && permission === 'default') {
    //   const timer = setTimeout(() => {
    //     setShowPrompt(true);
    //   }, 5000); // Mostrar después de 5 segundos
    //   return () => clearTimeout(timer);
    // }
  }, [isSupported, isSubscribed, permission]);

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Guardar en localStorage para no mostrar de nuevo en 7 días
    localStorage.setItem('notification-prompt-dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              ¿Activar Notificaciones?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Recibe notificaciones cuando tu reserva sea aprobada, recordatorios antes de tu turno, y alertas importantes.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Activando...' : 'Activar'}
              </button>
              <button
                onClick={handleDismiss}
                disabled={isLoading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                Ahora no
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
