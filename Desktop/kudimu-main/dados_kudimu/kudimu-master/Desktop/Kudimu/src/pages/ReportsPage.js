import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [systemData, setSystemData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [campaignData, setCampaignData] = useState(null);
  const [financialData, setFinancialData] = useState(null);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchSystemOverview();
    } else if (activeTab === 'campaigns') {
      fetchCampaigns();
    } else if (activeTab === 'financial') {
      fetchFinancial();
    }
  }, [activeTab]);

  const fetchSystemOverview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reports/system/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSystemData(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignReport = async (campaignId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reports/campaign/${campaignId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCampaignData(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar relatório de campanha:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancial = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reports/financial`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setFinancialData(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar relatório financeiro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reports/export/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar:', error);
    }
  };

  const handleCampaignChange = (e) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    if (campaignId) {
      fetchCampaignReport(campaignId);
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>📊 Relatórios e Analytics</h1>
        <p>Monitoramento completo da plataforma Kudimu</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📈 Visão Geral
        </button>
        <button
          className={activeTab === 'campaigns' ? 'active' : ''}
          onClick={() => setActiveTab('campaigns')}
        >
          🎯 Campanhas
        </button>
        <button
          className={activeTab === 'financial' ? 'active' : ''}
          onClick={() => setActiveTab('financial')}
        >
          💰 Financeiro
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && systemData && !loading && (
        <div className="overview-tab">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card users">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Usuários</h3>
                <div className="stat-number">{systemData.usuarios.total}</div>
                <div className="stat-details">
                  <span className="stat-label">Ativos:</span>
                  <span className="stat-value">{systemData.usuarios.ativos}</span>
                  <span className="stat-separator">•</span>
                  <span className="stat-label">Taxa:</span>
                  <span className="stat-value">{systemData.usuarios.taxa_ativacao}%</span>
                </div>
              </div>
            </div>

            <div className="stat-card campaigns">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>Campanhas</h3>
                <div className="stat-number">{systemData.campanhas.total}</div>
                <div className="stat-details">
                  <span className="stat-label">Ativas:</span>
                  <span className="stat-value">{systemData.campanhas.ativas}</span>
                  <span className="stat-separator">•</span>
                  <span className="stat-label">Progresso:</span>
                  <span className="stat-value">{systemData.campanhas.taxa_conclusao}%</span>
                </div>
              </div>
            </div>

            <div className="stat-card financial">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Financeiro</h3>
                <div className="stat-number">{systemData.financeiro.saldo_plataforma_aoa.toLocaleString()} AOA</div>
                <div className="stat-details">
                  <span className="stat-label">Pago:</span>
                  <span className="stat-value">{systemData.financeiro.total_pago_aoa.toLocaleString()} AOA</span>
                  <span className="stat-separator">•</span>
                  <span className="stat-label">Sacado:</span>
                  <span className="stat-value">{systemData.financeiro.total_sacado_aoa.toLocaleString()} AOA</span>
                </div>
              </div>
            </div>

            <div className="stat-card reputation">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Reputação Média</h3>
                <div className="stat-number">{systemData.usuarios.reputacao_media}</div>
                <div className="stat-details">
                  <span className="stat-label">Cidadãos:</span>
                  <span className="stat-value">{systemData.usuarios.cidadaos}</span>
                  <span className="stat-separator">•</span>
                  <span className="stat-label">Empresas:</span>
                  <span className="stat-value">{systemData.usuarios.empresas}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Crescimento de Usuários */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>📈 Crescimento de Usuários</h3>
                <button onClick={() => handleExport('users')} className="export-btn">
                  📥 Exportar CSV
                </button>
              </div>
              <div className="chart-wrapper">
                <Line
                  data={{
                    labels: systemData.graficos.crescimento_usuarios.map(item => item.mes),
                    datasets: [{
                      label: 'Total de Usuários',
                      data: systemData.graficos.crescimento_usuarios.map(item => item.total),
                      borderColor: 'rgb(102, 126, 234)',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      fill: true,
                      tension: 0.4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Top Usuários */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>🏆 Top Usuários por Reputação</h3>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Nome</th>
                      <th>Nível</th>
                      <th>Reputação</th>
                      <th>Respostas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemData.graficos.top_usuarios.slice(0, 10).map((user, index) => (
                      <tr key={user.id}>
                        <td className="rank">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </td>
                        <td className="user-name">{user.nome}</td>
                        <td>
                          <span className={`badge level-${user.nivel.toLowerCase()}`}>
                            {user.nivel}
                          </span>
                        </td>
                        <td className="reputation">
                          <span className="rep-value">{user.reputacao}</span>
                        </td>
                        <td>{user.total_respostas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Campanhas */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>🎯 Top Campanhas por Progresso</h3>
                <button onClick={() => handleExport('campaigns')} className="export-btn">
                  📥 Exportar CSV
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Campanha</th>
                      <th>Respostas</th>
                      <th>Progresso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemData.graficos.top_campanhas.slice(0, 10).map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="campaign-title">{campaign.titulo}</td>
                        <td>{campaign.quantidade_atual}</td>
                        <td>
                          <div className="progress-bar-container">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${campaign.progresso}%` }}
                            ></div>
                            <span className="progress-label">{campaign.progresso}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Distribuição por Província */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>📍 Distribuição Geográfica</h3>
              </div>
              <div className="chart-wrapper pie-chart">
                <Pie
                  data={{
                    labels: systemData.graficos.por_provincia.map(item => item.provincia),
                    datasets: [{
                      data: systemData.graficos.por_provincia.map(item => item.total),
                      backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                      ],
                      borderColor: 'white',
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          padding: 15,
                          font: { size: 13 }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && !loading && (
        <div className="campaigns-tab">
          <div className="campaign-selector-card">
            <h3>Selecione uma Campanha</h3>
            <select 
              value={selectedCampaign} 
              onChange={handleCampaignChange}
              className="campaign-select"
            >
              <option value="">-- Selecione uma campanha --</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.titulo} - {campaign.cliente}
                </option>
              ))}
            </select>
          </div>

          {campaignData && (
            <div className="campaign-report">
              {/* Campaign Info Card */}
              <div className="campaign-info-card">
                <h2>{campaignData.campanha.titulo}</h2>
                <div className="campaign-meta">
                  <span className="meta-item">
                    <strong>Cliente:</strong> {campaignData.campanha.cliente}
                  </span>
                  <span className="meta-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge ${campaignData.campanha.status}`}>
                      {campaignData.campanha.status}
                    </span>
                  </span>
                  <span className="meta-item">
                    <strong>Período:</strong> {campaignData.campanha.data_inicio} até {campaignData.campanha.data_fim}
                  </span>
                  <span className="meta-item">
                    <strong>Recompensa:</strong> {campaignData.campanha.recompensa_por_resposta} AOA
                  </span>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="stats-grid">
                <div className="stat-card small">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <h4>Participantes</h4>
                    <div className="stat-number">{campaignData.estatisticas.total_participantes}</div>
                  </div>
                </div>

                <div className="stat-card small">
                  <div className="stat-icon">💬</div>
                  <div className="stat-content">
                    <h4>Respostas</h4>
                    <div className="stat-number">{campaignData.estatisticas.total_respostas}</div>
                  </div>
                </div>

                <div className="stat-card small">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <h4>Taxa Aprovação</h4>
                    <div className="stat-number">{campaignData.estatisticas.taxa_aprovacao.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="stat-card small">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <h4>Progresso</h4>
                    <div className="stat-number">{campaignData.estatisticas.progresso_percentual}%</div>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="chart-card">
                <h3>💰 Informações Financeiras</h3>
                <div className="financial-grid">
                  <div className="financial-item">
                    <span className="financial-label">Custo Projetado:</span>
                    <span className="financial-value">{campaignData.financeiro.custo_projetado_aoa.toLocaleString()} AOA</span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Custo Real:</span>
                    <span className="financial-value">{campaignData.financeiro.custo_real_aoa.toLocaleString()} AOA</span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Economia:</span>
                    <span className="financial-value positive">{campaignData.financeiro.economia_aoa.toLocaleString()} AOA</span>
                  </div>
                  <div className="financial-item">
                    <span className="financial-label">Custo por Resposta:</span>
                    <span className="financial-value">{campaignData.financeiro.custo_por_resposta_real} AOA</span>
                  </div>
                </div>
              </div>

              {/* Charts */}
              {campaignData.graficos.respostas_por_dia.length > 0 && (
                <div className="chart-card">
                  <h3>📅 Respostas por Dia</h3>
                  <div className="simple-chart">
                    {campaignData.graficos.respostas_por_dia.map((item, index) => (
                      <div key={index} className="chart-bar">
                        <div className="bar-label">{item.dia}</div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${(item.total / Math.max(...campaignData.graficos.respostas_por_dia.map(i => i.total))) * 100}%` }}
                          >
                            <span className="bar-value">{item.total}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && financialData && !loading && (
        <div className="financial-tab">
          {/* Financial Summary */}
          <div className="stats-grid">
            <div className="stat-card financial-summary">
              <div className="stat-icon">💵</div>
              <div className="stat-content">
                <h3>Total Pago</h3>
                <div className="stat-number positive">{financialData.resumo.total_pago_aoa.toLocaleString()} AOA</div>
                <div className="stat-details">
                  <span className="stat-value">{financialData.resumo.total_transacoes_credito} transações</span>
                </div>
              </div>
            </div>

            <div className="stat-card financial-summary">
              <div className="stat-icon">💸</div>
              <div className="stat-content">
                <h3>Total Sacado</h3>
                <div className="stat-number negative">{financialData.resumo.total_sacado_aoa.toLocaleString()} AOA</div>
                <div className="stat-details">
                  <span className="stat-value">{financialData.resumo.total_transacoes_saque} transações</span>
                </div>
              </div>
            </div>

            <div className="stat-card financial-summary">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pendente</h3>
                <div className="stat-number warning">{financialData.resumo.total_pendente_aoa.toLocaleString()} AOA</div>
              </div>
            </div>

            <div className="stat-card financial-summary">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Saldo Plataforma</h3>
                <div className={`stat-number ${financialData.resumo.saldo_plataforma_aoa >= 0 ? 'positive' : 'negative'}`}>
                  {financialData.resumo.saldo_plataforma_aoa.toLocaleString()} AOA
                </div>
              </div>
            </div>
          </div>

          {/* By Payment Method */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>💳 Por Método de Pagamento</h3>
              <button onClick={() => handleExport('transactions')} className="export-btn">
                📥 Exportar CSV
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Método</th>
                    <th>Transações</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {financialData.por_metodo_pagamento.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span className="payment-method-badge">
                          {item.metodo_pagamento === 'dados_moveis' && '📱 Dados Móveis'}
                          {item.metodo_pagamento === 'e_kwanza' && '💳 e-Kwanza'}
                          {item.metodo_pagamento === 'paypay' && '💰 PayPay'}
                          {!['dados_moveis', 'e_kwanza', 'paypay'].includes(item.metodo_pagamento) && item.metodo_pagamento}
                        </span>
                      </td>
                      <td>{item.total_transacoes}</td>
                      <td className="amount">{item.total_valor_aoa.toLocaleString()} AOA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* By Operator */}
          {financialData.por_operadora.length > 0 && (
            <div className="chart-card">
              <h3>📡 Por Operadora (Dados Móveis)</h3>
              <div className="chart-wrapper">
                <Bar
                  data={{
                    labels: financialData.por_operadora.map(item => {
                      if (item.operadora === 'unitel') return '🔴 Unitel';
                      if (item.operadora === 'movicel') return '🔵 Movicel';
                      if (item.operadora === 'africell') return '🟢 Africell';
                      return item.operadora;
                    }),
                    datasets: [{
                      label: 'Valor em AOA',
                      data: financialData.por_operadora.map(item => item.total_valor_aoa),
                      backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)'
                      ],
                      borderColor: [
                        'rgb(239, 68, 68)',
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)'
                      ],
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                          label: function(context) {
                            const value = context.parsed.y;
                            const index = context.dataIndex;
                            const transactions = financialData.por_operadora[index].total_transacoes;
                            return [
                              `Valor: ${value.toLocaleString()} AOA`,
                              `Transações: ${transactions}`
                            ];
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return value.toLocaleString() + ' AOA';
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Top Users */}
          {financialData.graficos.top_usuarios.length > 0 && (
            <div className="chart-card">
              <h3>🏆 Top Usuários por Ganhos</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Nome</th>
                      <th>Total Ganho</th>
                      <th>Total Sacado</th>
                      <th>Saldo Atual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.graficos.top_usuarios.slice(0, 10).map((user, index) => (
                      <tr key={user.id}>
                        <td className="rank">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </td>
                        <td className="user-name">{user.nome}</td>
                        <td className="amount positive">{user.total_ganho_aoa.toLocaleString()} AOA</td>
                        <td className="amount negative">{user.total_sacado_aoa.toLocaleString()} AOA</td>
                        <td className="amount">{user.saldo_atual_aoa.toLocaleString()} AOA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .reports-page {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .reports-header {
          margin-bottom: 30px;
        }

        .reports-header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .reports-header p {
          color: #666;
          font-size: 16px;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 10px;
        }

        .tabs button {
          padding: 12px 24px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #666;
          border-radius: 8px 8px 0 0;
          transition: all 0.3s;
        }

        .tabs button:hover {
          background: #f5f5f5;
          color: #333;
        }

        .tabs button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        /* Loading */
        .loading {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .stat-card.small {
          padding: 20px;
        }

        .stat-icon {
          font-size: 48px;
        }

        .stat-content {
          flex: 1;
        }

        .stat-content h3,
        .stat-content h4 {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #333;
        }

        .stat-number.positive {
          color: #10b981;
        }

        .stat-number.negative {
          color: #ef4444;
        }

        .stat-number.warning {
          color: #f59e0b;
        }

        .stat-details {
          display: flex;
          gap: 8px;
          font-size: 14px;
          color: #666;
          flex-wrap: wrap;
        }

        .stat-label {
          font-weight: 500;
        }

        .stat-value {
          color: #333;
        }

        .stat-separator {
          color: #ccc;
        }

        /* Charts Section */
        .charts-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 20px;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .export-btn {
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .export-btn:hover {
          background: #5568d3;
        }

        /* Chart Wrapper */
        .chart-wrapper {
          position: relative;
          height: 300px;
          margin-top: 20px;
        }

        .chart-wrapper.pie-chart {
          height: 350px;
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        /* Simple Chart */
        .simple-chart {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chart-bar {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bar-label {
          min-width: 120px;
          font-size: 14px;
          font-weight: 500;
          color: #666;
        }

        .bar-container {
          flex: 1;
          height: 32px;
          background: #f3f4f6;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          padding: 0 12px;
          transition: width 0.5s ease;
        }

        .bar-fill.geographic {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .bar-fill.operator-unitel {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .bar-fill.operator-movicel {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .bar-fill.operator-africell {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .bar-value {
          color: white;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Table */
        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead {
          background: #f9fafb;
        }

        .data-table th {
          padding: 12px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          border-bottom: 2px solid #e5e7eb;
        }

        .data-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .data-table tbody tr:hover {
          background: #f9fafb;
        }

        .rank {
          font-size: 18px;
          text-align: center;
        }

        .user-name {
          font-weight: 500;
          color: #333;
        }

        .campaign-title {
          font-weight: 500;
          color: #333;
          max-width: 300px;
        }

        .reputation {
          text-align: center;
        }

        .rep-value {
          display: inline-block;
          padding: 4px 12px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          border-radius: 12px;
          font-weight: 600;
        }

        .amount {
          font-weight: 600;
          text-align: right;
        }

        .amount.positive {
          color: #10b981;
        }

        .amount.negative {
          color: #ef4444;
        }

        /* Badge */
        .badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .badge.level-iniciante {
          background: #dbeafe;
          color: #1e40af;
        }

        .badge.level-experiente {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.level-especialista {
          background: #fce7f3;
          color: #831843;
        }

        .badge.level-mestre {
          background: #ede9fe;
          color: #5b21b6;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          margin-left: 8px;
        }

        .status-badge.ativa {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.encerrada {
          background: #fee2e2;
          color: #991b1b;
        }

        .payment-method-badge {
          padding: 4px 12px;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        /* Progress Bar */
        .progress-bar-container {
          position: relative;
          width: 100%;
          height: 24px;
          background: #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          transition: width 0.5s ease;
        }

        .progress-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        /* Campaign Selector */
        .campaign-selector-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .campaign-selector-card h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          color: #333;
        }

        .campaign-select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .campaign-select:focus {
          outline: none;
          border-color: #667eea;
        }

        /* Campaign Info */
        .campaign-info-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 20px;
        }

        .campaign-info-card h2 {
          margin: 0 0 16px 0;
          font-size: 28px;
        }

        .campaign-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 14px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .meta-item strong {
          font-weight: 600;
        }

        /* Financial Grid */
        .financial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .financial-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .financial-label {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .financial-value {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }

        .financial-value.positive {
          color: #10b981;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-section {
            grid-template-columns: 1fr;
          }

          .stat-card {
            flex-direction: column;
            text-align: center;
          }

          .chart-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
