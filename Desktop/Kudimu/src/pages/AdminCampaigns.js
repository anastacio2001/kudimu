import React, { useState, useEffect } from 'react';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingCampaign, setEditingCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`${API_URL}/admin/campaigns?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.data);
      } else {
        setError(data.error || 'Erro ao carregar campanhas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampaign = async (campaignId, updates) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Campanha atualizada com sucesso!');
        setEditingCampaign(null);
        fetchCampaigns();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (err) {
      alert('Erro ao atualizar campanha');
    }
  };

  const handleDeleteCampaign = async (campaignId, titulo) => {
    if (!confirm(`Deseja realmente cancelar a campanha "${titulo}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Campanha cancelada com sucesso!');
        fetchCampaigns();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (err) {
      alert('Erro ao cancelar campanha');
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'ativa': 'status-active',
      'pendente': 'status-pending',
      'encerrada': 'status-completed',
      'cancelada': 'status-cancelled'
    };
    return classes[status] || 'status-default';
  };

  const getProgressPercentage = (atual, alvo) => {
    return Math.min(Math.round((atual / alvo) * 100), 100);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>📋 Gerenciar Campanhas</h1>
        <p>Total: {campaigns.length} campanhas</p>
      </header>

      {/* Filtros */}
      <section className="filters-section">
        <div className="filters-row">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="ativa">Ativa</option>
            <option value="encerrada">Encerrada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <button onClick={fetchCampaigns} className="btn-secondary">
            🔄 Atualizar
          </button>
        </div>
      </section>

      {/* Lista de Campanhas */}
      {loading ? (
        <div className="loading">Carregando campanhas...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : campaigns.length === 0 ? (
        <div className="empty-state">
          <p>📭 Nenhuma campanha encontrada</p>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-header">
                <h3>{campaign.titulo}</h3>
                <span className={`status-badge ${getStatusBadgeClass(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              <div className="campaign-info">
                <p className="campaign-client">
                  <strong>Cliente:</strong> {campaign.cliente}
                </p>
                <p className="campaign-creator">
                  <strong>Criador:</strong> {campaign.criador_nome || 'Desconhecido'}
                </p>
                <p className="campaign-theme">
                  <strong>Tema:</strong> {campaign.tema || 'Não especificado'}
                </p>
              </div>

              <div className="campaign-stats">
                <div className="stat-item">
                  <span className="stat-label">Progresso</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${getProgressPercentage(campaign.quantidade_atual, campaign.quantidade_alvo)}%`}}
                    ></div>
                  </div>
                  <span className="stat-value">
                    {campaign.quantidade_atual} / {campaign.quantidade_alvo} respostas
                  </span>
                </div>

                <div className="stat-row">
                  <div className="stat-item-small">
                    <span className="stat-icon">💰</span>
                    <span className="stat-value">{campaign.recompensa_por_resposta} Kz</span>
                  </div>
                  <div className="stat-item-small">
                    <span className="stat-icon">👥</span>
                    <span className="stat-value">{campaign.participantes_unicos || 0} usuários</span>
                  </div>
                </div>
              </div>

              <div className="campaign-dates">
                <div>
                  <strong>Início:</strong> {new Date(campaign.data_inicio).toLocaleDateString('pt-AO')}
                </div>
                <div>
                  <strong>Fim:</strong> {new Date(campaign.data_fim).toLocaleDateString('pt-AO')}
                </div>
              </div>

              <div className="campaign-actions">
                <button
                  onClick={() => setEditingCampaign(campaign)}
                  className="btn-secondary btn-sm"
                >
                  ✏️ Editar
                </button>
                {campaign.status !== 'cancelada' && (
                  <button
                    onClick={() => handleDeleteCampaign(campaign.id, campaign.titulo)}
                    className="btn-danger btn-sm"
                  >
                    🗑️ Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edição */}
      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={handleUpdateCampaign}
        />
      )}
    </div>
  );
}

function EditCampaignModal({ campaign, onClose, onSave }) {
  const [formData, setFormData] = useState({
    status: campaign.status,
    quantidade_necessaria: campaign.quantidade_alvo,
    recompensa_por_resposta: campaign.recompensa_por_resposta
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(campaign.id, formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Campanha</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Título</label>
            <input type="text" value={campaign.titulo} disabled className="input-disabled" />
          </div>

          <div className="form-group">
            <label>Cliente</label>
            <input type="text" value={campaign.cliente} disabled className="input-disabled" />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="form-select"
            >
              <option value="pendente">Pendente</option>
              <option value="ativa">Ativa</option>
              <option value="encerrada">Encerrada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantidade Alvo</label>
              <input
                type="number"
                value={formData.quantidade_necessaria}
                onChange={(e) => setFormData({...formData, quantidade_necessaria: parseInt(e.target.value)})}
                className="form-input"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Recompensa (Kz)</label>
              <input
                type="number"
                value={formData.recompensa_por_resposta}
                onChange={(e) => setFormData({...formData, recompensa_por_resposta: parseFloat(e.target.value)})}
                className="form-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="info-box">
            <strong>Progresso Atual:</strong> {campaign.quantidade_atual} / {campaign.quantidade_alvo} respostas
            ({Math.round((campaign.quantidade_atual / campaign.quantidade_alvo) * 100)}%)
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              💾 Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
