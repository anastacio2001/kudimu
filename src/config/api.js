/**
 * Configuração central de URLs da API
 * Kudimu Insights
 */

// Detecta se está em desenvolvimento local
const isDevelopment = process.env.NODE_ENV === 'development' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';

// Exportar variáveis para compatibilidade com código existente
export const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8787'
  : 'https://kudimu-api.l-anastacio001.workers.dev';

export { isDevelopment };

export const API_CONFIG = {
  BASE_URL: API_URL,
  
  TIMEOUT: 30000, // 30 segundos
  
  ENDPOINTS: {
    // Autenticação
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/me',
      CHANGE_PASSWORD: '/auth/change-password'
    },
    
    // Campanhas
    CAMPAIGNS: {
      LIST: '/campaigns',
      DETAILS: (id) => `/campaigns/${id}`,
      PARTICIPATE: (id) => `/campaigns/${id}/participate`,
      SUBMIT: (id) => `/campaigns/${id}/submit`
    },
    
    // Pagamentos Angola
    PAYMENTS: {
      CREATE_INTENT: '/payments/create-intent',
      CONFIRM: (id) => `/payments/${id}/confirm`,
      STATUS: (id) => `/payments/${id}/status`,
      CANCEL: (id) => `/payments/${id}/cancel`,
      METHODS: '/payments/methods',
      HISTORY: '/payments/history'
    },
    
    // Push Notifications
    PUSH: {
      SUBSCRIBE: '/push/subscribe',
      UNSUBSCRIBE: '/push/unsubscribe',
      TEST: '/push/test',
      SETTINGS: '/push/settings'
    },
    
    // AI e Recomendações
    AI: {
      RECOMMENDATIONS: '/ai/recommendations',
      INSIGHTS: '/ai/insights',
      TRENDING: '/ai/trending',
      OPTIMIZE: '/ai/optimize-campaign'
    },
    
    // Relatórios
    REPORTS: {
      DASHBOARD: '/reports/dashboard',
      ANALYTICS: '/reports/analytics',
      EXPORT: '/reports/export'
    },
    
    // Sistema de Reputação
    REPUTATION: {
      ME: '/reputation/me',
      RANKING: '/reputation/ranking',
      HISTORY: '/reputation/history'
    },
    
    // Dashboard e Recompensas
    USER: {
      DASHBOARD: '/user/dashboard',
      REWARDS: '/rewards/me',
      ANSWERS: '/answers/me'
    },
    
    // Admin
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      USERS: '/admin/users',
      USERS_UPDATE: (id) => `/admin/users/${id}`,
      CAMPAIGNS: '/admin/campaigns',
      ANSWERS: '/admin/answers',
      ANALYTICS: (id) => `/admin/campaigns/${id}/analytics`
    },
    
    // Client
    CLIENT: {
      DASHBOARD: '/client/dashboard',
      CAMPAIGNS: '/client/campaigns',
      ANALYTICS: (id) => `/client/campaigns/${id}/analytics`,
      BUDGET: '/client/budget',
      AI_INSIGHTS: '/client/ai-insights'
    }
  }
};

// Helper para construir URLs completas
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Adicionar parâmetros de query se fornecidos
  const queryParams = new URLSearchParams(params);
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }
  
  return url;
};

// Log da configuração atual
console.log('🚀 API Configuration:', {
  baseUrl: API_CONFIG.BASE_URL,
  environment: isDevelopment ? 'development' : 'production',
  timeout: API_CONFIG.TIMEOUT
});

export default API_CONFIG;