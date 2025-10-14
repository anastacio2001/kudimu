import React from 'react';
import './UserProfileCard.css';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function UserProfileCard({ userData, onViewHistory }) {
  if (!userData) return null;

  // Configuração dos níveis de reputação
  const niveis = {
    'Iniciante': { 
      icon: '🌱', 
      color: '#94a3b8', 
      nextLevel: 'Confiável',
      minPoints: 0,
      maxPoints: 99
    },
    'Confiável': { 
      icon: '⭐', 
      color: '#3b82f6', 
      nextLevel: 'Líder',
      minPoints: 100,
      maxPoints: 299
    },
    'Líder': { 
      icon: '👑', 
      color: '#f59e0b', 
      nextLevel: 'Embaixador',
      minPoints: 300,
      maxPoints: 999
    },
    'Embaixador': { 
      icon: '🏆', 
      color: '#a855f7', 
      nextLevel: null,
      minPoints: 1000,
      maxPoints: Infinity
    }
  };

  const nivelAtual = niveis[userData.nivel] || niveis['Iniciante'];
  const reputacao = userData.reputacao || 0;
  const saldoPontos = userData.saldo_pontos || 0;

  // Calcular progresso para próximo nível
  const calcularProgresso = () => {
    if (!nivelAtual.nextLevel) return 100; // Nível máximo
    
    const pontosFaixa = nivelAtual.maxPoints - nivelAtual.minPoints + 1;
    const pontosAtuais = reputacao - nivelAtual.minPoints;
    return Math.min(Math.max((pontosAtuais / pontosFaixa) * 100, 0), 100);
  };

  const progresso = calcularProgresso();

  return (
    <div className="user-profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.nome ? userData.nome.charAt(0).toUpperCase() : '👤'}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{userData.nome || 'Usuário'}</h2>
          <p className="profile-email">{userData.email}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Saldo</span>
            <span className="stat-value">{saldoPontos.toFixed(2)} pts</span>
          </div>
        </div>

        <div className="stat-item nivel-badge" style={{ borderColor: nivelAtual.color }}>
          <div className="stat-icon">{nivelAtual.icon}</div>
          <div className="stat-content">
            <span className="stat-label">Nível</span>
            <span className="stat-value" style={{ color: nivelAtual.color }}>
              {userData.nivel || 'Iniciante'}
            </span>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <span className="stat-label">Reputação</span>
            <span className="stat-value">{reputacao} pts</span>
          </div>
        </div>
      </div>

      {nivelAtual.nextLevel && (
        <div className="level-progress">
          <div className="progress-info">
            <span className="progress-label">
              Progresso para <strong>{nivelAtual.nextLevel}</strong>
            </span>
            <span className="progress-percentage">{progresso.toFixed(0)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${progresso}%`,
                background: `linear-gradient(90deg, ${nivelAtual.color}, ${niveis[nivelAtual.nextLevel]?.color || nivelAtual.color})`
              }}
            />
          </div>
          <p className="progress-hint">
            Faltam {Math.max(nivelAtual.maxPoints - reputacao + 1, 0)} pontos para o próximo nível
          </p>
        </div>
      )}

      {!nivelAtual.nextLevel && (
        <div className="max-level-badge">
          <span className="max-level-icon">🌟</span>
          <span className="max-level-text">Nível Máximo Alcançado!</span>
        </div>
      )}

      <button className="btn-view-history" onClick={onViewHistory}>
        📊 Ver Histórico Completo
      </button>
    </div>
  );
}
