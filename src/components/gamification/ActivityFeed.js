import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircleIcon, CurrencyDollarIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/outline';

/**
 * ActivityFeed - Feed social de atividades recentes (prova social)
 * Mostra ganhos e conquistas de outros usuários anonimizados
 * Cria competição saudável e motivação
 */

const ActivityFeed = ({ activities = [], maxItems = 5 }) => {
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'pesquisa':
        return CurrencyDollarIcon;
      case 'medalha':
        return TrophyIcon;
      case 'nivel':
        return SparklesIcon;
      default:
        return UserCircleIcon;
    }
  };

  const getActivityColor = (tipo) => {
    switch (tipo) {
      case 'pesquisa':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'medalha':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'nivel':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.floor((now - then) / 1000 / 60);

    if (diffInMinutes < 1) return 'agora mesmo';
    if (diffInMinutes < 60) return `há ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `há ${Math.floor(diffInMinutes / 60)}h`;
    return `há ${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-primary-500" />
          Atividades Recentes
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Veja o que outros usuários estão conquistando
        </p>
      </div>

      {/* Feed Items */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <AnimatePresence mode="popLayout">
          {displayActivities.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              <UserCircleIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhuma atividade recente</p>
            </div>
          ) : (
            displayActivities.map((activity, index) => {
              const Icon = getActivityIcon(activity.tipo);
              const colorClass = getActivityColor(activity.tipo);

              return (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar/Ícone */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {activity.usuario_anonimo}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {activity.descricao}
                      </p>
                      
                      {/* Valor ganho (se aplicável) */}
                      {activity.valor && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                            +{activity.valor} Kz
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      {getTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer com link "Ver mais" */}
      {activities.length > maxItems && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
            Ver todas as atividades ({activities.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
