// Script de prueba para notificaciones push
// Ejecuta esto en la consola del navegador después de suscribirte

console.log('🧪 Iniciando pruebas de notificaciones...');

// 1. Verificar soporte
if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
  console.log('✅ Navegador soporta notificaciones push');
  console.log('📊 Permiso actual:', Notification.permission);
} else {
  console.log('❌ Navegador NO soporta notificaciones push');
}

// 2. Verificar Service Worker
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg) {
    console.log('✅ Service Worker registrado:', reg);
    console.log('📍 Scope:', reg.scope);
    console.log('🔄 Estado:', reg.active ? 'Activo' : 'Inactivo');
  } else {
    console.log('❌ Service Worker NO registrado');
  }
});

// 3. Verificar suscripción
navigator.serviceWorker.ready.then(reg => {
  return reg.pushManager.getSubscription();
}).then(sub => {
  if (sub) {
    console.log('✅ Suscripción activa:', sub);
    console.log('📡 Endpoint:', sub.endpoint);
  } else {
    console.log('❌ NO hay suscripción activa');
  }
});

// 4. Probar notificación local (sin servidor)
async function testLocalNotification() {
  if (Notification.permission === 'granted') {
    new Notification('🧪 Prueba Local', {
      body: 'Esta es una notificación de prueba local',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      tag: 'test-local'
    });
    console.log('✅ Notificación local enviada');
  } else {
    console.log('❌ Permiso denegado para notificaciones');
  }
}

// 5. Probar notificación desde el servidor
async function testServerNotification() {
  try {
    const response = await fetch('/api/notifications/test', {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    console.log('✅ Respuesta del servidor:', data);
  } catch (error) {
    console.error('❌ Error al enviar notificación de prueba:', error);
  }
}

console.log('\n📝 Comandos disponibles:');
console.log('testLocalNotification() - Prueba notificación local');
console.log('testServerNotification() - Prueba notificación desde servidor');
