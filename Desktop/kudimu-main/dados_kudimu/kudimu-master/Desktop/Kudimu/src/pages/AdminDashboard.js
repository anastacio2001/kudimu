import React, { useState, useEffect } from 'react';

// Detectar se estamos em desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Erro ao carregar dashboard');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Carregando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>📊 Painel Administrativo</h1>
        <p>Bem-vindo ao painel de gestão Kudimu Insights</p>
      </header>

      {/* Estatísticas Gerais */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats?.totais?.usuarios || 0}</h3>
            <p>Usuários Cadastrados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats?.totais?.campanhas || 0}</h3>
            <p>Campanhas Criadas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{stats?.totais?.respostas || 0}</h3>
            <p>Respostas Recebidas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats?.totais?.recompensas_pagas || 0} Kz</h3>
            <p>Recompensas Pagas</p>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="metrics-section">
        <h2>📈 Métricas de Engajamento</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Usuários Ativos (7 dias)</div>
            <div className="metric-value">{stats?.metricas?.usuarios_ativos_7d || 0}</div>
            <div className="metric-bar">
              <div 
                className="metric-bar-fill" 
                style={{width: `${((stats?.metricas?.usuarios_ativos_7d || 0) / (stats?.totais?.usuarios || 1)) * 100}%`}}
              ></div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Campanhas Ativas</div>
            <div className="metric-value">{stats?.metricas?.campanhas_ativas || 0}</div>
            <div className="metric-bar">
              <div 
                className="metric-bar-fill active" 
                style={{width: `${((stats?.metricas?.campanhas_ativas || 0) / Math.max(stats?.totais?.campanhas || 1, 1)) * 100}%`}}
              ></div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Taxa de Aprovação</div>
            <div className="metric-value">{stats?.metricas?.taxa_aprovacao || 0}%</div>
            <div className="metric-bar">
              <div 
                className="metric-bar-fill success" 
                style={{width: `${stats?.metricas?.taxa_aprovacao || 0}%`}}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Atividades Recentes */}
      <section className="activities-section">
        <h2>🕐 Atividades Recentes</h2>
        <div className="activities-list">
          {stats?.atividades_recentes?.length > 0 ? (
            stats.atividades_recentes.map((atividade) => (
              <div key={atividade.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(atividade.acao)}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    <strong>{atividade.usuario_nome}</strong> - {getActivityText(atividade.acao)}
                  </div>
                  <div className="activity-time">
                    {new Date(atividade.timestamp).toLocaleString('pt-AO')}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-activities">Nenhuma atividade recente</p>
          )}
        </div>
      </section>

      {/* Links Rápidos */}
      <section className="quick-links">
        <h2>⚡ Ações Rápidas</h2>
        <div className="links-grid">
          <a href="/admin/users" className="quick-link-card">
            <span className="link-icon">👥</span>
            <span className="link-text">Gerenciar Usuários</span>
          </a>
          <a href="/admin/campaigns" className="quick-link-card">
            <span className="link-icon">📋</span>
            <span className="link-text">Gerenciar Campanhas</span>
          </a>
          <a href="/admin/answers" className="quick-link-card">
            <span className="link-icon">💬</span>
            <span className="link-text">Revisar Respostas</span>
          </a>
          <a href="/admin/reports" className="quick-link-card">
            <span className="link-icon">📊</span>
            <span className="link-text">Relatórios</span>
          </a>
        </div>
      </section>
    </div>
  );
}

function getActivityIcon(acao) {
  const icons = {
    'login': '🔐',
    'cadastro': '✅',
    'logout': '👋',
    'resposta_enviada': '💬',
    'campanha_criada': '📋',
    'medalha_pioneiro': '🚀',
    'reputacao_alterada': '⭐',
    'admin_atualizar_usuario': '👤',
    'admin_atualizar_campanha': '📝',
    'admin_validar_resposta': '✓'
  };
  return icons[acao] || '📌';
}

function getActivityText(acao) {
  const texts = {
    'login': 'fez login',
    'cadastro': 'se cadastrou',
    'logout': 'saiu do sistema',
    'resposta_enviada': 'enviou uma resposta',
    'campanha_criada': 'criou uma campanha',
    'medalha_pioneiro': 'conquistou medalha Pioneiro',
    'reputacao_alterada': 'teve reputação alterada',
    'admin_atualizar_usuario': 'atualizou um usuário',
    'admin_atualizar_campanha': 'atualizou uma campanha',
    'admin_validar_resposta': 'validou uma resposta'
  };
  return texts[acao] || acao.replace(/_/g, ' ');
}
