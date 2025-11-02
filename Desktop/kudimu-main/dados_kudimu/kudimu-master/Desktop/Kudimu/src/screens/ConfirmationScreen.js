import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, TrophyIcon, StarIcon, GiftIcon } from '@heroicons/react/24/solid';
import { useNotifications } from '../components/NotificationToast';
import { getReputationLevel } from '../components/ReputationBadge';

// Detectar se estamos em desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

export default function ConfirmationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const { showLevelUp, showReward, NotificationContainer } = useNotifications();

  const { campaign, recompensa, pontos, validacao } = location.state || {};

  useEffect(() => {
    // Buscar dados atualizados do usuário
    fetchUpdatedUserData();

    // Esconder confetti após 3 segundos
    setTimeout(() => setShowConfetti(false), 3000);

    // Mostrar notificação de recompensa
    if (recompensa && validacao === 'aprovada') {
      setTimeout(() => showReward(recompensa), 1000);
    }
  }, []);

  const fetchUpdatedUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar dados antigos do localStorage para comparar nível
      const oldUserStr = localStorage.getItem('user');
      const oldUser = oldUserStr ? JSON.parse(oldUserStr) : null;
      const oldLevel = oldUser ? getReputationLevel(oldUser.reputacao || 0) : null;

      const response = await fetch(`${API_URL}/reputation/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserData(data.data);
          
          // A API retorna pontos de reputação
          const pontos = data.data.reputacao || data.data.pontos || 0;
          
          // Verificar se houve mudança de nível
          const newLevel = getReputationLevel(pontos);
          if (oldLevel && newLevel.name !== oldLevel.name && newLevel.minPoints > oldLevel.minPoints) {
            // Level up! Mostrar notificação
            setTimeout(() => showLevelUp(pontos), 2000);
          }
          
          // Atualizar localStorage
          const updatedUser = { ...oldUser, reputacao: pontos, nivel: newLevel.name };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center max-w-md w-full"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Erro
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Dados da confirmação não encontrados
          </p>
          <button 
            onClick={() => navigate('/campaigns')} 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Voltar para Campanhas
          </button>
        </motion.div>
      </div>
    );
  }

  const niveis = {
    'Iniciante': { icon: '🌱', color: 'text-gray-500', bg: 'bg-gray-100' },
    'Confiável': { icon: '⭐', color: 'text-blue-500', bg: 'bg-blue-100' },
    'Líder': { icon: '👑', color: 'text-yellow-500', bg: 'bg-yellow-100' },
    'Embaixador': { icon: '🏆', color: 'text-purple-500', bg: 'bg-purple-100' }
  };

  const nivelAtual = niveis[userData?.nivel] || niveis['Iniciante'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1, 
                y: -100, 
                x: Math.random() * window.innerWidth,
                rotate: 0 
              }}
              animate={{ 
                y: window.innerHeight + 100, 
                rotate: 360 
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Respostas Enviadas com Sucesso!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Obrigado por participar da campanha <span className="font-semibold text-primary-600">{campaign.title}</span>
            </p>
          </motion.div>

          {/* Reward Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium mb-1">Recompensa Recebida</p>
                  <p className="text-2xl font-bold">{recompensa || campaign.reward} AOA</p>
                </div>
                <GiftIcon className="w-8 h-8 text-yellow-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Pontos de Reputação</p>
                  <p className="text-2xl font-bold">+{pontos || 500} pontos</p>
                </div>
                <StarIcon className="w-8 h-8 text-purple-200" />
              </div>
            </motion.div>
          </div>

          {/* Validation Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 p-2 rounded-full ${
                validacao === 'approved' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {validacao === 'approved' ? 
                  <CheckCircleIcon className="w-6 h-6 text-green-500" /> :
                  <div className="w-6 h-6 text-yellow-500">⏳</div>
                }
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {validacao === 'approved' ? 'Validação Aprovada!' : 'Em Validação'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {validacao === 'approved' 
                    ? 'Suas respostas foram validadas automaticamente e a recompensa já está disponível.'
                    : 'Suas respostas estão sendo analisadas. Você receberá a confirmação em até 24-48 horas.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {userData?.campanhas_respondidas || 1}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Campanhas Completas
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {userData?.saldo_pontos || pontos || 500}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total de Pontos
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {userData?.medalhas?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Medalhas
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex space-x-4 mb-8"
          >
            <button 
              onClick={() => navigate('/history')} 
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>📊</span>
              <span>Ver Histórico</span>
            </button>
            <button 
              onClick={() => navigate('/campaigns')} 
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>🚀</span>
              <span>Responder Outra Campanha</span>
            </button>
          </motion.div>

          {/* Motivational Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 text-center"
          >
            <div className="text-3xl mb-3">💡</div>
            <p className="text-gray-700 dark:text-gray-300">
              Continue participando para aumentar sua reputação e desbloquear campanhas exclusivas!
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Container de Notificações */}
      <NotificationContainer />
    </div>
  );
}
