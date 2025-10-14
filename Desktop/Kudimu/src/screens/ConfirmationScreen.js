import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ConfirmationScreen.css';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function ConfirmationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  const { campaign, recompensa, pontos, validacao } = location.state || {};

  useEffect(() => {
    // Buscar dados atualizados do usuário
    fetchUpdatedUserData();

    // Esconder confetti após 3 segundos
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const fetchUpdatedUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reputation/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserData(data.data);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
    }
  };

  if (!campaign) {
    return (
      <div className="confirmation-container">
        <div className="error-message">
          <h2>⚠️ Erro</h2>
          <p>Dados da confirmação não encontrados</p>
          <button onClick={() => navigate('/campaigns')} className="btn-primary">
            Voltar para Campanhas
          </button>
        </div>
      </div>
    );
  }

  const niveis = {
    'Iniciante': { icon: '🌱', color: '#94a3b8' },
    'Confiável': { icon: '⭐', color: '#3b82f6' },
    'Líder': { icon: '👑', color: '#f59e0b' },
    'Embaixador': { icon: '🏆', color: '#a855f7' }
  };

  const nivelAtual = niveis[userData?.nivel] || niveis['Iniciante'];

  return (
    <div className="confirmation-container">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              background: `hsl(${Math.random() * 360}, 70%, 60%)`
            }} />
          ))}
        </div>
      )}

      <div className="confirmation-card success-animation">
        {/* Ícone de sucesso */}
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>

        <h1 className="confirmation-title">Respostas Enviadas com Sucesso!</h1>
        <p className="confirmation-subtitle">
          Obrigado por participar da campanha <strong>{campaign.titulo}</strong>
        </p>

        {/* Informações da recompensa */}
        <div className="reward-info">
          <div className="reward-card">
            <div className="reward-icon">💰</div>
            <div className="reward-details">
              <span className="reward-label">Recompensa Recebida</span>
              <span className="reward-value">{recompensa || campaign.recompensa_por_resposta} AOA</span>
            </div>
          </div>

          <div className="reward-card">
            <div className="reward-icon">⚡</div>
            <div className="reward-details">
              <span className="reward-label">Pontos de Reputação</span>
              <span className="reward-value">+{pontos || 5} pontos</span>
            </div>
          </div>
        </div>

        {/* Status de validação */}
        <div className="validation-info">
          <div className="validation-icon">
            {validacao === 'aprovada' ? '✅' : '⏳'}
          </div>
          <div className="validation-text">
            <h3>
              {validacao === 'aprovada' ? 'Validação Aprovada!' : 'Em Validação'}
            </h3>
            <p>
              {validacao === 'aprovada' 
                ? 'Suas respostas foram validadas automaticamente e a recompensa já está disponível.'
                : 'Suas respostas estão sendo analisadas. Você receberá a confirmação em até 24-48 horas.'}
            </p>
          </div>
        </div>

        {/* Progresso de nível */}
        {userData && (
          <div className="level-progress-card">
            <div className="level-header">
              <span className="level-icon">{nivelAtual.icon}</span>
              <span className="level-name" style={{ color: nivelAtual.color }}>
                {userData.nivel}
              </span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${userData.progresso_proximo_nivel || 0}%`,
                  background: nivelAtual.color
                }}
              />
            </div>
            <p className="progress-text">
              {userData.progresso_proximo_nivel >= 100 
                ? '🎉 Você alcançou o nível máximo!' 
                : `${userData.progresso_proximo_nivel || 0}% para o próximo nível`}
            </p>
          </div>
        )}

        {/* Estatísticas adicionais */}
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-value">{userData?.campanhas_completas || 1}</span>
              <span className="stat-label">Campanhas Completas</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-value">{userData?.pontos || pontos}</span>
              <span className="stat-label">Total de Pontos</span>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <span className="stat-value">{userData?.medalhas?.length || 0}</span>
              <span className="stat-label">Medalhas</span>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/history')} 
            className="btn-secondary"
          >
            📊 Ver Histórico
          </button>
          <button 
            onClick={() => navigate('/campaigns')} 
            className="btn-primary"
          >
            🚀 Responder Outra Campanha
          </button>
        </div>

        {/* Dica motivacional */}
        <div className="motivational-tip">
          <span className="tip-icon">💡</span>
          <p>
            Continue participando para aumentar sua reputação e desbloquear campanhas exclusivas!
          </p>
        </div>
      </div>

      
    </div>
  );
}
