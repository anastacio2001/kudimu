import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BuildingOffice2Icon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import ClientLayout from '../components/ClientLayout';
import { API_URL } from '../config/api';

const ClientPlanUpgrade = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPlansAndSubscription();
  }, []);

  const loadPlansAndSubscription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Carregar planos disponíveis
      const plansResponse = await fetch(`${API_URL}/planos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const plansResult = await plansResponse.json();
      
      if (plansResult.success) {
        setPlans(plansResult.data);
      }

      // Carregar assinatura atual
      const subResponse = await fetch(`${API_URL}/client/assinatura`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const subResult = await subResponse.json();
      
      if (subResult.success) {
        setCurrentSubscription(subResult.data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const handleConfirmUpgrade = () => {
    // Redirecionar para página de pagamento com plano selecionado
    navigate('/client/budget', {
      state: {
        selectedPlan: selectedPlan,
        action: 'upgrade'
      }
    });
  };

  const getPlanoIcon = (planoNome) => {
    const icons = {
      'Starter': SparklesIcon,
      'Growth': RocketLaunchIcon,
      'Enterprise': BuildingOffice2Icon
    };
    return icons[planoNome] || SparklesIcon;
  };

  const isCurrentPlan = (planId) => {
    return currentSubscription?.plano?.id === planId;
  };

  const canUpgrade = (plan) => {
    if (!currentSubscription) return true;
    const currentPrice = currentSubscription.plano?.preco_mensal || 0;
    return plan.preco_mensal > currentPrice;
  };

  const canDowngrade = (plan) => {
    if (!currentSubscription) return false;
    const currentPrice = currentSubscription.plano?.preco_mensal || 0;
    return plan.preco_mensal < currentPrice;
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

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Desbloqueie todo o potencial da plataforma com recursos avançados
          </p>
        </div>

        {/* Current Plan Badge */}
        {currentSubscription && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center"
          >
            <p className="text-purple-900 dark:text-purple-300">
              Plano Atual: <strong>{currentSubscription.plano?.nome}</strong>
              {' '}•{' '}
              {currentSubscription.plano?.preco_mensal?.toLocaleString('pt-AO', {
                style: 'currency',
                currency: 'AOA'
              })}/mês
            </p>
          </motion.div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const PlanIcon = getPlanoIcon(plan.nome);
            const isCurrent = isCurrentPlan(plan.id);
            const canUp = canUpgrade(plan);
            const canDown = canDowngrade(plan);
            const features = typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${
                  plan.nome === 'Growth' ? 'ring-2 ring-purple-600 transform scale-105' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.nome === 'Growth' && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold">
                    Mais Popular
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute top-0 left-0 bg-green-600 text-white px-4 py-1 text-sm font-semibold">
                    Plano Atual
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Name */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <PlanIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.nome}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 min-h-[3rem]">
                    {plan.descricao}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.preco_mensal.toLocaleString('pt-AO', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </span>
                      <span className="text-xl text-gray-600 dark:text-gray-400 ml-2">
                        AOA/mês
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {features.campanhas_mensais === -1 ? 'Campanhas ilimitadas' : `${features.campanhas_mensais} campanhas/mês`}
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {features.respostas_por_campanha === -1 ? 'Respostas ilimitadas' : `${features.respostas_por_campanha} respostas/campanha`}
                      </span>
                    </li>
                    {features.ai_insights && (
                      <li className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          AI Insights avançados
                        </span>
                      </li>
                    )}
                    {features.exportacao_dados && (
                      <li className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          Exportação de dados
                        </span>
                      </li>
                    )}
                    {features.suporte_prioritario && (
                      <li className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          Suporte prioritário
                        </span>
                      </li>
                    )}
                    {features.api_acesso && (
                      <li className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          Acesso completo à API
                        </span>
                      </li>
                    )}
                    {features.white_label && (
                      <li className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          White Label (sem marca Kudimu)
                        </span>
                      </li>
                    )}
                    {features.gestor_conta_dedicado && (
                      <li className="flex items-start space-x-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          Gestor de conta dedicado
                        </span>
                      </li>
                    )}
                  </ul>

                  {/* CTA Button */}
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Plano Atual
                    </button>
                  ) : canUp ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
                        plan.nome === 'Growth'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      <span>Fazer Upgrade</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </motion.button>
                  ) : canDown ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
                    >
                      Fazer Downgrade
                    </motion.button>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8"
            >
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  {React.createElement(getPlanoIcon(selectedPlan.nome), {
                    className: "h-8 w-8 text-purple-600 dark:text-purple-400"
                  })}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Confirmar Mudança de Plano
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Você está prestes a mudar para o plano <strong>{selectedPlan.nome}</strong>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Plano:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedPlan.nome}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Valor mensal:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedPlan.preco_mensal.toLocaleString('pt-AO', {
                      style: 'currency',
                      currency: 'AOA'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setSelectedPlan(null);
                  }}
                  className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmUpgrade}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientPlanUpgrade;
