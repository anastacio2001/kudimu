import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import ClientLayout from '../components/ClientLayout';
import { API_URL } from '../config/api';

const ClientAIInsights = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Tentar carregar da API
      try {
        const response = await fetch(`${API_URL}/client/ai-insights`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();
        
        if (result.success) {
          setInsights(result.data);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.warn('API não disponível, usando dados mock');
      }

      // Fallback: usar dados mock
      const mockInsights = {
        campanha_titulo: 'Demonstração - Crie suas campanhas',
        total_respostas: 0,
        gerado_em: new Date().toISOString(),
        
        // Qualidade
        qualidade: {
          score_geral: '-',
          taxa_conclusao: 0
        },
        
        // Sentimento
        sentimento: {
          geral: 'neutro',
          score: 0,
          distribuicao: {
            positivo: 0,
            neutro: 0,
            negativo: 0
          }
        },
        
        // Clusters vazios
        clusters: [],
        
        // Descobertas vazias
        descobertas: [],
        
        // Insights gerais
        insights_gerais: [
          {
            type: 'info',
            title: '📊 Modo Demonstração',
            description: 'Esta é uma visualização de demonstração. Crie campanhas e colete respostas para gerar insights reais com IA sobre padrões, sentimentos e tendências.'
          },
          {
            type: 'info',
            title: '🤖 Análise com IA',
            description: 'Quando tiver respostas, a IA irá analisar automaticamente: sentimentos, clusters de respostas similares, padrões temporais e recomendações personalizadas.'
          },
          {
            type: 'info',
            title: '💡 Recursos Disponíveis',
            description: 'Workers AI com LLaMA-2 para geração de insights, DistilBERT para análise de sentimentos e clustering para identificar padrões nas respostas.'
          }
        ],
        
        // Recomendações vazias
        recomendacoes: [],
        
        // Padrões temporais vazios
        padroes_temporais: {
          pico_respostas: { hora: '-', quantidade: 0 },
          dias_mais_ativos: []
        }
      };

      setInsights(mockInsights);
    } catch (error) {
      console.error('Erro ao carregar insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (campaignId) => {
    setLoading(true);
    setSelectedCampaign(campaignId);

    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const campaign = campaigns.find(c => c.id === campaignId);

      // Mock insights usando os novos endpoints AI
      const mockInsights = {
        campanha_id: campaignId,
        campanha_titulo: campaign.titulo,
        total_respostas: campaign.total_respostas,
        gerado_em: new Date().toISOString(),

        // Análise de Sentimento
        sentimento: {
          geral: 'positivo',
          score: 7.8,
          distribuicao: {
            positivo: 68,
            neutro: 24,
            negativo: 8
          }
        },

        // Clusters de Respostas Similares (do endpoint /ai/cluster/similar-responses)
        clusters: [
          {
            id: 1,
            tema: 'Falta de capacitação profissional',
            quantidade: 45,
            similaridade_media: 0.89,
            sentimento_predominante: 'negativo',
            exemplos: [
              'Falta formação profissional adequada na área',
              'Necessidade de mais cursos técnicos',
              'Carência de oportunidades de capacitação'
            ]
          },
          {
            id: 2,
            tema: 'Dificuldade em encontrar emprego',
            quantidade: 38,
            similaridade_media: 0.85,
            sentimento_predominante: 'negativo',
            exemplos: [
              'Mercado de trabalho muito competitivo',
              'Poucas vagas disponíveis',
              'Experiência exigida mesmo para iniciantes'
            ]
          },
          {
            id: 3,
            tema: 'Salários baixos',
            quantidade: 32,
            similaridade_media: 0.82,
            sentimento_predominante: 'negativo',
            exemplos: [
              'Remuneração não compatível com formação',
              'Salários abaixo da média do mercado',
              'Dificuldade de crescimento salarial'
            ]
          },
          {
            id: 4,
            tema: 'Oportunidades de crescimento',
            quantidade: 25,
            similaridade_media: 0.87,
            sentimento_predominante: 'positivo',
            exemplos: [
              'Empresas investindo em desenvolvimento',
              'Boas perspectivas de carreira',
              'Programas de capacitação oferecidos'
            ]
          },
          {
            id: 5,
            tema: 'Trabalho remoto',
            quantidade: 16,
            similaridade_media: 0.79,
            sentimento_predominante: 'positivo',
            exemplos: [
              'Flexibilidade é um grande benefício',
              'Maior qualidade de vida com home office',
              'Economia de tempo e dinheiro'
            ]
          }
        ],

        // Principais Descobertas
        descobertas: [
          {
            tipo: 'trend',
            titulo: 'Alta Demanda por Capacitação',
            descricao: '28.8% das respostas mencionam necessidade de formação profissional',
            impacto: 'alto'
          },
          {
            tipo: 'insight',
            titulo: 'Sentimento Predominante Negativo',
            descricao: 'Apesar da taxa de satisfação, 32% das respostas indicam preocupações',
            impacto: 'medio'
          },
          {
            tipo: 'opportunity',
            titulo: 'Interesse em Trabalho Remoto',
            descricao: 'Crescente valorização de flexibilidade e trabalho híbrido',
            impacto: 'medio'
          }
        ],

        // Recomendações
        recomendacoes: [
          {
            prioridade: 'alta',
            titulo: 'Investir em Programas de Capacitação',
            descricao: 'Desenvolver parcerias com instituições de ensino para oferecer cursos técnicos',
            impacto_esperado: 'Alto engajamento e satisfação dos participantes'
          },
          {
            prioridade: 'alta',
            titulo: 'Revisar Política de Remuneração',
            descricao: 'Avaliar alinhamento dos salários com o mercado para melhorar atração de talentos',
            impacto_esperado: 'Redução de turnover e melhoria da satisfação'
          },
          {
            prioridade: 'media',
            titulo: 'Promover Oportunidades Remotas',
            descricao: 'Expandir opções de trabalho remoto e híbrido nas ofertas de emprego',
            impacto_esperado: 'Maior alcance geográfico e diversidade de candidatos'
          }
        ],

        // Métricas de Qualidade
        qualidade: {
          score_geral: 87.5,
          taxa_conclusao: 94.2,
          tempo_medio_resposta: 12.5, // minutos
          respostas_validas: 92.1 // percentual
        }
      };

      setInsights(mockInsights);
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentimento) => {
    switch (sentimento) {
      case 'positivo':
        return 'text-green-600 dark:text-green-400';
      case 'negativo':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-yellow-600 dark:text-yellow-400';
    }
  };

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  return (
    <ClientLayout title="AI Insights">
      <div className="container-custom py-8">

        {/* Seleção de Campanha */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Selecione uma Campanha
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => generateInsights(campaign.id)}
                disabled={loading || campaign.total_respostas === 0}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCampaign === campaign.id
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
                } ${campaign.total_respostas === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {campaign.titulo}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {campaign.total_respostas} respostas
                  </span>
                  {campaign.total_respostas > 0 && (
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      Analisar →
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gerando insights com IA...
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Analisando padrões, sentimentos e temas principais
            </p>
          </motion.div>
        )}

        {/* Insights Gerados */}
        {insights && !loading && (
          <div className="space-y-8">
            {/* Resumo Geral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white"
            >
              <h2 className="text-2xl font-bold mb-2">{insights.campanha_titulo}</h2>
              <p className="text-purple-100">
                Análise gerada em {new Date(insights.gerado_em).toLocaleString('pt-BR')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-purple-200 text-sm">Total de Respostas</p>
                  <p className="text-3xl font-bold">{insights.total_respostas || 0}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Score de Qualidade</p>
                  <p className="text-3xl font-bold">{insights.qualidade?.score_geral || '-'}</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Taxa de Conclusão</p>
                  <p className="text-3xl font-bold">{insights.qualidade?.taxa_conclusao || 0}%</p>
                </div>
                <div>
                  <p className="text-purple-200 text-sm">Sentimento Geral</p>
                  <p className="text-3xl font-bold capitalize">{insights.sentimento?.geral || 'neutro'}</p>
                </div>
              </div>
            </motion.div>

            {/* Análise de Sentimento */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaceSmileIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Análise de Sentimento
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {insights.sentimento?.distribuicao?.positivo || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Positivo</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {insights.sentimento?.distribuicao?.neutro || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Neutro</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {insights.sentimento?.distribuicao?.negativo || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Negativo</div>
                </div>
              </div>
            </motion.div>

            {/* Clusters de Temas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Temas Principais Identificados
                </h3>
              </div>

              <div className="space-y-4">
                {insights.clusters?.length > 0 ? (
                  insights.clusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {cluster.tema}
                          </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {cluster.quantidade} respostas
                          </span>
                          <span>
                            Similaridade: {(cluster.similaridade_media * 100).toFixed(0)}%
                          </span>
                          <span className={getSentimentColor(cluster.sentimento_predominante)}>
                            {cluster.sentimento_predominante}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                        Exemplos de respostas:
                      </p>
                      <ul className="space-y-1">
                        {cluster.exemplos.slice(0, 3).map((exemplo, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                            • {exemplo}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="mb-2">Nenhum tema identificado ainda</p>
                    <p className="text-sm">Colete respostas para a IA identificar padrões e clusters</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Principais Descobertas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <LightBulbIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Principais Descobertas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.descobertas?.length > 0 ? (
                  insights.descobertas.map((descoberta, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {descoberta.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {descoberta.descricao}
                    </p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-600 text-white">
                      Impacto: {descoberta.impacto}
                    </span>
                  </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="mb-2">Nenhuma descoberta ainda</p>
                    <p className="text-sm">A IA encontrará insights quando houver respostas</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recomendações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recomendações Baseadas em IA
                </h3>
              </div>

              <div className="space-y-4">
                {insights.recomendacoes?.length > 0 ? (
                  insights.recomendacoes.map((recomendacao, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-purple-600 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-r-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {recomendacao.titulo}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(recomendacao.prioridade)}`}>
                        {recomendacao.prioridade}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {recomendacao.descricao}
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      💡 {recomendacao.impacto_esperado}
                    </p>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p className="mb-2">Nenhuma recomendação disponível</p>
                    <p className="text-sm">A IA gerará sugestões após analisar as respostas</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientAIInsights;
