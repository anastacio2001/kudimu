import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  ChartBarIcon,
  PresentationChartLineIcon,
  UsersIcon,
  BanknotesIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Badge } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

/**
 * NewReportsPage - Página de relatórios moderna com Chart.js
 */
const NewReportsPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  
  // Data states
  const [overviewData, setOverviewData] = useState(null);
  const [campaignAnalytics, setCampaignAnalytics] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [financialData, setFinancialData] = useState(null);

  useEffect(() => {
    fetchReportsData();
  }, [activeTab, dateRange]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      
      // Mock data para desenvolvimento
      const mockOverviewData = {
        totalUsers: 1250,
        activeCampaigns: 15,
        totalResponses: 3420,
        totalRewards: 856750,
        userGrowth: 12.5,
        campaignGrowth: 8.3,
        responseGrowth: 23.1,
        rewardGrowth: 15.7,
        
        // Dados para gráficos
        userGrowthChart: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
          datasets: [{
            label: 'Novos Usuários',
            data: [45, 52, 48, 73, 86, 95, 108, 125, 142, 158],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        
        campaignPerformance: {
          labels: ['Tecnologia', 'Saúde', 'Educação', 'Consumo', 'Social'],
          datasets: [{
            label: 'Campanhas por Categoria',
            data: [5, 3, 2, 3, 2],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        
        responsesByMonth: {
          labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out'],
          datasets: [{
            label: 'Respostas Válidas',
            data: [320, 420, 385, 490, 580],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1
          }, {
            label: 'Respostas Rejeitadas',
            data: [45, 35, 52, 38, 42],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1
          }]
        }
      };

      const mockCampaignAnalytics = {
        topCampaigns: [
          {
            id: '1',
            titulo: 'Pesquisa sobre Apps de Delivery',
            respostas: 245,
            taxa_conclusao: 87.3,
            recompensa_media: 320,
            status: 'ativa'
          },
          {
            id: '2',
            titulo: 'Impacto da Telemedicina',
            respostas: 189,
            taxa_conclusao: 92.1,
            recompensa_media: 400,
            status: 'ativa'
          },
          {
            id: '3',
            titulo: 'Educação Digital nas Escolas',
            respostas: 156,
            taxa_conclusao: 78.9,
            recompensa_media: 300,
            status: 'encerrada'
          }
        ],
        
        campaignEngagement: {
          labels: ['0-2min', '2-5min', '5-10min', '10-15min', '15min+'],
          datasets: [{
            label: 'Distribuição por Tempo de Resposta',
            data: [125, 380, 420, 185, 95],
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        },
        
        qualityMetrics: {
          labels: ['Última Semana'],
          datasets: [{
            label: 'Taxa de Aprovação (%)',
            data: [94.2],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2
          }, {
            label: 'Taxa de Rejeição (%)',
            data: [5.8],
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 2
          }]
        }
      };

      const mockFinancialData = {
        totalPayouts: 856750,
        pendingPayouts: 45200,
        avgRewardPerResponse: 285,
        topSpendingCategories: {
          labels: ['Tecnologia', 'Saúde', 'Educação', 'Consumo', 'Social'],
          datasets: [{
            data: [285000, 195000, 125000, 156000, 95750],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        },
        
        monthlySpending: {
          labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out'],
          datasets: [{
            label: 'Gastos em Recompensas (AOA)',
            data: [125000, 145000, 135000, 175000, 185000],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          }]
        }
      };

      setOverviewData(mockOverviewData);
      setCampaignAnalytics(mockCampaignAnalytics);
      setFinancialData(mockFinancialData);
      setError(null);

    } catch (err) {
      console.error('Error fetching reports data:', err);
      setError('Erro ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-AO').format(value);
  };

  const getTrendIcon = (growth) => {
    return growth >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const getTrendColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: ChartBarIcon },
    { id: 'campaigns', label: 'Campanhas', icon: PresentationChartLineIcon },
    { id: 'users', label: 'Usuários', icon: UsersIcon },
    { id: 'financial', label: 'Financeiro', icon: BanknotesIcon }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(156, 163, 175, 1)' : 'rgba(75, 85, 99, 1)'
        }
      },
      x: {
        grid: {
          color: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(156, 163, 175, 1)' : 'rgba(75, 85, 99, 1)'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <ChartBarIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Erro ao carregar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchReportsData} className="w-full">
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/campaigns')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Voltar
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios e Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400">Insights detalhados da plataforma</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="last7days">Últimos 7 dias</option>
                <option value="last30days">Últimos 30 dias</option>
                <option value="last90days">Últimos 90 dias</option>
                <option value="lastyear">Último ano</option>
              </select>
              <Button variant="outline" size="sm">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {activeTab === 'overview' && overviewData && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usuários</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(overviewData.totalUsers)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {React.createElement(getTrendIcon(overviewData.userGrowth), {
                        className: `w-4 h-4 ${getTrendColor(overviewData.userGrowth)}`
                      })}
                      <span className={`text-sm font-medium ${getTrendColor(overviewData.userGrowth)}`}>
                        {overviewData.userGrowth > 0 ? '+' : ''}{overviewData.userGrowth}%
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Campanhas Ativas</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(overviewData.activeCampaigns)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {React.createElement(getTrendIcon(overviewData.campaignGrowth), {
                        className: `w-4 h-4 ${getTrendColor(overviewData.campaignGrowth)}`
                      })}
                      <span className={`text-sm font-medium ${getTrendColor(overviewData.campaignGrowth)}`}>
                        {overviewData.campaignGrowth > 0 ? '+' : ''}{overviewData.campaignGrowth}%
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Respostas</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(overviewData.totalResponses)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {React.createElement(getTrendIcon(overviewData.responseGrowth), {
                        className: `w-4 h-4 ${getTrendColor(overviewData.responseGrowth)}`
                      })}
                      <span className={`text-sm font-medium ${getTrendColor(overviewData.responseGrowth)}`}>
                        {overviewData.responseGrowth > 0 ? '+' : ''}{overviewData.responseGrowth}%
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recompensas Pagas</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(overviewData.totalRewards)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {React.createElement(getTrendIcon(overviewData.rewardGrowth), {
                        className: `w-4 h-4 ${getTrendColor(overviewData.rewardGrowth)}`
                      })}
                      <span className={`text-sm font-medium ${getTrendColor(overviewData.rewardGrowth)}`}>
                        {overviewData.rewardGrowth > 0 ? '+' : ''}{overviewData.rewardGrowth}%
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Growth Chart */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Crescimento de Usuários
                  </h3>
                  <div style={{ height: '300px' }}>
                    <Line data={overviewData.userGrowthChart} options={chartOptions} />
                  </div>
                </Card>

                {/* Campaign Categories */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Campanhas por Categoria
                  </h3>
                  <div style={{ height: '300px' }}>
                    <Doughnut data={overviewData.campaignPerformance} options={{
                      ...chartOptions,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }} />
                  </div>
                </Card>

                {/* Responses Chart */}
                <Card className="p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Respostas por Mês
                  </h3>
                  <div style={{ height: '300px' }}>
                    <Bar data={overviewData.responsesByMonth} options={chartOptions} />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && campaignAnalytics && (
            <div className="space-y-8">
              {/* Top Campaigns Table */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Campanhas com Melhor Performance
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Campanha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Respostas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Taxa Conclusão
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Recompensa Média
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {campaignAnalytics.topCampaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {campaign.titulo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatNumber(campaign.respostas)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {campaign.taxa_conclusao}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatCurrency(campaign.recompensa_media)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={campaign.status === 'ativa' ? 'success' : 'secondary'}
                              size="sm"
                            >
                              {campaign.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Tempo de Resposta
                  </h3>
                  <div style={{ height: '300px' }}>
                    <Pie data={campaignAnalytics.campaignEngagement} options={{
                      ...chartOptions,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }} />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Qualidade das Respostas
                  </h3>
                  <div style={{ height: '300px' }}>
                    <Bar data={campaignAnalytics.qualityMetrics} options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            }
                          }
                        }
                      }
                    }} />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'financial' && financialData && (
            <div className="space-y-8">
              {/* Financial KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BanknotesIcon className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pago</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(financialData.totalPayouts)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CalendarIcon className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendente</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(financialData.pendingPayouts)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Média por Resposta</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(financialData.avgRewardPerResponse)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Financial Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Gastos por Categoria
                  </h3>
                  <div style={{ height: '300px' }}>
                    <Doughnut data={financialData.topSpendingCategories} options={{
                      ...chartOptions,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }} />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Evolução dos Gastos
                  </h3>
                  <div style={{ height: '300px' }}>
                    <Line data={financialData.monthlySpending} options={chartOptions} />
                  </div>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NewReportsPage;