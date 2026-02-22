import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  WalletIcon,
  CreditCardIcon,
  BanknotesIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  GiftIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import ClientLayout from '../components/ClientLayout';
import { API_URL } from '../config/api';

const CreditManagement = () => {
  const [creditData, setCreditData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('transferencia');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');

  // Pacotes de créditos baseados nos planos da landing page
  const creditPackages = [
    {
      id: 'campanha-social',
      name: 'Campanha Social',
      credits: 50000,
      price: 50000,
      maxRespostas: 500,
      popular: false,
      bonus: 0,
      icon: '📱',
      description: 'Projetos de impacto social',
      features: [
        'Até 500 respostas',
        'Validação ética obrigatória',
        'Relatórios simplificados',
        'Para ONGs e projetos sociais'
      ]
    },
    {
      id: 'campanha-essencial',
      name: 'Campanha Essencial',
      credits: 100000,
      price: 100000,
      maxRespostas: 1000,
      popular: false,
      bonus: 0,
      icon: '🎯',
      description: 'Ideal para pequenas empresas e ONGs',
      features: [
        'Até 1.000 respostas',
        'Relatório simples com gráficos',
        '3-5 perguntas',
        'Segmentação básica',
        'Entrega em 5-7 dias'
      ]
    },
    {
      id: 'campanha-avancada',
      name: 'Campanha Avançada',
      credits: 500000,
      price: 500000,
      maxRespostas: 10000,
      popular: true,
      bonus: 50000,
      icon: '⭐',
      description: 'Para produtos e políticas públicas',
      features: [
        'Até 10.000 respostas',
        'Perguntas ilimitadas',
        'Análise com IA completa',
        'Segmentação avançada por perfil',
        'Insights preditivos',
        'Relatório PDF executivo',
        'Mapas de calor e visualizações',
        'Suporte prioritário'
      ]
    },
    {
      id: 'assinatura-mensal',
      name: 'Assinatura Mensal',
      credits: 400000,
      price: 400000,
      maxRespostas: null,
      popular: false,
      bonus: 100000,
      icon: '💎',
      description: 'Monitoramento contínuo',
      features: [
        'Painel de controle em tempo real',
        '2 campanhas incluídas por mês',
        'Campanhas adicionais com desconto',
        'Dashboard interativo',
        'Análise histórica',
        'API de dados (básico)',
        'Relatórios mensais automáticos',
        'Suporte dedicado'
      ],
      recurring: true
    },
    {
      id: 'plano-academico',
      name: 'Pesquisa Acadêmica',
      credits: 120000,
      price: 120000,
      maxRespostas: 1500,
      popular: false,
      bonus: 0,
      icon: '🎓',
      description: 'Para doutoramento e pesquisa',
      features: [
        'Até 1.500 respostas',
        'Relatório completo',
        'Segmentação avançada',
        'Formato acadêmico (tese)',
        'Exportação LaTeX, Word, Zotero',
        'Gráficos e tabelas',
        'Suporte metodológico'
      ]
    },
    {
      id: 'plano-estudante',
      name: 'Plano Estudante',
      credits: 50000,
      price: 50000,
      maxRespostas: 500,
      popular: false,
      bonus: 0,
      icon: '📚',
      description: 'Para licenciatura e mestrado',
      features: [
        'Até 500 respostas',
        'Relatório básico',
        'Validação ética obrigatória',
        'Comprovativo institucional',
        'Exportação em PDF',
        'Suporte técnico'
      ]
    }
  ];

  // Métodos de pagamento Angola
  const paymentMethods = [
    {
      id: 'transferencia',
      name: 'Transferência Bancária',
      icon: '🏦',
      type: 'bank',
      description: 'TPA, Transferência ou Depósito',
      processingTime: '24-48h após confirmação',
      recommended: true,
      bankDetails: {
        banco: 'Banco BAI',
        titular: 'Ladislau Segunda Anastácio',
        iban: 'AO06.0040.0000.3514.1269.1010.8',
        swift: 'BAIIAO22'
      }
    },
    {
      id: 'multicaixa',
      name: 'Multicaixa Express',
      icon: '🏧',
      type: 'atm',
      description: 'Brevemente disponível',
      processingTime: 'Em breve',
      disabled: true
    },
    {
      id: 'unitel',
      name: 'Unitel Money',
      icon: '📱',
      type: 'mobile',
      description: 'Brevemente disponível',
      processingTime: 'Em breve',
      disabled: true
    },
    {
      id: 'express',
      name: 'Express Kwik',
      icon: '💳',
      type: 'mobile',
      description: 'Brevemente disponível',
      processingTime: 'Em breve',
      disabled: true
    }
  ];

  // Serviços Adicionais (da landing page)
  const additionalServices = [
    {
      id: 'criacao-assistida',
      name: 'Criação Assistida de Campanha',
      icon: '🎯',
      description: 'Ajuda na estruturação das perguntas e público-alvo',
      priceRange: '20.000 - 50.000 AOA'
    },
    {
      id: 'traducao',
      name: 'Tradução para Línguas Locais',
      icon: '🌍',
      description: 'Umbundu, Kimbundu, Kikongo',
      price: '15.000 AOA'
    },
    {
      id: 'relatorio-visual',
      name: 'Relatório Visual Personalizado',
      icon: '📊',
      description: 'Gráficos, mapa de calor, nuvem de palavras',
      priceRange: '30.000 - 80.000 AOA'
    },
    {
      id: 'exportacao-academica',
      name: 'Exportação Formato Acadêmico',
      icon: '📄',
      description: 'PDF com estrutura de tese (método, resultados)',
      price: '25.000 AOA'
    },
    {
      id: 'simulacao',
      name: 'Simulação de Campanha',
      icon: '✏️',
      description: 'Teste com dados fictícios para validação metodológica',
      price: '10.000 AOA'
    },
    {
      id: 'suporte-tecnico',
      name: 'Suporte Técnico 1:1',
      icon: '💬',
      description: 'Sessão de 30 min com especialista Kudimu',
      price: '15.000 AOA'
    }
  ];

  useEffect(() => {
    loadCreditData();
    loadTransactions();
  }, []);

  const loadCreditData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/client/budget`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setCreditData(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/client/budget/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data.transacoes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    }
  };

  const handlePurchaseCredits = async () => {
    if (!selectedAmount) {
      alert('Selecione um pacote de créditos');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('Selecione um método de pagamento');
      return;
    }

    // Gerar referência única para rastreamento
    const reference = `KDM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setPaymentReference(reference);

    // Mostrar instruções de pagamento
    setShowPaymentInstructions(true);
  };

  const handlePaymentConfirmation = async (comprovantivoFile) => {
    setProcessingPayment(true);

    try {
      const token = localStorage.getItem('token');
      
      // Calcular total de créditos (base + bônus)
      const totalCreditos = selectedAmount.credits + (selectedAmount.bonus || 0);
      
      // Registrar solicitação de pagamento pendente
      const response = await fetch(`${API_URL}/client/budget/request-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantidade: totalCreditos,
          metodo_pagamento: selectedPaymentMethod,
          valor_pago: selectedAmount.price,
          referencia_pagamento: paymentReference,
          plano_id: selectedAmount.id,
          status: 'pendente_confirmacao'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Solicitação de pagamento registrada!\n\nReferência: ${paymentReference}\n\nSeus créditos serão adicionados em até 48h após a confirmação do pagamento.\n\nVocê receberá um email de confirmação.`);
        setShowPaymentInstructions(false);
        setShowAddCredits(false);
        setSelectedAmount(null);
        loadTransactions();
      } else {
        alert('❌ Erro ao registrar pagamento: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('❌ Erro ao processar pagamento');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'credito':
      case 'compra':
        return <ArrowUpIcon className="w-5 h-5 text-green-500" />;
      case 'debito':
      case 'campanha':
        return <ArrowDownIcon className="w-5 h-5 text-red-500" />;
      case 'reembolso':
        return <CheckCircleIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'credito':
      case 'compra':
      case 'reembolso':
        return 'text-green-600';
      case 'debito':
      case 'campanha':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Planos e Preços</h1>
          <p className="mt-2 text-gray-600">Soluções flexíveis em Kwanza (AOA) para todas as necessidades</p>
          
          {/* Info Banner */}
          <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-indigo-900 mb-1">Inteligência Coletiva Africana</h3>
                <p className="text-sm text-indigo-700">
                  Plataforma de pesquisas com IA que conecta empresas, governos e cidadãos. 
                  <span className="font-semibold"> Dados confiáveis, análise inteligente, recompensas justas.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Saldo Atual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <WalletIcon className="w-8 h-8" />
              <SparklesIcon className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-indigo-100 text-sm font-medium mb-1">Saldo Atual</p>
            <p className="text-4xl font-bold mb-2">
              {creditData?.saldo_creditos?.toLocaleString() || '0'}
            </p>
            <p className="text-indigo-100 text-sm">créditos disponíveis</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <BanknotesIcon className="w-8 h-8 text-green-600" />
              <ArrowUpIcon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Plano Atual</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {creditData?.plano || 'Básico'}
            </p>
            <p className="text-gray-500 text-sm">Upgrade disponível</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <ClockIcon className="w-8 h-8 text-blue-600" />
              <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Última Recarga</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {transactions[0] ? formatDate(transactions[0].created_at).split(' ')[0] : 'Nunca'}
            </p>
            <p className="text-gray-500 text-sm">
              {transactions[0] ? `${transactions[0].quantidade?.toLocaleString()} créditos` : 'Sem recargas'}
            </p>
          </motion.div>
        </div>

        {/* Botão Adicionar Créditos */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddCredits(!showAddCredits)}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <CreditCardIcon className="w-6 h-6" />
            Adicionar Créditos
          </button>
        </div>

        {/* Modal Adicionar Créditos */}
        {showAddCredits && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu Plano</h2>
              <p className="text-gray-600 mb-6">Planos baseados nas suas necessidades de pesquisa</p>
              
              {/* Pacotes de Créditos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {creditPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedAmount(pkg)}
                    className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all flex flex-col ${
                      selectedAmount?.id === pkg.id
                        ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        MAIS POPULAR
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{pkg.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                    </div>
                    
                    <div className="mb-4 text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-sm text-gray-500">AOA</span>
                        <p className="text-4xl font-bold text-indigo-600">
                          {pkg.price.toLocaleString()}
                        </p>
                      </div>
                      {pkg.recurring && (
                        <p className="text-xs text-gray-500 mt-1">Por mês</p>
                      )}
                      {pkg.maxRespostas && (
                        <p className="text-sm text-gray-600 mt-2">
                          Até {pkg.maxRespostas.toLocaleString()} respostas
                        </p>
                      )}
                    </div>
                    
                    {/* Features do plano */}
                    <div className="flex-1 border-t border-gray-200 pt-4">
                      <ul className="space-y-2">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {pkg.bonus > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 rounded-lg p-2">
                          <GiftIcon className="w-5 h-5" />
                          <span>Bônus: +{pkg.bonus.toLocaleString()} créditos grátis!</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Serviços Adicionais */}
              <div className="mb-8 bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Serviços Adicionais</h3>
                <p className="text-gray-600 mb-6 text-sm">Potencialize sua pesquisa com serviços extras</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {additionalServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{service.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">{service.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                          <p className="text-sm font-bold text-indigo-600">
                            {service.price || service.priceRange}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    💳 Aceitamos pagamentos via Unitel Money, Multicaixa Express e Kwanza (AOA)
                  </p>
                </div>
              </div>

              {/* Métodos de Pagamento */}
              {selectedAmount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Método de Pagamento</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => !method.disabled && setSelectedPaymentMethod(method.id)}
                        className={`relative rounded-lg p-4 border-2 transition-all ${
                          method.disabled 
                            ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                            : selectedPaymentMethod === method.id
                            ? 'cursor-pointer border-green-600 bg-green-50 shadow-lg'
                            : 'cursor-pointer border-gray-200 bg-white hover:border-green-300'
                        }`}
                      >
                        {method.recommended && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            ✓ DISPONÍVEL
                          </div>
                        )}
                        <div className="text-3xl mb-2">{method.icon}</div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{method.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{method.description}</p>
                        <p className="text-xs text-gray-500">⏱️ {method.processingTime}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Botões de Ação */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowAddCredits(false);
                    setSelectedAmount(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePurchaseCredits}
                  disabled={!selectedAmount || processingPayment}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {processingPayment ? 'Processando...' : `Pagar ${selectedAmount?.price.toLocaleString() || '0'} Kz`}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Histórico de Transações */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Histórico de Transações</h2>
            <p className="text-gray-600 mt-1">Últimas movimentações da sua conta</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Após
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-lg font-medium">Nenhuma transação encontrada</p>
                      <p className="text-sm mt-1">Adicione créditos para começar</p>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.tipo)}
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {transaction.tipo}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{transaction.descricao}</p>
                        {transaction.referencia && (
                          <p className="text-xs text-gray-500 mt-1">Ref: {transaction.referencia}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${getTransactionColor(transaction.tipo)}`}>
                          {transaction.tipo === 'debito' || transaction.tipo === 'campanha' ? '-' : '+'}
                          {transaction.quantidade?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-medium">
                          {transaction.saldo_apos?.toLocaleString() || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Instruções de Pagamento */}
        {showPaymentInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Instruções de Pagamento</h2>
                    <p className="text-green-100">Siga as instruções abaixo para completar seu pagamento</p>
                  </div>
                  <button
                    onClick={() => setShowPaymentInstructions(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Resumo do Pedido */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                    Resumo do Pedido
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Plano Selecionado</p>
                      <p className="font-bold text-gray-900">{selectedAmount?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valor Total</p>
                      <p className="font-bold text-green-600 text-xl">
                        {selectedAmount?.price.toLocaleString()} Kz
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Créditos</p>
                      <p className="font-bold text-gray-900">
                        {(selectedAmount?.credits + (selectedAmount?.bonus || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Referência</p>
                      <p className="font-mono font-bold text-indigo-600 text-sm">{paymentReference}</p>
                    </div>
                  </div>
                </div>

                {/* Dados Bancários */}
                <div className="border-2 border-green-200 rounded-xl p-6 mb-6 bg-green-50">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🏦 Dados Bancários para Transferência
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-300">
                      <p className="text-xs text-gray-600 mb-1">Banco</p>
                      <p className="font-bold text-gray-900 text-lg">Banco BAI</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-300">
                      <p className="text-xs text-gray-600 mb-1">Titular da Conta</p>
                      <p className="font-bold text-gray-900 text-lg">Ladislau Segunda Anastácio</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 mb-1">IBAN</p>
                          <p className="font-mono font-bold text-gray-900 text-lg">AO06.0040.0000.3514.1269.1010.8</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('AO06004000003514126910108');
                            alert('IBAN copiado!');
                          }}
                          className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                        >
                          📋 Copiar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instruções Passo a Passo */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📝 Passo a Passo
                  </h3>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <div>
                        <p className="font-semibold text-gray-900">Faça a transferência bancária</p>
                        <p className="text-sm text-gray-600">Use os dados bancários acima e transfira o valor de <strong>{selectedAmount?.price.toLocaleString()} Kz</strong></p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <div>
                        <p className="font-semibold text-gray-900">Guarde o comprovativo</p>
                        <p className="text-sm text-gray-600">Tire uma foto ou screenshot do comprovativo de transferência</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <div>
                        <p className="font-semibold text-gray-900">Envie o comprovativo</p>
                        <p className="text-sm text-gray-600 mb-2">Envie por WhatsApp ou Email com a referência <strong className="text-indigo-600">{paymentReference}</strong></p>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`https://wa.me/244923456789?text=Olá! Fiz uma transferência para o plano ${selectedAmount?.name}. Referência: ${paymentReference}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                          >
                            📱 Enviar via WhatsApp
                          </a>
                          <a
                            href={`mailto:pagamentos@kudimu.ao?subject=Comprovativo - ${paymentReference}&body=Segue em anexo o comprovativo de pagamento do plano ${selectedAmount?.name}.%0A%0AReferência: ${paymentReference}%0AValor: ${selectedAmount?.price.toLocaleString()} Kz`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                          >
                            ✉️ Enviar via Email
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <div>
                        <p className="font-semibold text-gray-900">Aguarde confirmação</p>
                        <p className="text-sm text-gray-600">Seus créditos serão adicionados em até <strong>24-48h úteis</strong> após confirmação</p>
                      </div>
                    </li>
                  </ol>
                </div>

                {/* Avisos Importantes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                    ⚠️ Importante
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Certifique-se de transferir o valor <strong>exato</strong> de {selectedAmount?.price.toLocaleString()} Kz</li>
                    <li>• Sempre inclua a referência <strong>{paymentReference}</strong> ao enviar o comprovativo</li>
                    <li>• Transferências são processadas apenas em dias úteis</li>
                    <li>• Você receberá confirmação por email quando os créditos forem adicionados</li>
                  </ul>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowPaymentInstructions(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handlePaymentConfirmation()}
                    disabled={processingPayment}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {processingPayment ? 'Registrando...' : '✓ Já Fiz a Transferência'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default CreditManagement;
