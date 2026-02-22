import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
  ArrowUpCircleIcon,
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import ClientLayout from '../components/ClientLayout';
import { API_URL } from '../config/api';

const ClientSubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/client/assinatura`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setSubscription(result.data);
      } else {
        setError(result.error || 'Erro ao carregar assinatura');
      }
    } catch (err) {
      console.error('Erro ao carregar assinatura:', err);
      setError('Erro ao conectar com servidor');
    } finally {
      setLoading(false);
    }
  };

  const getPlanoIcon = (planoNome) => {
    const icons = {
      'Starter': SparklesIcon,
      'Growth': RocketLaunchIcon,
      'Enterprise': BuildingOffice2Icon
    };
    return icons[planoNome] || SparklesIcon;
  };

  const getStatusColor = (status) => {
    const colors = {
      'ativo': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'trial': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'expirado': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[status] || colors.ativo;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateUsagePercentage = (used, limit) => {
    if (!limit) return 0;
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const PlanoIcon = subscription?.plano ? getPlanoIcon(subscription.plano.nome) : SparklesIcon;
  const features = subscription?.features || {};

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Minha Assinatura
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gerencie seu plano e acompanhe o uso dos recursos
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/client/plans')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ArrowUpCircleIcon className="h-5 w-5" />
            <span>Upgrade de Plano</span>
          </motion.button>
        </div>

        {/* Plano Atual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <PlanoIcon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{subscription?.plano?.nome || 'Plano'}</h2>
                <p className="text-purple-100 mt-1">
                  {subscription?.plano?.descricao || 'Seu plano atual'}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full ${getStatusColor(subscription?.status)} font-semibold`}>
              {subscription?.status === 'ativo' ? 'Ativo' : 
               subscription?.status === 'trial' ? 'Período Trial' :
               subscription?.status === 'cancelado' ? 'Cancelado' : 'Expirado'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCardIcon className="h-5 w-5 text-purple-200" />
                <span className="text-sm text-purple-200">Valor Mensal</span>
              </div>
              <p className="text-2xl font-bold">
                {subscription?.plano?.preco_mensal?.toLocaleString('pt-AO', {
                  style: 'currency',
                  currency: 'AOA'
                }) || 'N/A'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarIcon className="h-5 w-5 text-purple-200" />
                <span className="text-sm text-purple-200">Data de Ativação</span>
              </div>
              <p className="text-2xl font-bold">{formatDate(subscription?.data_ativacao)}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ClockIcon className="h-5 w-5 text-purple-200" />
                <span className="text-sm text-purple-200">Próxima Renovação</span>
              </div>
              <p className="text-2xl font-bold">{formatDate(subscription?.data_expiracao)}</p>
            </div>
          </div>
        </motion.div>

        {/* Uso de Recursos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Uso de Recursos
          </h3>

          <div className="space-y-6">
            {/* Campanhas */}
            {features.campanhas_mensais !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Campanhas Mensais
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {subscription?.uso_atual?.campanhas || 0} / {features.campanhas_mensais === -1 ? '∞' : features.campanhas_mensais}
                  </span>
                </div>
                {features.campanhas_mensais !== -1 && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getUsageColor(
                        calculateUsagePercentage(subscription?.uso_atual?.campanhas || 0, features.campanhas_mensais)
                      )}`}
                      style={{
                        width: `${calculateUsagePercentage(subscription?.uso_atual?.campanhas || 0, features.campanhas_mensais)}%`
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Respostas por Campanha */}
            {features.respostas_por_campanha !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Respostas por Campanha
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Limite: {features.respostas_por_campanha === -1 ? 'Ilimitado' : features.respostas_por_campanha}
                  </span>
                </div>
              </div>
            )}

            {/* Features Extras */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {features.ai_insights ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm ${features.ai_insights ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  AI Insights
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {features.exportacao_dados ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm ${features.exportacao_dados ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  Exportação de Dados
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {features.suporte_prioritario ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm ${features.suporte_prioritario ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  Suporte Prioritário
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {features.api_acesso ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-400" />
                )}
                <span className={`text-sm ${features.api_acesso ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                  Acesso à API
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ações Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => navigate('/client/plans')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-colors text-left"
          >
            <ArrowUpCircleIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Fazer Upgrade</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Desbloquear mais recursos e aumentar limites
            </p>
          </button>

          <button
            onClick={() => navigate('/client/billing')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-left"
          >
            <CreditCardIcon className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Histórico de Pagamentos</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ver todas as transações e faturas
            </p>
          </button>

          <button
            onClick={() => navigate('/client/support')}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors text-left"
          >
            <UserGroupIcon className="h-8 w-8 text-gray-600 dark:text-gray-400 mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Suporte</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Precisa de ajuda? Fale conosco
            </p>
          </button>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default ClientSubscription;
