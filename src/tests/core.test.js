import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Core Application Tests', () => {
  describe('Utility Functions', () => {
    it('should validate email format', () => {
      const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });

    it('should format currency correctly', () => {
      const formatCurrency = (amount, currency = 'EUR') => {
        return new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: currency
        }).format(amount);
      };

      expect(formatCurrency(10.50)).toBe('10.50 €');
      expect(formatCurrency(0)).toBe('0.00 €');
      expect(formatCurrency(1000)).toBe('1000.00 €');
    });

    it('should calculate reward points', () => {
      const calculateRewardPoints = (baseAmount, multiplier = 1, bonus = 0) => {
        return Math.floor((baseAmount * multiplier) + bonus);
      };

      expect(calculateRewardPoints(10, 1, 0)).toBe(10);
      expect(calculateRewardPoints(15.75, 2, 5)).toBe(36);
      expect(calculateRewardPoints(0, 1, 10)).toBe(10);
    });

    it('should validate user age', () => {
      const validateAge = (age) => {
        return age >= 18 && age <= 100;
      };

      expect(validateAge(18)).toBe(true);
      expect(validateAge(25)).toBe(true);
      expect(validateAge(17)).toBe(false);
      expect(validateAge(101)).toBe(false);
    });

    it('should generate random campaign ID', () => {
      const generateCampaignId = () => {
        return 'camp_' + Math.random().toString(36).substring(2, 15);
      };

      const id1 = generateCampaignId();
      const id2 = generateCampaignId();

      expect(id1).toMatch(/^camp_[a-z0-9]+$/);
      expect(id2).toMatch(/^camp_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('Data Validation', () => {
    it('should validate campaign data', () => {
      const validateCampaign = (campaign) => {
        if (!campaign.title || campaign.title.length < 3) return false;
        if (!campaign.description || campaign.description.length < 10) return false;
        if (!campaign.reward_amount || campaign.reward_amount < 0) return false;
        if (!campaign.category) return false;
        return true;
      };

      const validCampaign = {
        title: 'Test Campaign',
        description: 'This is a test campaign description',
        reward_amount: 15.50,
        category: 'technology'
      };

      const invalidCampaign = {
        title: 'Te',
        description: 'Short',
        reward_amount: -5,
        category: ''
      };

      expect(validateCampaign(validCampaign)).toBe(true);
      expect(validateCampaign(invalidCampaign)).toBe(false);
    });

    it('should validate user registration data', () => {
      const validateRegistration = (data) => {
        const errors = [];
        
        if (!data.name || data.name.length < 2) {
          errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.push('Email inválido');
        }
        
        if (!data.password || data.password.length < 6) {
          errors.push('Senha deve ter pelo menos 6 caracteres');
        }
        
        if (!data.age || data.age < 18) {
          errors.push('Idade mínima é 18 anos');
        }

        return {
          valid: errors.length === 0,
          errors
        };
      };

      const validData = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'password123',
        age: 25
      };

      const invalidData = {
        name: 'J',
        email: 'invalid-email',
        password: '123',
        age: 16
      };

      const validResult = validateRegistration(validData);
      const invalidResult = validateRegistration(invalidData);

      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors).toHaveLength(4);
    });
  });

  describe('Business Logic', () => {
    it('should calculate campaign completion rate', () => {
      const calculateCompletionRate = (completed, total) => {
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
      };

      expect(calculateCompletionRate(8, 10)).toBe(80);
      expect(calculateCompletionRate(0, 10)).toBe(0);
      expect(calculateCompletionRate(10, 10)).toBe(100);
      expect(calculateCompletionRate(3, 0)).toBe(0);
    });

    it('should determine user level based on points', () => {
      const getUserLevel = (points) => {
        if (points < 100) return 1;
        if (points < 500) return 2;
        if (points < 1000) return 3;
        if (points < 2500) return 4;
        return 5;
      };

      expect(getUserLevel(50)).toBe(1);
      expect(getUserLevel(250)).toBe(2);
      expect(getUserLevel(750)).toBe(3);
      expect(getUserLevel(1500)).toBe(4);
      expect(getUserLevel(3000)).toBe(5);
    });

    it('should calculate points needed for next level', () => {
      const getPointsForNextLevel = (currentPoints) => {
        const levels = [0, 100, 500, 1000, 2500, 5000];
        const currentLevel = levels.findIndex(threshold => currentPoints < threshold) - 1;
        
        if (currentLevel >= levels.length - 1) return 0; // Max level
        
        return levels[currentLevel + 1] - currentPoints;
      };

      expect(getPointsForNextLevel(50)).toBe(50); // Needs 50 more for level 2
      expect(getPointsForNextLevel(250)).toBe(250); // Needs 250 more for level 3
      expect(getPointsForNextLevel(2000)).toBe(0); // Max level
    });

    it('should filter campaigns by criteria', () => {
      const campaigns = [
        { id: 1, category: 'tech', reward: 15, difficulty: 1 },
        { id: 2, category: 'health', reward: 25, difficulty: 2 },
        { id: 3, category: 'tech', reward: 10, difficulty: 1 },
        { id: 4, category: 'marketing', reward: 30, difficulty: 3 }
      ];

      const filterCampaigns = (campaigns, filters) => {
        return campaigns.filter(campaign => {
          if (filters.category && campaign.category !== filters.category) return false;
          if (filters.minReward && campaign.reward < filters.minReward) return false;
          if (filters.maxDifficulty && campaign.difficulty > filters.maxDifficulty) return false;
          return true;
        });
      };

      const techFiltered = filterCampaigns(campaigns, { category: 'tech' });
      expect(techFiltered).toHaveLength(2);

      const rewardFiltered = filterCampaigns(campaigns, { minReward: 20 });
      expect(rewardFiltered).toHaveLength(2);

      const difficultyFiltered = filterCampaigns(campaigns, { maxDifficulty: 2 });
      expect(difficultyFiltered).toHaveLength(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle division by zero', () => {
      const safeDivide = (a, b) => {
        if (b === 0) return 0;
        return a / b;
      };

      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(10, 0)).toBe(0);
      expect(safeDivide(0, 5)).toBe(0);
    });

    it('should handle null/undefined values', () => {
      const safeGetProperty = (obj, property, defaultValue = null) => {
        if (!obj || typeof obj !== 'object') return defaultValue;
        return obj[property] !== undefined ? obj[property] : defaultValue;
      };

      const testObj = { name: 'Test', value: 42 };

      expect(safeGetProperty(testObj, 'name')).toBe('Test');
      expect(safeGetProperty(testObj, 'missing')).toBe(null);
      expect(safeGetProperty(null, 'name')).toBe(null);
      expect(safeGetProperty(undefined, 'name', 'default')).toBe('default');
    });

    it('should validate array operations', () => {
      const safeArrayOperation = (arr, operation) => {
        if (!Array.isArray(arr) || arr.length === 0) return null;
        
        switch (operation) {
          case 'sum':
            return arr.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
          case 'average':
            const validNumbers = arr.filter(val => typeof val === 'number');
            if (validNumbers.length === 0) return 0;
            return validNumbers.reduce((sum, val) => sum + val, 0) / validNumbers.length;
          case 'max':
            const numbers = arr.filter(val => typeof val === 'number');
            return numbers.length > 0 ? Math.max(...numbers) : 0;
          default:
            return null;
        }
      };

      expect(safeArrayOperation([1, 2, 3, 4], 'sum')).toBe(10);
      expect(safeArrayOperation([1, 2, 3, 4], 'average')).toBe(2.5);
      expect(safeArrayOperation([1, 2, 3, 4], 'max')).toBe(4);
      expect(safeArrayOperation([], 'sum')).toBe(null);
      expect(safeArrayOperation([1, 'invalid', 3], 'sum')).toBe(4);
    });
  });

  describe('Date and Time Utils', () => {
    it('should format dates correctly', () => {
      const formatDate = (date, locale = 'pt-PT') => {
        return new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date(date));
      };

      const testDate = '2024-01-15T10:30:00Z';
      const formatted = formatDate(testDate);
      
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should calculate time differences', () => {
      const getTimeDifference = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end - start;
        
        return {
          milliseconds: diffMs,
          seconds: Math.floor(diffMs / 1000),
          minutes: Math.floor(diffMs / (1000 * 60)),
          hours: Math.floor(diffMs / (1000 * 60 * 60)),
          days: Math.floor(diffMs / (1000 * 60 * 60 * 24))
        };
      };

      const diff = getTimeDifference('2024-01-01T00:00:00Z', '2024-01-02T00:00:00Z');
      
      expect(diff.days).toBe(1);
      expect(diff.hours).toBe(24);
      expect(diff.minutes).toBe(1440);
    });
  });

  describe('Mock API Responses', () => {
    it('should mock successful API response', async () => {
      const mockFetch = vi.fn();
      global.fetch = mockFetch;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: { id: 1, name: 'Test User' }
        })
      });

      const response = await fetch('/api/users/1');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test User');
    });

    it('should mock error API response', async () => {
      const mockFetch = vi.fn();
      global.fetch = mockFetch;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({
          success: false,
          error: 'User not found'
        })
      });

      const response = await fetch('/api/users/999');
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('User not found');
    });
  });

  describe('Local Storage Utils', () => {
    beforeEach(() => {
      // Mock localStorage
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      };
      global.localStorage = localStorageMock;
    });

    it('should handle localStorage operations', () => {
      const storageUtils = {
        save: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        load: (key) => {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        remove: (key) => {
          localStorage.removeItem(key);
        }
      };

      localStorage.getItem.mockReturnValue('{"name":"Test","value":42}');

      storageUtils.save('test', { name: 'Test', value: 42 });
      expect(localStorage.setItem).toHaveBeenCalledWith('test', '{"name":"Test","value":42}');

      const loaded = storageUtils.load('test');
      expect(localStorage.getItem).toHaveBeenCalledWith('test');
      expect(loaded).toEqual({ name: 'Test', value: 42 });

      storageUtils.remove('test');
      expect(localStorage.removeItem).toHaveBeenCalledWith('test');
    });
  });
});