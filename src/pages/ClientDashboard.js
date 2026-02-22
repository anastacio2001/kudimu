import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import ClientLayout from '../components/ClientLayout';
import { API_URL } from '../config/api';

const ClientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadClientDashboard();
  }, []);

  const loadClientDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Buscar dados reais do backend
      const response = await fetch(`${API_URL}/client/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        console.error('Erro ao carregar dashboard:', result.error);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativa':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rascunho':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'finalizada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const services = [
    {
      title: 'Minhas Campanhas',
      description: 'Gerenciar e criar novas campanhas de pesquisa',
      icon: ClipboardDocumentListIcon,
      color: 'blue',
      path: '/client/campaigns'
    },
    {
      title: 'Analytics',
      description: 'Análises detalhadas das suas campanhas',
      icon: ChartBarIcon,
      color: 'purple',
      path: '/client/campaigns/1/analytics'
    },
    {
      title: 'AI Insights',
      description: 'Insights automáticos com inteligência artificial',
      icon: SparklesIcon,
      color: 'pink',
      path: '/client/ai-insights'
    },
    {
      title: 'Relatórios',
      description: 'Relatórios e exportação de dados',
      icon: DocumentTextIcon,
      color: 'green',
      path: '/client/reports'
    },
    {
      title: 'Gestão de Orçamento',
      description: 'Controle financeiro das campanhas',
      icon: CurrencyDollarIcon,
      color: 'yellow',
      path: '/client/budget'
    },
    {
      title: 'Adicionar Créditos',
      description: 'Comprar créditos e ver histórico',
      icon: CurrencyDollarIcon,
      color: 'green',
      path: '/client/credits'
    },
    {
      title: 'Validar Respostas',
      description: 'Revisar e validar respostas recebidas',
      icon: CheckCircleIcon,
      color: 'indigo',
      path: '/admin/answers'
    }
  ];

  if (loading) {
    return (
      <ClientLayout title="Dashboard do Cliente">
        <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <ClientLayout title="Dashboard do Cliente">
        <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Erro ao carregar dados do dashboard</p>
            <button 
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Dashboard do Cliente">
      <div className="container-custom py-8">

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Campanhas Ativas</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {dashboardData.overview.campanhas_ativas}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Respostas</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {dashboardData.overview.total_respostas}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <UserGroupIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Orçamento</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {((dashboardData.overview.orcamento_utilizado / dashboardData.overview.orcamento_total) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {(dashboardData.overview.orcamento_utilizado / 1000).toFixed(0)}K / {(dashboardData.overview.orcamento_total / 1000).toFixed(0)}K AOA
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Qualidade Média</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {dashboardData.overview.qualidade_media.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">de 5.0</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Serviços Disponíveis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Serviços Disponíveis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                onClick={() => navigate(service.path)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all text-left group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-${service.color}-100 dark:bg-${service.color}-900/20 mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`h-6 w-6 text-${service.color}-600 dark:text-${service.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campanhas Recentes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Campanhas Recentes
                </h3>
                <button
                  onClick={() => navigate('/client/campaigns')}
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Ver todas
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {dashboardData.campanhas_recentes.map((campanha) => (
                <div
                  key={campanha.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/client/campaigns/${campanha.id}/analytics`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {campanha.titulo}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {campanha.total_respostas}/{campanha.meta_respostas} respostas
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campanha.status)}`}>
                      {campanha.status}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${campanha.progresso}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Insights e Atividades */}
          <div className="space-y-8">
            {/* Insights Recentes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Insights Recentes
                  </h3>
                  <button
                    onClick={() => navigate('/client/ai-insights')}
                    className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Ver todos
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {dashboardData.insights_recentes.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      insight.tipo === 'positive'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {insight.tipo === 'positive' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                          {insight.titulo}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {insight.descricao}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {insight.campanha}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Atividades Recentes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Atividades Recentes
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {dashboardData.atividades_recentes.map((atividade, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {atividade.descricao}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {atividade.campanha} • {atividade.tempo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
