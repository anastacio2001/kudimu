import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';

export default function AddCreditsModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('express_payment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const presetAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

  const paymentMethods = [
    { id: 'express_payment', name: 'Express Payment', logo: '💳' },
    { id: 'multicaixa', name: 'Multicaixa Express', logo: '🏦' },
    { id: 'transferencia', name: 'Transferência Bancária', logo: '🏧' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const amountValue = parseFloat(amount);
    
    if (!amountValue || amountValue <= 0) {
      setError('Por favor, insira um valor válido');
      setLoading(false);
      return;
    }

    if (amountValue < 1000) {
      setError('O valor mínimo é 1.000 Kz');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/client/budget/add-credits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountValue,
          payment_method: paymentMethod,
          transaction_id: `TXN${Date.now()}`
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess(result.data);
          handleClose();
        }, 2000);
      } else {
        setError(result.error || 'Erro ao processar pagamento');
      }
    } catch (err) {
      console.error('Erro ao adicionar créditos:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setPaymentMethod('express_payment');
    setError('');
    setSuccess(false);
    onClose();
  };

  const selectPresetAmount = (value) => {
    setAmount(value.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Adicionar Créditos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Recarregue sua conta para criar mais campanhas
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {success ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Pagamento Processado!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seus créditos foram adicionados com sucesso
              </p>
            </motion.div>
          ) : (
            <>
              {/* Valores Rápidos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Valores Rápidos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectPresetAmount(value)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        amount === value.toString()
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
                      }`}
                    >
                      <div className="text-sm font-semibold">
                        {(value / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Kz
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Valor Personalizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <BanknotesIcon className="h-4 w-4 inline mr-1" />
                  Valor Personalizado (Kz)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite o valor em Kwanzas"
                  min="1000"
                  step="1000"
                  required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Valor mínimo: 1.000 Kz
                </p>
              </div>

              {/* Método de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <CreditCardIcon className="h-4 w-4 inline mr-1" />
                  Método de Pagamento
                </label>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-2xl mr-3">{method.logo}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {method.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Resumo */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Valor a adicionar:</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {parseFloat(amount).toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Método:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {paymentMethods.find(m => m.id === paymentMethod)?.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={loading || !amount || parseFloat(amount) < 1000}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      <BanknotesIcon className="h-5 w-5 mr-2" />
                      Adicionar Créditos
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Info Footer */}
        {!success && (
          <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              💡 <strong>Nota:</strong> Os créditos são utilizados para financiar as recompensas das suas campanhas. 
              1 Crédito = 1 Kwanza (Kz).
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
