// Service Worker para Kudimu - Push Notifications
const CACHE_NAME = 'kudimu-v1';

// Instalação
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...');
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Push notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'Kudimu Insights',
    body: 'Nova notificação disponível',
    icon: '/manifest-icon-192.png'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (err) {
      console.error('Erro no parse da notificação:', err);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      tag: 'kudimu-notification',
      data: data.data || {}
    })
  );
});

// Click na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/campaigns';
  
  event.waitUntil(
    clients.openWindow(targetUrl)
  );
});