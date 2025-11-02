import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  TagIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolid,
  FireIcon as FireSolid
} from '@heroicons/react/24/solid';
import { Card, Badge, Button } from './ui';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

/**
 * SmartRecommendations - Componente de recomendações inteligentes
 */
const SmartRecommendations = ({ userId = '1', onCampaignSelect }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [activeCategory, setActiveCategory] = useState('highly_recommended');

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/recommendations?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data);
        setError(null);
      } else {
        setError('Erro ao carregar recomendações');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyIcon = (urgencia) => {
    switch (urgencia) {
      case 'alta': return <FireSolid className="w-4 h-4 text-red-500" />;
      case 'media': return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      default: return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgencia) => {
    switch (urgencia) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'highly_recommended':
        return {
          title: 'Altamente Recomendadas',
          subtitle: 'Campanhas com alta compatibilidade',
          icon: StarSolid,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          count: recommendations?.recommendations.highly_recommended.length || 0
        };
      case 'recommended':
        return {
          title: 'Recomendadas',
          subtitle: 'Boas opções para você',
          icon: SparklesIcon,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          count: recommendations?.recommendations.recommended.length || 0
        };
      case 'other':
        return {
          title: 'Outras Campanhas',
          subtitle: 'Campanhas disponíveis',
          icon: ChartBarIcon,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          count: recommendations?.recommendations.other.length || 0
        };
      default:
        return { title: '', subtitle: '', icon: SparklesIcon, color: '', bgColor: '', count: 0 };
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Button onClick={fetchRecommendations} size="sm" className="mt-3">
          Tentar novamente
        </Button>
      </Card>
    );
  }

  if (!recommendations || !recommendations.recommendations) {
    return null;
  }

  const categories = [
    'highly_recommended',
    'recommended',
    'other'
  ];

  const currentCampaigns = recommendations.recommendations[activeCategory] || [];
  const categoryInfo = getCategoryInfo(activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recomendações Inteligentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Campanhas personalizadas para você
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchRecommendations}
          className="text-purple-600 hover:text-purple-700"
        >
          Atualizar
        </Button>
      </div>

      {/* User Profile Summary */}
      {recommendations.user_profile && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPinIcon className="w-4 h-4" />
                <span>{recommendations.user_profile.localizacao}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <TrophyIcon className="w-4 h-4" />
                <span>{recommendations.user_profile.nivel_reputacao}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <ChartBarIcon className="w-4 h-4" />
                <span>{recommendations.user_profile.campanhas_completadas} campanhas</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {recommendations.user_profile.interesses.map((interesse, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {interesse}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Category Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {categories.map((category) => {
          const info = getCategoryInfo(category);
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <info.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{info.title}</span>
              <span className="inline sm:hidden">{info.title.split(' ')[0]}</span>
              {info.count > 0 && (
                <Badge variant="primary" size="sm" className="ml-1">
                  {info.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {currentCampaigns.length === 0 ? (
          <Card className="p-8 text-center">
            <categoryInfo.icon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhuma campanha nesta categoria
            </p>
          </Card>
        ) : (
          currentCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => onCampaignSelect?.(campaign)}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {campaign.titulo}
                        </h3>
                        {getUrgencyIcon(campaign.urgencia)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <TagIcon className="w-4 h-4" />
                          <span className="capitalize">{campaign.tema}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{campaign.localizacao_alvo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>~{Math.round(campaign.tempo_estimado / 60)}min</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="primary" className="text-lg font-bold">
                          {campaign.recompensa_por_resposta} AOA
                        </Badge>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="success" size="sm">
                          {campaign.match_percentage}% match
                        </Badge>
                        <Badge className={getUrgencyColor(campaign.urgencia)} size="sm">
                          {campaign.urgencia}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {campaign.reasons && campaign.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {campaign.reasons.slice(0, 3).map((reason, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                        >
                          ✓ {reason}
                        </Badge>
                      ))}
                      {campaign.reasons.length > 3 && (
                        <Badge variant="ghost" size="sm" className="text-xs">
                          +{campaign.reasons.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {campaign.tags && (
                    <div className="flex flex-wrap gap-1">
                      {campaign.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar for Match */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>Compatibilidade</span>
                      <span>{campaign.match_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          campaign.match_percentage >= 80
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : campaign.match_percentage >= 60
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}
                        style={{ width: `${campaign.match_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-4 h-4" />
            <span>Algoritmo v{recommendations.algorithm_version}</span>
          </div>
          <div>
            Atualizado: {new Date(recommendations.generated_at).toLocaleTimeString('pt-AO')}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SmartRecommendations;