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
  DocumentArrowDownIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

// Detectar se estamos em desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

export default function CampaignAnalytics() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [campaignId, timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/campaigns/${campaignId}/analytics?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError(data.error || 'Erro ao carregar analytics');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  // Dados mock para demonstração
  const mockAnalytics = {
    campanha: {
      id: campaignId || 'camp_1',
      titulo: 'Pesquisa sobre Hábitos Alimentares em Luanda',
      status: 'ativa',
      total_respostas: 156,
      meta_respostas: 500,
      progresso: 31.2,
      data_inicio: '2025-10-15',
      data_fim: '2025-11-15'
    },
    metricas_gerais: {
      taxa_conversao: 15.2,
      tempo_medio_resposta: 8.5,
      custo_por_resposta: 480,
      gasto_total: 74880,
      orcamento_restante: 165120
    },
    respostas_por_dia: [
      { data: '01/11', respostas: 12 },
      { data: '02/11', respostas: 18 },
      { data: '03/11', respostas: 25 },
      { data: '04/11', respostas: 22 },
      { data: '05/11', respostas: 15 },
      { data: '06/11', respostas: 28 },
      { data: '07/11', respostas: 36 }
    ],
    demografia_idade: [
      { faixa: '18-25', quantidade: 45, porcentagem: 28.8 },
      { faixa: '26-35', quantidade: 62, porcentagem: 39.7 },
      { faixa: '36-45', quantidade: 35, porcentagem: 22.4 },
      { faixa: '46-55', quantidade: 12, porcentagem: 7.7 },
      { faixa: '55+', quantidade: 2, porcentagem: 1.3 }
    ],
    demografia_genero: [
      { genero: 'Feminino', quantidade: 89, porcentagem: 57.1 },
      { genero: 'Masculino', quantidade: 64, porcentagem: 41.0 },
      { genero: 'Outro', quantidade: 3, porcentagem: 1.9 }
    ],
    localizacao: [
      { municipio: 'Luanda', quantidade: 98, porcentagem: 62.8 },
      { municipio: 'Viana', quantidade: 25, porcentagem: 16.0 },
      { municipio: 'Cazenga', quantidade: 18, porcentagem: 11.5 },
      { municipio: 'Maianga', quantidade: 10, porcentagem: 6.4 },
      { municipio: 'Outros', quantidade: 5, porcentagem: 3.2 }
    ],
    qualidade_respostas: {
      completas: 142,
      incompletas: 14,
      taxa_qualidade: 91.0
    },
    insights: [
      {
        id: 1,
        tipo: 'tendencia',
        titulo: 'Pico de Respostas no Final de Semana',
        descricao: 'Sábados e domingos apresentam 35% mais respostas que dias úteis',
        impacto: 'alto'
      },
      {
        id: 2,
        tipo: 'demografia',
        titulo: 'Público Jovem Dominante',
        descricao: 'Participantes de 18-35 anos representam 68% das respostas',
        impacto: 'medio'
      },
      {
        id: 3,
        tipo: 'qualidade',
        titulo: 'Alta Taxa de Conclusão',
        descricao: 'Taxa de conclusão de 91% indica perguntas bem estruturadas',
        impacto: 'positivo'
      }
    ]
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Carregando analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <div className="text-red-600 dark:text-red-400 text-center">{error}</div>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const data = analytics || mockAnalytics;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/campaigns')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text">
                Kudimu
              </div>
              <div className="text-gray-400">|</div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Analytics da Campanha
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
              </select>
              <button
                onClick={() => alert('Funcionalidade de exportar em desenvolvimento')}
                className="inline-flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Informações da Campanha */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {data.campanha.titulo}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Status: {data.campanha.status}</span>
                <span>•</span>
                <span>{data.campanha.total_respostas}/{data.campanha.meta_respostas} respostas</span>
                <span>•</span>
                <span>{data.campanha.progresso}% completo</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {data.campanha.progresso}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Progresso
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Taxa de Conversão"
            value={`${data.metricas_gerais.taxa_conversao}%`}
            icon={ArrowTrendingUpIcon}
            color="green"
          />
          <MetricCard 
            title="Tempo Médio"
            value={`${data.metricas_gerais.tempo_medio_resposta} min`}
            icon={CalendarIcon}
            color="blue"
          />
          <MetricCard 
            title="Custo por Resposta"
            value={`${data.metricas_gerais.custo_por_resposta} Kz`}
            icon={ChartBarIcon}
            color="purple"
          />
          <MetricCard 
            title="Orçamento Restante"
            value={`${data.metricas_gerais.orcamento_restante.toLocaleString()} Kz`}
            icon={UserGroupIcon}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Respostas por Dia */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Respostas por Dia
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.respostas_por_dia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="respostas" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Demografia por Idade */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Demografia por Idade
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.demografia_idade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faixa" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Distribuição por Gênero */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Distribuição por Gênero
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.demografia_genero}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ genero, porcentagem }) => `${genero}: ${porcentagem}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {data.demografia_genero.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Localizações */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Localizações
            </h3>
            <div className="space-y-4">
              {data.localizacao.map((loc, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{loc.municipio}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(loc.quantidade / data.campanha.total_respostas) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {loc.quantidade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Insights Automáticos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.insights.map((insight) => (
              <div key={insight.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {insight.titulo}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    insight.impacto === 'alto' ? 'bg-red-100 text-red-800' :
                    insight.impacto === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impacto}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {insight.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}