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
  ClockIcon
} from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';

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

const ClientCampaignAnalytics = () => {
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
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/client/campaigns/${campaignId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        console.error('Erro ao carregar analytics:', result.error);
      }
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

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  const responsesData = {
    labels: data?.respostas_por_dia?.map(d => d.data) || [],
    datasets: [
      {
        label: 'Respostas por Dia',
        data: data?.respostas_por_dia?.map(d => d.respostas) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const ageData = {
    labels: Object.keys(data?.demograficos_basicos?.faixa_etaria || {}),
    datasets: [
      {
        data: Object.values(data?.demograficos_basicos?.faixa_etaria || {}),
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/client/campaigns')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar às Campanhas
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics da Campanha
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{data?.campanha?.titulo}</p>
            </div>
            
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {data?.campanha?.status === 'ativa' ? 'Ativa' : data?.campanha?.status}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Métricas Principais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Progresso</p>
                <p className="text-2xl font-bold text-primary-600">
                  {data?.campanha?.progresso?.toFixed(1) || 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {data?.campanha?.total_respostas || 0}/{data?.campanha?.meta_respostas || 0} respostas
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-green-600">
                  {data?.metricas_performance?.taxa_conclusao || 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Acima da média
                </p>
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Tempo Médio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {data?.metricas_performance?.tempo_medio_resposta || 0} min
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Por resposta
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Satisfação</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {data?.metricas_performance?.satisfacao_geral || 0}/5
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Avaliação média
                </p>
              </div>
              <EyeIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        {/* Progresso da Campanha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progresso da Meta</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {data?.campanha?.total_respostas || 0} de {data?.campanha?.meta_respostas || 0} respostas
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {data?.campanha?.progresso?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${data?.campanha?.progresso || 0}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Período: {data?.campanha?.data_inicio ? new Date(data.campanha.data_inicio).toLocaleDateString('pt-BR') : '-'} - {data?.campanha?.data_fim ? new Date(data.campanha.data_fim).toLocaleDateString('pt-BR') : '-'}
          </div>
        </motion.div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Respostas por Dia */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Respostas por Dia (Últimos 7 dias)</h3>
            <Bar data={responsesData} options={chartOptions} />
          </motion.div>

          {/* Demografia por Idade */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição por Faixa Etária</h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={ageData} />
            </div>
          </motion.div>
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights da Campanha</h3>
          
          <div className="space-y-4">
            {(data?.insights_qualitativos || []).map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                insight.tipo === 'positivo' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-500' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500'
              }`}>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{insight.categoria}</h4>
                <p className="text-gray-700 dark:text-gray-300">{insight.insight}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Distribuição Geográfica */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição Geográfica</h3>
          
          <div className="space-y-3">
            {Object.entries(data?.demograficos_basicos?.localizacao || {}).map(([local, porcentagem]) => (
              <div key={local} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{local}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${porcentagem}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-10 text-right">
                    {porcentagem}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientCampaignAnalytics;