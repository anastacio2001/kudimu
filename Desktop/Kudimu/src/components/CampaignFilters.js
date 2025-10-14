import React, { useState } from 'react';
import './CampaignFilters.css';

export default function CampaignFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    tema: '',
    duracao: '',
    recompensaMin: 0
  });

  const temas = [
    { value: '', label: 'Todos os temas' },
    { value: 'consumo', label: '🛒 Consumo' },
    { value: 'saude', label: '🏥 Saúde' },
    { value: 'educacao', label: '📚 Educação' },
    { value: 'transporte', label: '🚗 Transporte' },
    { value: 'tecnologia', label: '💻 Tecnologia' },
    { value: 'alimentacao', label: '🍽️ Alimentação' },
    { value: 'entretenimento', label: '🎮 Entretenimento' },
    { value: 'financas', label: '💰 Finanças' },
    { value: 'meio_ambiente', label: '🌍 Meio Ambiente' },
    { value: 'social', label: '🤝 Social' }
  ];

  const duracoes = [
    { value: '', label: 'Qualquer duração' },
    { value: '5', label: '⚡ Rápida (até 5 min)' },
    { value: '10', label: '⏱️ Média (5-10 min)' },
    { value: '15', label: '⏳ Longa (10-15 min)' },
    { value: '15+', label: '🕐 Muito longa (15+ min)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { tema: '', duracao: '', recompensaMin: 0 };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.tema || filters.duracao || filters.recompensaMin > 0;

  return (
    <div className="campaign-filters">
      <div className="filters-header">
        <h3>🔍 Filtrar Campanhas</h3>
        {hasActiveFilters && (
          <button className="btn-clear-filters" onClick={handleClearFilters}>
            ✕ Limpar filtros
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Filtro por Tema */}
        <div className="filter-group">
          <label htmlFor="filter-tema">Tema</label>
          <select
            id="filter-tema"
            className="filter-select"
            value={filters.tema}
            onChange={(e) => handleFilterChange('tema', e.target.value)}
          >
            {temas.map(tema => (
              <option key={tema.value} value={tema.value}>
                {tema.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Duração */}
        <div className="filter-group">
          <label htmlFor="filter-duracao">Duração</label>
          <select
            id="filter-duracao"
            className="filter-select"
            value={filters.duracao}
            onChange={(e) => handleFilterChange('duracao', e.target.value)}
          >
            {duracoes.map(duracao => (
              <option key={duracao.value} value={duracao.value}>
                {duracao.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Recompensa Mínima */}
        <div className="filter-group">
          <label htmlFor="filter-recompensa">
            Recompensa mínima: {filters.recompensaMin} pontos
          </label>
          <input
            id="filter-recompensa"
            type="range"
            min="0"
            max="100"
            step="5"
            className="filter-slider"
            value={filters.recompensaMin}
            onChange={(e) => handleFilterChange('recompensaMin', parseInt(e.target.value))}
          />
          <div className="slider-labels">
            <span>0</span>
            <span>50</span>
            <span>100+</span>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Filtros ativos:</span>
          {filters.tema && (
            <span className="filter-badge">
              {temas.find(t => t.value === filters.tema)?.label}
            </span>
          )}
          {filters.duracao && (
            <span className="filter-badge">
              {duracoes.find(d => d.value === filters.duracao)?.label}
            </span>
          )}
          {filters.recompensaMin > 0 && (
            <span className="filter-badge">
              ≥ {filters.recompensaMin} pontos
            </span>
          )}
        </div>
      )}

    </div>
  );
}
