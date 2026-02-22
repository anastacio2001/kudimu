/**
 * Push Notifications Service
 * Gerencia subscrições e envio de notificações push
 */

const VAPID_PUBLIC_KEY = 'BI-Ns3LNNDKikY7-sxVLD4_WiH7beo46ObFHu3ZG9GUQNSSZ-25LCFg64tRqRHoA5aEvOLxBr3Z_3citU_2OqMo';
const API_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

/**
 * Converte chave VAPID para formato Uint8Array
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
 * Verifica se push notifications são suportadas
 */
export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Verifica se o usuário já deu permissão
 */
export function isNotificationPermissionGranted() {
  return Notification.permission === 'granted';
}

/**
 * Solicita permissão para notificações
 */
export async function requestNotificationPermission() {
  if (!isPushSupported()) {
    throw new Error('Push notifications não são suportadas neste navegador');
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Registra service worker
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Workers não são suportados');
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registrado:', registration);
    return registration;
  } catch (error) {
    console.error('Erro ao registrar Service Worker:', error);
    throw error;
  }
}

/**
 * Subscreve usuário para push notifications
 */
export async function subscribeToPush() {
  try {
    // Verifica suporte
    if (!isPushSupported()) {
      throw new Error('Push notifications não são suportadas');
    }

    // Solicita permissão
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      throw new Error('Permissão para notificações negada');
    }

    // Registra service worker
    const registration = await registerServiceWorker();
    
    // Aguarda service worker estar ativo
    await new Promise((resolve) => {
      if (registration.active) {
        resolve();
      } else {
        registration.addEventListener('statechange', () => {
          if (registration.active) {
            resolve();
          }
        });
      }
    });

    // Verifica se já existe uma subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Cria nova subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Envia subscription para o servidor
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar subscription no servidor');
    }

    const data = await response.json();
    console.log('Subscription criada com sucesso:', data);
    
    return subscription;

  } catch (error) {
    console.error('Erro ao subscrever push notifications:', error);
    throw error;
  }
}

/**
 * Cancela subscription de push notifications
 */
export async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      return false;
    }

    // Remove do servidor
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/push/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint
      })
    });

    // Remove localmente
    const result = await subscription.unsubscribe();
    console.log('Unsubscribed from push notifications:', result);
    
    return result;

  } catch (error) {
    console.error('Erro ao cancelar subscription:', error);
    throw error;
  }
}

/**
 * Verifica se usuário está subscrito
 */
export async function isPushSubscribed() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return false;
    }

    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;

  } catch (error) {
    console.error('Erro ao verificar subscription:', error);
    return false;
  }
}

/**
 * Envia notificação de teste
 */
export async function sendTestNotification() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/push/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar notificação de teste');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Erro ao enviar notificação de teste:', error);
    throw error;
  }
}

/**
 * Obtém configurações de notificação do usuário
 */
export async function getNotificationSettings() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/push/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar configurações');
    }

    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    throw error;
  }
}

/**
 * Atualiza configurações de notificação
 */
export async function updateNotificationSettings(settings) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/push/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar configurações');
    }

    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    throw error;
  }
}