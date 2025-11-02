import React from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import BadgeComponent from './Badge';

// Badge usa default export
const Badge = BadgeComponent;

/**
 * CampaignCard - Card moderno de campanha
 */
export const CampaignCard = ({
  campaign,
  onParticipate,
  recommendationScore,
  isRecommended = false
}) => {
  const getProgressPercentage = () => {
    return Math.min((campaign.respostas_atuais / campaign.respostas_alvo) * 100, 100);
  };

  const formatReward = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getThemeColor = (tema) => {
    const colors = {
      'Saúde': 'text-green-600 bg-green-100 dark:bg-green-900/30',
      'Educação': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      'Tecnologia': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      'Política': 'text-red-600 bg-red-100 dark:bg-red-900/30',
      'Economia': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      'default': 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    };
    return colors[tema] || colors.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header com Badge de Recomendação */}
      {isRecommended && (
        <div className="bg-gradient-to-r from-primary-500 to-purple-600 px-4 py-2">
          <div className="flex items-center text-white text-sm font-medium">
            <SparklesIcon className="w-4 h-4 mr-2" />
            Recomendado para você {recommendationScore && `(${Math.round(recommendationScore * 100)}% match)`}
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Título e Tema */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
              {campaign.titulo}
            </h3>
            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getThemeColor(campaign.tema)}`}>
              {campaign.tema}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {campaign.descricao}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Recompensa */}
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mr-2">
              <CurrencyDollarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Recompensa</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatReward(campaign.recompensa)}
              </div>
            </div>
          </div>

          {/* Duração */}
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-2">
              <ClockIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Duração</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {campaign.numero_perguntas || 5} perguntas
              </div>
            </div>
          </div>

          {/* Participantes */}
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-2">
              <UserGroupIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Respostas</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {campaign.respostas_atuais}/{campaign.respostas_alvo}
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progresso</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
            />
          </div>
        </div>

        {/* Tags/Badges */}
        {campaign.publico_alvo && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" size="sm">
              {campaign.publico_alvo}
            </Badge>
            {campaign.reputacao_minima > 0 && (
              <Badge variant="warning" size="sm">
                Reputação mín: {campaign.reputacao_minima}
              </Badge>
            )}
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => onParticipate(campaign.id)}
          className="w-full bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Participar Agora
        </button>

        {/* Empresa/Organização */}
        {campaign.empresa && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Por:</span>
              <span className="ml-2">{campaign.empresa}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CampaignCard;
