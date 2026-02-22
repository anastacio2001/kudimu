import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  EyeIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  PencilIcon,
  PauseIcon,
  PlayIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import CreateCampaignModal from '../components/CreateCampaignModal';
import EditCampaignModal from '../components/EditCampaignModal';
import ClientLayout from '../components/ClientLayout';
import { API_URL } from '../config/api';

const ClientCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadClientCampaigns();
  }, [statusFilter, searchTerm]);

  const loadClientCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      // Buscar campanhas reais do backend
      const params = new URLSearchParams();
      if (statusFilter !== 'todas') params.append('status', statusFilter);
      if (searchTerm) params.append('pesquisa', searchTerm);
      
      const response = await fetch(`${API_URL}/client/campaigns?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setCampaigns(result.data);
      } else {
        console.error('Erro ao carregar campanhas:', result.error);
      }
    } catch (error) {
      console.error('Erro ao carregar campanhas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todas' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ativa':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'rascunho':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'finalizada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pausada':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ativa': return 'Ativa';
      case 'rascunho': return 'Rascunho';
      case 'finalizada': return 'Finalizada';
      case 'pausada': return 'Pausada';
      default: return status;
    }
  };

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleCampaignCreated = (newCampaign) => {
    // Adicionar nova campanha à lista
    setCampaigns([newCampaign, ...campaigns]);
    setShowCreateModal(false);
    // Recarregar campanhas do servidor
    loadClientCampaigns();
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowEditModal(true);
    setActionMenuOpen(null);
  };

  const handleCampaignUpdated = (updatedCampaign) => {
    setCampaigns(campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    setShowEditModal(false);
    setSelectedCampaign(null);
    loadClientCampaigns();
  };

  const handleTogglePause = async (campaign) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = campaign.status === 'pausada' ? 'ativa' : 'pausada';
      
      const response = await fetch(`${API_URL}/campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...campaign,
          status: newStatus
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setCampaigns(campaigns.map(c => 
          c.id === campaign.id ? { ...c, status: newStatus } : c
        ));
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
    setActionMenuOpen(null);
  };

  const handleDuplicate = async (campaign) => {
    try {
      const token = localStorage.getItem('token');
      
      const duplicateData = {
        ...campaign,
        titulo: `${campaign.titulo} (Cópia)`,
        status: 'rascunho',
        id: undefined,
        created_at: undefined,
        updated_at: undefined
      };
      
      const response = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(duplicateData)
      });

      const result = await response.json();
      
      if (result.success) {
        setCampaigns([result.data, ...campaigns]);
      }
    } catch (error) {
      console.error('Erro ao duplicar campanha:', error);
    }
    setActionMenuOpen(null);
  };

  const handleDelete = async (campaign) => {
    if (!window.confirm(`Tem certeza que deseja deletar a campanha "${campaign.titulo}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/campaigns/${campaign.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setCampaigns(campaigns.filter(c => c.id !== campaign.id));
      }
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
    }
    setActionMenuOpen(null);
  };

  if (loading) {
    return (
      <ClientLayout title="Minhas Campanhas">
        <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando suas campanhas...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Minhas Campanhas">
      <div className="container-custom py-8">
        {/* Header com botão Nova Campanha */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Minhas Campanhas</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Gerencie e acompanhe todas as suas campanhas
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-medium">Nova Campanha</span>
          </button>
        </div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar campanhas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="todas">Todos os status</option>
                <option value="ativa">Ativas</option>
                <option value="rascunho">Rascunhos</option>
                <option value="finalizada">Finalizadas</option>
                <option value="pausada">Pausadas</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredCampaigns.length} de {campaigns.length} campanhas
            </div>
          </div>
        </motion.div>

        {/* Lista de Campanhas */}
        <div className="space-y-6">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {campaign.titulo}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {campaign.descricao}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(campaign.data_inicio).toLocaleDateString('pt-BR')} - {new Date(campaign.data_fim).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center">
                          <UserGroupIcon className="h-4 w-4 mr-1" />
                          {campaign.total_respostas}/{campaign.meta_respostas} respostas
                        </span>
                      </div>
                    </div>
                    
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </div>

                  {/* Progresso */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progresso</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.progresso.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${campaign.progresso}%` }}
                      />
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {(campaign.orcamento / 1000).toFixed(0)}K AOA
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Orçamento</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.incentivo_por_resposta} AOA
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Por Resposta</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.categoria}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Categoria</div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center space-x-2 ml-6">
                  <button
                    onClick={() => {
                      const analyticsPath = `/client/campaigns/${campaign.id}/analytics`;
                      navigate(analyticsPath);
                    }}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Ver Analytics"
                  >
                    <ChartBarIcon className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => handleEditCampaign(campaign)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleTogglePause(campaign)}
                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                    title={campaign.status === 'pausada' ? 'Reativar' : 'Pausar'}
                  >
                    {campaign.status === 'pausada' ? (
                      <PlayIcon className="h-5 w-5" />
                    ) : (
                      <PauseIcon className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDuplicate(campaign)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Duplicar"
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(campaign)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Deletar"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mensagem quando não há campanhas */}
        {filteredCampaigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'todas'
                ? 'Nenhuma campanha encontrada'
                : 'Nenhuma campanha criada ainda'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'todas'
                ? 'Tente ajustar os filtros de pesquisa.'
                : 'Clique em "Nova Campanha" para criar sua primeira campanha.'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal de Criação de Campanha */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCampaignCreated}
      />

      {/* Modal de Edição de Campanha */}
      <EditCampaignModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCampaign(null);
        }}
        onSave={handleCampaignUpdated}
        campaign={selectedCampaign}
      />
    </ClientLayout>
  );
};

export default ClientCampaigns;