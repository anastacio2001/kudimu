import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  LanguageIcon,
  DocumentChartBarIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import ClientLayout from '../components/ClientLayout';
import { API_URL } from '../config/api';

/**
 * ClientServicesPage - Catálogo de Serviços Adicionais
 * 
 * Backend: GET /servicos (lista), POST /servicos/contratar (comprar)
 * Fonte: IMPLEMENTACAO_ITENS_2_3.md
 * 
 * Serviços disponíveis:
 * 1. Criação Assistida de Campanha
 * 2. Tradução de Campanha (PT-EN-FR)
 * 3. Relatório Visual Premium
 * 4. Consultoria Estatística
 * 5. Segmentação Avançada de Público
 * 6. Suporte Prioritário 24/7
 */

const ClientServicesPage = () => {
  const [services, setServices] = useState([]);
  const [saldoCreditos, setSaldoCreditos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasingService, setPurchasingService] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
    loadCredits();
  }, []);

  const loadServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/servicos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setServices(result.data || getDefaultServices());
      } else {
        setServices(getDefaultServices());
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setServices(getDefaultServices());
    } finally {
      setLoading(false);
    }
  };

  const loadCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/client/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success && result.data) {
        setSaldoCreditos(result.data.saldo_creditos || 0);
      }
    } catch (error) {
      console.error('Erro ao carregar créditos:', error);
    }
  };

  const getDefaultServices = () => [
    {
      id: 'criacao-assistida',
      nome: 'Criação Assistida de Campanha',
      descricao: 'Nossa equipe de especialistas cria sua campanha completa com perguntas otimizadas e público-alvo definido',
      preco: 5000,
      icone: 'sparkles',
      cor: 'purple',
      tempo_entrega: '24 horas',
      inclui: [
        'Análise de objetivo',
        '10-15 perguntas profissionais',
        'Definição de público-alvo',
        'Configuração de orçamento otimizado',
        '1 revisão gratuita'
      ]
    },
    {
      id: 'traducao',
      nome: 'Tradução de Campanha',
      descricao: 'Traduza sua campanha para Português, Inglês e Francês por tradutores nativos especializados em pesquisas',
      preco: 3000,
      icone: 'language',
      cor: 'blue',
      tempo_entrega: '48 horas',
      inclui: [
        'Tradução para 2 idiomas',
        'Revisão de contexto cultural',
        'Adaptação de expressões locais',
        'Garantia de qualidade'
      ]
    },
    {
      id: 'relatorio-visual',
      nome: 'Relatório Visual Premium',
      descricao: 'Relatório executivo em PDF com infográficos, gráficos avançados e insights acionáveis prontos para apresentação',
      preco: 2500,
      icone: 'chart',
      cor: 'green',
      tempo_entrega: '72 horas',
      inclui: [
        'Design profissional em PDF',
        'Até 20 páginas',
        'Gráficos interativos',
        'Resumo executivo',
        'Recomendações estratégicas'
      ]
    },
    {
      id: 'consultoria-estatistica',
      nome: 'Consultoria Estatística',
      descricao: 'Sessão de 1 hora com estatístico especialista para análise profunda dos seus dados',
      preco: 4000,
      icone: 'presentation',
      cor: 'orange',
      tempo_entrega: 'Agendamento flexível',
      inclui: [
        'Videochamada de 1 hora',
        'Análise de significância estatística',
        'Testes de hipóteses',
        'Relatório técnico pós-sessão',
        'Q&A ilimitado durante a sessão'
      ]
    },
    {
      id: 'segmentacao-avancada',
      nome: 'Segmentação Avançada',
      descricao: 'IA identifica micro-segmentos no seu público com comportamentos e preferências distintas',
      preco: 3500,
      icone: 'users',
      cor: 'pink',
      tempo_entrega: '24-48 horas',
      inclui: [
        'Análise de clustering com IA',
        'Até 5 personas detalhadas',
        'Recomendações de targeting',
        'Visualização de segmentos',
        'Exportação em Excel/CSV'
      ]
    },
    {
      id: 'suporte-prioritario',
      nome: 'Suporte Prioritário 24/7',
      descricao: 'Acesso prioritário ao suporte via WhatsApp, email e telefone com resposta em até 1 hora (válido por 30 dias)',
      preco: 6000,
      icone: 'academic',
      cor: 'red',
      tempo_entrega: 'Ativação imediata',
      inclui: [
        'Resposta em até 1 hora',
        'Atendimento 24/7',
        'Gerente de conta dedicado',
        'Suporte técnico avançado',
        'Válido por 30 dias'
      ]
    }
  ];

  const getIconComponent = (icone) => {
    const icons = {
      sparkles: SparklesIcon,
      language: LanguageIcon,
      chart: DocumentChartBarIcon,
      presentation: PresentationChartBarIcon,
      users: UserGroupIcon,
      academic: AcademicCapIcon
    };
    return icons[icone] || SparklesIcon;
  };

  const getColorClasses = (cor) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
      red: 'from-red-500 to-red-600'
    };
    return colors[cor] || colors.purple;
  };

  const handlePurchase = async (servico) => {
    if (saldoCreditos < servico.preco) {
      setNotification({
        type: 'error',
        message: 'Saldo insuficiente. Adicione créditos para contratar este serviço.'
      });
      setTimeout(() => navigate('/client/subscription'), 2000);
      return;
    }

    setPurchasingService(servico.id);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/servicos/contratar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          servico_id: servico.id,
          detalhes_adicionais: {}
        })
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          type: 'success',
          message: `Serviço "${servico.nome}" contratado com sucesso! Nossa equipe entrará em contato em breve.`
        });
        setSaldoCreditos(prev => prev - servico.preco);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Erro ao contratar serviço. Tente novamente.'
      });
    } finally {
      setPurchasingService(null);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Serviços Adicionais 🚀
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Potencialize suas campanhas com serviços profissionais especializados
          </p>
        </motion.div>

        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl ${
              notification.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5" />
              )}
              <p className="font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}

        {/* Saldo Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Seu Saldo Atual</p>
              <p className="text-4xl font-black">{saldoCreditos.toLocaleString('pt-AO')} Kz</p>
            </div>
            <button
              onClick={() => navigate('/client/subscription')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <CurrencyDollarIcon className="w-5 h-5" />
              Adicionar Créditos
            </button>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((servico, index) => {
            const IconComponent = getIconComponent(servico.icone);
            const colorClass = getColorClasses(servico.cor);
            const isPurchasing = purchasingService === servico.id;
            const canAfford = saldoCreditos >= servico.preco;

            return (
              <motion.div
                key={servico.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, shadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Header com gradiente */}
                <div className={`bg-gradient-to-r ${colorClass} p-6 text-white`}>
                  <IconComponent className="w-12 h-12 mb-3" />
                  <h3 className="text-xl font-bold mb-2">{servico.nome}</h3>
                  <p className="text-white/90 text-sm">{servico.descricao}</p>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Preço */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      {servico.preco.toLocaleString('pt-AO')}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">Kz</span>
                  </div>

                  {/* Tempo de entrega */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    <span>Entrega: {servico.tempo_entrega}</span>
                  </div>

                  {/* Inclusos */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">O que está incluído:</p>
                    <ul className="space-y-2">
                      {servico.inclui.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePurchase(servico)}
                    disabled={isPurchasing || !canAfford}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      !canAfford
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                        : `bg-gradient-to-r ${colorClass} text-white hover:shadow-lg`
                    }`}
                  >
                    {isPurchasing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Processando...
                      </>
                    ) : !canAfford ? (
                      <>
                        <CurrencyDollarIcon className="w-5 h-5" />
                        Saldo Insuficiente
                      </>
                    ) : (
                      <>
                        <ShoppingCartIcon className="w-5 h-5" />
                        Contratar Serviço
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ / Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Como Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-3">1</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Escolha o Serviço</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Selecione o serviço que melhor atende suas necessidades</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-3">2</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Contrate com 1 Clique</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Os créditos são debitados automaticamente do seu saldo</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-3">3</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Receba o Serviço</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">Nossa equipe entra em contato e entrega no prazo</p>
            </div>
          </div>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

export default ClientServicesPage;
