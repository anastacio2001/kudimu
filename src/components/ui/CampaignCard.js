import React from 'react';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CheckCircleIcon,
  FireIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { FireIcon as FireSolid } from '@heroicons/react/24/solid';
import BadgeComponent from './Badge';

// Badge usa default export
const Badge = BadgeComponent;

/**
 * CampaignCard - Card ultra moderno de campanha com gradientes temáticos
 * Redesign completo seguindo princípios Duolingo/Stripe
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

  // Gradientes temáticos ricos (inspirado em Stripe + Duolingo)
  const getThemeGradient = (tema) => {
    const gradients = {
      'Saúde': {
        bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
        icon: '🏥',
        accent: 'text-green-600 dark:text-green-400'
      },
      'Educação': {
        bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
        icon: '📚',
        accent: 'text-blue-600 dark:text-blue-400'
      },
      'Tecnologia': {
        bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        badge: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white',
        icon: '💻',
        accent: 'text-purple-600 dark:text-purple-400'
      },
      'Política': {
        bg: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
        border: 'border-red-200 dark:border-red-800',
        badge: 'bg-gradient-to-r from-red-500 to-orange-600 text-white',
        icon: '🏛️',
        accent: 'text-red-600 dark:text-red-400'
      },
      'Economia': {
        bg: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        badge: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white',
        icon: '💰',
        accent: 'text-yellow-600 dark:text-yellow-400'
      },
      'Consumo': {
        bg: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        badge: 'bg-gradient-to-r from-orange-500 to-red-600 text-white',
        icon: '🛒',
        accent: 'text-orange-600 dark:text-orange-400'
      },
      'default': {
        bg: 'from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800',
        border: 'border-gray-200 dark:border-gray-700',
        badge: 'bg-gradient-to-r from-gray-500 to-slate-600 text-white',
        icon: '📋',
        accent: 'text-gray-600 dark:text-gray-400'
      }
    };
    return gradients[tema] || gradients.default;
  };

  // Detectar urgência (campanha terminando em breve)
  const isUrgent = () => {
    const dataFim = new Date(campaign.data_fim);
    const now = new Date();
    const hoursRemaining = (dataFim - now) / (1000 * 60 * 60);
    return hoursRemaining <= 24 && hoursRemaining > 0;
  };

  // Detectar alto valor (recompensa acima de 500 AOA)
  const isHighValue = () => {
    return (campaign.recompensa || campaign.reward || 0) >= 500;
  };

  const themeStyle = getThemeGradient(campaign.tema || campaign.theme);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-gradient-to-br ${themeStyle.bg} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${themeStyle.border} overflow-hidden relative`}
    >
      {/* Badge de Recomendação (topo fixo) */}
      {isRecommended && (
        <motion.div 
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="absolute top-4 left-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-r-full shadow-lg z-10 flex items-center gap-2"
        >
          <SparklesIcon className="w-4 h-4" />
          <span className="text-xs font-bold">RECOMENDADO {recommendationScore && `${Math.round(recommendationScore * 100)}%`}</span>
        </motion.div>
      )}

      {/* Badges de Status (canto superior direito) */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {isUrgent() && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="bg-red-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
          >
            <FireSolid className="w-4 h-4" />
            <span className="text-xs font-bold">URGENTE</span>
          </motion.div>
        )}
        {isHighValue() && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <BoltIcon className="w-4 h-4" />
            <span className="text-xs font-bold">ALTO VALOR</span>
          </div>
        )}
      </div>

      <div className="p-6 pt-12">
        {/* Ícone Temático Grande */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-5xl">{themeStyle.icon}</div>
          <div className="flex-1">
            {/* Título */}
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
              {campaign.titulo || campaign.title}
            </h3>
            
            {/* Badge de Tema */}
            <div className="inline-flex items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${themeStyle.badge}`}>
                {campaign.tema || campaign.theme || 'Geral'}
              </span>
            </div>
          </div>
        </div>

        {/* Descrição */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {campaign.descricao || campaign.description}
        </p>

        {/* Stats Grid (3 colunas, compacto) */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Recompensa (destaque maior) */}
          <div className="col-span-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-green-200 dark:border-green-800">
            <div className="flex flex-col items-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600 dark:text-green-400 mb-1" />
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recompensa</div>
              <div className="text-lg font-black text-green-600 dark:text-green-400">
                {campaign.recompensa || campaign.reward || 0} <span className="text-xs">AOA</span>
              </div>
            </div>
          </div>

          {/* Duração */}
          <div className="col-span-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col items-center">
              <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tempo</div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {campaign.numero_perguntas || 5} <span className="text-xs">perguntas</span>
              </div>
            </div>
          </div>

          {/* Participantes */}
          <div className="col-span-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex flex-col items-center">
              <UserGroupIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Vagas</div>
              <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {(campaign.respostas_alvo || 100) - (campaign.respostas_atuais || 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Progresso Melhorada */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="flex items-center gap-1">
              <span>📊</span>
              <span>Progresso da Campanha</span>
            </span>
            <span className={`font-black ${themeStyle.accent}`}>{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${themeStyle.badge} rounded-full relative`}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
            <span>{campaign.respostas_atuais || 0} respostas</span>
            <span>Meta: {campaign.respostas_alvo || 100}</span>
          </div>
        </div>

        {/* CTA Button (gradiente temático) */}
        <motion.button
          onClick={() => onParticipate(campaign.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full bg-gradient-to-r ${themeStyle.badge} font-black py-4 px-6 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl group text-base`}
        >
          <CheckCircleIcon className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
          <span>Participar Agora</span>
          <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform">→</span>
        </motion.button>

        {/* Footer: Empresa */}
        {(campaign.empresa || campaign.cliente) && (
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Promovido por:</span>
              <span className="font-bold text-gray-900 dark:text-white">{campaign.empresa || campaign.cliente}</span>
            </div>
          </div>
        )}
      </div>

      {/* Glow effect no hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${themeStyle.bg} blur-xl`}></div>
      </div>
    </motion.div>
  );
};

export default CampaignCard;
