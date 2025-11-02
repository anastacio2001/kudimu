/**
 * Sistema de Pagamentos para Angola
 * Métodos de pagamento específicos de Angola
 */

// Métodos de pagamento disponíveis em Angola
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  UNITEL_MONEY: 'unitel_money',
  ZAP: 'zap',
  CARD_LOCAL: 'card_local',
  CASH: 'cash'
};

// Bancos principais de Angola
export const BANKS = {
  BAI: { code: 'BAI', name: 'Banco Angolano de Investimentos' },
  BFA: { code: 'BFA', name: 'Banco de Fomento Angola' },
  BIC: { code: 'BIC', name: 'Banco BIC' },
  BPC: { code: 'BPC', name: 'Banco de Poupança e Crédito' },
  STANDARD: { code: 'STANDARD', name: 'Standard Bank' },
  BAC: { code: 'BAC', name: 'Banco Angolano de Comércio' }
};

// Operadoras de dinheiro móvel
export const MOBILE_OPERATORS = {
  UNITEL: { code: 'UNITEL', name: 'Unitel Money' },
  ZAP: { code: 'ZAP', name: 'Zap' }
};

/**
 * Cria uma intenção de pagamento para Angola
 * @param {Object} paymentData - Dados do pagamento
 * @returns {Object} Resultado da criação da intenção
 */
export const createPaymentIntent = async (paymentData) => {
  const { amount, method, currency = 'AOA', metadata = {} } = paymentData;

  // Validação básica
  if (!amount || amount <= 0) {
    throw new Error('Valor do pagamento deve ser maior que zero');
  }

  if (!Object.values(PAYMENT_METHODS).includes(method)) {
    throw new Error('Método de pagamento não suportado');
  }

  // Gerar ID único para o pagamento
  const paymentId = generatePaymentId();
  
  const paymentIntent = {
    id: paymentId,
    amount: amount,
    currency: currency,
    method: method,
    status: 'pending',
    created_at: new Date().toISOString(),
    metadata: metadata,
    reference: generatePaymentReference(method)
  };

  // Adicionar dados específicos por método
  switch (method) {
    case PAYMENT_METHODS.BANK_TRANSFER:
      paymentIntent.bank_details = generateBankTransferDetails(amount);
      break;
    case PAYMENT_METHODS.UNITEL_MONEY:
      paymentIntent.mobile_details = generateMobilePaymentDetails('UNITEL', amount);
      break;
    case PAYMENT_METHODS.ZAP:
      paymentIntent.mobile_details = generateMobilePaymentDetails('ZAP', amount);
      break;
    case PAYMENT_METHODS.CARD_LOCAL:
      paymentIntent.card_details = { requires_confirmation: true };
      break;
    case PAYMENT_METHODS.CASH:
      paymentIntent.cash_details = generateCashPaymentDetails();
      break;
  }

  return paymentIntent;
};

/**
 * Confirma um pagamento
 * @param {string} paymentId - ID do pagamento
 * @param {Object} confirmationData - Dados de confirmação
 * @returns {Object} Status da confirmação
 */
export const confirmPayment = async (paymentId, confirmationData = {}) => {
  if (!paymentId) {
    throw new Error('ID do pagamento é obrigatório');
  }

  // Simular confirmação de pagamento
  const confirmation = {
    id: paymentId,
    status: 'confirmed',
    confirmed_at: new Date().toISOString(),
    transaction_id: generateTransactionId(),
    confirmation_data: confirmationData
  };

  return confirmation;
};

/**
 * Verifica o status de um pagamento
 * @param {string} paymentId - ID do pagamento
 * @returns {Object} Status do pagamento
 */
export const getPaymentStatus = async (paymentId) => {
  if (!paymentId) {
    throw new Error('ID do pagamento é obrigatório');
  }

  // Simular consulta de status
  return {
    id: paymentId,
    status: 'pending',
    last_updated: new Date().toISOString()
  };
};

/**
 * Cancela um pagamento
 * @param {string} paymentId - ID do pagamento
 * @returns {Object} Confirmação do cancelamento
 */
export const cancelPayment = async (paymentId) => {
  if (!paymentId) {
    throw new Error('ID do pagamento é obrigatório');
  }

  return {
    id: paymentId,
    status: 'cancelled',
    cancelled_at: new Date().toISOString()
  };
};

/**
 * Processa reembolso
 * @param {string} paymentId - ID do pagamento
 * @param {number} amount - Valor a reembolsar
 * @returns {Object} Dados do reembolso
 */
export const processRefund = async (paymentId, amount = null) => {
  if (!paymentId) {
    throw new Error('ID do pagamento é obrigatório');
  }

  return {
    id: generatePaymentId(),
    payment_id: paymentId,
    amount: amount,
    status: 'processing',
    created_at: new Date().toISOString()
  };
};

/**
 * Valida dados de pagamento
 * @param {Object} paymentData - Dados a validar
 * @returns {Object} Resultado da validação
 */
export const validatePaymentData = (paymentData) => {
  const errors = [];

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Valor deve ser maior que zero');
  }

  if (!paymentData.method) {
    errors.push('Método de pagamento é obrigatório');
  }

  if (paymentData.method && !Object.values(PAYMENT_METHODS).includes(paymentData.method)) {
    errors.push('Método de pagamento inválido');
  }

  // Validações específicas por método
  if (paymentData.method === PAYMENT_METHODS.BANK_TRANSFER && !paymentData.bank_code) {
    errors.push('Código do banco é obrigatório para transferência bancária');
  }

  if ((paymentData.method === PAYMENT_METHODS.UNITEL_MONEY || paymentData.method === PAYMENT_METHODS.ZAP) 
      && !paymentData.phone_number) {
    errors.push('Número de telefone é obrigatório para dinheiro móvel');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Funções auxiliares privadas
const generatePaymentId = () => {
  return 'pay_' + Date.now() + Math.random().toString(36).substr(2, 9);
};

const generateTransactionId = () => {
  return 'txn_' + Date.now() + Math.random().toString(36).substr(2, 9);
};

const generatePaymentReference = (method) => {
  const prefix = method.toUpperCase().substr(0, 3);
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

const generateBankTransferDetails = (amount) => {
  return {
    account_number: '0000123456789',
    account_name: 'KUDIMU PLATFORM LDA',
    bank_name: 'Banco Angolano de Investimentos',
    bank_code: 'BAI',
    reference: generatePaymentReference('BANK'),
    instructions: `Transferir ${amount} AOA para a conta indicada usando a referência fornecida`
  };
};

const generateMobilePaymentDetails = (operator, amount) => {
  const operatorData = operator === 'UNITEL' ? 
    { number: '+244 923 456 789', name: 'Unitel Money' } :
    { number: '+244 936 123 456', name: 'Zap' };

  return {
    operator: operatorData.name,
    number: operatorData.number,
    reference: generatePaymentReference(operator),
    instructions: `Enviar ${amount} AOA para o número ${operatorData.number} com a referência fornecida`
  };
};

const generateCashPaymentDetails = () => {
  return {
    locations: [
      'Loja Kudimu - Luanda, Ilha do Cabo',
      'Agente Kudimu - Talatona, Condomínio Kikuxi'
    ],
    instructions: 'Apresente este código em um dos locais indicados para efetuar o pagamento'
  };
};