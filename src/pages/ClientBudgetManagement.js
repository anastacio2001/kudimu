import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../components/ClientLayout';

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
import { API_URL } from '../config/api';

const ClientBudgetManagement = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${API_URL}/client/budget`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Transformar dados do backend para o formato esperado pelo componente
        const transformedData = {
          resumo_geral: {
            orcamento_total: result.data.orcamento_total,
            gasto_total: result.data.orcamento_utilizado,
            orcamento_restante: result.data.orcamento_disponivel,
            numero_campanhas: result.data.campanhas_ativas + result.data.campanhas_pendentes,
            percentual_utilizado: result.data.percentual_utilizado
          },
          alertas: result.data.alertas || [],
          historico_mensal: result.data.historico_mensal || []
        };
        setBudgetData(transformedData);
        setAlerts(result.data.alertas || []);
      } else {
        console.error('Erro ao carregar orçamento:', result.error);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de orçamento:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !budgetData) {
    return (
      <ClientLayout title="Gestão de Orçamento">
        <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando dados de orçamento...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Gestão de Orçamento">
      <div className="container-custom py-8">


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
                  className="p-4 rounded-xl border-l-4 bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-amber-500"
                >
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{alert.campanha}</p>
                      <p className="text-gray-600 dark:text-gray-400">{alert.mensagem}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resumo Financeiro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Orçamento Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {budgetData?.resumo_geral?.orcamento_total?.toLocaleString() || '0'} Kz
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {budgetData?.resumo_geral?.numero_campanhas || 0} campanhas ativas
                </p>
              </div>
              <WalletIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Investido</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {budgetData?.resumo_geral?.gasto_total?.toLocaleString() || '0'} Kz
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {((budgetData?.resumo_geral?.gasto_total || 0) / (budgetData?.resumo_geral?.orcamento_total || 1) * 100).toFixed(1)}% utilizado
                </p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Disponível</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {budgetData?.resumo_geral?.orcamento_restante?.toLocaleString() || '0'} Kz
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {((budgetData?.resumo_geral?.orcamento_restante || 0) / (budgetData?.resumo_geral?.orcamento_total || 1) * 100).toFixed(1)}% restante
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">ROI Estimado</p>
                <p className="text-2xl font-bold text-primary-600">
                  {budgetData?.resumo_geral?.roi_estimado || 0}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{budgetData?.resumo_geral?.economia_mes?.toLocaleString() || '0'} Kz/mês
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </motion.div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Semanal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Semanal</h3>
            <Line 
              data={{
                labels: budgetData?.performance_mensal?.ultimos_30_dias?.map(d => d.dia) || [],
                datasets: [
                  {
                    label: 'Gastos Semanais',
                    data: budgetData?.performance_mensal?.ultimos_30_dias?.map(d => d.gasto) || [],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                  },
                  {
                    label: 'Meta Semanal',
                    data: budgetData?.performance_mensal?.ultimos_30_dias?.map(d => d.meta) || [],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    borderDash: [5, 5]
                  }
                ],
              }}
              options={{
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
              }}
            />
          </motion.div>

          {/* Distribuição do Orçamento */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição do Orçamento</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut 
                data={{
                  labels: ['Gasto', 'Restante'],
                  datasets: [
                    {
                      data: [
                        budgetData?.resumo_geral?.gasto_total || 0,
                        budgetData?.resumo_geral?.orcamento_restante || 0
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
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Minhas Campanhas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Minhas Campanhas</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Campanha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Orçamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Investido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progresso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {(budgetData?.campanhas || []).map((campanha) => (
                  <tr key={campanha.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {campanha.nome}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {campanha.respostas}/{campanha.meta_respostas} respostas
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {campanha.orcamento.toLocaleString()} Kz
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                      {campanha.gasto.toLocaleString()} Kz
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{width: `${(campanha.respostas/campanha.meta_respostas)*100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {Math.round((campanha.respostas/campanha.meta_respostas)*100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        campanha.status === 'ativa' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : campanha.status === 'quase_esgotado'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {campanha.status === 'ativa' ? 'Ativa' : 
                         campanha.status === 'quase_esgotado' ? 'Atenção' : 'Pausada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button 
                        onClick={() => navigate(`/client/campaigns/${campanha.id}/analytics`)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Insights e Recomendações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights e Recomendações</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Otimização Sugerida</h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Sua eficiência média está em 91.8%. Considere realocar orçamento da campanha menos eficiente para campanhas com melhor performance.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">📈 Tendência Positiva</h4>
              <p className="text-sm text-green-800 dark:text-green-400">
                Suas campanhas estão performando 15% acima da média do mercado. Continue investindo nas mesmas estratégias.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default ClientBudgetManagement;