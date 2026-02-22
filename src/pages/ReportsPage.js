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
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token de autenticação não encontrado');
        navigate('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch System Overview
      if (activeTab === 'overview') {
        const overviewResponse = await fetch(`${API_URL}/reports/system/overview`, { headers });
        const overviewResult = await overviewResponse.json();

        if (!overviewResult.success) {
          throw new Error(overviewResult.error || 'Erro ao carregar overview');
        }

        const systemData = overviewResult.data;

        // Transform API data to chart format
        const transformedData = {
          totalUsers: systemData.usuarios.total,
          activeCampaigns: systemData.campanhas.ativas,
          totalResponses: systemData.campanhas.total_respostas,
          totalRewards: systemData.financeiro.total_pago_aoa,
          userGrowth: systemData.usuarios.taxa_ativacao,
          campaignGrowth: (systemData.campanhas.ativas / systemData.campanhas.total * 100).toFixed(1),
          responseGrowth: systemData.campanhas.taxa_conclusao,
          rewardGrowth: 15.7, // Placeholder

          userGrowthChart: {
            labels: systemData.graficos.crescimento_usuarios.map(item => item.mes),
            datasets: [{
              label: 'Total de Usuários',
              data: systemData.graficos.crescimento_usuarios.map(item => item.total),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },

          campaignPerformance: {
            labels: systemData.graficos.por_provincia.slice(0, 5).map(item => item.provincia),
            datasets: [{
              label: 'Distribuição Geográfica',
              data: systemData.graficos.por_provincia.slice(0, 5).map(item => item.total),
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
            labels: ['Últimos 30 dias'],
            datasets: [{
              label: 'Respostas Totais',
              data: [systemData.campanhas.total_respostas],
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              borderColor: 'rgba(16, 185, 129, 1)',
              borderWidth: 1
            }]
          }
        };

        setOverviewData(transformedData);

        // Campaign Analytics from top campaigns
        const topCampaigns = systemData.graficos.top_campanhas.map(c => ({
          id: c.id,
          titulo: c.titulo,
          respostas: c.quantidade_atual,
          taxa_conclusao: c.progresso,
          recompensa_media: c.recompensa_por_resposta || 0,
          status: c.quantidade_atual >= c.quantidade_desejada ? 'encerrada' : 'ativa'
        }));

        setCampaignAnalytics({
          topCampaigns: topCampaigns.slice(0, 5),
          campaignEngagement: {
            labels: ['Alta', 'Média', 'Baixa'],
            datasets: [{
              label: 'Engajamento',
              data: [topCampaigns.filter(c => c.taxa_conclusao > 70).length,
                     topCampaigns.filter(c => c.taxa_conclusao >= 40 && c.taxa_conclusao <= 70).length,
                     topCampaigns.filter(c => c.taxa_conclusao < 40).length],
              backgroundColor: [
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
              ]
            }]
          },
          qualityMetrics: {
            labels: ['Atual'],
            datasets: [{
              label: 'Taxa de Conclusão Média (%)',
              data: [systemData.campanhas.taxa_conclusao],
              backgroundColor: 'rgba(16, 185, 129, 0.8)',
              borderColor: 'rgba(16, 185, 129, 1)',
              borderWidth: 2
            }]
          }
        });
      }

      // Fetch Financial Data
      if (activeTab === 'financial') {
        const financialResponse = await fetch(`${API_URL}/reports/financial`, { headers });
        const financialResult = await financialResponse.json();

        if (!financialResult.success) {
          throw new Error(financialResult.error || 'Erro ao carregar dados financeiros');
        }

        const finData = financialResult.data;

        setFinancialData({
          totalPayouts: finData.resumo.total_pago_aoa,
          pendingPayouts: finData.resumo.total_pendente_aoa,
          avgRewardPerResponse: Math.round(finData.resumo.total_pago_aoa / (finData.resumo.total_transacoes_credito || 1)),
          topSpendingCategories: {
            labels: finData.por_metodo_pagamento.map(m => {
              if (m.metodo_pagamento === 'dados_moveis') return 'Dados Móveis';
              if (m.metodo_pagamento === 'e_kwanza') return 'e-Kwanza';
              if (m.metodo_pagamento === 'paypay') return 'PayPay';
              return m.metodo_pagamento;
            }),
            datasets: [{
              data: finData.por_metodo_pagamento.map(m => m.total_valor_aoa),
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
            labels: ['Total Atual'],
            datasets: [{
              label: 'Gastos em Recompensas (AOA)',
              data: [finData.resumo.total_pago_aoa],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.4
            }]
          }
        });
      }

      setError(null);

    } catch (err) {
      console.error('Error fetching reports data:', err);
      setError(err.message || 'Erro ao carregar dados dos relatórios');
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

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autenticação não encontrado');
        return;
      }

      let exportType = 'campaigns'; // Default
      if (activeTab === 'overview') exportType = 'users';
      else if (activeTab === 'campaigns') exportType = 'campaigns';
      else if (activeTab === 'financial') exportType = 'transactions';

      const response = await fetch(`${API_URL}/reports/export/${exportType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kudimu_${exportType}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    }
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
              <Button variant="outline" size="sm" onClick={handleExport}>
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar CSV
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