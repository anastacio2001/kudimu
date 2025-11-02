import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  FireIcon, 
  ChartBarIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

/**
 * StatsCard - Card de estatística do dashboard
 */
export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  colorScheme = 'primary' 
}) => {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    info: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={`inline-flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <span className="mr-1">{trend === 'up' ? '↑' : '↓'}</span>
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[colorScheme]} bg-opacity-10`}>
          <Icon className={`w-6 h-6 bg-gradient-to-br ${colorClasses[colorScheme]} text-transparent bg-clip-text`} />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * ProgressCard - Card com barra de progresso
 */
export const ProgressCard = ({ 
  title, 
  current, 
  target, 
  unit = '', 
  icon: Icon,
  colorScheme = 'primary' 
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {Icon && (
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 mr-3">
              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
          )}
          <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="mb-2">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${colorClasses[colorScheme]} rounded-full`}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {current} {unit}
        </span>
        <span className="text-gray-500 dark:text-gray-500">
          Meta: {target} {unit}
        </span>
      </div>
    </motion.div>
  );
};

/**
 * ReputationBadge - Badge de nível de reputação
 */
export const ReputationBadge = ({ level, points }) => {
  const levelConfig = {
    'Bronze': {
      color: 'from-yellow-700 to-yellow-900',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      icon: '🥉'
    },
    'Prata': {
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      textColor: 'text-gray-700 dark:text-gray-300',
      icon: '🥈'
    },
    'Ouro': {
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      icon: '🥇'
    },
    'Diamante': {
      color: 'from-cyan-400 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-400',
      icon: '💎'
    }
  };

  const config = levelConfig[level] || levelConfig['Bronze'];

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full ${config.bgColor}`}>
      <span className="text-2xl mr-2">{config.icon}</span>
      <div>
        <div className={`text-sm font-bold ${config.textColor}`}>
          {level}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {points} pontos
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
