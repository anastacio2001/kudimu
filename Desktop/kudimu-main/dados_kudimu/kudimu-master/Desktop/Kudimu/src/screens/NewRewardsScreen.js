import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Badge, Modal, Input } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

const WITHDRAWAL_METHODS = {
  banco: {
    id: 'banco',
    name: 'Transferência Bancária',
    icon: BuildingLibraryIcon,
    minAmount: 2000,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Transferência direta para sua conta bancária'
  },
  unitel: {
    id: 'unitel',
    name: 'Dados Móveis Unitel',
    icon: DevicePhoneMobileIcon,
    minAmount: 500,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Recarga de dados móveis na rede Unitel'
  },
  movicel: {
    id: 'movicel',
    name: 'Dados Móveis Movicel',
    icon: DevicePhoneMobileIcon,
    minAmount: 500,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Recarga de dados móveis na rede Movicel'
  },
  ekwanza: {
    id: 'ekwanza',
    name: 'e-Kwanza',
    icon: CreditCardIcon,
    minAmount: 1000,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    description: 'Pagamento via carteira digital e-Kwanza'
  },
  paypay: {
    id: 'paypay',
    name: 'PayPay',
    icon: CreditCardIcon,
    minAmount: 1000,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'Pagamento via carteira digital PayPay'
  }
};

/**
 * NewRewardsScreen - Tela de recompensas moderna com design system
 */
