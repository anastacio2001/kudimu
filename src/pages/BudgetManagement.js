import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const BudgetManagement = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  useEffect(() => {
    loadBudgetData();
  }, [selectedCampaign]);

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      
      // Detectar se estamos em desenvolvimento ou produção
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/budget/overview`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setBudgetData(result.data);
        setAlerts(result.data.alertas || []);
      } else {
        console.error('Erro ao carregar dados de orçamento:', result.error);
        // Fallback para dados mock em caso de erro
        const mockData = {
          resumo_geral: {
            orcamento_total: 500000,
            gasto_total: 287000,
            orcamento_restante: 213000,
            numero_campanhas: 8,
            custo_medio_por_resposta: 485,
            roi_geral: 23.5,
            economia_mensal: 15200
          },
          campanhas: [
            {
              id: 1,
              nome: "Estudo Mercado de Trabalho 2024",
              orcamento: 100000,
              gasto: 74880,
              restante: 25120,
              custo_por_resposta: 480,
              respostas: 156,
              status: "ativa",
              eficiencia: 95.2
            },
            {
              id: 2,
              nome: "Avaliação Serviços Bancários",
              orcamento: 150000,
              gasto: 89000,
              restante: 61000,
              custo_por_resposta: 490,
              respostas: 182,
              status: "ativa",
              eficiencia: 87.8
            },
            {
              id: 3,
              nome: "Pesquisa Produtos Digitais",
              orcamento: 60000,
              gasto: 58200,
              restante: 1800,
              custo_por_resposta: 470,
              respostas: 124,
              status: "quase_esgotado",
              eficiencia: 92.3
            }
          ],
          tendencias: {
            ultimos_7_dias: [
              { dia: 'Seg', gasto: 8500 },
              { dia: 'Ter', gasto: 12300 },
              { dia: 'Qua', gasto: 9800 },
              { dia: 'Qui', gasto: 15600 },
              { dia: 'Sex', gasto: 11200 },
              { dia: 'Sáb', gasto: 7400 },
              { dia: 'Dom', gasto: 4200 }
            ],
            projecao_mensal: {
              estimativa_gasto: 350000,
              orcamento_disponivel: 500000,
              dias_restantes: 18,
              ritmo_atual: 'moderado'
            }
          },
          alertas: [
            {
              tipo: 'warning',
              campanha: 'Pesquisa Produtos Digitais',
              mensagem: 'Orçamento restante: apenas 3% (1.800 Kz)',
              severidade: 'alta'
            },
            {
              tipo: 'info',
              campanha: 'Estudo Mercado de Trabalho 2024',
              mensagem: 'Performance excelente - 95.2% de eficiência',
              severidade: 'baixa'
            }
          ]
        };

        setBudgetData(mockData);
        setAlerts(mockData.alertas);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de orçamento:', error);
      // Usar dados mock como fallback
      const mockData = {
        resumo_geral: {
          orcamento_total: 500000,
          gasto_total: 287000,
          orcamento_restante: 213000,
          numero_campanhas: 8,
          custo_medio_por_resposta: 485,
          roi_geral: 23.5,
          economia_mensal: 15200
        },
        campanhas: [
          {
            id: 1,
            nome: "Estudo Mercado de Trabalho 2024",
            orcamento: 100000,
            gasto: 74880,
            restante: 25120,
            custo_por_resposta: 480,
            respostas: 156,
            status: "ativa",
            eficiencia: 95.2
          },
          {
            id: 2,
            nome: "Avaliação Serviços Bancários",
            orcamento: 150000,
            gasto: 89000,
            restante: 61000,
            custo_por_resposta: 490,
            respostas: 182,
            status: "ativa",
            eficiencia: 87.8
          },
          {
            id: 3,
            nome: "Pesquisa Produtos Digitais",
            orcamento: 60000,
            gasto: 58200,
            restante: 1800,
            custo_por_resposta: 470,
            respostas: 124,
            status: "quase_esgotado",
            eficiencia: 92.3
          }
        ],
        tendencias: {
          ultimos_7_dias: [
            { dia: 'Seg', gasto: 8500 },
            { dia: 'Ter', gasto: 12300 },
            { dia: 'Qua', gasto: 9800 },
            { dia: 'Qui', gasto: 15600 },
            { dia: 'Sex', gasto: 11200 },
            { dia: 'Sáb', gasto: 7400 },
            { dia: 'Dom', gasto: 4200 }
          ],
          projecao_mensal: {
            estimativa_gasto: 350000,
            orcamento_disponivel: 500000,
            dias_restantes: 18,
            ritmo_atual: 'moderado'
          }
        },
        alertas: [
          {
            tipo: 'warning',
            campanha: 'Pesquisa Produtos Digitais',
            mensagem: 'Orçamento restante: apenas 3% (1.800 Kz)',
            severidade: 'alta'
          },
          {
            tipo: 'info',
            campanha: 'Estudo Mercado de Trabalho 2024',
            mensagem: 'Performance excelente - 95.2% de eficiência',
            severidade: 'baixa'
          }
        ]
      };

      setBudgetData(mockData);
      setAlerts(mockData.alertas);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + ' Kz';
          }
        }
      }
    }
  };

  const spendingTrendData = {
    labels: budgetData?.tendencias.ultimos_7_dias.map(d => d.dia) || [],
    datasets: [
      {
        label: 'Gastos Diários',
        data: budgetData?.tendencias.ultimos_7_dias.map(d => d.gasto) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const budgetDistributionData = {
    labels: ['Gasto', 'Restante'],
    datasets: [
      {
        data: [
          budgetData?.resumo_geral.gasto_total || 0,
          budgetData?.resumo_geral.orcamento_restante || 0
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados de orçamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestão de Orçamento</h1>
          <p className="text-gray-600 dark:text-gray-400">Controle e otimize seus gastos de campanha</p>
        </motion.div>

        {/* Alertas */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.tipo === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
                  }`}
                >
                  <div className="flex items-center">
                    {alert.tipo === 'warning' ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                    ) : (
                      <BellIcon className="h-5 w-5 text-blue-600 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{alert.campanha}</p>
                      <p className="text-gray-600">{alert.mensagem}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resumo Geral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Orçamento Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {budgetData.resumo_geral.orcamento_total.toLocaleString()} Kz
                </p>
              </div>
              <WalletIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Gasto Total</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {budgetData.resumo_geral.gasto_total.toLocaleString()} Kz
                </p>
                <p className="text-xs text-gray-500">
                  {((budgetData.resumo_geral.gasto_total / budgetData.resumo_geral.orcamento_total) * 100).toFixed(1)}% do orçamento
                </p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Restante</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {budgetData.resumo_geral.orcamento_restante.toLocaleString()} Kz
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {((budgetData.resumo_geral.orcamento_restante / budgetData.resumo_geral.orcamento_total) * 100).toFixed(1)}% disponível
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">ROI Geral</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {budgetData.resumo_geral.roi_geral}%
                </p>
                <p className="text-xs text-gray-500">
                  Economia: {budgetData.resumo_geral.economia_mensal.toLocaleString()} Kz/mês
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tendência de Gastos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tendência de Gastos (7 dias)</h3>
            <Line data={spendingTrendData} options={chartOptions} />
          </motion.div>

          {/* Distribuição do Orçamento */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição do Orçamento</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={budgetDistributionData} />
            </div>
          </motion.div>
        </div>

        {/* Lista de Campanhas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Orçamento por Campanha</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Campanha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Orçamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Gasto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eficiência
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {budgetData.campanhas.map((campanha) => (
                  <tr key={campanha.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {campanha.nome}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {campanha.respostas} respostas
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campanha.orcamento.toLocaleString()} Kz
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {campanha.gasto.toLocaleString()} Kz
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {campanha.restante.toLocaleString()} Kz
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${campanha.eficiencia}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{campanha.eficiencia}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        campanha.status === 'ativa' 
                          ? 'bg-green-100 text-green-800'
                          : campanha.status === 'quase_esgotado'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campanha.status === 'ativa' ? 'Ativa' : 
                         campanha.status === 'quase_esgotado' ? 'Quase Esgotado' : 'Pausada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Projeções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Projeção Mensal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {budgetData.tendencias.projecao_mensal.estimativa_gasto.toLocaleString()} Kz
              </p>
              <p className="text-gray-600 dark:text-gray-400">Estimativa de Gasto</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {budgetData.tendencias.projecao_mensal.dias_restantes} dias
              </p>
              <p className="text-gray-600 dark:text-gray-400">Restantes no Mês</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 capitalize">
                {budgetData.tendencias.projecao_mensal.ritmo_atual}
              </p>
              <p className="text-gray-600 dark:text-gray-400">Ritmo de Gastos</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetManagement;