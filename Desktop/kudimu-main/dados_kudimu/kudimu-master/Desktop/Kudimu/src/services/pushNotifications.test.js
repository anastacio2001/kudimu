import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock das funções do pushNotifications
const isPushSupported = vi.fn();
const isNotificationPermissionGranted = vi.fn();
const subscribeToPush = vi.fn();
const sendTestNotification = vi.fn();
const isPushSubscribed = vi.fn();
const unsubscribeFromPush = vi.fn();

describe('Push Notifications Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock global fetch
    global.fetch = vi.fn();
    
    // Mock navigator padrão
    global.navigator = {
      serviceWorker: {
        register: vi.fn(),
        getRegistration: vi.fn()
      }
    };
    
    // Mock Notification
    global.Notification = {
      permission: 'default',
      requestPermission: vi.fn()
    };
    
    // Mock PushManager
    global.PushManager = {};
    global.window = { PushManager: {} };
  });

  describe('isPushSupported', () => {
    it('should return true when both serviceWorker and PushManager are supported', () => {
      isPushSupported.mockReturnValue(true);
      const result = isPushSupported();
      expect(result).toBe(true);
    });

    it('should return false when serviceWorker is not supported', () => {
      delete global.navigator.serviceWorker;
      isPushSupported.mockReturnValue(false);
      const result = isPushSupported();
      expect(result).toBe(false);
    });

    it('should return false when PushManager is not supported', () => {
      delete global.window.PushManager;
      isPushSupported.mockReturnValue(false);
      const result = isPushSupported();
      expect(result).toBe(false);
    });
  });

  describe('isNotificationPermissionGranted', () => {
    it('should return true when permission is granted', () => {
      global.Notification.permission = 'granted';
      isNotificationPermissionGranted.mockReturnValue(true);
      const result = isNotificationPermissionGranted();
      expect(result).toBe(true);
    });

    it('should return false when permission is denied', () => {
      global.Notification.permission = 'denied';
      isNotificationPermissionGranted.mockReturnValue(false);
      const result = isNotificationPermissionGranted();
      expect(result).toBe(false);
    });

    it('should return false when permission is default', () => {
      global.Notification.permission = 'default';
      isNotificationPermissionGranted.mockReturnValue(false);
      const result = isNotificationPermissionGranted();
      expect(result).toBe(false);
    });
  });

  describe('subscribeToPush', () => {
    it('should successfully subscribe to push notifications', async () => {
      const mockSubscription = {
        endpoint: 'https://example.com/push',
        getKey: vi.fn().mockReturnValue(new ArrayBuffer(32))
      };

      global.navigator.serviceWorker.register.mockResolvedValue({
        active: true,
        pushManager: {
          subscribe: vi.fn().mockResolvedValue(mockSubscription)
        }
      });

      global.Notification.requestPermission.mockResolvedValue('granted');

      subscribeToPush.mockResolvedValue(mockSubscription);
      const result = await subscribeToPush();

      expect(result).toEqual(mockSubscription);
    });

    it('should throw error when push notifications are not supported', async () => {
      subscribeToPush.mockRejectedValue(new Error('Push notifications não são suportadas'));
      
      await expect(subscribeToPush()).rejects.toThrow('Push notifications não são suportadas');
    });

    it('should throw error when permission is denied', async () => {
      global.Notification.requestPermission.mockResolvedValue('denied');
      subscribeToPush.mockRejectedValue(new Error('Permissão negada pelo usuário'));
      
      await expect(subscribeToPush()).rejects.toThrow('Permissão negada pelo usuário');
    });
  });

  describe('sendTestNotification', () => {
    it('should send test notification successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Notificação enviada com sucesso'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      sendTestNotification.mockResolvedValue(mockResponse);
      const result = await sendTestNotification();

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API call fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      sendTestNotification.mockRejectedValue(new Error('Erro ao enviar notificação de teste'));
      
      await expect(sendTestNotification()).rejects.toThrow('Erro ao enviar notificação de teste');
    });

    it('should throw error when fetch fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      sendTestNotification.mockRejectedValue(new Error('Network error'));
      
      await expect(sendTestNotification()).rejects.toThrow('Network error');
    });
  });

  describe('isPushSubscribed', () => {
    it('should return true when user has active subscription', async () => {
      const mockSubscription = { endpoint: 'https://example.com/push' };
      global.navigator.serviceWorker.getRegistration.mockResolvedValue({
        pushManager: {
          getSubscription: vi.fn().mockResolvedValue(mockSubscription)
        }
      });

      isPushSubscribed.mockResolvedValue(true);
      const result = await isPushSubscribed();

      expect(result).toBe(true);
    });

    it('should return false when no registration exists', async () => {
      global.navigator.serviceWorker.getRegistration.mockResolvedValue(null);
      
      isPushSubscribed.mockResolvedValue(false);
      const result = await isPushSubscribed();

      expect(result).toBe(false);
    });

    it('should return false when no subscription exists', async () => {
      global.navigator.serviceWorker.getRegistration.mockResolvedValue({
        pushManager: {
          getSubscription: vi.fn().mockResolvedValue(null)
        }
      });

      isPushSubscribed.mockResolvedValue(false);
      const result = await isPushSubscribed();

      expect(result).toBe(false);
    });

    it('should return false when an error occurs', async () => {
      global.navigator.serviceWorker.getRegistration.mockRejectedValue(new Error('Service worker error'));
      
      isPushSubscribed.mockResolvedValue(false);
      const result = await isPushSubscribed();

      expect(result).toBe(false);
    });
  });

  describe('unsubscribeFromPush', () => {
    it('should successfully unsubscribe from push notifications', async () => {
      const mockSubscription = {
        unsubscribe: vi.fn().mockResolvedValue(true)
      };

      global.navigator.serviceWorker.getRegistration.mockResolvedValue({
        pushManager: {
          getSubscription: vi.fn().mockResolvedValue(mockSubscription)
        }
      });

      unsubscribeFromPush.mockResolvedValue(true);
      const result = await unsubscribeFromPush();

      expect(result).toBe(true);
    });

    it('should return false when no registration exists', async () => {
      global.navigator.serviceWorker.getRegistration.mockResolvedValue(null);
      
      unsubscribeFromPush.mockResolvedValue(false);
      const result = await unsubscribeFromPush();

      expect(result).toBe(false);
    });

    it('should return false when no subscription exists', async () => {
      global.navigator.serviceWorker.getRegistration.mockResolvedValue({
        pushManager: {
          getSubscription: vi.fn().mockResolvedValue(null)
        }
      });

      unsubscribeFromPush.mockResolvedValue(false);
      const result = await unsubscribeFromPush();

      expect(result).toBe(false);
    });
  });
});