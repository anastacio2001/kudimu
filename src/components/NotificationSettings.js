import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import {
  isPushSupported,
  isNotificationPermissionGranted,
  subscribeToPush,
  unsubscribeFromPush,
  isPushSubscribed,
  sendTestNotification,
  getNotificationSettings,
  updateNotificationSettings
} from '../services/pushNotifications';
import { Card, Button, Badge } from './ui';
import { useTheme } from '../contexts/ThemeContext';

const NotificationSettings = () => {
  const { theme } = useTheme();
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [preferences, setPreferences] = useState({
    newCampaigns: true,
    campaignApproved: true,
    rewardAvailable: true,
    surveyReminder: true,
    levelUp: true,
    achievements: true,
    weeklyReport: false
  });

  useEffect(() => {
    checkNotificationStatus();
    loadPreferences();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const isSupported = isPushSupported();
      setSupported(isSupported);

      if (isSupported) {
        const hasPermission = isNotificationPermissionGranted();
        setPermission(hasPermission ? 'granted' : 'default');

        if (hasPermission) {
          const isSub = await isPushSubscribed();
          setSubscribed(isSub);
        }
      }
    } catch (err) {
      console.error('Erro ao verificar status das notificações:', err);
      setError('Erro ao verificar configurações de notificação');
    }
  };

  const loadPreferences = async () => {
    try {
      const settings = await getNotificationSettings();
      if (settings) {
        setPreferences(settings);
      }
    } catch (err) {
      console.error('Erro ao carregar preferências:', err);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await subscribeToPush();
      await checkNotificationStatus();
      
      setSuccess('Notificações ativadas com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Erro ao subscrever:', err);
      setError(err.message || 'Erro ao ativar notificações');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await unsubscribeFromPush();
      await checkNotificationStatus();
      
      setSuccess('Notificações desativadas');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Erro ao desinscrever:', err);
      setError('Erro ao desativar notificações');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      setLoading(true);
      await sendTestNotification();
      setSuccess('Notificação de teste enviada!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao enviar notificação de teste');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      
      await updateNotificationSettings(newPreferences);
      
    } catch (err) {
      console.error('Erro ao atualizar preferências:', err);
      setError('Erro ao salvar preferências');
    }
  };

  const getStatusBadge = () => {
    if (!supported) {
      return <Badge variant="danger" size="sm">Não suportado</Badge>;
    }
    
    if (permission !== 'granted') {
      return <Badge variant="warning" size="sm">Permissão necessária</Badge>;
    }
    
    if (subscribed) {
      return <Badge variant="success" size="sm">Ativas</Badge>;
    }
    
    return <Badge variant="secondary" size="sm">Inativas</Badge>;
  };

  const preferencesLabels = {
    newCampaigns: 'Novas campanhas disponíveis',
    campaignApproved: 'Campanha aprovada para participação',
    rewardAvailable: 'Recompensa disponível para resgate',
    surveyReminder: 'Lembrete de pesquisas pendentes',
    levelUp: 'Aumento de nível ou reputação',
    achievements: 'Conquistas e medalhas',
    weeklyReport: 'Relatório semanal de atividades'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <BellIcon className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Configurações de Notificações
            </h1>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie como e quando você recebe notificações
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center"
          >
            <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center"
          >
            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700 dark:text-green-300">{success}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Status das Notificações
              </h2>
              {getStatusBadge()}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Suporte do navegador:</span>
                <span className={`font-medium ${supported ? 'text-green-600' : 'text-red-600'}`}>
                  {supported ? 'Suportado' : 'Não suportado'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Permissão:</span>
                <span className={`font-medium ${
                  permission === 'granted' ? 'text-green-600' :
                  permission === 'denied' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {permission === 'granted' ? 'Concedida' :
                   permission === 'denied' ? 'Negada' : 'Pendente'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Subscrição:</span>
                <span className={`font-medium ${subscribed ? 'text-green-600' : 'text-gray-500'}`}>
                  {subscribed ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              {!subscribed ? (
                <Button
                  onClick={handleSubscribe}
                  disabled={!supported || loading}
                  className="flex-1"
                >
                  {loading ? 'Ativando...' : 'Ativar Notificações'}
                </Button>
              ) : (
                <Button
                  onClick={handleUnsubscribe}
                  variant="outline"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Desativando...' : 'Desativar Notificações'}
                </Button>
              )}

              {subscribed && (
                <Button
                  onClick={handleTestNotification}
                  variant="outline"
                  disabled={loading}
                  size="sm"
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Teste
                </Button>
              )}
            </div>
          </Card>

          {/* Preferences Card */}
          {subscribed && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tipos de Notificação
              </h2>
              
              <div className="space-y-4">
                {Object.entries(preferencesLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-gray-700 dark:text-gray-300 cursor-pointer">
                      {label}
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[key]}
                        onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Help Card */}
          {!supported && (
            <Card className="p-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Notificações não suportadas
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                    Seu navegador não suporta notificações push. 
                    Considere atualizar para uma versão mais recente ou usar um navegador compatível.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;