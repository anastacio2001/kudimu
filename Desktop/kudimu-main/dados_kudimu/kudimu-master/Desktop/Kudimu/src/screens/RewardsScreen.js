import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RewardsScreen.css';

// Detectar se estamos em desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

const WITHDRAWAL_METHODS = {
  banco: {
    id: 'banco',
    name: 'Transferência Bancária',
    icon: '🏦',
    minAmount: 2000,
    fields: ['banco', 'numeroConta', 'titular']
  },
  unitel: {
    id: 'unitel',
    name: 'Dados Móveis Unitel',
    icon: '📱',
    minAmount: 500,
    fields: ['numeroTelefone']
  },
  movicel: {
    id: 'movicel',
    name: 'Dados Móveis Movicel',
    icon: '📲',
    minAmount: 500,
    fields: ['numeroTelefone']
  },
  ekwanza: {
    id: 'ekwanza',
    name: 'e-Kwanza',
    icon: '💳',
    minAmount: 1000,
    fields: ['contaEKwanza']
  },
  paypay: {
    id: 'paypay',
    name: 'PayPay',
    icon: '💸',
    minAmount: 1000,
    fields: ['contaPayPay']
  }
};

const BANCOS_ANGOLA = [
  'BAI - Banco Angolano de Investimentos',
  'BFA - Banco de Fomento Angola',
  'BCI - Banco de Comércio e Indústria',
  'Banco Económico',
  'Banco Sol',
  'BDA - Banco de Desenvolvimento de Angola',
  'Banco Keve',
  'Banco Millennium Atlântico',
  'Standard Bank Angola',
  'BNI - Banco de Negócios Internacional'
];

