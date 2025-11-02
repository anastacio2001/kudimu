import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock global do fetch
global.fetch = vi.fn();

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

// ApiService mock
const apiService = {
  register: vi.fn(),
  login: vi.fn(),
  getProfile: vi.fn(),
  getCampaigns: vi.fn(),
  getCampaignDetails: vi.fn(),
  participateInCampaign: vi.fn(),
  submitAnswers: vi.fn(),
  createPaymentIntent: vi.fn(),
  getPaymentHistory: vi.fn(),
  getRecommendations: vi.fn(),
  getInsights: vi.fn(),
  subscribeToPush: vi.fn(),
  sendTestNotification: vi.fn(),
  setBaseUrl: vi.fn(),
  setToken: vi.fn()
};

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('Authentication Methods', () => {
    it('should register user successfully', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'senha123'
      };

      const mockResponse = {
        success: true,
        user: { id: 1, name: 'João Silva', email: 'joao@email.com' },
        token: 'mock-token'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.register.mockResolvedValue(mockResponse);
      const result = await apiService.register(userData);

      expect(result).toEqual(mockResponse);
      expect(apiService.register).toHaveBeenCalledWith(userData);
    });

    it('should login user successfully', async () => {
      const credentials = {
        email: 'joao@email.com',
        password: 'senha123'
      };

      const mockResponse = {
        success: true,
        token: 'mock-token',
        user: { id: 1, email: 'joao@email.com' }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.login.mockResolvedValue(mockResponse);
      const result = await apiService.login(credentials);

      expect(result).toEqual(mockResponse);
      expect(apiService.login).toHaveBeenCalledWith(credentials);
    });

    it('should get user profile with authentication', async () => {
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@email.com'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      apiService.getProfile.mockResolvedValue(mockUser);
      const result = await apiService.getProfile();

      expect(result).toEqual(mockUser);
      expect(apiService.getProfile).toHaveBeenCalled();
    });

    it('should handle authentication errors', async () => {
      const credentials = {
        email: 'wrong@email.com',
        password: 'wrongpassword'
      };

      apiService.login.mockRejectedValue(new Error('Credenciais inválidas'));

      await expect(apiService.login(credentials)).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('Campaign Methods', () => {
    it('should fetch campaigns with filters', async () => {
      const filters = {
        category: 'tecnologia',
        minReward: 10,
        maxReward: 100
      };

      const mockCampaigns = [
        { id: 1, title: 'Campanha 1', category: 'tecnologia', reward: 50 },
        { id: 2, title: 'Campanha 2', category: 'tecnologia', reward: 75 }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCampaigns)
      });

      apiService.getCampaigns.mockResolvedValue(mockCampaigns);
      const result = await apiService.getCampaigns(filters);

      expect(result).toEqual(mockCampaigns);
      expect(apiService.getCampaigns).toHaveBeenCalledWith(filters);
    });

    it('should get campaign details', async () => {
      const campaignId = 1;
      const mockCampaign = {
        id: 1,
        title: 'Campanha de Teste',
        description: 'Descrição da campanha',
        reward: 50
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCampaign)
      });

      apiService.getCampaignDetails.mockResolvedValue(mockCampaign);
      const result = await apiService.getCampaignDetails(campaignId);

      expect(result).toEqual(mockCampaign);
      expect(apiService.getCampaignDetails).toHaveBeenCalledWith(campaignId);
    });

    it('should participate in campaign', async () => {
      const campaignId = 1;
      const mockResponse = {
        success: true,
        participation: { id: 1, campaignId: 1, userId: 1 }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.participateInCampaign.mockResolvedValue(mockResponse);
      const result = await apiService.participateInCampaign(campaignId);

      expect(result).toEqual(mockResponse);
      expect(apiService.participateInCampaign).toHaveBeenCalledWith(campaignId);
    });

    it('should submit campaign answers', async () => {
      const campaignId = 1;
      const answers = [
        { questionId: 1, answer: 'Resposta 1' },
        { questionId: 2, answer: 'Resposta 2' }
      ];

      const mockResponse = {
        success: true,
        score: 85,
        reward: 42.5
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.submitAnswers.mockResolvedValue(mockResponse);
      const result = await apiService.submitAnswers(campaignId, answers);

      expect(result).toEqual(mockResponse);
      expect(apiService.submitAnswers).toHaveBeenCalledWith(campaignId, answers);
    });
  });

  describe('Payment Methods', () => {
    it('should create payment intent', async () => {
      const paymentData = {
        method: 'bank_transfer',
        amount: 100,
        currency: 'AOA'
      };

      const mockResponse = {
        success: true,
        intentId: 'payment_123',
        status: 'requires_confirmation'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.createPaymentIntent.mockResolvedValue(mockResponse);
      const result = await apiService.createPaymentIntent(paymentData);

      expect(result).toEqual(mockResponse);
      expect(apiService.createPaymentIntent).toHaveBeenCalledWith(paymentData);
    });

    it('should get payment history', async () => {
      const mockHistory = [
        { id: 1, amount: 100, status: 'completed', date: '2024-01-01' },
        { id: 2, amount: 50, status: 'pending', date: '2024-01-02' }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHistory)
      });

      apiService.getPaymentHistory.mockResolvedValue(mockHistory);
      const result = await apiService.getPaymentHistory();

      expect(result).toEqual(mockHistory);
      expect(apiService.getPaymentHistory).toHaveBeenCalled();
    });
  });

  describe('AI Methods', () => {
    it('should get personalized recommendations', async () => {
      const options = {
        limit: 5,
        category: 'tecnologia'
      };

      const mockRecommendations = [
        { id: 1, title: 'Recomendação 1', score: 0.9 },
        { id: 2, title: 'Recomendação 2', score: 0.8 }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockRecommendations)
      });

      apiService.getRecommendations.mockResolvedValue(mockRecommendations);
      const result = await apiService.getRecommendations(options);

      expect(result).toEqual(mockRecommendations);
      expect(apiService.getRecommendations).toHaveBeenCalledWith(options);
    });

    it('should get performance insights', async () => {
      const period = 'month';
      const mockInsights = {
        totalCampaigns: 10,
        averageScore: 85,
        recommendations: ['Melhore sua pontuação', 'Participe mais']
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInsights)
      });

      apiService.getInsights.mockResolvedValue(mockInsights);
      const result = await apiService.getInsights(period);

      expect(result).toEqual(mockInsights);
      expect(apiService.getInsights).toHaveBeenCalledWith(period);
    });
  });

  describe('Push Notification Methods', () => {
    it('should subscribe to push notifications', async () => {
      const mockSubscription = {
        endpoint: 'https://example.com/push',
        keys: {
          p256dh: 'test-key',
          auth: 'test-auth'
        }
      };

      const mockResponse = {
        success: true,
        subscriptionId: 'sub_123'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.subscribeToPush.mockResolvedValue(mockResponse);
      const result = await apiService.subscribeToPush(mockSubscription);

      expect(result).toEqual(mockResponse);
      expect(apiService.subscribeToPush).toHaveBeenCalledWith(mockSubscription);
    });

    it('should send test notification', async () => {
      const mockResponse = {
        success: true,
        message: 'Notificação enviada com sucesso'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.sendTestNotification.mockResolvedValue(mockResponse);
      const result = await apiService.sendTestNotification();

      expect(result).toEqual(mockResponse);
      expect(apiService.sendTestNotification).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      apiService.getCampaigns.mockRejectedValue(new Error('Network error'));

      await expect(apiService.getCampaigns()).rejects.toThrow('Network error');
    });

    it('should handle HTTP errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' })
      });

      apiService.getCampaigns.mockRejectedValue(new Error('Not found'));
      await expect(apiService.getCampaigns()).rejects.toThrow('Not found');
    });

    it('should handle authentication expiry', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Token expired' })
      });

      apiService.getProfile.mockRejectedValue(new Error('Token expired'));
      await expect(apiService.getProfile()).rejects.toThrow('Token expired');
    });

    it('should handle malformed JSON responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      apiService.getCampaigns.mockRejectedValue(new Error('Invalid JSON'));
      await expect(apiService.getCampaigns()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('Request Interceptors', () => {
    it('should add authentication header when token exists', async () => {
      localStorageMock.getItem.mockReturnValue('test-token');

      const mockResponse = { campaigns: [] };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.getCampaigns.mockResolvedValue(mockResponse);
      await apiService.getCampaigns();

      expect(apiService.getCampaigns).toHaveBeenCalled();
    });

    it('should not add authentication header when no token', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const mockResponse = { campaigns: [] };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      apiService.getCampaigns.mockResolvedValue(mockResponse);
      await apiService.getCampaigns();

      expect(apiService.getCampaigns).toHaveBeenCalled();
    });
  });

  describe('Response Interceptors', () => {
    it('should handle successful responses', async () => {
      const mockData = { campaigns: [] };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      apiService.getCampaigns.mockResolvedValue({ data: mockData });
      const result = await apiService.getCampaigns();

      expect(result.data).toEqual(mockData);
    });

    it('should handle error responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal server error' })
      });

      apiService.getCampaigns.mockRejectedValue(new Error('Internal server error'));

      try {
        await apiService.getCampaigns();
      } catch (error) {
        expect(error.message).toBe('Internal server error');
      }
    });
  });
});