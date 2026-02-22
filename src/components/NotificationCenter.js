import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  EyeIcon,
  ArchiveBoxIcon,
  FireIcon,
  ChartBarIcon,
  WalletIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, campaigns, budget, achievements

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      // Detectar se estamos em desenvolvimento ou produção
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setNotifications(result.data);
      } else {
        // Mock data para desenvolvimento
        const mockNotifications = [
          {
            id: 1,
            tipo: 'campaign',
            titulo: 'Meta de Respostas Atingida! 🎉',
            mensagem: 'Sua campanha "Estudo Mercado de Trabalho 2024" atingiu 150 respostas.',
            timestamp: '2025-11-03T06:45:00Z',
            lida: false,
            prioridade: 'high',
            campanha_id: 1,
            icone: 'trophy'
          },
          {
            id: 2,
            tipo: 'budget',
            titulo: 'Alerta de Orçamento ⚠️',
            mensagem: 'Campanha "Pesquisa Produtos Digitais" tem apenas 3% do orçamento restante.',
            timestamp: '2025-11-03T06:30:00Z',
            lida: false,
            prioridade: 'high',
            campanha_id: 3,
            icone: 'wallet'
          },
          {
            id: 3,
            tipo: 'campaign',
            titulo: 'Novo Insight Disponível 📊',
            mensagem: 'Análise de tendências concluída para "Avaliação Serviços Bancários".',
            timestamp: '2025-11-03T06:15:00Z',
            lida: true,
            prioridade: 'medium',
            campanha_id: 2,
            icone: 'chart'
          },
          {
            id: 4,
            tipo: 'campaign',
            titulo: 'Performance Excelente! ⭐',
            mensagem: 'Sua campanha tem 95.2% de eficiência - acima da média!',
            timestamp: '2025-11-03T06:00:00Z',
            lida: true,
            prioridade: 'medium',
            campanha_id: 1,
            icone: 'fire'
          },
          {
            id: 5,
            tipo: 'achievement',
            titulo: 'Conquista Desbloqueada! 🏆',
            mensagem: 'Você alcançou 500+ respostas totais em suas campanhas.',
            timestamp: '2025-11-03T05:45:00Z',
            lida: false,
            prioridade: 'low',
            icone: 'trophy'
          }
        ];
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      // Mock data como fallback
      const mockNotifications = [
        {
          id: 1,
          tipo: 'campaign',
          titulo: 'Meta de Respostas Atingida! 🎉',
          mensagem: 'Sua campanha "Estudo Mercado de Trabalho 2024" atingiu 150 respostas.',
          timestamp: '2025-11-03T06:45:00Z',
          lida: false,
          prioridade: 'high',
          campanha_id: 1,
          icone: 'trophy'
        },
        {
          id: 2,
          tipo: 'budget',
          titulo: 'Alerta de Orçamento ⚠️',
          mensagem: 'Campanha "Pesquisa Produtos Digitais" tem apenas 3% do orçamento restante.',
          timestamp: '2025-11-03T06:30:00Z',
          lida: false,
          prioridade: 'high',
          campanha_id: 3,
          icone: 'wallet'
        }
      ];
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';
      
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, lida: true } : n)
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      // Marcar localmente mesmo se a API falhar
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, lida: true } : n)
      );
    }
  };

  const getIcon = (icone, prioridade) => {
    const baseClass = "h-5 w-5";
    const colorClass = prioridade === 'high' ? 'text-red-500' : 
                     prioridade === 'medium' ? 'text-yellow-500' : 'text-green-500';
    
    switch (icone) {
      case 'trophy':
        return <TrophyIcon className={`${baseClass} ${colorClass}`} />;
      case 'wallet':
        return <WalletIcon className={`${baseClass} ${colorClass}`} />;
      case 'chart':
        return <ChartBarIcon className={`${baseClass} ${colorClass}`} />;
      case 'fire':
        return <FireIcon className={`${baseClass} ${colorClass}`} />;
      default:
        return <BellIcon className={`${baseClass} ${colorClass}`} />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'campaigns') return n.tipo === 'campaign';
    if (filter === 'budget') return n.tipo === 'budget';
    if (filter === 'achievements') return n.tipo === 'achievement';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.lida).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BellIcon className="h-6 w-6 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Notificações</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Filtros */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'campaigns', label: 'Campanhas' },
              { key: 'budget', label: 'Orçamento' },
              { key: 'achievements', label: 'Conquistas' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Notificações */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhuma notificação encontrada</p>
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 border-l-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      notification.lida 
                        ? 'bg-white border-gray-200' 
                        : 'bg-blue-50 border-blue-500'
                    } ${notification.prioridade === 'high' ? 'border-red-500' : ''}`}
                    onClick={() => !notification.lida && markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.icone, notification.prioridade)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium ${
                            notification.lida ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.titulo}
                          </h3>
                          {!notification.lida && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        
                        <p className={`text-sm mt-1 ${
                          notification.lida ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {notification.mensagem}
                        </p>
                        
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.timestamp).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => {
              // Marcar todas como lidas
              setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
            }}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Marcar todas como lidas
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationCenter;