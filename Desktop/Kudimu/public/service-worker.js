/* eslint-disable no-restricted-globals */
// Service Worker para Kudimu Insights
// Push Notifications, Cache Strategy e Offline Support

const CACHE_NAME = 'kudimu-v1';
const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

// Recursos para cache
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('[Service Worker] Erro ao cachear:', err);
      })
  );
  
  // Ativa imediatamente sem esperar
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Toma controle imediatamente
  return self.clients.claim();
});

// Estratégia de fetch: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET
  if (event.request.method !== 'GET') return;
  
  // Ignora requisições para API (sempre buscar do servidor)
  if (event.request.url.includes(API_URL)) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clona a resposta
        const responseClone = response.clone();
        
        // Atualiza o cache
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // Se falhar, tenta buscar do cache
        return caches.match(event.request);
      })
  );
});

// ========== PUSH NOTIFICATIONS ==========

// Recebe notificação push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recebido:', event);
  
  let notificationData = {
    title: 'Kudimu Insights',
    body: 'Nova notificação disponível',
    icon: '/logo192.png',
    badge: '/badge72.png',
    tag: 'kudimu-notification',
    requireInteraction: false,
    data: {}
  };
  
  // Parse dos dados
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        title: payload.title || notificationData.title,
        body: payload.body || notificationData.body,
        icon: payload.icon || notificationData.icon,
        badge: payload.badge || notificationData.badge,
        tag: payload.tag || notificationData.tag,
        requireInteraction: payload.requireInteraction || false,
        data: payload.data || {},
        actions: payload.actions || []
      };
    } catch (err) {
      console.error('[Service Worker] Erro ao parsear payload:', err);
      notificationData.body = event.data.text();
    }
  }
  
  // Exibe a notificação
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
      actions: notificationData.actions,
      vibrate: [200, 100, 200],
      timestamp: Date.now()
    })
  );
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notificação clicada:', event.notification.tag);
  
  event.notification.close();
  
  // Dados da notificação
  const notificationData = event.notification.data || {};
  let urlToOpen = '/campaigns';
  
  // Define URL baseado no tipo
  if (notificationData.type === 'new-campaign') {
    urlToOpen = `/questionnaire/${notificationData.campaignId}`;
  } else if (notificationData.type === 'level-up') {
    urlToOpen = '/history';
  } else if (notificationData.type === 'reward') {
    urlToOpen = '/rewards';
  } else if (notificationData.type === 'medal') {
    urlToOpen = '/history';
  } else if (notificationData.url) {
    urlToOpen = notificationData.url;
  }
  
  // Ação clicada (se houver)
  if (event.action) {
    console.log('[Service Worker] Ação clicada:', event.action);
    
    if (event.action === 'view') {
      urlToOpen = notificationData.url || urlToOpen;
    } else if (event.action === 'dismiss') {
      return; // Apenas fecha
    }
  }
  
  // Abre ou foca na aba
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Procura uma aba já aberta
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus().then(() => {
              return client.navigate(urlToOpen);
            });
          }
        }
        
        // Se não encontrou, abre nova aba
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notificação fechada:', event.notification.tag);
  
  // Analytics (opcional)
  // trackEvent('notification-closed', { tag: event.notification.tag });
});

// ========== BACKGROUND SYNC ==========

self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-answers') {
    event.waitUntil(syncAnswers());
  } else if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

// Sincroniza respostas pendentes
async function syncAnswers() {
  try {
    // Busca respostas pendentes no IndexedDB (a implementar)
    console.log('[Service Worker] Sincronizando respostas...');
    
    // TODO: Implementar lógica de sync
    
    return Promise.resolve();
  } catch (err) {
    console.error('[Service Worker] Erro ao sincronizar respostas:', err);
    return Promise.reject(err);
  }
}

// Sincroniza dados do usuário
async function syncUserData() {
  try {
    console.log('[Service Worker] Sincronizando dados do usuário...');
    
    // TODO: Implementar lógica de sync
    
    return Promise.resolve();
  } catch (err) {
    console.error('[Service Worker] Erro ao sincronizar dados:', err);
    return Promise.reject(err);
  }
}

// ========== MESSAGE HANDLERS ==========

self.addEventListener('message', (event) => {
  console.log('[Service Worker] Mensagem recebida:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_BADGE_COUNT') {
    // Retorna o número de notificações não lidas
    event.ports[0].postMessage({ count: 0 }); // TODO: Implementar contagem real
  }
  
  if (event.data && event.data.type === 'CLEAR_NOTIFICATIONS') {
    self.registration.getNotifications().then((notifications) => {
      notifications.forEach((notification) => notification.close());
    });
  }
});

console.log('[Service Worker] Carregado e pronto! 🚀');
