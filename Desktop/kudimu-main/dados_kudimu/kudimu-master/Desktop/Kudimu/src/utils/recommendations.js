/**
 * Sistema de Recomendações Inteligente
 * Calcula score de relevância baseado em histórico, interesses e localização
 */

/**
 * Calcula score de relevância de uma campanha para um usuário
 * @param {Object} campaign - Campanha a ser avaliada
 * @param {Object} userProfile - Perfil do usuário com interesses e localização
 * @param {Array} userHistory - Histórico de campanhas respondidas
 * @returns {number} Score de 0 a 100
 */
export function calculateRelevanceScore(campaign, userProfile, userHistory = []) {
  let score = 0;
  const weights = {
    interest: 40,      // 40% - Correspondência com interesses
    location: 25,      // 25% - Proximidade geográfica
    history: 20,       // 20% - Baseado em histórico
    reputation: 10,    // 10% - Reputação do usuário
    freshness: 5       // 5% - Campanha nova
  };

  // 1. SCORE POR INTERESSE (40 pontos máximo)
  if (userProfile?.interesses && campaign.tema) {
    const userInterests = Array.isArray(userProfile.interesses) 
      ? userProfile.interesses 
      : userProfile.interesses.split(',');
    
    const campaignTheme = campaign.tema.toLowerCase();
    
    // Match exato: pontos completos
    if (userInterests.some(interest => interest.toLowerCase() === campaignTheme)) {
      score += weights.interest;
    } 
    // Match parcial: pontos reduzidos
    else if (userInterests.some(interest => 
      campaignTheme.includes(interest.toLowerCase()) || 
      interest.toLowerCase().includes(campaignTheme)
    )) {
      score += weights.interest * 0.6;
    }
  }

  // 2. SCORE POR LOCALIZAÇÃO (25 pontos máximo)
  if (userProfile?.localizacao && campaign.localizacao) {
    const userLocation = userProfile.localizacao.toLowerCase();
    const campaignLocation = campaign.localizacao?.toLowerCase() || '';
    
    // Match exato de província/município
    if (userLocation === campaignLocation) {
      score += weights.location;
    }
    // Match parcial (mesma província)
    else if (campaignLocation.includes(userLocation) || userLocation.includes(campaignLocation)) {
      score += weights.location * 0.7;
    }
    // Campanha nacional/sem localização específica
    else if (!campaign.localizacao || campaign.localizacao === 'Nacional') {
      score += weights.location * 0.3;
    }
  } else if (!campaign.localizacao || campaign.localizacao === 'Nacional') {
    // Se não há restrição de localização, dar pontos parciais
    score += weights.location * 0.5;
  }

  // 3. SCORE POR HISTÓRICO (20 pontos máximo)
  if (userHistory && userHistory.length > 0) {
    // Temas mais respondidos pelo usuário
    const themeCounts = {};
    userHistory.forEach(item => {
      const theme = item.tema || item.campanha_tema;
      if (theme) {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      }
    });

    // Se o usuário já respondeu campanhas desse tema antes
    if (themeCounts[campaign.tema]) {
      const frequency = themeCounts[campaign.tema] / userHistory.length;
      score += weights.history * frequency;
    }

    // Penalidade se usuário já respondeu ESTA campanha específica
    if (userHistory.some(item => item.campanha_id === campaign.id)) {
      score -= 30; // Grande penalidade para evitar duplicatas
    }
  }

  // 4. SCORE POR REPUTAÇÃO (10 pontos máximo)
  if (userProfile?.reputacao !== undefined && campaign.reputacao_minima !== undefined) {
    const userRep = userProfile.reputacao || 0;
    const minRep = campaign.reputacao_minima || 0;
    
    // Usuário tem reputação suficiente?
    if (userRep >= minRep) {
      // Quanto maior a diferença positiva, melhor o match
      const repRatio = Math.min((userRep - minRep) / 100, 1);
      score += weights.reputation * (0.5 + repRatio * 0.5);
    } else {
      // Penalidade se não tem reputação suficiente
      score -= weights.reputation;
    }
  }

  // 5. SCORE POR FRESHNESS (5 pontos máximo)
  if (campaign.data_criacao) {
    const now = new Date();
    const created = new Date(campaign.data_criacao);
    const daysSinceCreation = (now - created) / (1000 * 60 * 60 * 24);
    
    // Campanhas mais novas (últimos 7 dias) ganham pontos
    if (daysSinceCreation <= 7) {
      score += weights.freshness * (1 - daysSinceCreation / 7);
    }
  }

  // Normalizar score entre 0 e 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Ordena campanhas por relevância
 * @param {Array} campaigns - Lista de campanhas
 * @param {Object} userProfile - Perfil do usuário
 * @param {Array} userHistory - Histórico do usuário
 * @returns {Array} Campanhas ordenadas com score
 */
export function rankCampaigns(campaigns, userProfile, userHistory = []) {
  return campaigns
    .map(campaign => ({
      ...campaign,
      relevanceScore: calculateRelevanceScore(campaign, userProfile, userHistory)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Filtra apenas campanhas recomendadas (score >= 50)
 * @param {Array} campaigns - Lista de campanhas com score
 * @returns {Array} Apenas campanhas recomendadas
 */
export function getRecommendedCampaigns(campaigns) {
  return campaigns.filter(campaign => campaign.relevanceScore >= 50);
}

/**
 * Retorna label de recomendação baseado no score
 * @param {number} score - Score de relevância
 * @returns {Object} Label e cor
 */
export function getRecommendationLabel(score) {
  if (score >= 80) {
    return { 
      text: '🌟 Altamente Recomendado', 
      color: '#10b981',
      bgColor: '#d1fae5'
    };
  } else if (score >= 60) {
    return { 
      text: '⭐ Recomendado para Você', 
      color: '#3b82f6',
      bgColor: '#dbeafe'
    };
  } else if (score >= 50) {
    return { 
      text: '👍 Pode Interessar', 
      color: '#f59e0b',
      bgColor: '#fef3c7'
    };
  }
  return null;
}

/**
 * Agrupa campanhas por tema
 * @param {Array} campaigns - Lista de campanhas
 * @returns {Object} Campanhas agrupadas por tema
 */
export function groupByTheme(campaigns) {
  return campaigns.reduce((groups, campaign) => {
    const theme = campaign.tema || 'Outros';
    if (!groups[theme]) {
      groups[theme] = [];
    }
    groups[theme].push(campaign);
    return groups;
  }, {});
}

/**
 * Gera insights sobre preferências do usuário
 * @param {Array} userHistory - Histórico de campanhas
 * @returns {Object} Insights sobre preferências
 */
export function generateUserInsights(userHistory) {
  if (!userHistory || userHistory.length === 0) {
    return {
      favoriteThemes: [],
      avgCompletionTime: 0,
      totalCampaigns: 0,
      bestDayOfWeek: null
    };
  }

  // Temas favoritos
  const themeCounts = {};
  let totalTime = 0;
  const dayOfWeekCounts = {};

  userHistory.forEach(item => {
    // Contar temas
    const theme = item.tema || item.campanha_tema || 'Outros';
    themeCounts[theme] = (themeCounts[theme] || 0) + 1;

    // Tempo médio
    if (item.tempo_total) {
      totalTime += item.tempo_total;
    }

    // Dia da semana preferido
    if (item.data_resposta) {
      const date = new Date(item.data_resposta);
      const day = date.getDay();
      dayOfWeekCounts[day] = (dayOfWeekCounts[day] || 0) + 1;
    }
  });

  // Top 3 temas favoritos
  const favoriteThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme, count]) => ({ theme, count }));

  // Tempo médio de conclusão (em minutos)
  const avgCompletionTime = userHistory.length > 0 
    ? Math.round(totalTime / userHistory.length / 60) 
    : 0;

  // Melhor dia da semana
  const bestDay = Object.entries(dayOfWeekCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const bestDayOfWeek = bestDay ? dayNames[parseInt(bestDay[0])] : null;

  return {
    favoriteThemes,
    avgCompletionTime,
    totalCampaigns: userHistory.length,
    bestDayOfWeek
  };
}
