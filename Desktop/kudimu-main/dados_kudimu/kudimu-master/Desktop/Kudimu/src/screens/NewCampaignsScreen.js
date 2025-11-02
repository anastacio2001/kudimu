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

  useEffect(() => {
    fetchUserData();
    fetchCampaigns();
    fetchUserHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        
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
          } else {
            setUserData(user);
          }
        } else {
          setUserData(user);
        }
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
      const response = await fetch(`${API_URL}/answers/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setUserHistory(data.data || []);
      }
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns?status=ativa`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.data);
        setFilteredCampaigns(data.data);
      } else {
        setError(data.error || 'Erro ao carregar campanhas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
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
      filtered = filtered.filter(campaign =>
        campaign.titulo.toLowerCase().includes(search.toLowerCase()) ||
        campaign.descricao.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtro por tema
    if (theme) {
      filtered = filtered.filter(campaign => campaign.tema === theme);
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
        sorted.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
        break;
      
      case 'reward':
        sorted.sort((a, b) => b.recompensa - a.recompensa);
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

  // Estatísticas
  const totalRewards = userHistory.reduce((sum, h) => sum + (h.recompensa || 0), 0);
  const campaignsThisWeek = userHistory.filter(h => {
    const date = new Date(h.data_resposta);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }).length;

  const uniqueThemes = [...new Set(campaigns.map(c => c.tema))].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando campanhas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Navbar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text">
                Kudimu
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/campaigns" className="text-primary-600 dark:text-primary-400 font-medium">
                Campanhas
              </a>
              <a href="/history" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                Histórico
              </a>
              <a href="/rewards" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                Recompensas
              </a>
              <a href="/reports" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                Relatórios
              </a>
              <a href="/notifications" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                Notificações
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {userData && (
                <div className="flex items-center">
                  <ReputationBadge 
                    level={userData.nivel || 'Bronze'} 
                    points={userData.reputacao || 0} 
                  />
                </div>
              )}
              <button 
                onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
        </div>

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
      </div>
    </div>
  );
}
