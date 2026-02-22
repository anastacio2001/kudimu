import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BanknotesIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

/**
 * BalanceCard - Card de saldo detalhado que explica:
 * - Saldo Total (histórico de ganhos)
 * - Saldo Disponível (pode resgatar agora)
 * - Saldo Bloqueado (em validação)
 * 
 * Soluciona confusão entre diferentes tipos de saldo
 */
const BalanceCard = ({ userData, className = '' }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Cálculos de saldo (mock - backend deve fornecer isso)
  const saldoTotal = userData?.saldo_pontos || 0; // Total histórico
  const pontosEmValidacao = userData?.pontos_pendentes || 0; // Em validação
  const saldoDisponivel = saldoTotal - pontosEmValidacao; // Líquido para saque

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl overflow-hidden ${className}`}
    >
      {/* Header Principal - Saldo Disponível (mais importante) */}
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BanknotesIcon className="w-6 h-6" />
            <span className="text-green-100 text-sm font-medium">Saldo Disponível</span>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <InformationCircleIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Valor Principal */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          <div className="text-5xl font-black mb-1">
            {saldoDisponivel.toLocaleString('pt-AO', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} <span className="text-3xl">Kz</span>
          </div>
          <p className="text-green-100 text-sm">Pronto para resgate</p>
        </motion.div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Histórico */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircleIcon className="w-4 h-4 text-green-200" />
              <span className="text-xs text-green-100">Total Ganho</span>
            </div>
            <div className="text-xl font-bold">
              {saldoTotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} <span className="text-xs">Kz</span>
            </div>
          </div>

          {/* Em Validação */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="w-4 h-4 text-amber-300" />
              <span className="text-xs text-green-100">Em Validação</span>
            </div>
            <div className="text-xl font-bold">
              {pontosEmValidacao.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} <span className="text-xs">Kz</span>
            </div>
          </div>
        </div>

        {/* Botão Expandir Detalhes */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
        >
          <span>{showDetails ? 'Ocultar' : 'Ver'} Detalhes</span>
          <motion.div
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDownIcon className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* Painel de Detalhes Expandível */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                Como Funciona o Saldo
              </h4>

              {/* Explicação: Saldo Total */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Saldo Total</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Soma de <strong>todos os pontos que já ganhou</strong> desde que se registrou. Este valor <strong>nunca diminui</strong> - é seu histórico de conquistas!
                    </p>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-2 border border-blue-300 dark:border-blue-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Seu Total Histórico</div>
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {saldoTotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explicação: Saldo Disponível */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <BanknotesIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Saldo Disponível</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Pontos que <strong>pode resgatar agora</strong> via M-Pesa, banco ou outros métodos. Só inclui campanhas <strong>validadas e aprovadas</strong>.
                    </p>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-2 border border-green-300 dark:border-green-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Pronto para Saque</div>
                      <div className="text-2xl font-black text-green-600 dark:text-green-400">
                        {saldoDisponivel.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explicação: Saldo Bloqueado */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                    <LockClosedIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Saldo em Validação</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Pontos de campanhas que <strong>ainda estão sendo validadas</strong> pela equipa ou clientes. Geralmente liberado em <strong>24-48 horas</strong>.
                    </p>
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-2 border border-amber-300 dark:border-amber-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Aguardando Aprovação</div>
                      <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                        {pontosEmValidacao.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fórmula Visual */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 border border-gray-300 dark:border-gray-700">
                <h5 className="font-bold text-gray-900 dark:text-white mb-3 text-center">💡 Fórmula Simples</h5>
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <div className="bg-blue-100 dark:bg-blue-900/50 px-3 py-2 rounded-lg text-blue-900 dark:text-blue-300">
                    Saldo Total
                  </div>
                  <span className="text-gray-500">−</span>
                  <div className="bg-amber-100 dark:bg-amber-900/50 px-3 py-2 rounded-lg text-amber-900 dark:text-amber-300">
                    Em Validação
                  </div>
                  <span className="text-gray-500">=</span>
                  <div className="bg-green-100 dark:bg-green-900/50 px-3 py-2 rounded-lg text-green-900 dark:text-green-300 font-bold">
                    Disponível
                  </div>
                </div>
                <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-3">
                  {saldoTotal.toFixed(2)} − {pontosEmValidacao.toFixed(2)} = <strong>{saldoDisponivel.toFixed(2)} Kz</strong>
                </p>
              </div>

              {/* Dica Final */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                <div className="flex gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Dica</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Complete mais campanhas para aumentar seu <strong>Saldo Total</strong>. Respostas de qualidade são validadas mais rápido, liberando seu <strong>Saldo Disponível</strong> mais cedo!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BalanceCard;
