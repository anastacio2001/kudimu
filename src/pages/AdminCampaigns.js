import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  StopIcon
} from '@heroicons/react/24/solid';
import CreateCampaignModal from '../components/CreateCampaignModal';
import { API_URL } from '../config/api';

export default function NewAdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`${API_URL}/admin/campaigns?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.data);
      } else {
        setError(data.error || 'Erro ao carregar campanhas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (campaignData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateModal(false);
        fetchCampaigns();
        alert('Campanha criada com sucesso!');
      } else {
        alert('Erro ao criar campanha: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ativa': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'rascunho': return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'finalizada': return <StopIcon className="h-4 w-4 text-gray-500" />;
      default: return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rascunho': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'finalizada': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Carregando campanhas...</span>
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
            onClick={fetchCampaigns}
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ←
              </button>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text">
                Kudimu
              </div>
              <div className="text-gray-400">|</div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Gerenciar Campanhas
              </h1>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {campaigns.length} campanhas
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Filtros e Ações */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos os status</option>
                <option value="ativa">Ativas</option>
                <option value="rascunho">Rascunhos</option>
                <option value="finalizada">Finalizadas</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Campanha
          </button>
        </div>

        {/* Lista de Campanhas */}
        <div className="grid gap-6">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.titulo}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1 capitalize">{campaign.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {campaign.descricao}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {campaign.total_respostas}/{campaign.meta_respostas} respostas
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        {campaign.recompensa_por_resposta} Kz por resposta
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Até {new Date(campaign.data_fim).toLocaleDateString('pt-AO')}
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min((campaign.total_respostas / campaign.meta_respostas) * 100, 100)}%` 
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {Math.round((campaign.total_respostas / campaign.meta_respostas) * 100)}% completo
                      </span>
                      <span>
                        Criada em {new Date(campaign.data_criacao).toLocaleDateString('pt-AO')}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        const userType = JSON.parse(localStorage.getItem('user') || '{}').tipo_usuario;
                        const analyticsPath = userType === 'admin' 
                          ? `/admin/campaigns/${campaign.id}/analytics`
                          : `/client/campaigns/${campaign.id}/analytics`;
                        navigate(analyticsPath);
                      }}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      title="Analytics"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => alert('Visualizar campanha')}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingCampaign(campaign)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => alert('Excluir campanha')}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {campaigns.length === 0 && (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma campanha encontrada
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {statusFilter ? 'Não há campanhas com este status.' : 'Comece criando sua primeira campanha.'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Criar Primeira Campanha
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criação */}
      <CreateCampaignModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCampaign}
      />

      {/* Modal de Edição */}
      {editingCampaign && (
        <EditCampaignModal 
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={(updates) => {
            // Implementar salvamento
            console.log('Salvando:', updates);
            setEditingCampaign(null);
            fetchCampaigns();
          }}
        />
      )}
    </div>
  );
}

function EditCampaignModal({ campaign, onClose, onSave }) {
  const [formData, setFormData] = useState({
    titulo: campaign.titulo,
    descricao: campaign.descricao,
    status: campaign.status,
    meta_respostas: campaign.meta_respostas,
    recompensa_por_resposta: campaign.recompensa_por_resposta,
    data_fim: campaign.data_fim
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Editar Campanha
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="rascunho">Rascunho</option>
                <option value="ativa">Ativa</option>
                <option value="finalizada">Finalizada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta de Respostas
              </label>
              <input
                type="number"
                value={formData.meta_respostas}
                onChange={(e) => setFormData({...formData, meta_respostas: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recompensa por Resposta (Kz)
              </label>
              <input
                type="number"
                value={formData.recompensa_por_resposta}
                onChange={(e) => setFormData({...formData, recompensa_por_resposta: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>

          {/* Progresso Atual */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Progresso Atual
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {campaign.total_respostas} / {campaign.meta_respostas} respostas
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((campaign.total_respostas / campaign.meta_respostas) * 100)}% completo
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}