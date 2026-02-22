import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
  StatsCard,
  ProgressCard,
  ReputationBadge,
  CampaignCard,
  Button
} from '../components/ui';
import SmartRecommendations from '../components/SmartRecommendations';
import { rankCampaigns } from '../utils/recommendations';
import MainLayout from '../components/MainLayout';

// Detecta se está em desenvolvimento local
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8787'  // Ambiente local de desenvolvimento
  : 'https://kudimu-api.l-anastacio001.workers.dev';  // Ambiente de produção

/**
 * NewCampaignsScreen - Dashboard moderno de campanhas
 */
export default function NewCampaignsScreen() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false); // Prevenir múltiplos carregamentos

  // Helper para ícones de nível
  const getNivelIcon = (nivel) => {
    const icons = {
      'Iniciante': '🌱',
      'Bronze': '🥉',
      'Prata': '🥈',
      'Ouro': '🥇',
      'Confiável': '⭐',
      'Líder': '👑',
      'Embaixador': '💎',
      'Diamante': '💎'
    };
    return icons[nivel] || '🌱';
  };

  // Debug: garantir que não há renderizações duplicadas
  console.log('🔵 CampaignsScreen renderizado');

  useEffect(() => {
    if (!dataLoaded) {
      console.log('🟢 CampaignsScreen: carregando dados...');
      const loadData = async () => {
        await Promise.all([
          fetchUserData(),
          fetchCampaigns(),
          fetchUserHistory()
        ]);
        setDataLoaded(true);
        setLoading(false);
      };
      loadData();
    }
  }, [dataLoaded]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        
        // Tentar buscar dados de reputação (opcional - não bloqueia se falhar)
        try {
          const reputationResponse = await fetch(`${API_URL}/reputation/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (reputationResponse.ok) {
            const reputationData = await reputationResponse.json();
            if (reputationData.success) {
              const nivelNome = typeof reputationData.data.nivel === 'object' 
                ? reputationData.data.nivel.nome 
                : reputationData.data.nivel;
              
              setUserData({
                ...user,
                nivel: nivelNome,
                reputacao: reputationData.data.reputacao || reputationData.data.pontos,
                saldo_pontos: reputationData.data.estatisticas?.saldo_pontos || user.saldo_pontos || 0,
                campanhas_respondidas: reputationData.data.estatisticas?.total_respostas || 0
              });
              return; // Dados atualizados com sucesso
            }
          }
        } catch (repErr) {
          console.log('⚠️ Endpoint de reputação não disponível, usando dados locais');
        }
        
        // Fallback: usar dados do localStorage
        setUserData(user);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUserData(JSON.parse(userStr));
      }
    }
  };

  const fetchUserHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch(`${API_URL}/answers/me/1`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUserHistory(data.data || []);
            return;
          }
        }
      } catch (histErr) {
        console.log('⚠️ Endpoint de histórico não disponível');
      }
      
      // Fallback: histórico vazio
      setUserHistory([]);
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
      setUserHistory([]);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setCampaigns(data.data || []);
          setFilteredCampaigns(data.data || []);
          return;
        }
      }
      
      // Fallback em caso de erro
      console.log('⚠️ Usando campanhas mock');
      setCampaigns([]);
      setFilteredCampaigns([]);
    } catch (err) {
      console.log('⚠️ Erro ao carregar campanhas, usando mock');
      setCampaigns([]);
      setFilteredCampaigns([]);
    }
  };

  const handleParticipar = (campaignId) => {
    navigate(`/questionnaire/${campaignId}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applyFilters(term, selectedTheme);
  };

  const handleThemeFilter = (theme) => {
    setSelectedTheme(theme);
    applyFilters(searchTerm, theme);
  };

  const applyFilters = (search, theme) => {
    let filtered = [...campaigns];

    // Busca por texto
    if (search) {
      filtered = filtered.filter(campaign => {
        const title = campaign.title || campaign.titulo || '';
        const description = campaign.description || campaign.descricao || '';
        return title.toLowerCase().includes(search.toLowerCase()) ||
               description.toLowerCase().includes(search.toLowerCase());
      });
    }

    // Filtro por tema
    if (theme) {
      filtered = filtered.filter(campaign => {
        const campaignTheme = campaign.theme || campaign.tema || '';
        return campaignTheme === theme;
      });
    }

    // Aplicar ordenação
    filtered = applySorting(filtered);
    setFilteredCampaigns(filtered);
  };

  const applySorting = (campaignsList) => {
    let sorted = [...campaignsList];

    switch (sortBy) {
      case 'relevance':
        const userProfile = {
          interesses: userData?.interesses,
          localizacao: userData?.localizacao,
          reputacao: userData?.reputacao
        };
        sorted = rankCampaigns(sorted, userProfile, userHistory);
        break;
      
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || a.data_criacao || 0);
          const dateB = new Date(b.created_at || b.data_criacao || 0);
          return dateB - dateA;
        });
        break;
      
      case 'reward':
        sorted.sort((a, b) => {
          const rewardA = a.reward || a.recompensa || 0;
          const rewardB = b.reward || b.recompensa || 0;
          return rewardB - rewardA;
        });
        break;
      
      default:
        break;
    }

    return sorted;
  };

  useEffect(() => {
    if (filteredCampaigns.length > 0) {
      applyFilters(searchTerm, selectedTheme);
    }
  }, [sortBy]);

  // Estatísticas (com verificação de segurança)
  const totalRewards = Array.isArray(userHistory) && userHistory.length > 0
    ? userHistory.reduce((sum, h) => sum + (h.recompensa || 0), 0) 
    : (userData?.saldo_pontos || 0); // Fallback para saldo do usuário
  const campaignsThisWeek = Array.isArray(userHistory) 
    ? userHistory.filter(h => {
        const date = new Date(h.data_resposta);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      }).length 
    : 0;

  const uniqueThemes = [...new Set(campaigns.map(c => c.tema))].filter(Boolean);

  if (loading) {
    return (
      <MainLayout activePage="campaigns">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Carregando campanhas...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout activePage="campaigns">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Olá, {userData?.nome?.split(' ')[0] || 'Usuário'} 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Participe de campanhas e ganhe recompensas reais!
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <button
          onClick={() => {
            const firstCampaign = filteredCampaigns[0];
            if (firstCampaign) navigate(`/questionnaire/${firstCampaign.id}`);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
        >
          <div className="text-left">
            <p className="text-indigo-100 text-sm font-medium mb-1">Ação Rápida</p>
            <p className="text-xl font-bold">Ganhar Pontos Agora</p>
          </div>
          <FireIcon className="w-10 h-10 text-indigo-200 group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={() => navigate('/history')}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
        >
          <div className="text-left">
            <p className="text-green-100 text-sm font-medium mb-1">Seu Progresso</p>
            <p className="text-xl font-bold">Ver Ranking</p>
          </div>
          <TrophyIcon className="w-10 h-10 text-green-200 group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={() => navigate('/rewards')}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group"
        >
          <div className="text-left">
            <p className="text-amber-100 text-sm font-medium mb-1">Saldo Disponível</p>
            <p className="text-xl font-bold">Resgatar Prêmios</p>
          </div>
          <CurrencyDollarIcon className="w-10 h-10 text-amber-200 group-hover:scale-110 transition-transform" />
        </button>
      </motion.div>

      {/* Conquistas e Progresso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 mb-8 border border-purple-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrophyIcon className="w-6 h-6 text-purple-600" />
            Conquistas Recentes
          </h3>
          <button
            onClick={() => navigate('/history')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Ver todas →
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">{getNivelIcon(userData?.nivel || 'Bronze')}</div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Nível Atual</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{userData?.nivel || 'Bronze'}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Sequência</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{Math.min(campaignsThisWeek, 7)} dias</p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Participações</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{userData?.campanhas_respondidas || userHistory.length}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">💎</div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Próximo Nível</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{Math.max(0, 1000 - (userData?.reputacao || 0))}</p>
          </div>
        </div>
        
        {/* Progress Bar para próximo nível */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso para Próximo Nível</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{Math.min(100, Math.round(((userData?.reputacao || 0) / 1000) * 100))}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, ((userData?.reputacao || 0) / 1000) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
          <StatsCard
            title="Pontos Totais"
            value={userData?.saldo_pontos || 0}
            subtitle="Disponível para resgatar"
            icon={TrophyIcon}
            colorScheme="primary"
          />
          <StatsCard
            title="Campanhas Respondidas"
            value={userData?.campanhas_respondidas || userHistory.length}
            subtitle="Total de participações"
            icon={CheckCircleIcon}
            trend="up"
            trendValue={`+${campaignsThisWeek} esta semana`}
            colorScheme="success"
          />
          <StatsCard
            title="Ganhos Totais"
            value={`${totalRewards.toLocaleString()} AOA`}
            subtitle="Recompensas acumuladas"
            icon={CurrencyDollarIcon}
            colorScheme="warning"
          />
          <StatsCard
            title="Nível Atual"
            value={userData?.nivel || 'Bronze'}
            subtitle={`${userData?.reputacao || 0} pontos de reputação`}
            icon={FireIcon}
            colorScheme="purple"
          />
        </motion.div>

        {/* Progress Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <ProgressCard
            title="Progresso para Próximo Nível"
            current={userData?.reputacao || 0}
            target={1000}
            unit="pontos"
            icon={TrophyIcon}
            colorScheme="primary"
          />
          <ProgressCard
            title="Meta Mensal de Campanhas"
            current={campaignsThisWeek}
            target={10}
            unit="campanhas"
            icon={ChartBarIcon}
            colorScheme="success"
          />
        </motion.div>

        {/* Campanhas em Destaque */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FireIcon className="w-6 h-6 text-orange-500" />
            Campanhas em Destaque
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Terminando em Breve */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-red-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <ClockIcon className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Terminando em Breve</h4>
              </div>
              {filteredCampaigns.slice(0, 2).map(campaign => (
                <div
                  key={campaign.id}
                  onClick={() => navigate(`/questionnaire/${campaign.id}`)}
                  className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">{campaign.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">⏰ Últimas horas</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{campaign.reward}pt</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mais Rentáveis */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-green-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Mais Rentáveis</h4>
              </div>
              {[...filteredCampaigns].sort((a, b) => b.reward - a.reward).slice(0, 2).map(campaign => (
                <div
                  key={campaign.id}
                  onClick={() => navigate(`/questionnaire/${campaign.id}`)}
                  className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">{campaign.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">💰 Alto valor</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{campaign.reward}pt</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Perfeitas para Você */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 border border-indigo-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <TrophyIcon className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Perfeitas para Você</h4>
              </div>
              {filteredCampaigns.slice(0, 2).map(campaign => (
                <div
                  key={campaign.id}
                  onClick={() => navigate(`/questionnaire/${campaign.id}`)}
                  className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-gray-900 dark:text-white text-sm mb-1">{campaign.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">✨ Recomendado</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{campaign.reward}pt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Smart Recommendations */}
        <div className="mb-8">
          <SmartRecommendations
            userId={userData?.id || '1'}
            onCampaignSelect={(campaign) => {
              // Redirecionar para a campanha selecionada
              navigate(`/questionnaire/${campaign.id}`);
            }}
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar campanhas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="newest">Mais Recentes</option>
                <option value="reward">Maior Recompensa</option>
              </select>

              {/* Theme Filter */}
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedTheme}
                  onChange={(e) => handleThemeFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Todos os Temas</option>
                  {uniqueThemes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns Grid */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm || selectedTheme 
                ? 'Nenhuma campanha encontrada com os filtros selecionados.'
                : 'Nenhuma campanha disponível no momento.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {filteredCampaigns.length} Campanha{filteredCampaigns.length !== 1 ? 's' : ''} Disponível{filteredCampaigns.length !== 1 ? 'is' : ''}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onParticipate={handleParticipar}
                  isRecommended={sortBy === 'relevance' && index < 3}
                  recommendationScore={campaign.relevanceScore}
                />
              ))}
            </div>
          </>
        )}
      </MainLayout>
    );
}
