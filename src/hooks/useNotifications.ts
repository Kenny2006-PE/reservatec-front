import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar si el navegador soporta notificaciones
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  // Verificar si ya existe una suscripción
  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setIsSubscribed(true);
        setSubscription(existingSubscription);
      }
    } catch (error) {
      console.error('Error al verificar suscripción:', error);
    }
  };

  // Solicitar permiso y suscribirse
  const subscribe = useCallback(async () => {
    if (!isSupported) {
      alert('Tu navegador no soporta notificaciones push');
      return false;
    }

    setIsLoading(true);

    try {
      // Pedir permiso al usuario
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        alert('Necesitas permitir las notificaciones para continuar');
        return false;
      }

      // Esperar a que el service worker esté listo (ya se registró en el layout)
      console.log('⏳ Esperando Service Worker...');
      const registration = await navigator.serviceWorker.ready;
      console.log('✅ Service Worker listo:', registration);

      // Obtener la clave pública VAPID del servidor
      console.log('⏳ Obteniendo clave VAPID...');
      const { data } = await axios.get('/api/notifications/vapid-public-key');
      const vapidPublicKey = data.publicKey;
      console.log('✅ Clave VAPID obtenida');

      // Crear suscripción
      console.log('⏳ Creando suscripción push...');
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
      });
      console.log('✅ Suscripción push creada');

      // Detectar información del dispositivo
      const deviceInfo = {
        deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: detectBrowser()
      };

      // Enviar suscripción al servidor
      console.log('⏳ Guardando suscripción en el servidor...');
      await axios.post('/api/notifications/subscribe', {
        subscription: pushSubscription.toJSON(),
        deviceInfo
      });

      setIsSubscribed(true);
      setSubscription(pushSubscription);
      
      console.log('✅ Suscripción completada exitosamente');
      alert('✅ ¡Notificaciones activadas! Recibirás alertas cuando tus reservas sean aprobadas o rechazadas.');
      return true;
    } catch (error) {
      console.error('❌ Error al suscribirse:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Mensaje de error más amigable
      if (errorMessage.includes('push service error') || errorMessage.includes('Registration failed')) {
        alert('⚠️ Las notificaciones push aún están en desarrollo.\n\n' +
              'Por el momento, puedes revisar tus reservas manualmente en "Mis Reservas".\n\n' +
              'Estamos trabajando para activar esta función pronto.');
      } else {
        alert('Error al activar notificaciones: ' + errorMessage);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Desuscribirse
  const unsubscribe = useCallback(async () => {
    if (!subscription) return;

    setIsLoading(true);

    try {
      // Desuscribir del navegador
      await subscription.unsubscribe();

      // Notificar al servidor
      await axios.post('/api/notifications/unsubscribe', {
        endpoint: subscription.endpoint
      });

      setIsSubscribed(false);
      setSubscription(null);
      
      console.log('✅ Desuscripción exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error al desuscribirse:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  // Enviar notificación de prueba
  const sendTestNotification = useCallback(async () => {
    try {
      await axios.post('/api/notifications/test');
      console.log('✅ Notificación de prueba enviada');
      return true;
    } catch (error) {
      console.error('❌ Error al enviar notificación de prueba:', error);
      return false;
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    unsubscribe,
    sendTestNotification
  };
}

// Utilidad para convertir VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Detectar navegador
function detectBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
}
