import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  DevicePhoneMobileIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Métodos de pagamento disponíveis em Angola
const PAYMENT_METHODS = [
  {
    id: 'bank_transfer',
    name: 'Transferência Bancária',
    description: 'Pagar via transferência bancária',
    icon: BanknotesIcon,
    color: 'blue',
    processing_time: '1-2 dias úteis'
  },
  {
    id: 'unitel_money',
    name: 'Unitel Money',
    description: 'Pagar com Unitel Money',
    icon: DevicePhoneMobileIcon,
    color: 'red',
    processing_time: 'Instantâneo'
  },
  {
    id: 'zap',
    name: 'Zap',
    description: 'Pagar com Zap',
    icon: DevicePhoneMobileIcon,
    color: 'yellow',
    processing_time: 'Instantâneo'
  },
  {
    id: 'card_local',
    name: 'Cartão de Crédito/Débito',
    description: 'Cartões emitidos em Angola',
    icon: CreditCardIcon,
    color: 'green',
    processing_time: 'Instantâneo'
  },
  {
    id: 'cash',
    name: 'Pagamento Presencial',
    description: 'Pagar em pontos físicos',
    icon: MapPinIcon,
    color: 'purple',
    processing_time: 'Durante horário comercial'
  }
];

const AngolaPaymentForm = ({ 
  amount, 
  currency = 'AOA', 
  campaignId, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentData, setPaymentData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [step, setStep] = useState('select'); // select, details, confirm, result

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setStep('details');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Criar intenção de pagamento
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          currency: currency,
          method: selectedMethod.id,
          campaign_id: campaignId,
          ...paymentData
        })
      });

      const result = await response.json();

      if (result.success) {
        setPaymentResult(result.data);
        setStep('confirm');
        
        // Chamar callback de sucesso se fornecido
        if (onPaymentSuccess) {
          onPaymentSuccess(result.data);
        }
      } else {
        throw new Error(result.error || 'Erro ao processar pagamento');
      }
    } catch (error) {
      console.error('Payment error:', error);
      if (onPaymentError) {
        onPaymentError(error);
      }
      setPaymentResult({ error: error.message });
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentDetails = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod.id) {
      case 'bank_transfer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={paymentData.bank_code || ''}
                onChange={(e) => setPaymentData({...paymentData, bank_code: e.target.value})}
                required
              >
                <option value="">Selecione seu banco</option>
                <option value="BAI">Banco Angolano de Investimentos (BAI)</option>
                <option value="BFA">Banco de Fomento Angola (BFA)</option>
                <option value="BIC">Banco BIC</option>
                <option value="BPC">Banco de Poupança e Crédito (BPC)</option>
                <option value="STANDARD">Standard Bank</option>
                <option value="BAC">Banco Angolano de Comércio (BAC)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do titular da conta
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={paymentData.account_holder || ''}
                onChange={(e) => setPaymentData({...paymentData, account_holder: e.target.value})}
                required
              />
            </div>
          </div>
        );

      case 'unitel_money':
      case 'zap':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de telefone
              </label>
              <input
                type="tel"
                placeholder="+244 9XX XXX XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={paymentData.phone_number || ''}
                onChange={(e) => setPaymentData({...paymentData, phone_number: e.target.value})}
                required
              />
            </div>
          </div>
        );

      case 'card_local':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do cartão
                </label>
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={paymentData.card_number || ''}
                  onChange={(e) => setPaymentData({...paymentData, card_number: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de validade
                </label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={paymentData.expiry || ''}
                  onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome no cartão
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={paymentData.card_holder || ''}
                onChange={(e) => setPaymentData({...paymentData, card_holder: e.target.value})}
                required
              />
            </div>
          </div>
        );

      case 'cash':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Locais de pagamento:</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Loja Kudimu - Luanda, Ilha do Cabo</li>
                <li>• Agente Kudimu - Talatona, Condomínio Kikuxi</li>
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={paymentData.customer_name || ''}
                onChange={(e) => setPaymentData({...paymentData, customer_name: e.target.value})}
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderConfirmation = () => {
    if (!paymentResult) return null;

    return (
      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="font-medium text-green-900">Pagamento criado com sucesso!</h3>
          </div>
          <p className="text-sm text-green-700">
            Siga as instruções abaixo para completar o pagamento.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium mb-4">Detalhes do pagamento:</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID do pagamento:</span>
              <span className="font-mono">{paymentResult.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Valor:</span>
              <span className="font-semibold">{formatAmount(paymentResult.amount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Método:</span>
              <span>{selectedMethod.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Referência:</span>
              <span className="font-mono font-semibold text-blue-600">{paymentResult.reference}</span>
            </div>
          </div>
        </div>

        {/* Instruções específicas por método */}
        {paymentResult.bank_details && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Instruções para transferência:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Conta:</strong> {paymentResult.bank_details.account_number}</p>
              <p><strong>Titular:</strong> {paymentResult.bank_details.account_name}</p>
              <p><strong>Banco:</strong> {paymentResult.bank_details.bank_name}</p>
              <p><strong>Referência:</strong> {paymentResult.reference}</p>
            </div>
          </div>
        )}

        {paymentResult.mobile_details && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Instruções para dinheiro móvel:</h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p><strong>Enviar para:</strong> {paymentResult.mobile_details.number}</p>
              <p><strong>Operadora:</strong> {paymentResult.mobile_details.operator}</p>
              <p><strong>Valor:</strong> {formatAmount(paymentResult.amount)}</p>
              <p><strong>Referência:</strong> {paymentResult.reference}</p>
            </div>
          </div>
        )}

        {paymentResult.cash_details && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Instruções para pagamento presencial:</h4>
            <div className="text-sm text-purple-800 space-y-2">
              <p><strong>Referência:</strong> {paymentResult.reference}</p>
              <div>
                <p className="font-medium">Locais disponíveis:</p>
                <ul className="list-disc list-inside mt-1">
                  {paymentResult.cash_details.locations.map((location, index) => (
                    <li key={index}>{location}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (step === 'select') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Escolha o método de pagamento
          </h2>
          <p className="text-lg text-gray-600">
            Valor: <span className="font-semibold text-blue-600">{formatAmount(amount)}</span>
          </p>
        </div>

        <div className="grid gap-4">
          {PAYMENT_METHODS.map((method) => {
            const IconComponent = method.icon;
            return (
              <motion.div
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-${method.color}-500 transition-colors`}
                onClick={() => handleMethodSelect(method)}
              >
                <div className="flex items-center">
                  <div className={`p-2 bg-${method.color}-100 rounded-lg mr-4`}>
                    <IconComponent className={`h-6 w-6 text-${method.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Processamento: {method.processing_time}
                    </p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedMethod.name}
          </h2>
          <p className="text-lg text-gray-600">
            Valor: <span className="font-semibold text-blue-600">{formatAmount(amount)}</span>
          </p>
        </div>

        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          {renderPaymentDetails()}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('select')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? 'Processando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="max-w-2xl mx-auto">
        {renderConfirmation()}
        
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setStep('select');
              setSelectedMethod(null);
              setPaymentData({});
              setPaymentResult(null);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Fazer outro pagamento
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AngolaPaymentForm;