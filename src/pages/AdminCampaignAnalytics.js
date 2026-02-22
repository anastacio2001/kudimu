import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  ChartBarIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ArrowLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

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

const AdminCampaignAnalytics = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [campaignId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Dados completos para admins - com todas as informações sensíveis
      const adminAnalytics = {
        campanha: {
          id: campaignId,
          titulo: 'Estudo Mercado de Trabalho 2024',
          cliente: 'Instituto Nacional de Estatística',
          status: 'ativa',
          total_respostas: 156,
          meta_respostas: 500,
          progresso: 31.2,
          data_inicio: '2025-10-15',
          data_fim: '2025-11-15',
          orcamento_total: 100000,
          gasto_atual: 74880,
          custo_por_resposta: 480.26,
          receita_gerada: 85000,
          margem_lucro: 13.5
        },
        metricas_performance: {
          taxa_conclusao: 94.2,
          tempo_medio_resposta: 8.5,
          satisfacao_geral: 4.2,
          taxa_abandono: 5.8,
          taxa_rejeicao: 2.1,
          qualidade_score: 87.5
        },
        respostas_por_dia: [
          { data: '01/11', respostas: 12, custo: 5763, qualidade: 89 },
          { data: '02/11', respostas: 18, custo: 8645, qualidade: 92 },
          { data: '03/11', respostas: 25, custo: 12007, qualidade: 85 },
          { data: '04/11', respostas: 22, custo: 10566, qualidade: 91 },
          { data: '05/11', respostas: 15, custo: 7204, qualidade: 88 },
          { data: '06/11', respostas: 28, custo: 13447, qualidade: 94 },
          { data: '07/11', respostas: 19, custo: 9125, qualidade: 87 }
        ],
        demograficos_detalhados: {
          faixa_etaria: {
            '18-25': { count: 35, engagement: 96, dropout: 3.2 },
            '26-35': { count: 42, engagement: 94, dropout: 4.1 },
            '36-45': { count: 18, engagement: 89, dropout: 8.7 },
            '46+': { count: 5, engagement: 85, dropout: 12.4 }
          },
          localizacao: {
            'Luanda': { count: 65, cost: 510, quality: 91 },
            'Benguela': { count: 15, cost: 420, quality: 89 },
            'Huambo': { count: 12, cost: 380, quality: 93 },
            'Outras': { count: 8, cost: 340, quality: 87 }
          },
          dispositivos: {
            'Mobile': 78,
            'Desktop': 22
          },
          fontes_trafego: {
            'Redes Sociais': 45,
            'SMS': 35,
            'Email': 15,
            'Outros': 5
          }
        },
        alertas_sistema: [
          {
            tipo: 'warning',
            titulo: 'Taxa de abandono elevada',
            descricao: 'Pergunta 7 tem 15% de abandono - revisar formulação',
            prioridade: 'media'
          },
          {
            tipo: 'success',
            titulo: 'Meta diária atingida',
            descricao: 'Ontem foram coletadas 28 respostas (meta: 25)',
            prioridade: 'baixa'
          },
          {
            tipo: 'info',
            titulo: 'Novo segmento identificado',
            descricao: 'Perfil 25-30 anos mostra alta qualidade de resposta',
            prioridade: 'media'
          }
        ],
        custos_detalhados: {
          incentivos: 45000,
          divulgacao: 18000,
          plataforma: 8880,
          operacional: 3000
        },
        qualidade_dados: {
          respostas_validas: 148,
          respostas_suspeitas: 5,
          respostas_rejeitadas: 3,
          score_consistencia: 91.2,
          tempo_validacao_medio: 24
        }
      };

      setData(adminAnalytics);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
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
      }
    }
  };

  const exportReport = () => {
    // Função para exportar relatório detalhado
    console.log('Exportando relatório administrativo...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando analytics administrativos...</p>
        </div>
      </div>
    );
  }

  const responsesData = {
    labels: data.respostas_por_dia.map(d => d.data),
    datasets: [
      {
        label: 'Respostas',
        data: data.respostas_por_dia.map(d => d.respostas),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Custo (AOA)',
        data: data.respostas_por_dia.map(d => d.custo),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        yAxisID: 'y1',
        type: 'line'
      }
    ],
  };

  const costBreakdownData = {
    labels: Object.keys(data.custos_detalhados),
    datasets: [
      {
        data: Object.values(data.custos_detalhados),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const qualityTrendData = {
    labels: data.respostas_por_dia.map(d => d.data),
    datasets: [
      {
        label: 'Score de Qualidade',
        data: data.respostas_por_dia.map(d => d.qualidade),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Admin */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/admin/campaigns')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar às Campanhas
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics Administrativos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{data.campanha.titulo}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Cliente: {data.campanha.cliente}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={exportReport}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Exportar Relatório
              </button>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {data.campanha.status === 'ativa' ? 'Ativa' : data.campanha.status}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alertas do Sistema */}
        {data.alertas_sistema.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas do Sistema</h3>
            <div className="space-y-3">
              {data.alertas_sistema.map((alerta, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  alerta.tipo === 'warning' 
                    ? 'bg-yellow-50 border-yellow-400' 
                    : alerta.tipo === 'success'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start">
                    {alerta.tipo === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />}
                    {alerta.tipo === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 mr-3" />}
                    {alerta.tipo === 'info' && <EyeIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />}
                    <div>
                      <h4 className="font-medium text-gray-900">{alerta.titulo}</h4>
                      <p className="text-gray-700 text-sm">{alerta.descricao}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Métricas Administrativas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Receita</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {(data.campanha.receita_gerada / 1000).toFixed(0)}K AOA
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Margem: {data.campanha.margem_lucro}%
                </p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Custo/Resposta</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.campanha.custo_por_resposta.toFixed(0)} AOA
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Orçamento: 500 AOA
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Qualidade</p>
                <p className="text-2xl font-bold text-purple-600">
                  {data.metricas_performance.qualidade_score}
                </p>
                <p className="text-xs text-gray-500">
                  Score médio
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Rejeições</p>
                <p className="text-2xl font-bold text-red-600">
                  {data.metricas_performance.taxa_rejeicao}%
                </p>
                <p className="text-xs text-gray-500">
                  {data.qualidade_dados.respostas_rejeitadas} respostas
                </p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Validação</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {data.qualidade_dados.tempo_validacao_medio}h
                </p>
                <p className="text-xs text-gray-500">
                  Tempo médio
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        {/* Gráficos Avançados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance e Custos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance vs Custos</h3>
            <Bar 
              data={responsesData} 
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                }
              }} 
            />
          </motion.div>

          {/* Distribuição de Custos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Custos</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={costBreakdownData} />
            </div>
          </motion.div>
        </div>

        {/* Tendência de Qualidade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Qualidade</h3>
          <Line data={qualityTrendData} options={chartOptions} />
        </motion.div>

        {/* Analytics Detalhados por Localização */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Localização</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Respostas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo Médio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qualidade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(data.demograficos_detalhados.localizacao).map(([local, dados]) => (
                  <tr key={local}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {local}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dados.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dados.cost} AOA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        dados.quality >= 90 ? 'bg-green-100 text-green-800' :
                        dados.quality >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {dados.quality}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Métricas de Qualidade de Dados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualidade dos Dados</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {data.qualidade_dados.respostas_validas}
              </div>
              <div className="text-sm text-gray-600">Respostas Válidas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {data.qualidade_dados.respostas_suspeitas}
              </div>
              <div className="text-sm text-gray-600">Suspeitas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {data.qualidade_dados.respostas_rejeitadas}
              </div>
              <div className="text-sm text-gray-600">Rejeitadas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {data.qualidade_dados.score_consistencia}%
              </div>
              <div className="text-sm text-gray-600">Consistência</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCampaignAnalytics;