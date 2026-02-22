import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { TrophyIcon, FireIcon, StarIcon, BoltIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';

/**
 * MedalCard - Card de medalha/achievement estilo Duolingo
 * Com animação de revelação e estados (bloqueado, desbloqueado, em progresso)
 */

const MEDAL_ICONS = {
  trophy: TrophyIcon,
  fire: FireIcon,
  star: StarIcon,
  bolt: BoltIcon,
  sparkles: SparklesIcon,
  heart: HeartIcon,
};

const MedalCard = ({ 
  medal,
  size = 'md' // sm, md, lg
}) => {
  const {
    id,
    nome,
    descricao,
    icone = 'trophy',
    cor = 'gold',
    desbloqueada = false,
    progresso = 0,
    total = 100,
    data_desbloqueio = null,
    raridade = 'comum' // comum, raro, épico, lendário
  } = medal;

  const IconComponent = MEDAL_ICONS[icone] || TrophyIcon;

  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-24 h-24 text-4xl'
  };

  const colorClasses = {
    gold: 'from-yellow-400 via-yellow-500 to-yellow-600',
    silver: 'from-gray-300 via-gray-400 to-gray-500',
    bronze: 'from-orange-400 via-orange-500 to-orange-600',
    blue: 'from-blue-400 via-blue-500 to-blue-600',
    purple: 'from-purple-400 via-purple-500 to-purple-600',
    green: 'from-green-400 via-green-500 to-green-600',
  };

  const raridadeConfig = {
    comum: { border: 'border-gray-400', glow: 'shadow-gray-400/30' },
    raro: { border: 'border-blue-500', glow: 'shadow-blue-500/50' },
    épico: { border: 'border-purple-500', glow: 'shadow-purple-500/50' },
    lendário: { border: 'border-yellow-500', glow: 'shadow-yellow-500/70 shadow-glow' }
  };

  const config = raridadeConfig[raridade] || raridadeConfig.comum;
  const progressoPercentual = Math.min((progresso / total) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative group cursor-pointer
        bg-white dark:bg-gray-800 rounded-2xl border-2
        ${desbloqueada ? config.border + ' ' + config.glow : 'border-gray-300 dark:border-gray-700'}
        overflow-hidden transition-all duration-300
        ${desbloqueada ? 'shadow-lg' : 'shadow-md'}
      `}
    >
      {/* Efeito de brilho para medalhas desbloqueadas */}
      {desbloqueada && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      )}

      <div className="p-4 sm:p-6">
        {/* Ícone da Medalha */}
        <div className="flex justify-center mb-4">
          <div className={`
            relative ${sizeClasses[size]}
            flex items-center justify-center
            rounded-full
            ${desbloqueada 
              ? `bg-gradient-to-br ${colorClasses[cor]} text-white shadow-xl`
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
            }
            transition-all duration-300
          `}>
            {desbloqueada ? (
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <IconComponent className="w-1/2 h-1/2" />
              </motion.div>
            ) : (
              <LockClosedIcon className="w-1/2 h-1/2" />
            )}
            
            {/* Check badge para medalhas desbloqueadas */}
            {desbloqueada && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.4 }}
                className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
              >
                <CheckCircleIcon className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Informações da medalha */}
        <div className="text-center">
          <h3 className={`
            font-bold text-sm sm:text-base mb-1
            ${desbloqueada ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
          `}>
            {nome}
          </h3>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {descricao}
          </p>

          {/* Barra de progresso (se não estiver desbloqueada) */}
          {!desbloqueada && total > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{progresso}/{total}</span>
                <span>{Math.round(progressoPercentual)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressoPercentual}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Data de desbloqueio */}
          {desbloqueada && data_desbloqueio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-gray-500 dark:text-gray-400 mt-2"
            >
              Desbloqueada em {new Date(data_desbloqueio).toLocaleDateString('pt-AO')}
            </motion.p>
          )}
        </div>
      </div>

      {/* Ribbon de raridade (para épicas e lendárias) */}
      {(raridade === 'épico' || raridade === 'lendário') && desbloqueada && (
        <div className={`
          absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white rounded-bl-lg
          ${raridade === 'épico' ? 'bg-purple-600' : 'bg-gradient-to-r from-yellow-500 to-orange-500'}
        `}>
          {raridade.toUpperCase()}
        </div>
      )}
    </motion.div>
  );
};

export default MedalCard;
