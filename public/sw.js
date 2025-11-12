// Service Worker para notificaciones push
// Este archivo debe estar en la carpeta public/

self.addEventListener('install', (event) => {
  console.log('✅ Service Worker instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activado');
  event.waitUntil(self.clients.claim());
});

// Escuchar notificaciones push
self.addEventListener('push', (event) => {
  console.log('📬 Notificación recibida:', event);
  
  if (!event.data) {
    console.log('❌ No hay datos en la notificación');
    return;
  }

  try {
    const data = event.data.json();
    console.log('📦 Datos de la notificación:', data);

    const options = {
      body: data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/badge-72x72.png',
      image: data.image,
      vibrate: data.vibrate || [200, 100, 200],
      tag: data.tag,
      requireInteraction: data.requireInteraction || false,
      data: data.data,
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('❌ Error al procesar notificación:', error);
  }
});

// Manejar clicks en la notificación
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Click en notificación:', event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  const notificationId = event.notification.data?.notificationId;

  // Marcar notificación como clickeada
  if (notificationId) {
    fetch(`/api/notifications/${notificationId}/clicked`, {
      method: 'POST',
      credentials: 'include'
    }).catch(err => console.error('Error al marcar notificación:', err));
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Buscar si ya hay una ventana abierta
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Si no hay ventana abierta, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Manejar cierre de notificación
self.addEventListener('notificationclose', (event) => {
  console.log('❌ Notificación cerrada:', event.notification.tag);
});
