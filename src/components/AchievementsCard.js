import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophySolid } from '@heroicons/react/24/solid';

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8787'
  : 'https://kudimu-api.l-anastacio001.workers.dev';

const AchievementsCard = () => {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/achievements/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setAchievements(result.data.todas_conquistas || []);
        setStats(result.data.estatisticas || {});
      }
    } catch (error) {
      console.error('Erro ao carregar conquistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRaridadeColor = (raridade) => {
    const colors = {
      'comum': 'bg-gray-100 text-gray-700 border-gray-300',
      'raro': 'bg-blue-100 text-blue-700 border-blue-300',
      'épico': 'bg-purple-100 text-purple-700 border-purple-300',
      'lendário': 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[raridade] || colors.comum;
  };

  const displayedAchievements = showAll ? achievements : achievements.slice(0, 6);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const desbloqueadas = achievements.filter(a => a.desbloqueada).length;
  const total = achievements.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <TrophySolid className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Conquistas</h3>
            <p className="text-sm text-gray-500">
              {desbloqueadas} de {total} desbloqueadas
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-yellow-600">
            {Math.round((desbloqueadas / total) * 100)}%
          </div>
          <p className="text-xs text-gray-500">Completo</p>
        </div>
      </div>

      {/* Barra de progresso geral */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(desbloqueadas / total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Grid de conquistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {displayedAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative border-2 rounded-lg p-4 transition-all ${
              achievement.desbloqueada
                ? `${getRaridadeColor(achievement.raridade)} border-opacity-50`
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {achievement.desbloqueada ? (
                  <div className="text-4xl">{achievement.icone}</div>
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <LockClosedIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-bold text-sm ${achievement.desbloqueada ? '' : 'text-gray-500'}`}>
                    {achievement.nome}
                  </h4>
                  {achievement.desbloqueada && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs mb-2">{achievement.descricao}</p>
                
                {/* Progresso */}
                {!achievement.desbloqueada && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progresso: {achievement.progresso}/{achievement.criterio}</span>
                      <span>{achievement.progresso_percentual}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${achievement.progresso_percentual}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Recompensas */}
                <div className="flex gap-3 mt-2 text-xs">
                  {achievement.recompensa_pontos > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-600">💰</span>
                      <span className="font-semibold">{achievement.recompensa_pontos} AOA</span>
                    </span>
                  )}
                  {achievement.recompensa_reputacao > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="text-blue-600">⭐</span>
                      <span className="font-semibold">+{achievement.recompensa_reputacao}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botão Ver Mais */}
      {achievements.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {showAll ? 'Ver Menos' : `Ver Mais (${achievements.length - 6} conquistas)`}
        </button>
      )}

      {/* Estatísticas */}
      {stats && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.total_questionarios}</div>
              <div className="text-xs text-gray-600">Questionários</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.sequencia_dias}</div>
              <div className="text-xs text-gray-600">Dias Seguidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.melhor_sequencia}</div>
              <div className="text-xs text-gray-600">Melhor Sequência</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.total_referrals}</div>
              <div className="text-xs text-gray-600">Indicações</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AchievementsCard;
