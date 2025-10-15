import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileCard from '../components/UserProfileCard';
import CampaignFilters from '../components/CampaignFilters';
import './CampaignsScreen.css';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function CampaignsScreen() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchCampaigns();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        
        // Buscar dados de reputação do backend
        const reputationResponse = await fetch(`${API_URL}/reputation/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (reputationResponse.ok) {
          const reputationData = await reputationResponse.json();
          if (reputationData.success) {
            setUserData({
              ...user,
              nivel: reputationData.data.nivel,
              reputacao: reputationData.data.pontos,
              saldo_pontos: user.saldo_pontos || 0
            });
          } else {
            // Se não conseguir buscar reputação, usa dados do localStorage
            setUserData(user);
          }
        } else {
          setUserData(user);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      // Em caso de erro, tenta usar dados do localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUserData(JSON.parse(userStr));
      }
    }
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns?status=ativa`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.data);
        setFilteredCampaigns(data.data); // Inicialmente sem filtros
      } else {
        setError(data.error || 'Erro ao carregar campanhas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipar = (campaignId) => {
    navigate(`/questionnaire/${campaignId}`);
  };

  const getProgressPercentage = (atual, alvo) => {
    return Math.min((atual / alvo) * 100, 100);
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleFilterChange = (filters) => {
    let filtered = [...campaigns];

    // Filtrar por tema
    if (filters.tema) {
      filtered = filtered.filter(campaign => 
        campaign.tema?.toLowerCase() === filters.tema.toLowerCase()
      );
    }

    // Filtrar por reputação mínima
    if (filters.reputacaoMinima) {
      filtered = filtered.filter(campaign => {
        const userReputation = userData?.reputacao || 0;
        return userReputation >= campaign.reputacao_minima;
      });
    }

    // Filtrar por recompensa mínima
    if (filters.recompensaMinima) {
      filtered = filtered.filter(campaign => 
        campaign.recompensa >= parseFloat(filters.recompensaMinima)
      );
    }

    setFilteredCampaigns(filtered);
  };

  if (loading) {
    return (
      <div className="campaigns-screen">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando campanhas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaigns-screen">
        <div className="error-container">
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={fetchCampaigns} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-screen">
      <header className="campaigns-header">
        <h1>Campanhas Disponíveis</h1>
        <p>Participe de pesquisas e ganhe recompensas!</p>
      </header>

      <div className="campaigns-content">
        {/* Sidebar com perfil e filtros */}
        <aside className="sidebar">
          {userData && (
            <UserProfileCard 
              userData={userData}
              onViewHistory={handleViewHistory}
            />
          )}
          
          <CampaignFilters 
            onFilterChange={handleFilterChange}
            userReputation={userData?.reputacao || 0}
          />
        </aside>

        {/* Lista de campanhas */}
        <main className="campaigns-list">
          {filteredCampaigns.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhuma campanha encontrada</h3>
              <p>Tente ajustar os filtros ou volte mais tarde para ver novas campanhas.</p>
            </div>
          ) : (
            <div className="campaigns-grid">
              {filteredCampaigns.map((campaign) => {
                const userReputation = userData?.reputacao || 0;
                const hasRequiredReputation = userReputation >= campaign.reputacao_minima;
                const progressPercentage = getProgressPercentage(
                  campaign.respostas_atuais,
                  campaign.respostas_alvo
                );

                return (
                  <div key={campaign.id} className="campaign-card">
                    <div className="campaign-image">
                      <img 
                        src={campaign.imagem_url || 'https://via.placeholder.com/300x200?text=Campanha'} 
                        alt={campaign.titulo}
                      />
                      {!hasRequiredReputation && (
                        <div className="reputation-badge insufficient">
                          Reputação insuficiente
                        </div>
                      )}
                      {hasRequiredReputation && (
                        <div className="reputation-badge sufficient">
                          ✓ Você pode participar
                        </div>
                      )}
                    </div>

                    <div className="campaign-content">
                      <h3 className="campaign-title">{campaign.titulo}</h3>
                      <p className="campaign-description">{campaign.descricao}</p>

                      <div className="campaign-info">
                        <div className="info-item">
                          <span className="label">Tema:</span>
                          <span className="value">{campaign.tema}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Recompensa:</span>
                          <span className="value reward">{campaign.recompensa} AOA</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Reputação mínima:</span>
                          <span className="value">{campaign.reputacao_minima} pontos</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Duração:</span>
                          <span className="value">~{campaign.duracao_estimada} min</span>
                        </div>
                      </div>

                      <div className="campaign-progress">
                        <div className="progress-info">
                          <span>Progresso</span>
                          <span>{campaign.respostas_atuais}/{campaign.respostas_alvo} respostas</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleParticipar(campaign.id)}
                        disabled={!hasRequiredReputation}
                        className={`participate-button ${!hasRequiredReputation ? 'disabled' : ''}`}
                      >
                        {hasRequiredReputation ? 'Participar Agora' : 'Reputação Insuficiente'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
