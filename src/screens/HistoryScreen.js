import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  AcademicCapIcon,
  FireIcon,
  BanknotesIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import {
  TrophyIcon as TrophySolid,
  StarIcon as StarSolid
} from '@heroicons/react/24/solid';
import { Card, Button, Badge } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import ReputationBadge from '../components/ReputationBadge';
import MainLayout from '../components/MainLayout';
import BalanceCard from '../components/BalanceCard';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

/**
 * NewHistoryScreen - Tela de histórico moderna com design system
 */
const NewHistoryScreen = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // User data states
  const [userData, setUserData] = useState(null);
  const [reputationData, setReputationData] = useState(null);
  const [medals, setMedals] = useState([]);
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('todas');
  const [activeTab, setActiveTab] = useState('resumo');

  // Níveis de reputação com design moderno
  const niveis = {
    'Iniciante': { 
      icon: '🌱', 
      color: 'bg-gray-500', 
      textColor: 'text-gray-100',
      minPoints: 0, 
      maxPoints: 99,
      gradient: 'from-gray-400 to-gray-600'
    },
    'Confiável': { 
      icon: '⭐', 
      color: 'bg-blue-500', 
      textColor: 'text-blue-100',
      minPoints: 100, 
      maxPoints: 299,
      gradient: 'from-blue-400 to-blue-600'
    },
    'Líder': { 
      icon: '👑', 
      color: 'bg-amber-500', 
      textColor: 'text-amber-100',
      minPoints: 300, 
      maxPoints: 999,
      gradient: 'from-amber-400 to-amber-600'
    },
    'Embaixador': { 
      icon: '🏆', 
      color: 'bg-purple-500', 
      textColor: 'text-purple-100',
      minPoints: 1000, 
      maxPoints: Infinity,
      gradient: 'from-purple-400 to-purple-600'
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Buscar dados do usuário
      const userResponse = await fetch('http://localhost:8787/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Erro ao buscar dados do usuário');
      }

      const userData = await userResponse.json();
      
      // Buscar histórico de respostas
      const historyResponse = await fetch('http://localhost:8787/answers/me/1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const historyData = historyResponse.ok ? await historyResponse.json() : { data: { answers: [] } };

      // Buscar reputação
      const reputationResponse = await fetch('http://localhost:8787/reputation/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const reputationData = reputationResponse.ok ? await reputationResponse.json() : {
        level: 'Bronze',
        points: userData.data?.reputacao || 0,
        nextLevel: 'Prata',
        pointsToNext: 500,
        progress: ((userData.data?.reputacao || 0) / 500) * 100
      };

      // Medalhas baseadas nas campanhas completadas
      const campanhasCompletas = historyData.data?.answers?.length || 0;
      const mockMedals = [
        { id: 1, name: 'Primeiros Passos', description: 'Completou primeira campanha', icon: '🏁', earned: campanhasCompletas >= 1 },
        { id: 2, name: 'Dedicado', description: '10 campanhas completadas', icon: '🔥', earned: campanhasCompletas >= 10 },
        { id: 3, name: 'Especialista', description: '50 campanhas completadas', icon: '🎯', earned: campanhasCompletas >= 50 }
      ];

      // Formatar histórico de campanhas
      const campaignHistory = (historyData.data?.answers || []).map(answer => ({
        id: answer.id,
        titulo: answer.campaign_title,
        status: 'concluida',
        data_resposta: new Date(answer.completed_at).toLocaleDateString('pt-AO'),
        recompensa: answer.reward_earned,
        tempo_resposta: 0,
        validada: 1
      }));

      setUserData(userData.data);
      setReputationData(reputationData);
      setMedals(mockMedals);
      setCampaignHistory(campaignHistory);
      setError(null);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erro ao carregar dados do perfil');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'rejeitada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluida': return <CheckCircleIcon className="w-4 h-4" />;
      case 'pendente': return <ClockIcon className="w-4 h-4" />;
      case 'rejeitada': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'resumo', label: 'Resumo', icon: ChartBarIcon },
    { id: 'campanhas', label: 'Campanhas', icon: ClockIcon },
    { id: 'medalhas', label: 'Medalhas', icon: TrophyIcon }
  ];

  if (loading) {
    return (
      <MainLayout activePage="history">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando seu histórico...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout activePage="history">
        <Card className="max-w-md mx-auto text-center p-8">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Erro ao carregar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchAllData} className="w-full">
            Tentar novamente
          </Button>
        </Card>
      </MainLayout>
    );
  }

  const currentLevel = niveis[userData?.nivel] || niveis['Iniciante'];

  return (
    <MainLayout activePage="history">
      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'resumo' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserCircleIcon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{userData?.nome}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{userData?.email}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentLevel.color} ${currentLevel.textColor}`}>
                        <span className="mr-2">{currentLevel.icon}</span>
                        {userData?.nivel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Localização</span>
                      <span className="text-gray-900 dark:text-white">{userData?.localizacao}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Membro desde</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(userData?.data_cadastro).toLocaleDateString('pt-AO')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Campanhas</span>
                      <span className="text-gray-900 dark:text-white">{userData?.campanhas_respondidas}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats Cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* BalanceCard Substitui Card Antigo de Saldo */}
                <BalanceCard userData={userData} />

                <Card>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <StarIcon className="w-8 h-8 text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reputação</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {userData?.reputacao} pontos
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ChartBarIcon className="w-8 h-8 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Campanhas</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {userData?.campanhas_respondidas}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrophyIcon className="w-8 h-8 text-purple-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ganho</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {userData?.total_ganho?.toFixed(2)} AOA
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'campanhas' && (
            <div>
              {/* Filters */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {['todas', 'concluida', 'pendente', 'rejeitada'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Campaign History */}
              <div className="grid gap-4">
                {campaignHistory
                  .filter(campaign => statusFilter === 'todas' || campaign.status === statusFilter)
                  .map((campaign) => (
                    <Card key={campaign.id}>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {campaign.titulo}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{new Date(campaign.data_resposta).toLocaleDateString('pt-AO')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="w-4 h-4" />
                                <span>{Math.floor(campaign.tempo_resposta / 60)}m {campaign.tempo_resposta % 60}s</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BanknotesIcon className="w-4 h-4" />
                                <span>{campaign.recompensa} AOA</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                              {getStatusIcon(campaign.status)}
                              <span>{campaign.status}</span>
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/questionnaire/${campaign.id}`)}
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'medalhas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medals.map((medal) => (
                <Card key={medal.id} className={`${medal.earned ? 'ring-2 ring-yellow-400' : 'opacity-60'}`}>
                  <div className="p-6 text-center">
                    <div className="text-6xl mb-4">{medal.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {medal.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {medal.description}
                    </p>
                    {medal.earned ? (
                      <Badge variant="success">Conquistada</Badge>
                    ) : (
                      <Badge variant="secondary">Bloqueada</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </MainLayout>
    );
};

export default NewHistoryScreen;