/**
 * Serviço de API para Kudimu Insights
 * Comunicação com backend Cloudflare Workers
 */

const API_BASE_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

// Storage do token JWT
const TOKEN_KEY = 'kudimu_auth_token';

/**
 * Obtém o token armazenado
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Salva o token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove o token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Faz requisição à API
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

// ===== AUTH =====

/**
 * Registra novo usuário
 */
export const register = async (userData) => {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true,
  });

  if (data.success && data.data.token) {
    setToken(data.data.token);
  }

  return data;
};

/**
 * Faz login
 */
export const login = async (email, senha) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
    skipAuth: true,
  });

  if (data.success && data.data.token) {
    setToken(data.data.token);
  }

  return data;
};

/**
 * Obtém dados do usuário logado
 */
export const getMe = async () => {
  return await apiRequest('/auth/me', {
    method: 'GET',
  });
};

/**
 * Faz logout
 */
export const logout = async () => {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Erro no logout:', error);
  } finally {
    removeToken();
  }
};

// ===== CAMPAIGNS =====

/**
 * Lista campanhas
 */
export const getCampaigns = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return await apiRequest(`/campaigns?${params}`, {
    method: 'GET',
    skipAuth: true, // Campanhas públicas
  });
};

/**
 * Obtém detalhes de uma campanha
 */
export const getCampaign = async (id) => {
  return await apiRequest(`/campaigns/${id}`, {
    method: 'GET',
    skipAuth: true,
  });
};

/**
 * Cria nova campanha (apenas clientes)
 */
export const createCampaign = async (campaignData) => {
  return await apiRequest('/campaigns', {
    method: 'POST',
    body: JSON.stringify(campaignData),
  });
};

// ===== ANSWERS =====

/**
 * Envia respostas de uma campanha
 */
export const submitAnswers = async (campanhaId, respostas) => {
  return await apiRequest('/answers', {
    method: 'POST',
    body: JSON.stringify({
      campanha_id: campanhaId,
      respostas,
    }),
  });
};

/**
 * Obtém histórico de respostas
 */
export const getMyAnswers = async () => {
  return await apiRequest('/answers/me', {
    method: 'GET',
  });
};

// ===== REWARDS =====

/**
 * Obtém histórico de recompensas
 */
export const getMyRewards = async () => {
  return await apiRequest('/rewards/me', {
    method: 'GET',
  });
};

// ===== UTILS =====

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = () => {
  return !!getToken();
};