const NewRewardsScreen = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Balance and transactions
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [earningsChart, setEarningsChart] = useState([]);
  
  // Withdrawal modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawalForm, setWithdrawalForm] = useState({});
  const [withdrawing, setWithdrawing] = useState(false);
  
  // Filter and tab states
  const [activeTab, setActiveTab] = useState('saldo');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Mock data para desenvolvimento
      const mockBalance = 3450.75;
      
      const mockTransactions = [
        {
          id: '1',
          tipo: 'recompensa',
          valor: 250,
          status: 'concluido',
          data_criacao: '2025-10-20T10:30:00Z',
          campanha_id: '1',
          campanha_titulo: 'Pesquisa Mobilidade Urbana'
        },
        {
          id: '2',
          tipo: 'saque',
          valor: -1000,
          status: 'processando',
          data_criacao: '2025-10-19T14:15:00Z',
          metodo_pagamento: 'unitel',
          telefone_destino: '+244 923 456 789'
        },
        {
          id: '3',
          tipo: 'recompensa',
          valor: 300,
          status: 'concluido',
          data_criacao: '2025-10-18T16:45:00Z',
          campanha_id: '2',
          campanha_titulo: 'Opinião E-commerce'
        },
        {
          id: '4',
          tipo: 'saque',
          valor: -500,
          status: 'concluido',
          data_criacao: '2025-10-15T09:20:00Z',
          metodo_pagamento: 'movicel',
          telefone_destino: '+244 912 345 678'
        }
      ];

      const mockEarningsChart = [
        { month: 'Jul', earnings: 1200 },
        { month: 'Ago', earnings: 1800 },
        { month: 'Set', earnings: 2200 },
        { month: 'Out', earnings: 3450 }
      ];

      setBalance(mockBalance);
      setTransactions(mockTransactions);
      setEarningsChart(mockEarningsChart);
      setError(null);

    } catch (err) {
      console.error('Error fetching rewards data:', err);
      setError('Erro ao carregar dados de recompensas');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setWithdrawing(true);
      
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      const newTransaction = {
        id: Date.now().toString(),
        tipo: 'saque',
        valor: -parseFloat(withdrawAmount),
        status: 'processando',
        data_criacao: new Date().toISOString(),
        metodo_pagamento: selectedMethod.id,
        ...withdrawalForm
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev - parseFloat(withdrawAmount));
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawalForm({});
      setSelectedMethod(null);

    } catch (err) {
      console.error('Error processing withdrawal:', err);
      setError('Erro ao processar saque');
    } finally {
      setWithdrawing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluido': return 'text-green-600 bg-green-100';
      case 'processando': return 'text-yellow-600 bg-yellow-100';
      case 'pendente': return 'text-blue-600 bg-blue-100';
      case 'erro': return 'text-red-600 bg-red-100';
      case 'cancelado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluido': return <CheckCircleIcon className="w-4 h-4" />;
      case 'processando': return <ClockIcon className="w-4 h-4" />;
      case 'pendente': return <ClockIcon className="w-4 h-4" />;
      case 'erro': return <XCircleIcon className="w-4 h-4" />;
      case 'cancelado': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2
    }).format(Math.abs(value));
  };

  const tabs = [
    { id: 'saldo', label: 'Saldo', icon: BanknotesIcon },
    { id: 'historico', label: 'Histórico', icon: ChartBarIcon },
    { id: 'saques', label: 'Saques', icon: ArrowDownTrayIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando suas recompensas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Erro ao carregar</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchRewardsData} className="w-full">
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/campaigns')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Voltar
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Recompensas</h1>
                <p className="text-gray-600 dark:text-gray-400">Gerencie seu saldo e saques</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Saldo atual</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(balance)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'saldo' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Balance Card */}
              <Card className="lg:col-span-1">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BanknotesIcon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Saldo Disponível</h3>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(balance)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Valor mínimo para saque: 500 AOA
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={balance < 500}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                    Solicitar Saque
                  </Button>
                </div>
              </Card>

              {/* Earnings Chart */}
              <Card className="lg:col-span-2">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Evolução dos Ganhos</h3>
                  <div className="space-y-4">
                    {earningsChart.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{item.month}</span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                              style={{ width: `${(item.earnings / Math.max(...earningsChart.map(i => i.earnings))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(item.earnings)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'historico' && (
            <div>
              {/* Filters */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {['todos', 'recompensa', 'saque'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setStatusFilter(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction History */}
              <div className="grid gap-4">
                {transactions
                  .filter(transaction => statusFilter === 'todos' || transaction.tipo === statusFilter)
                  .map((transaction) => (
                    <Card key={transaction.id}>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              transaction.tipo === 'recompensa' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {transaction.tipo === 'recompensa' ? (
                                <BanknotesIcon className="w-6 h-6" />
                              ) : (
                                <ArrowDownTrayIcon className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {transaction.tipo === 'recompensa' ? 'Recompensa recebida' : 'Saque solicitado'}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {transaction.campanha_titulo || 
                                 (transaction.metodo_pagamento && `${WITHDRAWAL_METHODS[transaction.metodo_pagamento]?.name} - ${transaction.telefone_destino}`) ||
                                 'Transação'}
                              </p>
                              <p className="text-gray-500 dark:text-gray-500 text-xs">
                                {new Date(transaction.data_criacao).toLocaleString('pt-AO')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold ${
                              transaction.valor > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.valor > 0 ? '+' : ''}{formatCurrency(transaction.valor)}
                            </p>
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {getStatusIcon(transaction.status)}
                              <span>{transaction.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'saques' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(WITHDRAWAL_METHODS).map((method) => {
                const IconComponent = method.icon;
                return (
                  <Card 
                    key={method.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedMethod(method);
                      setShowWithdrawModal(true);
                    }}
                  >
                    <div className="p-6 text-center">
                      <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className={`w-8 h-8 ${method.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {method.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {method.description}
                      </p>
                      <Badge variant="secondary">
                        Mín: {formatCurrency(method.minAmount)}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Withdraw Modal */}
      <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Solicitar Saque
          </h3>
          
          {selectedMethod && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <selectedMethod.icon className={`w-6 h-6 ${selectedMethod.color}`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMethod.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor mínimo: {formatCurrency(selectedMethod.minAmount)}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor do saque
                </label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Mínimo ${selectedMethod.minAmount} AOA`}
                  min={selectedMethod.minAmount}
                  max={balance}
                />
              </div>

              {selectedMethod.id === 'unitel' || selectedMethod.id === 'movicel' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de telefone
                  </label>
                  <Input
                    type="tel"
                    value={withdrawalForm.telefone || ''}
                    onChange={(e) => setWithdrawalForm({...withdrawalForm, telefone: e.target.value})}
                    placeholder="+244 9XX XXX XXX"
                  />
                </div>
              ) : selectedMethod.id === 'banco' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número da conta
                    </label>
                    <Input
                      value={withdrawalForm.conta || ''}
                      onChange={(e) => setWithdrawalForm({...withdrawalForm, conta: e.target.value})}
                      placeholder="Número da sua conta bancária"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do titular
                    </label>
                    <Input
                      value={withdrawalForm.titular || ''}
                      onChange={(e) => setWithdrawalForm({...withdrawalForm, titular: e.target.value})}
                      placeholder="Nome completo do titular da conta"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número da conta {selectedMethod.name}
                  </label>
                  <Input
                    value={withdrawalForm.conta || ''}
                    onChange={(e) => setWithdrawalForm({...withdrawalForm, conta: e.target.value})}
                    placeholder={`Sua conta ${selectedMethod.name}`}
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) < selectedMethod.minAmount}
                  className="flex-1"
                >
                  {withdrawing ? 'Processando...' : 'Solicitar Saque'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NewRewardsScreen;