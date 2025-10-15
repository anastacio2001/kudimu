import React, { useState, useEffect } from 'react';
import ReputationBadge from './ReputationBadge';
import './RankingWidget.css';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function RankingWidget({ currentUserId }) {
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [filter, setFilter] = useState('semanal'); // 'semanal', 'mensal', 'total'
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRanking();
  }, [filter]);

  const fetchRanking = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reputation/ranking?periodo=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Pegar apenas o top 5
        setRanking(data.data.slice(0, 5));
      } else {
        setError('Erro ao carregar ranking');
      }
    } catch (err) {
      console.error('Erro ao buscar ranking:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getPositionClass = (position) => {
    if (position === 1) return 'gold';
    if (position === 2) return 'silver';
    if (position === 3) return 'bronze';
    return 'other';
  };

  const getPositionIcon = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return position;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="ranking-widget">
      <div className="ranking-header">
        <h3 className="ranking-title">
          <span className="ranking-icon">🏆</span>
          Ranking de Reputação
        </h3>
        
        <div className="ranking-filter">
          <button
            className={`filter-button ${filter === 'semanal' ? 'active' : ''}`}
            onClick={() => setFilter('semanal')}
          >
            Semanal
          </button>
          <button
            className={`filter-button ${filter === 'mensal' ? 'active' : ''}`}
            onClick={() => setFilter('mensal')}
          >
            Mensal
          </button>
          <button
            className={`filter-button ${filter === 'total' ? 'active' : ''}`}
            onClick={() => setFilter('total')}
          >
            Geral
          </button>
        </div>
      </div>

      {loading ? (
        <div className="ranking-loading">
          <div className="ranking-spinner"></div>
          <p>Carregando ranking...</p>
        </div>
      ) : error ? (
        <div className="ranking-empty">
          <div className="ranking-empty-icon">⚠️</div>
          <p>{error}</p>
        </div>
      ) : ranking.length === 0 ? (
        <div className="ranking-empty">
          <div className="ranking-empty-icon">👥</div>
          <p>Nenhum dado disponível ainda</p>
        </div>
      ) : (
        <>
          <div className="ranking-list">
            {ranking.map((user, index) => {
              const position = index + 1;
              const isCurrentUser = user.usuario_id === currentUserId;

              return (
                <div 
                  key={user.usuario_id} 
                  className={`ranking-item ${isCurrentUser ? 'current-user' : ''}`}
                >
                  <div className={`ranking-position ${getPositionClass(position)}`}>
                    {getPositionIcon(position)}
                  </div>

                  <div className="ranking-avatar">
                    {getInitials(user.nome)}
                  </div>

                  <div className="ranking-info">
                    <div className="ranking-name">
                      {isCurrentUser ? 'Você' : user.nome}
                    </div>
                    <div className="ranking-level">
                      <ReputationBadge 
                        points={user.pontos} 
                        showPoints={false} 
                        size="small"
                        compact
                      />
                    </div>
                  </div>

                  <div className="ranking-points">
                    {user.pontos} pts
                  </div>

                  {position <= 3 && (
                    <span className="ranking-trophy">
                      {position === 1 && '👑'}
                      {position === 2 && '⭐'}
                      {position === 3 && '🎖️'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="ranking-footer">
            <a href="/ranking" className="view-full-ranking">
              Ver ranking completo →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
