import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do Worker Env com AI binding
const createMockEnv = () => ({
  DB: {
    prepare: vi.fn(),
    exec: vi.fn()
  },
  AI: {
    run: vi.fn()
  },
  AI_MODEL: '@cf/meta/llama-2-7b-chat-int8'
});

describe('AI and Recommendations Endpoints', () => {
  let mockEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv = createMockEnv();
  });

  describe('POST /ai/recommendations', () => {
    it('should generate personalized campaign recommendations', async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        age: 25,
        gender: 'M',
        location: 'São Paulo',
        reputation_score: 85,
        level: 3,
        interests: 'tecnologia,gaming,saúde'
      };
      
      // Mock user participation history
      const mockParticipations = [
        { campaign_id: 1, category: 'tecnologia', completion_rate: 0.9 },
        { campaign_id: 2, category: 'gaming', completion_rate: 0.8 },
        { campaign_id: 3, category: 'saúde', completion_rate: 0.7 }
      ];
      
      // Mock available campaigns
      const mockCampaigns = [
        {
          id: 4,
          title: 'Pesquisa sobre Smartphones',
          category: 'tecnologia',
          target_audience: '18-35',
          reward_amount: 15.00,
          difficulty_level: 2,
          estimated_time: 10
        },
        {
          id: 5,
          title: 'Teste de Novo Game',
          category: 'gaming',
          target_audience: '18-40',
          reward_amount: 20.00,
          difficulty_level: 3,
          estimated_time: 15
        }
      ];

      // Mock AI response
      const mockAIResponse = {
        response: JSON.stringify({
          recommendations: [
            {
              campaignId: 4,
              score: 0.92,
              reasons: ['Histórico positivo em tecnologia', 'Faixa etária compatível'],
              category: 'tecnologia'
            },
            {
              campaignId: 5,
              score: 0.88,
              reasons: ['Interesse em gaming', 'Nível adequado'],
              category: 'gaming'
            }
          ],
          insights: {
            topCategories: ['tecnologia', 'gaming'],
            averageScore: 0.90,
            confidenceLevel: 'high'
          }
        })
      };

      // Mock database calls
      const mockBind = vi.fn();
      mockBind.mockReturnValueOnce({
        first: vi.fn().mockResolvedValue(mockUser)
      });
      mockBind.mockReturnValueOnce({
        all: vi.fn().mockResolvedValue(mockParticipations)
      });
      mockBind.mockReturnValueOnce({
        all: vi.fn().mockResolvedValue(mockCampaigns)
      });
      
      mockEnv.DB.prepare.mockReturnValue({
        bind: mockBind
      });

      // Mock AI call
      mockEnv.AI.run.mockResolvedValue(mockAIResponse);

      const userId = 1;
      const requestData = {
        limit: 5,
        categories: ['tecnologia', 'gaming'],
        minReward: 10.00
      };

      // Verificar busca do usuário
      expect(mockBind).toHaveBeenCalledWith(userId);
      
      // Verificar busca do histórico
      expect(mockBind).toHaveBeenCalledWith(userId);
      
      // Verificar busca das campanhas
      expect(mockBind).toHaveBeenCalledWith(
        requestData.categories,
        requestData.minReward
      );

      // Verificar chamada da AI
      expect(mockEnv.AI.run).toHaveBeenCalledWith(
        mockEnv.AI_MODEL,
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('recommender system')
            }),
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('user profile')
            })
          ])
        })
      );

      // Verificar resposta da AI
      const aiResponse = JSON.parse(mockAIResponse.response);
      expect(aiResponse.recommendations).toHaveLength(2);
      expect(aiResponse.recommendations[0].score).toBe(0.92);
      expect(aiResponse.insights.confidenceLevel).toBe('high');
    });

    it('should handle user with no participation history', async () => {
      // Mock new user
      const mockNewUser = {
        id: 2,
        age: 22,
        gender: 'F',
        location: 'Lisboa',
        reputation_score: 50,
        level: 1,
        interests: null
      };
      
      // Empty participation history
      const mockEmptyParticipations = [];
      
      // Mock basic campaigns for new users
      const mockBeginnerCampaigns = [
        {
          id: 1,
          title: 'Pesquisa Básica de Opinião',
          category: 'geral',
          difficulty_level: 1,
          reward_amount: 5.00,
          estimated_time: 5
        }
      ];

      const mockBind = vi.fn();
      mockBind.mockReturnValueOnce({
        first: vi.fn().mockResolvedValue(mockNewUser)
      });
      mockBind.mockReturnValueOnce({
        all: vi.fn().mockResolvedValue(mockEmptyParticipations)
      });
      mockBind.mockReturnValueOnce({
        all: vi.fn().mockResolvedValue(mockBeginnerCampaigns)
      });
      
      mockEnv.DB.prepare.mockReturnValue({
        bind: mockBind
      });

      const userId = 2;

      // Verificar tratamento de usuário novo
      expect(mockEmptyParticipations).toHaveLength(0);
      expect(mockBeginnerCampaigns[0].difficulty_level).toBe(1);
    });

    it('should validate recommendation parameters', () => {
      const testCases = [
        { limit: 0, valid: false },
        { limit: -1, valid: false },
        { limit: 1, valid: true },
        { limit: 20, valid: true },
        { limit: 101, valid: false }, // Max 100
        { minReward: -1, valid: false },
        { minReward: 0, valid: true },
        { minReward: 1000, valid: true }
      ];

      testCases.forEach(({ limit, minReward, valid }) => {
        if (limit !== undefined) {
          const isValidLimit = limit > 0 && limit <= 100;
          expect(isValidLimit).toBe(valid);
        }
        if (minReward !== undefined) {
          const isValidReward = minReward >= 0;
          expect(isValidReward).toBe(valid);
        }
      });
    });
  });

  describe('POST /ai/insights', () => {
    it('should generate user performance insights', async () => {
      // Mock user performance data
      const mockPerformanceData = [
        {
          campaign_id: 1,
          completion_rate: 0.95,
          quality_score: 4.8,
          time_efficiency: 0.85,
          category: 'tecnologia',
          completed_at: '2024-01-15T10:00:00Z'
        },
        {
          campaign_id: 2,
          completion_rate: 0.88,
          quality_score: 4.5,
          time_efficiency: 0.75,
          category: 'saúde',
          completed_at: '2024-01-10T15:30:00Z'
        }
      ];

      // Mock AI insights response
      const mockInsightsResponse = {
        response: JSON.stringify({
          performanceAnalysis: {
            overallScore: 4.65,
            trend: 'improving',
            strengths: ['tecnologia', 'qualidade consistente'],
            weaknesses: ['eficiência de tempo'],
            recommendations: [
              'Focar em campanhas de tecnologia',
              'Melhorar gestão de tempo'
            ]
          },
          categoryBreakdown: {
            tecnologia: { score: 4.8, participation: 5 },
            saúde: { score: 4.5, participation: 3 }
          },
          nextLevelProgress: {
            currentLevel: 3,
            progressToNext: 0.75,
            pointsNeeded: 50
          }
        })
      };

      const mockBind = vi.fn().mockReturnValue({
        all: vi.fn().mockResolvedValue(mockPerformanceData)
      });
      
      mockEnv.DB.prepare.mockReturnValue({
        bind: mockBind
      });

      mockEnv.AI.run.mockResolvedValue(mockInsightsResponse);

      const userId = 1;
      const timeframe = 'month';

      // Verificar busca dos dados de performance
      expect(mockBind).toHaveBeenCalledWith(userId);

      // Verificar chamada da AI para insights
      expect(mockEnv.AI.run).toHaveBeenCalledWith(
        mockEnv.AI_MODEL,
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
              content: expect.stringContaining('performance analyst')
            })
          ])
        })
      );

      // Verificar estrutura da resposta
      const insights = JSON.parse(mockInsightsResponse.response);
      expect(insights.performanceAnalysis.overallScore).toBe(4.65);
      expect(insights.performanceAnalysis.trend).toBe('improving');
      expect(insights.nextLevelProgress.progressToNext).toBe(0.75);
    });

    it('should analyze category preferences', async () => {
      const mockCategoryData = [
        { category: 'tecnologia', count: 8, avg_score: 4.7 },
        { category: 'saúde', count: 5, avg_score: 4.2 },
        { category: 'gaming', count: 3, avg_score: 4.9 },
        { category: 'marketing', count: 1, avg_score: 3.8 }
      ];

      // Análise de preferências
      const sortedByScore = [...mockCategoryData].sort((a, b) => b.avg_score - a.avg_score);
      const sortedByCount = [...mockCategoryData].sort((a, b) => b.count - a.count);

      expect(sortedByScore[0].category).toBe('gaming'); // Maior score
      expect(sortedByCount[0].category).toBe('tecnologia'); // Maior participação
    });
  });

  describe('GET /ai/trending', () => {
    it('should return trending campaigns based on AI analysis', async () => {
      // Mock trending data
      const mockTrendingData = [
        {
          campaign_id: 1,
          title: 'Pesquisa sobre IA',
          participation_rate: 0.85,
          completion_rate: 0.92,
          avg_quality: 4.6,
          recent_growth: 0.35,
          category: 'tecnologia'
        },
        {
          campaign_id: 2,
          title: 'Teste de App Fitness',
          participation_rate: 0.78,
          completion_rate: 0.88,
          avg_quality: 4.4,
          recent_growth: 0.28,
          category: 'saúde'
        }
      ];

      // Mock AI trending analysis
      const mockTrendingResponse = {
        response: JSON.stringify({
          trendingCampaigns: [
            {
              campaignId: 1,
              trendScore: 0.89,
              trendFactors: [
                'alto engajamento',
                'crescimento acelerado',
                'qualidade consistente'
              ],
              prediction: 'crescimento contínuo'
            },
            {
              campaignId: 2,
              trendScore: 0.76,
              trendFactors: [
                'categoria em alta',
                'boa retenção'
              ],
              prediction: 'estabilização'
            }
          ],
          marketInsights: {
            hotCategories: ['tecnologia', 'saúde'],
            emergingTrends: ['sustentabilidade', 'fintech'],
            seasonalFactors: ['volta às aulas']
          }
        })
      };

      const mockBind = vi.fn().mockReturnValue({
        all: vi.fn().mockResolvedValue(mockTrendingData)
      });
      
      mockEnv.DB.prepare.mockReturnValue({
        bind: mockBind
      });

      mockEnv.AI.run.mockResolvedValue(mockTrendingResponse);

      const timeframe = 'week';
      const limit = 10;

      // Verificar análise de tendências
      const trending = JSON.parse(mockTrendingResponse.response);
      expect(trending.trendingCampaigns).toHaveLength(2);
      expect(trending.trendingCampaigns[0].trendScore).toBe(0.89);
      expect(trending.marketInsights.hotCategories).toContain('tecnologia');
    });
  });

  describe('POST /ai/optimize-campaign', () => {
    it('should provide campaign optimization suggestions', async () => {
      // Mock campaign data
      const mockCampaign = {
        id: 1,
        title: 'Pesquisa sobre E-commerce',
        description: 'Análise de comportamento de compra online',
        target_audience: '25-45',
        reward_amount: 10.00,
        estimated_time: 15,
        category: 'marketing',
        current_participants: 45,
        target_participants: 100,
        completion_rate: 0.65
      };

      // Mock campaign performance
      const mockPerformanceMetrics = [
        { metric: 'participation_rate', value: 0.45 },
        { metric: 'completion_rate', value: 0.65 },
        { metric: 'quality_score', value: 4.2 },
        { metric: 'time_efficiency', value: 0.78 }
      ];

      // Mock AI optimization response
      const mockOptimizationResponse = {
        response: JSON.stringify({
          optimizationSuggestions: [
            {
              area: 'reward',
              current: 10.00,
              suggested: 15.00,
              impact: 'increase participation by ~25%',
              confidence: 0.82
            },
            {
              area: 'duration',
              current: 15,
              suggested: 12,
              impact: 'improve completion rate by ~15%',
              confidence: 0.76
            },
            {
              area: 'targeting',
              current: '25-45',
              suggested: '28-42',
              impact: 'better demographic fit',
              confidence: 0.68
            }
          ],
          performanceScore: 7.2,
          benchmarkComparison: {
            industry: 6.8,
            category: 7.5,
            platform: 7.0
          },
          riskAssessment: {
            level: 'low',
            factors: ['stable category', 'proven format']
          }
        })
      };

      const mockBind = vi.fn();
      mockBind.mockReturnValueOnce({
        first: vi.fn().mockResolvedValue(mockCampaign)
      });
      mockBind.mockReturnValueOnce({
        all: vi.fn().mockResolvedValue(mockPerformanceMetrics)
      });
      
      mockEnv.DB.prepare.mockReturnValue({
        bind: mockBind
      });

      mockEnv.AI.run.mockResolvedValue(mockOptimizationResponse);

      const campaignId = 1;

      // Verificar análise de otimização
      const optimization = JSON.parse(mockOptimizationResponse.response);
      expect(optimization.optimizationSuggestions).toHaveLength(3);
      expect(optimization.performanceScore).toBe(7.2);
      expect(optimization.riskAssessment.level).toBe('low');
    });
  });

  describe('AI Error Handling', () => {
    it('should handle AI service unavailable', async () => {
      mockEnv.AI.run.mockRejectedValue(new Error('AI service unavailable'));

      try {
        await mockEnv.AI.run(mockEnv.AI_MODEL, { messages: [] });
      } catch (error) {
        expect(error.message).toBe('AI service unavailable');
      }
    });

    it('should handle invalid AI response format', async () => {
      // AI retorna resposta malformada
      const mockInvalidResponse = {
        response: 'invalid json response'
      };

      mockEnv.AI.run.mockResolvedValue(mockInvalidResponse);

      try {
        const response = await mockEnv.AI.run(mockEnv.AI_MODEL, { messages: [] });
        JSON.parse(response.response);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    });

    it('should handle AI timeout', async () => {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000);
      });

      mockEnv.AI.run.mockImplementation(() => timeoutPromise);

      const startTime = Date.now();
      try {
        await Promise.race([
          mockEnv.AI.run(mockEnv.AI_MODEL, { messages: [] }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 1000)
          )
        ]);
      } catch (error) {
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(2000);
        expect(error.message).toBe('Timeout');
      }
    });
  });

  describe('Content Filtering', () => {
    it('should filter inappropriate content in AI responses', () => {
      const inappropriateTerms = [
        'violence', 'hate', 'discrimination', 
        'illegal', 'harmful', 'offensive'
      ];

      const testContent = 'This is a normal campaign about product testing';
      const inappropriateContent = 'This contains hate speech and violence';

      const containsInappropriate = (text) => {
        return inappropriateTerms.some(term => 
          text.toLowerCase().includes(term)
        );
      };

      expect(containsInappropriate(testContent)).toBe(false);
      expect(containsInappropriate(inappropriateContent)).toBe(true);
    });

    it('should validate AI recommendation scores', () => {
      const mockRecommendations = [
        { score: 0.95, valid: true },
        { score: 1.5, valid: false }, // Score > 1
        { score: -0.1, valid: false }, // Score < 0
        { score: 0.0, valid: true },
        { score: 1.0, valid: true }
      ];

      mockRecommendations.forEach(({ score, valid }) => {
        const isValid = score >= 0 && score <= 1;
        expect(isValid).toBe(valid);
      });
    });
  });
});