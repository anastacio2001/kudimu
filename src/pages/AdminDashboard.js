import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BoltIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../components/AdminLayout';
import { API_URL } from '../config/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Erro ao carregar dashboard');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <div className="text-red-600 dark:text-red-400 text-center">{error}</div>
          <button 
            onClick={fetchDashboard}
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard Administrativo">
        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={UsersIcon}
            title="Usuários Ativos"
            value={stats?.usuarios_ativos || 0}
            color="blue"
            delay={0.1}
          />
          <StatCard 
            icon={ClipboardDocumentListIcon}
            title="Campanhas Ativas"
            value={stats?.campanhas_ativas || 0}
            color="green"
            delay={0.2}
          />
          <StatCard 
            icon={ChatBubbleLeftRightIcon}
            title="Respostas Hoje"
            value={stats?.respostas_hoje || 0}
            color="purple"
            delay={0.3}
          />
          <StatCard 
            icon={CurrencyDollarIcon}
            title="Receita Mensal"
            value={`${(stats?.receita_mensal || 0).toLocaleString()} Kz`}
            color="orange"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campanhas Recentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Campanhas Recentes
              </h2>
              <button 
                onClick={() => navigate('/admin/campaigns')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Ver todas
              </button>
            </div>
            
            <div className="space-y-4">
              {stats?.campanhas_recentes?.map((campanha, index) => (
                <div key={campanha.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {campanha.titulo}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {campanha.respostas}/{campanha.meta} respostas
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${campanha.progresso}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {campanha.progresso.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhuma campanha encontrada
                </p>
              )}
            </div>
          </motion.div>

          {/* Métricas Semanais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Atividade Semanal
            </h2>
            
            <div className="space-y-4">
              {Object.entries(stats?.metricas_semanais || {}).map(([dia, valor]) => (
                <div key={dia} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {dia}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(valor / 200) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {valor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Ações Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Ações Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mostrar opções baseadas no tipo de usuário */}
            {JSON.parse(localStorage.getItem('user') || '{}').tipo_usuario === 'admin' && (
              <QuickLinkCard 
                icon={UsersIcon}
                title="Gerenciar Usuários"
                href="/admin/users"
                navigate={navigate}
              />
            )}
            
            <QuickLinkCard 
              icon={ClipboardDocumentListIcon}
              title="Gerenciar Campanhas"
              href={JSON.parse(localStorage.getItem('user') || '{}').tipo_usuario === 'admin' ? "/admin/campaigns" : "/client/campaigns"}
              navigate={navigate}
            />
            
            <QuickLinkCard 
              icon={WalletIcon}
              title="Gestão de Orçamento"
              href={JSON.parse(localStorage.getItem('user') || '{}').tipo_usuario === 'admin' ? "/admin/budget" : "/client/budget"}
              navigate={navigate}
            />
            
            <QuickLinkCard 
              icon={ChatBubbleLeftRightIcon}
              title="Revisar Respostas"
              href="/admin/answers"
              navigate={navigate}
            />
            
            <QuickLinkCard 
              icon={ChartBarIcon}
              title="Relatórios"
              href={JSON.parse(localStorage.getItem('user') || '{}').tipo_usuario === 'admin' ? "/admin/reports" : "/client/reports"}
              navigate={navigate}
            />
            
            {/* AI Insights apenas para admins */}
            {JSON.parse(localStorage.getItem('user') || '{}').tipo_usuario === 'admin' && (
              <QuickLinkCard 
                icon={BoltIcon}
                title="AI Insights"
                href="/admin/ai-insights"
                navigate={navigate}
              />
            )}
          </div>
        </motion.div>
      </AdminLayout>
    );
  }
  
  function StatCard({ icon: Icon, title, value, color, delay }) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function QuickLinkCard({ icon: Icon, title, href, navigate }) {
  return (
    <button
      onClick={() => navigate(href)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
    >
      <div className="flex items-center">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </p>
        </div>
      </div>
    </button>
  );
}
