import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HistoryScreen.css';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // User data states
  const [userData, setUserData] = useState(null);
  const [reputationData, setReputationData] = useState(null);
  const [medals, setMedals] = useState([]);
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('todas');

  // Níveis de reputação
  const niveis = {
    'Iniciante': { icon: '🌱', color: '#94a3b8', minPoints: 0, maxPoints: 99 },
    'Confiável': { icon: '⭐', color: '#3b82f6', minPoints: 100, maxPoints: 299 },
    'Líder': { icon: '👑', color: '#f59e0b', minPoints: 300, maxPoints: 999 },
    'Embaixador': { icon: '🏆', color: '#a855f7', minPoints: 1000, maxPoints: Infinity }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user data and reputation
      const [reputationRes, answersRes, rewardsRes] = await Promise.all([
        fetch(`${API_URL}/reputation/me`, { headers }),
        fetch(`${API_URL}/answers/me`, { headers }),
        fetch(`${API_URL}/rewards/me`, { headers })
      ]);

      if (reputationRes.ok) {
        const repData = await reputationRes.json();
        setUserData(repData.data);
        setReputationData(repData.data);
        
        // Fetch medals
        if (repData.data.usuario_id) {
          const medalsRes = await fetch(`${API_URL}/reputation/medals/${repData.data.usuario_id}`, { headers });
          if (medalsRes.ok) {
            const medalsData = await medalsRes.json();
            setMedals(medalsData.data || []);
          }
        }
      }

      if (answersRes.ok) {
        const answersData = await answersRes.json();
        setCampaignHistory(answersData.data || []);
      }

      // Generate mock recent actions (últimos 30 dias)
      generateRecentActions();

      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar seu histórico. Tente novamente.');
      setLoading(false);
    }
  };

  const generateRecentActions = () => {
    // Mock data for recent actions
    const actions = [
      { type: 'Campanha Respondida', points: 50, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { type: 'Login Diário', points: 5, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { type: 'Perfil Completo', points: 20, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { type: 'Resposta Validada', points: 30, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
    ];
    setRecentActions(actions);
  };

  const calcularProgresso = () => {
    if (!reputationData || !reputationData.nivel) return 0;
    
    const nivelAtual = niveis[reputationData.nivel];
    if (!nivelAtual) return 0;
    
    const reputacao = reputationData.reputacao || 0;
    
    if (reputacao >= nivelAtual.maxPoints) return 100;
    
    const pontosFaixa = nivelAtual.maxPoints - nivelAtual.minPoints + 1;
    const pontosAtuais = reputacao - nivelAtual.minPoints;
    return Math.min(Math.max((pontosAtuais / pontosFaixa) * 100, 0), 100);
  };

  const getNextLevel = () => {
    if (!reputationData || !reputationData.nivel) return null;
    
    const niveisOrdenados = ['Iniciante', 'Confiável', 'Líder', 'Embaixador'];
    const nivelAtualIndex = niveisOrdenados.indexOf(reputationData.nivel);
    
    if (nivelAtualIndex === -1 || nivelAtualIndex === niveisOrdenados.length - 1) {
      return null;
    }
    
    return niveisOrdenados[nivelAtualIndex + 1];
  };

  const filterCampaigns = () => {
    if (statusFilter === 'todas') return campaignHistory;
    return campaignHistory.filter(c => c.validacao === statusFilter);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateRelative = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `Há ${days} dias`;
    if (days < 30) return `Há ${Math.floor(days / 7)} semanas`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="history-screen">
        <div className="loading">
          <div>⏳ Carregando seu histórico...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-screen">
        <div className="error-message">
          <h2>❌ Erro</h2>
          <p>{error}</p>
          <button onClick={fetchAllData} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const nivelAtual = userData && userData.nivel ? niveis[userData.nivel] : niveis['Iniciante'];
  const progresso = calcularProgresso();
  const proximoNivel = getNextLevel();
  const pontosRestantes = proximoNivel ? niveis[proximoNivel].minPoints - (reputationData?.reputacao || 0) : 0;

  return (
    <div className="history-screen">
      <div className="history-container">
        {/* Header */}
        <div className="history-header">
          <h1>📊 Meu Histórico</h1>
          <p>Acompanhe seu desempenho, reputação e conquistas</p>
        </div>

        {/* Personal Info + Reputation Grid */}
        <div className="history-grid">
          {/* Personal Information */}
          <div className="personal-info-card">
            <h2>👤 Informações Pessoais</h2>
            
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div className="info-details">
                <div className="info-label">Email</div>
                <div className="info-value">{userData?.email || 'Não informado'}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">👤</div>
              <div className="info-details">
                <div className="info-label">Nome</div>
                <div className="info-value">{userData?.nome || 'Não informado'}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📱</div>
              <div className="info-details">
                <div className="info-label">Telefone</div>
                <div className="info-value">{userData?.telefone || 'Não informado'}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-details">
                <div className="info-label">Localização</div>
                <div className="info-value">{userData?.localizacao || 'Não informado'}</div>
              </div>
            </div>

            <button className="btn-edit-profile" onClick={() => navigate('/profile/edit')}>
              ✏️ Editar Perfil
            </button>
          </div>

          {/* Reputation System */}
          <div className="reputation-card">
            <h2>⚡ Sistema de Reputação</h2>
            
            {/* Summary Stats */}
            <div className="reputation-summary">
              <div className="reputation-stat">
                <div className="reputation-stat-label">Nível Atual</div>
                <div className="reputation-stat-value">
                  {nivelAtual.icon} {userData?.nivel || 'Iniciante'}
                </div>
              </div>
              
              <div className="reputation-stat">
                <div className="reputation-stat-label">Reputação</div>
                <div className="reputation-stat-value">{reputationData?.reputacao || 0}</div>
              </div>
              
              <div className="reputation-stat">
                <div className="reputation-stat-label">Saldo</div>
                <div className="reputation-stat-value">{reputationData?.saldo_pontos?.toFixed(2) || '0.00'} pts</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="level-progress-section">
              <div className="level-info">
                <div className="current-level">
                  <span className="level-badge" style={{ background: nivelAtual.color }}>
                    {nivelAtual.icon} {userData?.nivel || 'Iniciante'}
                  </span>
                </div>
                {proximoNivel && (
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Próximo: {niveis[proximoNivel].icon} {proximoNivel}
                  </div>
                )}
              </div>
              
              {proximoNivel ? (
                <>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                  <div className="progress-text">
                    {progresso.toFixed(0)}% completo • Faltam {pontosRestantes} pontos para {proximoNivel}
                  </div>
                </>
              ) : (
                <div className="progress-text" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', color: 'white', padding: '1rem', borderRadius: '8px', fontWeight: '700' }}>
                  🌟 Parabéns! Você atingiu o nível máximo!
                </div>
              )}
            </div>

            {/* Recent Actions Table */}
            <div className="recent-actions">
              <h3>📋 Ações Recentes (Últimos 30 dias)</h3>
              <table className="actions-table">
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Pontos</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActions.length > 0 ? (
                    recentActions.map((action, index) => (
                      <tr key={index}>
                        <td className="action-type">{action.type}</td>
                        <td className="action-points">+{action.points}</td>
                        <td className="action-date">{formatDateRelative(action.date)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                        Nenhuma ação registrada recentemente
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Medals Section */}
        <div className="medals-section">
          <h2>🏆 Medalhas Conquistadas</h2>
          <div className="medals-grid">
            {medals.length > 0 ? (
              medals.map((medal, index) => (
                <div key={index} className={`medal-card ${medal.conquistada ? 'earned' : ''}`}>
                  <div className="medal-icon">{medal.icone || '🏅'}</div>
                  <div className="medal-name">{medal.nome}</div>
                  <div className="medal-description">{medal.descricao}</div>
                  {medal.conquistada && medal.data_conquista && (
                    <div className="medal-date">
                      ✅ {formatDate(medal.data_conquista)}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                🎯 Continue participando de campanhas para conquistar medalhas!
              </div>
            )}
          </div>
        </div>

        {/* Campaign History */}
        <div className="campaigns-history">
          <h2>📝 Histórico de Campanhas</h2>
          
          {/* Filters */}
          <div className="campaigns-filters">
            <button 
              className={`filter-btn ${statusFilter === 'todas' ? 'active' : ''}`}
              onClick={() => setStatusFilter('todas')}
            >
              Todas
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'aprovada' ? 'active' : ''}`}
              onClick={() => setStatusFilter('aprovada')}
            >
              Aprovadas
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'pendente' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pendente')}
            >
              Pendentes
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'rejeitada' ? 'active' : ''}`}
              onClick={() => setStatusFilter('rejeitada')}
            >
              Rejeitadas
            </button>
          </div>

          {/* Table */}
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>Campanha</th>
                <th>Data</th>
                <th>Status</th>
                <th>Recompensa</th>
              </tr>
            </thead>
            <tbody>
              {filterCampaigns().length > 0 ? (
                filterCampaigns().map((campaign, index) => (
                  <tr key={index}>
                    <td className="campaign-name">{campaign.campanha_nome || `Campanha #${campaign.campanha_id}`}</td>
                    <td>{formatDate(campaign.data_resposta)}</td>
                    <td>
                      <span className={`status-badge ${campaign.validacao}`}>
                        {campaign.validacao === 'aprovada' && '✅ Aprovada'}
                        {campaign.validacao === 'pendente' && '⏳ Pendente'}
                        {campaign.validacao === 'rejeitada' && '❌ Rejeitada'}
                      </span>
                    </td>
                    <td className="reward-amount">
                      {campaign.validacao === 'aprovada' 
                        ? `+${campaign.pontos || 50} pts` 
                        : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                    {statusFilter === 'todas' 
                      ? 'Você ainda não respondeu nenhuma campanha. Comece agora!' 
                      : `Nenhuma campanha ${statusFilter} encontrada.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Statistics */}
        <div className="statistics-section">
          <h2>📈 Estatísticas</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{campaignHistory.length}</div>
              <div className="stat-label">Campanhas Respondidas</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">
                {campaignHistory.filter(c => c.validacao === 'aprovada').length}
              </div>
              <div className="stat-label">Respostas Aprovadas</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{medals.filter(m => m.conquistada).length}</div>
              <div className="stat-label">Medalhas Conquistadas</div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="chart-placeholder">
            📊 Gráfico de participação mensal (em breve com Chart.js)
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => navigate('/campaigns')}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🎯 Responder Novas Campanhas
          </button>
          
          <button 
            onClick={() => navigate('/rewards')}
            style={{
              padding: '1rem 2rem',
              background: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            💰 Ver Recompensas
          </button>
        </div>
      </div>
    </div>
  );
}
