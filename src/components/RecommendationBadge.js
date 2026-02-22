import React from 'react';
import './RecommendationBadge.css';
import { getRecommendationLabel } from '../utils/recommendations';

export default function RecommendationBadge({ score, size = 'medium', className = '' }) {
  const recommendation = getRecommendationLabel(score);
  
  if (!recommendation) return null;

  return (
    <div 
      className={`recommendation-badge ${size} ${className}`}
      style={{
        background: recommendation.bgColor,
        color: recommendation.color,
        borderColor: recommendation.color
      }}
      title={`Score de relevância: ${score}/100`}
    >
      <span className="recommendation-text">{recommendation.text}</span>
      <span className="recommendation-score">{score}%</span>
    </div>
  );
}