export default function RewardsScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State para dados
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [statistics, setStatistics] = useState({
    totalEarned: 0,
    totalWithdrawn: 0,
    pendingAmount: 0
  });

  // State para formulário de saque
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // State para modal de sucesso
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    fetchRewardsData();
  }, []);

  const fetchRewardsData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar histórico de recompensas
      const rewardsResponse = await fetch(`${API_URL}/rewards/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (rewardsResponse.ok) {
        const rewardsData = await rewardsResponse.json();
        if (rewardsData.success) {
          const data = rewardsData.data;
          
          // Calcular saldo (total ganho - total sacado)
          const totalEarned = data.reduce((sum, r) => 
            r.tipo === 'ganho' ? sum + r.valor : sum, 0
          );
          const totalWithdrawn = data.reduce((sum, r) => 
            r.tipo === 'saque' && r.status === 'completado' ? sum + r.valor : sum, 0
          );
          const pendingAmount = data.reduce((sum, r) => 
            r.tipo === 'saque' && r.status === 'pendente' ? sum + r.valor : sum, 0
          );
          
          setBalance(totalEarned - totalWithdrawn - pendingAmount);
          setStatistics({
            totalEarned,
            totalWithdrawn,
            pendingAmount
          });

          // Separar transações e saques pendentes
          const allTransactions = data.map(r => ({
            id: r.id,
            date: r.data_criacao,
            type: r.tipo === 'ganho' ? 'Ganho de Campanha' : `Saque - ${r.metodo_pagamento || 'N/A'}`,
            amount: r.valor,
            status: r.status,
            isWithdrawal: r.tipo === 'saque'
          })).sort((a, b) => new Date(b.date) - new Date(a.date));

          setTransactions(allTransactions);

          const pending = data
            .filter(r => r.tipo === 'saque' && r.status === 'pendente')
            .map(r => ({
              id: r.id,
              method: r.metodo_pagamento,
              amount: r.valor,
              date: r.data_criacao,
              status: r.status
            }));
          
          setPendingWithdrawals(pending);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar recompensas:', err);
      setError('Erro ao carregar dados de recompensas');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setFormData({});
    setFormErrors({});
    setWithdrawalAmount('');
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Limpar erro do campo quando usuário digita
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    const method = WITHDRAWAL_METHODS[selectedMethod];
    const amount = parseFloat(withdrawalAmount);

    // Validar valor
    if (!withdrawalAmount || amount <= 0) {
      errors.amount = 'Digite um valor válido';
    } else if (amount < method.minAmount) {
      errors.amount = `Valor mínimo: ${method.minAmount} AOA`;
    } else if (amount > balance) {
      errors.amount = `Saldo insuficiente. Disponível: ${balance.toFixed(2)} AOA`;
    }

    // Validar campos específicos do método
    method.fields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = 'Campo obrigatório';
      }
    });

    // Validações específicas
    if (formData.numeroTelefone) {
      const phoneRegex = /^[9][0-9]{8}$/;
      if (!phoneRegex.test(formData.numeroTelefone.replace(/\s/g, ''))) {
        errors.numeroTelefone = 'Número inválido (formato: 9XXXXXXXX)';
      }
    }

    if (formData.numeroConta) {
      if (formData.numeroConta.length < 10) {
        errors.numeroConta = 'Número de conta inválido';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitWithdrawal = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const method = WITHDRAWAL_METHODS[selectedMethod];
      
      const payload = {
        valor: parseFloat(withdrawalAmount),
        metodo_pagamento: method.name,
        detalhes: formData
      };

      const response = await fetch(`${API_URL}/payments/withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        // Mostrar modal de sucesso
        setShowSuccessModal(true);
        
        // Resetar formulário
        setSelectedMethod(null);
        setWithdrawalAmount('');
        setFormData({});
        
        // Recarregar dados
        await fetchRewardsData();
      } else {
        setFormErrors({ submit: data.error || 'Erro ao processar saque' });
      }
    } catch (err) {
      console.error('Erro ao solicitar saque:', err);
      setFormErrors({ submit: 'Erro ao conectar com o servidor' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return (
      <div className="rewards-screen">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando suas recompensas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rewards-screen">
        <div className="rewards-container">
          <div className="error-container">
            <h2>Erro</h2>
            <p>{error}</p>
            <button onClick={fetchRewardsData} className="retry-button">
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rewards-screen">
      <div className="rewards-container">
        <header className="rewards-header">
          <h1>💰 Minhas Recompensas</h1>
          <p>Gerencie seus ganhos e solicite saques</p>
        </header>

        {/* Card de Saldo */}
        <div className="balance-card">
          <div className="balance-label">Saldo Disponível</div>
          <div className="balance-amount">{formatCurrency(balance)}</div>
          <div className="balance-currency">AOA (Kwanzas Angolanos)</div>
          
          <div className="balance-actions">
            <button 
              className="withdraw-button"
              onClick={() => document.getElementById('withdrawal-section')?.scrollIntoView({ behavior: 'smooth' })}
              disabled={balance < 500}
            >
              💸 Solicitar Saque
            </button>
            <button 
              className="history-button"
              onClick={() => navigate('/history')}
            >
              📊 Ver Histórico
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💵</div>
            <div className="stat-label">Total Ganho</div>
            <div className="stat-value">{formatCurrency(statistics.totalEarned)} AOA</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💸</div>
            <div className="stat-label">Total Sacado</div>
            <div className="stat-value">{formatCurrency(statistics.totalWithdrawn)} AOA</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-label">Pendente</div>
            <div className="stat-value">{formatCurrency(statistics.pendingAmount)} AOA</div>
          </div>
        </div>

        {/* Saques Pendentes */}
        {pendingWithdrawals.length > 0 && (
          <div className="pending-withdrawals">
            <h2 className="card-title">⏳ Saques Pendentes</h2>
            <div className="pending-list">
              {pendingWithdrawals.map(withdrawal => (
                <div key={withdrawal.id} className="pending-item">
                  <div className="pending-info">
                    <div className="pending-method">{withdrawal.method}</div>
                    <div className="pending-date">Solicitado em {formatDate(withdrawal.date)}</div>
                  </div>
                  <div className="pending-amount">{formatCurrency(withdrawal.amount)} AOA</div>
                  <div className="pending-status-badge">Em Análise</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid Principal */}
        <div className="rewards-grid">
          {/* Opções de Saque */}
          <div id="withdrawal-section" className="withdrawal-options-card">
            <h2 className="card-title">💳 Solicitar Saque</h2>
            
            <div className="withdrawal-methods">
              {Object.values(WITHDRAWAL_METHODS).map(method => (
                <div
                  key={method.id}
                  className={`method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-name">{method.name}</div>
                  <div className="method-min">Mín: {method.minAmount} AOA</div>
                </div>
              ))}
            </div>

            {/* Formulário de Saque */}
            {selectedMethod && (
              <form className="withdrawal-form" onSubmit={handleSubmitWithdrawal}>
                <div className="form-group">
                  <label className="form-label">Valor do Saque</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Digite o valor"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    min={WITHDRAWAL_METHODS[selectedMethod].minAmount}
                    max={balance}
                  />
                  {formErrors.amount && <div className="form-error">{formErrors.amount}</div>}
                  <div className="form-hint">
                    Mínimo: {WITHDRAWAL_METHODS[selectedMethod].minAmount} AOA | 
                    Disponível: {formatCurrency(balance)} AOA
                  </div>
                </div>

                {/* Campos específicos por método */}
                {selectedMethod === 'banco' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Banco</label>
                      <select
                        className="form-select"
                        value={formData.banco || ''}
                        onChange={(e) => handleFormChange('banco', e.target.value)}
                      >
                        <option value="">Selecione o banco</option>
                        {BANCOS_ANGOLA.map(banco => (
                          <option key={banco} value={banco}>{banco}</option>
                        ))}
                      </select>
                      {formErrors.banco && <div className="form-error">{formErrors.banco}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Número da Conta</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="000000000000"
                        value={formData.numeroConta || ''}
                        onChange={(e) => handleFormChange('numeroConta', e.target.value)}
                      />
                      {formErrors.numeroConta && <div className="form-error">{formErrors.numeroConta}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Titular da Conta</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Nome completo"
                        value={formData.titular || ''}
                        onChange={(e) => handleFormChange('titular', e.target.value)}
                      />
                      {formErrors.titular && <div className="form-error">{formErrors.titular}</div>}
                    </div>
                  </>
                )}

                {(selectedMethod === 'unitel' || selectedMethod === 'movicel') && (
                  <div className="form-group">
                    <label className="form-label">Número de Telefone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="9XXXXXXXX"
                      value={formData.numeroTelefone || ''}
                      onChange={(e) => handleFormChange('numeroTelefone', e.target.value)}
                    />
                    {formErrors.numeroTelefone && <div className="form-error">{formErrors.numeroTelefone}</div>}
                    <div className="form-hint">Formato: 9XXXXXXXX (9 dígitos)</div>
                  </div>
                )}

                {selectedMethod === 'ekwanza' && (
                  <div className="form-group">
                    <label className="form-label">Conta e-Kwanza</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Número da conta e-Kwanza"
                      value={formData.contaEKwanza || ''}
                      onChange={(e) => handleFormChange('contaEKwanza', e.target.value)}
                    />
                    {formErrors.contaEKwanza && <div className="form-error">{formErrors.contaEKwanza}</div>}
                  </div>
                )}

                {selectedMethod === 'paypay' && (
                  <div className="form-group">
                    <label className="form-label">Conta PayPay</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Número da conta PayPay"
                      value={formData.contaPayPay || ''}
                      onChange={(e) => handleFormChange('contaPayPay', e.target.value)}
                    />
                    {formErrors.contaPayPay && <div className="form-error">{formErrors.contaPayPay}</div>}
                  </div>
                )}

                {formErrors.submit && <div className="form-error">{formErrors.submit}</div>}

                <button 
                  type="submit" 
                  className="submit-withdrawal-button"
                  disabled={submitting}
                >
                  {submitting ? 'Processando...' : 'Confirmar Saque'}
                </button>
              </form>
            )}
          </div>

          {/* Evolução Mensal (placeholder) */}
          <div className="evolution-chart-card">
            <h2 className="card-title">📈 Evolução Mensal</h2>
            <div className="chart-placeholder">
              📊 Gráfico será implementado com Chart.js
            </div>
          </div>
        </div>

        {/* Histórico de Transações */}
        <div className="transactions-card">
          <h2 className="card-title">📜 Histórico de Transações</h2>
          
          {transactions.length === 0 ? (
            <div className="empty-transactions">
              <div className="empty-transactions-icon">💸</div>
              <p>Você ainda não possui transações</p>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map(transaction => (
                  <tr key={transaction.id}>
                    <td className="transaction-date">{formatDate(transaction.date)}</td>
                    <td className="transaction-type">{transaction.type}</td>
                    <td className={`transaction-amount ${transaction.isWithdrawal ? 'negative' : ''}`}>
                      {transaction.isWithdrawal ? '-' : '+'}{formatCurrency(transaction.amount)} AOA
                    </td>
                    <td>
                      <span className={`transaction-status ${transaction.status}`}>
                        {transaction.status === 'completado' && '✓ Completado'}
                        {transaction.status === 'pendente' && '⏳ Pendente'}
                        {transaction.status === 'processando' && '🔄 Processando'}
                        {transaction.status === 'rejeitado' && '✗ Rejeitado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">✅</div>
            <h2>Saque Solicitado com Sucesso!</h2>
            <p>
              Sua solicitação de saque foi recebida e está em análise. 
              Você receberá uma notificação quando o pagamento for processado.
            </p>
            <p>
              <strong>Prazo de processamento:</strong> até 48 horas úteis
            </p>
            <button className="modal-button" onClick={() => setShowSuccessModal(false)}>
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
