import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '../components/AdminLayout';

const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8787' 
  : 'https://kudimu-api.l-anastacio001.workers.dev';

const STATUS_COLORS = {
  pendente: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  processado: 'bg-blue-100 text-blue-800',
  rejeitado: 'bg-red-100 text-red-800',
  cancelado: 'bg-gray-100 text-gray-800'
};

const STATUS_LABELS = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  processado: 'Processado',
  rejeitado: 'Rejeitado',
  cancelado: 'Cancelado'
};

const METODO_LABELS = {
  banco: 'Transferência Bancária',
  unitel: 'Dados Móveis Unitel',
  movicel: 'Dados Móveis Movicel',
  ekwanza: 'e-Kwanza',
  paypay: 'PayPay'
};

export default function AdminWithdrawals() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('pendente');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [stats, setStats] = useState({
    pendente: 0,
    aprovado: 0,
    processado: 0,
    rejeitado: 0,
    total_valor_pendente: 0
  });

  useEffect(() => {
    fetchWithdrawals();
    fetchStats();
  }, [statusFilter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_URL}/admin/withdrawals?status=${statusFilter}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setWithdrawals(data.data || []);
      } else {
        setError(data.error || 'Erro ao carregar levantamentos');
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar estatísticas de todos os status
      const statuses = ['pendente', 'aprovado', 'processado', 'rejeitado'];
      const promises = statuses.map(status =>
        fetch(`${API_URL}/admin/withdrawals?status=${status}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(r => r.json())
      );

      const results = await Promise.all(promises);
      
      const newStats = {
        pendente: results[0].total || 0,
        aprovado: results[1].total || 0,
        processado: results[2].total || 0,
        rejeitado: results[3].total || 0,
        total_valor_pendente: results[0].data?.reduce((sum, w) => sum + parseFloat(w.valor), 0) || 0
      };

      setStats(newStats);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    }
  };

  const handleUpdateStatus = async (withdrawalId, newStatus) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${API_URL}/admin/withdrawals/${withdrawalId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus,
            observacoes: observacoes || null
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        setShowModal(false);
        setObservacoes('');
        fetchWithdrawals();
        fetchStats();
      } else {
        alert(data.error || 'Erro ao processar levantamento');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao conectar com o servidor');
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestão de Levantamentos
          </h1>
          <p className="text-gray-600">
            Aprove ou rejeite solicitações de levantamento de recompensas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pendente}</p>
              </div>
              <ClockIcon className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Aprovados</p>
                <p className="text-3xl font-bold text-green-900">{stats.aprovado}</p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Processados</p>
                <p className="text-3xl font-bold text-blue-900">{stats.processado}</p>
              </div>
              <ArrowPathIcon className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Rejeitados</p>
                <p className="text-3xl font-bold text-red-900">{stats.rejeitado}</p>
              </div>
              <XCircleIcon className="w-12 h-12 text-red-400" />
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Valor Pendente</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.total_valor_pendente.toLocaleString('pt-AO')} AOA
                </p>
              </div>
              <BanknotesIcon className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {['pendente', 'aprovado', 'processado', 'rejeitado', 'todos'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {STATUS_LABELS[status] || 'Todos'}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Withdrawals Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando levantamentos...</p>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BanknotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum levantamento {STATUS_LABELS[statusFilter].toLowerCase()} encontrado</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Solicitação
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {withdrawal.usuario_nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {withdrawal.usuario_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {withdrawal.valor_formatado}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {METODO_LABELS[withdrawal.metodo_pagamento] || withdrawal.metodo_pagamento}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[withdrawal.status]}`}>
                        {STATUS_LABELS[withdrawal.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(withdrawal.data_solicitacao)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal(withdrawal)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <EyeIcon className="w-4 h-4" />
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Detalhes */}
        {showModal && selectedWithdrawal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalhes do Levantamento
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedWithdrawal.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Usuário</label>
                      <p className="text-sm text-gray-900">{selectedWithdrawal.usuario_nome}</p>
                      <p className="text-sm text-gray-500">{selectedWithdrawal.usuario_email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Valor</label>
                      <p className="text-lg font-bold text-gray-900">{selectedWithdrawal.valor_formatado}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Método de Pagamento</label>
                    <p className="text-sm text-gray-900">
                      {METODO_LABELS[selectedWithdrawal.metodo_pagamento]}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Dados de Pagamento</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                        {JSON.stringify(selectedWithdrawal.dados_pagamento, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[selectedWithdrawal.status]}`}>
                        {STATUS_LABELS[selectedWithdrawal.status]}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Data Solicitação</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedWithdrawal.data_solicitacao)}</p>
                    </div>
                  </div>

                  {selectedWithdrawal.observacoes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Observações</label>
                      <p className="text-sm text-gray-900">{selectedWithdrawal.observacoes}</p>
                    </div>
                  )}

                  {selectedWithdrawal.status === 'pendente' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações (opcional)
                        </label>
                        <textarea
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Adicione observações sobre este levantamento..."
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => handleUpdateStatus(selectedWithdrawal.id, 'aprovado')}
                          disabled={processing}
                          className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          {processing ? 'Processando...' : 'Aprovar'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedWithdrawal.id, 'rejeitado')}
                          disabled={processing}
                          className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <XCircleIcon className="w-5 h-5" />
                          {processing ? 'Processando...' : 'Rejeitar'}
                        </button>
                      </div>
                    </>
                  )}

                  {selectedWithdrawal.status === 'aprovado' && (
                    <div className="pt-4">
                      <button
                        onClick={() => handleUpdateStatus(selectedWithdrawal.id, 'processado')}
                        disabled={processing}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                        {processing ? 'Processando...' : 'Marcar como Processado'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
