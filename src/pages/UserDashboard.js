import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  TrophyIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  GiftIcon,
  UserIcon,
  BellIcon,
  FireIcon,
  SparklesIcon,
  BoltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import {
  TrophyIcon as TrophySolid,
  StarIcon as StarSolid,
  FireIcon as FireSolid
} from '@heroicons/react/24/solid';
import AchievementsCard from '../components/AchievementsCard';
import ReferralCard from '../components/ReferralCard';
import ProgressRing from '../components/gamification/ProgressRing';
import MedalCard from '../components/gamification/MedalCard';
import ActivityFeed from '../components/gamification/ActivityFeed';
import { useCelebration } from '../utils/celebrations';

const UserDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [medals, setMedals] = useState([]);
  const navigate = useNavigate();
  const { celebrate } = useCelebration();

  // Helper para obter dados unificados do usuário
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

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

  useEffect(() => {
    loadUserStats();
    loadMedals();
    loadActivities();
  }, []);

  const loadMedals = () => {
    // Mock medals data
    const mockMedals = [
      {
        id: '1',
        nome: 'Primeira Pesquisa',
        descricao: 'Completou sua primeira pesquisa',
        icone: 'star',
        cor: 'gold',
        desbloqueada: true,
        data_desbloqueio: '2025-01-15',
        raridade: 'comum'
      },
      {
        id: '2',
        nome: 'Sequência de Fogo',
        descricao: 'Respondeu pesquisas por 7 dias seguidos',
        icone: 'fire',
        cor: 'bronze',
        desbloqueada: true,
        data_desbloqueio: '2025-02-10',
        raridade: 'raro'
      },
      {
        id: '3',
        nome: 'Mestre das Opiniões',
        descricao: 'Completou 50 pesquisas',
        icone: 'trophy',
        cor: 'purple',
        desbloqueada: false,
        progresso: 12,
        total: 50,
        raridade: 'épico'
      },
      {
        id: '4',
        nome: 'Relâmpago',
        descricao: 'Completou 5 pesquisas em 1 dia',
        icone: 'bolt',
        cor: 'blue',
        desbloqueada: false,
        progresso: 2,
        total: 5,
        raridade: 'raro'
      }
    ];
    setMedals(mockMedals);
  };

  const loadActivities = () => {
    // Mock activities for social proof
    const mockActivities = [
      {
        id: '1',
        usuario_anonimo: 'Usuário #1247',
        tipo: 'pesquisa',
        descricao: 'completou "Pesquisa sobre Internet em Angola"',
        valor: 150,
        timestamp: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        id: '2',
        usuario_anonimo: 'Usuário #3891',
        tipo: 'medalha',
        descricao: 'desbloqueou a medalha "Sequência de Fogo"',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString()
      },
      {
        id: '3',
        usuario_anonimo: 'Usuário #5632',
        tipo: 'nivel',
        descricao: 'subiu para o nível Confiável!',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString()
      },
      {
        id: '4',
        usuario_anonimo: 'Usuário #7123',
        tipo: 'pesquisa',
        descricao: 'completou "Avaliação de Serviços Bancários"',
        valor: 200,
        timestamp: new Date(Date.now() - 48 * 60000).toISOString()
      }
    ];
    setRecentActivities(mockActivities);
  };

  const loadUserStats = async () => {
    try {
      setLoading(true);
      
      // Detectar se estamos em desenvolvimento ou produção
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/user/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setUserStats(result.data);
      } else {
        // Mock data para usuários normais (usa dados do localStorage)
        const userData = getUserData();
        const mockStats = {
          pesquisas_respondidas: userData?.campanhas_respondidas || 12,
          pontos_ganhos: userData?.saldo_pontos || 15700,
          nivel_atual: userData?.nivel || 'Bronze',
          reputacao: userData?.reputacao || 490,
          saldo_disponivel: userData?.saldo_pontos || 15700,
          pesquisas_disponveis: 50,
          meta_mensal: 20,
          progresso_meta: 60, // 12/20 = 60%
          conquistas_recentes: [
            { nome: 'Primeira Pesquisa', descricao: 'Completou sua primeira pesquisa', data: '2025-11-01' },
            { nome: 'Semana Produtiva', descricao: 'Respondeu 5 pesquisas em uma semana', data: '2025-11-02' }
          ],
          campanhas_disponiveis: [
            {
              id: 1,
              titulo: 'Pesquisa sobre Hábitos de Consumo',
              cliente: 'Empresa ABC',
              recompensa: 150,
              tempo_estimado: 8,
              categoria: 'Consumo'
            },
            {
              id: 2,
              titulo: 'Avaliação de Serviços Bancários',
              cliente: 'Banco XYZ',
              recompensa: 200,
              tempo_estimado: 12,
              categoria: 'Financeiro'
            }
          ]
        };
        setUserStats(mockStats);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      // Usar dados do localStorage como fallback
      const userData = getUserData();
      const mockStats = {
        pesquisas_respondidas: userData?.campanhas_respondidas || 12,
        pontos_ganhos: userData?.saldo_pontos || 15700,
        nivel_atual: userData?.nivel || 'Bronze',
        reputacao: userData?.reputacao || 490,
        saldo_disponivel: userData?.saldo_pontos || 15700,
        pesquisas_disponveis: 50,
        meta_mensal: 20,
        progresso_meta: 60,
        conquistas_recentes: [
          { nome: 'Primeira Pesquisa', descricao: 'Completou sua primeira pesquisa', data: '2025-11-01' },
          { nome: 'Semana Produtiva', descricao: 'Respondeu 5 pesquisas em uma semana', data: '2025-11-02' }
        ],
        campanhas_disponiveis: [
          {
            id: 1,
            titulo: 'Pesquisa sobre Hábitos de Consumo',
            cliente: 'Empresa ABC',
            recompensa: 150,
            tempo_estimado: 8,
            categoria: 'Consumo'
          },
          {
            id: 2,
            titulo: 'Avaliação de Serviços Bancários',
            cliente: 'Banco XYZ',
            recompensa: 200,
            tempo_estimado: 12,
            categoria: 'Financeiro'
          }
        ]
      };
      setUserStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent absolute inset-0"></div>
          </div>
          <span className="text-gray-700 dark:text-gray-300 font-medium">Carregando sua experiência...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Header with Avatar & Level */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 text-white overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black">Kudimu</span>
            </motion.div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12 relative z-10">
        {/* Hero Card - Profile & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8"
        >
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar with Progress Ring */}
              <div className="flex-shrink-0 relative">
                <ProgressRing 
                  progress={userStats.reputacao} 
                  size={160}
                  strokeWidth={10}
                  color="#0ea5e9"
                  glowEffect
                >
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-3xl font-black text-white mb-1 shadow-lg">
                      {JSON.parse(localStorage.getItem('user') || '{}').nome?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </ProgressRing>
                
                {/* Streak Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg"
                >
                  <FireSolid className="w-4 h-4" />
                  <span className="text-sm font-bold">7 dias</span>
                </motion.div>
              </div>

              {/* User Info & Level */}
              <div className="flex-1 text-center lg:text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-black text-gray-900 dark:text-white mb-2"
                >
                  Olá, {JSON.parse(localStorage.getItem('user') || '{}').nome}! 👋
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center lg:justify-start gap-2 mb-4"
                >
                  <div className="px-4 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
                    <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                      {getNivelIcon(userStats.nivel_atual)} Nível {userStats.nivel_atual}
                    </span>
                  </div>
                  <div className="px-4 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <span className="text-sm font-bold text-green-700 dark:text-green-300">
                      {userStats.reputacao} XP
                    </span>
                  </div>
                </motion.div>

                {/* Progress to next level */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2 mb-6"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Próximo nível: <strong>Líder</strong></span>
                    <span className="text-gray-900 dark:text-white font-bold">{userStats.reputacao}/150 XP</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500 rounded-full relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${(userStats.reputacao / 150) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse-soft"></div>
                    </motion.div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Faltam apenas {150 - userStats.reputacao} XP para subir de nível! 🚀
                  </p>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl">
                    <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{userStats.pesquisas_respondidas}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Pesquisas</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{userStats.saldo_disponivel.toFixed(0)}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Kz Ganhos</p>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl">
                    <TrophySolid className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{userStats.conquistas_recentes?.length || 0}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Medalhas</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid Principal: Medalhas + Feed + Campanhas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Coluna 1: Medalhas/Achievements */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <TrophySolid className="w-7 h-7 text-yellow-500" />
                  Suas Medalhas
                </h2>
                <button
                  onClick={() => navigate('/rewards')}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                >
                  Ver todas →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {medals.map((medal, index) => (
                  <motion.div
                    key={medal.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <MedalCard medal={medal} size="md" />
                  </motion.div>
                ))}
              </div>

              {/* Meta Mensal Redesenhada */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black">Meta Mensal 🎯</h3>
                    <div className="text-right">
                      <p className="text-3xl font-black">{userStats.progresso_meta}%</p>
                      <p className="text-sm opacity-90">Concluído</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2 opacity-90">
                      <span>{userStats.pesquisas_respondidas} de {userStats.meta_mensal} pesquisas</span>
                      <span>{userStats.meta_mensal - userStats.pesquisas_respondidas} restantes</span>
                    </div>
                    <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ width: `${userStats.progresso_meta}%` }}
                        transition={{ duration: 1.5, delay: 1 }}
                      />
                    </div>
                  </div>

                  <p className="text-sm opacity-90">
                    🔥 Continue assim! Mais {userStats.meta_mensal - userStats.pesquisas_respondidas} pesquisas para completar sua meta!
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Coluna 2: Feed de Atividades */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-1"
          >
            <ActivityFeed activities={recentActivities} maxItems={6} />
          </motion.div>
        </div>

        {/* Pesquisas Disponíveis - Redesenhadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <SparklesIcon className="w-7 h-7 text-primary-500" />
              Pesquisas Disponíveis
            </h2>
            <button
              onClick={() => navigate('/campaigns')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
            >
              Ver todas ({userStats.pesquisas_disponveis})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userStats.campanhas_disponiveis.map((campanha, index) => (
              <motion.div
                key={campanha.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/questionnaire/${campanha.id}`)}
              >
                {/* Header com gradiente */}
                <div className="h-2 bg-gradient-to-r from-primary-500 via-blue-500 to-purple-500"></div>

                <div className="p-6">
                  {/* Badge de categoria */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full">
                      {campanha.categoria}
                    </span>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                      <CurrencyDollarIcon className="w-5 h-5" />
                      <span>{campanha.recompensa} Kz</span>
                    </div>
                  </div>

                  {/* Título e descrição */}
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {campanha.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Por {campanha.cliente}
                  </p>

                  {/* Footer com tempo e botão */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                      <ClockIcon className="w-4 h-4" />
                      <span>{campanha.tempo_estimado} min</span>
                    </div>
                    <div className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg group-hover:bg-primary-700 transition-colors text-sm">
                      Responder →
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ações Rápidas - Redesenhadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Ações Rápidas</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/campaigns')}
              className="group relative bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl p-6 text-left overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <ClipboardDocumentListIcon className="w-10 h-10 text-white mb-4 relative z-10" />
              <h3 className="text-white font-bold text-lg mb-1 relative z-10">Responder Pesquisas</h3>
              <p className="text-blue-100 text-sm relative z-10">Ganhe recompensas</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/history')}
              className="group relative bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl p-6 text-left overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <ChartBarIcon className="w-10 h-10 text-white mb-4 relative z-10" />
              <h3 className="text-white font-bold text-lg mb-1 relative z-10">Ver Histórico</h3>
              <p className="text-green-100 text-sm relative z-10">Acompanhe seu progresso</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/rewards')}
              className="group relative bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-2xl p-6 text-left overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <GiftIcon className="w-10 h-10 text-white mb-4 relative z-10" />
              <h3 className="text-white font-bold text-lg mb-1 relative z-10">Minhas Recompensas</h3>
              <p className="text-purple-100 text-sm relative z-10">Veja suas conquistas</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;