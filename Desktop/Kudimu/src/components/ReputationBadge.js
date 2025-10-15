import React from 'react';
import './ReputationBadge.css';

const REPUTATION_LEVELS = {
  iniciante: {
    name: 'Iniciante',
    icon: '🌱',
    minPoints: 0,
    maxPoints: 99,
    color: '#94a3b8'
  },
  confiavel: {
    name: 'Confiável',
    icon: '⭐',
    minPoints: 100,
    maxPoints: 299,
    color: '#3b82f6'
  },
  lider: {
    name: 'Líder',
    icon: '👑',
    minPoints: 300,
    maxPoints: 999,
    color: '#f59e0b'
  },
  embaixador: {
    name: 'Embaixador',
    icon: '🏆',
    minPoints: 1000,
    maxPoints: Infinity,
    color: '#a855f7'
  }
};

export const getReputationLevel = (points) => {
  if (points >= 1000) return REPUTATION_LEVELS.embaixador;
  if (points >= 300) return REPUTATION_LEVELS.lider;
  if (points >= 100) return REPUTATION_LEVELS.confiavel;
  return REPUTATION_LEVELS.iniciante;
};

export const getNextLevel = (points) => {
  if (points >= 1000) return null; // Já é o nível máximo
  if (points >= 300) return REPUTATION_LEVELS.embaixador;
  if (points >= 100) return REPUTATION_LEVELS.lider;
  return REPUTATION_LEVELS.confiavel;
};

export const calculateProgress = (points) => {
  const currentLevel = getReputationLevel(points);
  const nextLevel = getNextLevel(points);
  
  if (!nextLevel) return 100; // Nível máximo alcançado
  
  const pointsInCurrentRange = points - currentLevel.minPoints;
  const totalPointsInRange = nextLevel.minPoints - currentLevel.minPoints;
  
  return Math.min(Math.max((pointsInCurrentRange / totalPointsInRange) * 100, 0), 100);
};

export default function ReputationBadge({ 
  points = 0, 
  showPoints = true, 
  size = 'medium', // 'small', 'medium', 'large'
  animated = false,
  compact = false,
  className = ''
}) {
  const level = getReputationLevel(points);
  const levelKey = Object.keys(REPUTATION_LEVELS).find(
    key => REPUTATION_LEVELS[key].name === level.name
  );

  return (
    <div 
      className={`reputation-badge ${levelKey} ${size} ${animated ? 'animated' : ''} ${compact ? 'compact' : ''} ${className}`}
      title={`${level.name} - ${points} pontos de reputação`}
    >
      <span className="reputation-badge-icon">{level.icon}</span>
      <div className="reputation-badge-text">
        <span className="reputation-badge-level">{level.name}</span>
        {showPoints && !compact && (
          <span className="reputation-badge-points">{points} pts</span>
        )}
      </div>
    </div>
  );
}
