// Push Notification Manager para Kudimu Insights
// Gerencia permissões, subscrições e envio de notificações

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

// VAPID Public Key (será necessário gerar no backend)
const VAPID_PUBLIC_KEY = 'BGxYsGVLLHBxZGlmYXRpYW8tZGUtdGVzdGUtcHVibGljLWtleQ==';

/**
 * Converte VAPID key de base64 para Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Registra o Service Worker
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker não suportado neste navegador');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });

    console.log('Service Worker registrado:', registration.scope);

    // Aguarda o service worker estar pronto
    await navigator.serviceWorker.ready;
    console.log('Service Worker pronto');

    return registration;
  } catch (error) {
    console.error('Erro ao registrar Service Worker:', error);
    return null;
  }
}

/**
 * Verifica se notificações são suportadas
 */
export function isNotificationSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Verifica o estado da permissão
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) {
    return 'not-supported';
  }
  return Notification.permission; // 'default', 'granted', 'denied'
}

/**
 * Solicita permissão para notificações
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    throw new Error('Notificações não suportadas neste navegador');
  }

  if (Notification.permission === 'granted') {
    console.log('Permissão já concedida');
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Permissão negada pelo usuário');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Permissão de notificação:', permission);
    return permission === 'granted';
  } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
    return false;
  }
}

/**
 * Subscreve para push notifications
 */
export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;

    // Verifica se já tem subscrição
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('Já subscrito:', subscription);
      return subscription;
    }

    // Cria nova subscrição
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });

    console.log('Nova subscrição criada:', subscription);

    // Envia subscrição para o backend
    await sendSubscriptionToBackend(subscription);

    return subscription;
  } catch (error) {
    console.error('Erro ao subscrever push notifications:', error);
    throw error;
  }
}

/**
 * Envia subscrição para o backend
 */
async function sendSubscriptionToBackend(subscription) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Usuário não autenticado, não é possível salvar subscrição');
      return;
    }

    const response = await fetch(`${API_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar subscrição para backend');
    }

    const data = await response.json();
    console.log('Subscrição salva no backend:', data);
    
    return data;
  } catch (error) {
    console.error('Erro ao enviar subscrição:', error);
    throw error;
  }
}

/**
 * Cancela subscrição de push notifications
 */
export async function unsubscribeFromPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.log('Nenhuma subscrição ativa');
      return true;
    }

    // Remove do backend
    await removeSubscriptionFromBackend(subscription);

    // Cancela subscrição
    const successful = await subscription.unsubscribe();
    console.log('Subscrição cancelada:', successful);

    return successful;
  } catch (error) {
    console.error('Erro ao cancelar subscrição:', error);
    return false;
  }
}

/**
 * Remove subscrição do backend
 */
async function removeSubscriptionFromBackend(subscription) {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch(`${API_URL}/notifications/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error('Erro ao remover subscrição do backend');
    }

    console.log('Subscrição removida do backend');
  } catch (error) {
    console.error('Erro ao remover subscrição:', error);
  }
}

/**
 * Envia notificação local (fallback quando push não está disponível)
 */
export async function showLocalNotification(title, options = {}) {
  if (!isNotificationSupported()) {
    console.warn('Notificações não suportadas');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Permissão de notificação não concedida');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    return registration.showNotification(title, {
      body: options.body || '',
      icon: options.icon || '/logo192.png',
      badge: options.badge || '/badge72.png',
      tag: options.tag || 'kudimu-notification',
      requireInteraction: options.requireInteraction || false,
      data: options.data || {},
      actions: options.actions || [],
      vibrate: options.vibrate || [200, 100, 200],
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Erro ao exibir notificação local:', error);
    return null;
  }
}

/**
 * Obtém todas as notificações ativas
 */
export async function getActiveNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.getNotifications();
  } catch (error) {
    console.error('Erro ao obter notificações ativas:', error);
    return [];
  }
}

/**
 * Limpa todas as notificações
 */
export async function clearAllNotifications() {
  try {
    const notifications = await getActiveNotifications();
    notifications.forEach(notification => notification.close());
    console.log(`${notifications.length} notificações limpas`);
    return true;
  } catch (error) {
    console.error('Erro ao limpar notificações:', error);
    return false;
  }
}

/**
 * Verifica se usuário está subscrito
 */
export async function isUserSubscribed() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error('Erro ao verificar subscrição:', error);
    return false;
  }
}

/**
 * Inicializa sistema de notificações
 */
export async function initializeNotifications() {
  try {
    console.log('Inicializando sistema de notificações...');

    // Registra service worker
    const registration = await registerServiceWorker();
    if (!registration) {
      console.warn('Service Worker não pôde ser registrado');
      return false;
    }

    // Verifica suporte
    if (!isNotificationSupported()) {
      console.warn('Notificações não suportadas');
      return false;
    }

    // Verifica permissão
    const permission = getNotificationPermission();
    console.log('Permissão de notificação:', permission);

    if (permission === 'granted') {
      // Se já tem permissão, subscreve automaticamente
      const subscribed = await isUserSubscribed();
      if (!subscribed) {
        await subscribeToPushNotifications();
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao inicializar notificações:', error);
    return false;
  }
}

// Notificações predefinidas

export const NotificationTypes = {
  NEW_CAMPAIGN: {
    title: '🎯 Nova Campanha Disponível!',
    getBody: (campaignName) => `A campanha "${campaignName}" está disponível. Responda agora!`,
    icon: '/logo192.png',
    tag: 'new-campaign',
    requireInteraction: true,
    actions: [
      { action: 'view', title: '👁️ Ver Campanha' },
      { action: 'dismiss', title: '❌ Dispensar' }
    ]
  },
  LEVEL_UP: {
    title: '🎉 Parabéns! Você subiu de nível!',
    getBody: (level) => `Você alcançou o nível ${level}! Continue participando.`,
    icon: '/logo192.png',
    tag: 'level-up',
    requireInteraction: false
  },
  MEDAL_EARNED: {
    title: '🏅 Nova Medalha Conquistada!',
    getBody: (medalName) => `Você ganhou a medalha "${medalName}"!`,
    icon: '/logo192.png',
    tag: 'medal-earned',
    requireInteraction: false
  },
  REWARD_RECEIVED: {
    title: '💰 Recompensa Recebida!',
    getBody: (amount) => `Você recebeu ${amount} AOA. Confira suas recompensas!`,
    icon: '/logo192.png',
    tag: 'reward-received',
    requireInteraction: false
  },
  REMINDER: {
    title: '⏰ Lembrete Kudimu',
    getBody: () => 'Há campanhas aguardando sua participação!',
    icon: '/logo192.png',
    tag: 'reminder',
    requireInteraction: false
  }
};

export default {
  registerServiceWorker,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  showLocalNotification,
  getActiveNotifications,
  clearAllNotifications,
  isUserSubscribed,
  initializeNotifications,
  NotificationTypes
};
