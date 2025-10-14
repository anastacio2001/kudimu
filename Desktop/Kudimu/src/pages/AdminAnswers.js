import React, { useState, useEffect } from 'react';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function AdminAnswers() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [validadaFilter, setValidadaFilter] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    fetchAnswers();
  }, [validadaFilter]);

  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({ limit: '50' });
      if (validadaFilter !== '') params.append('validada', validadaFilter);

      const response = await fetch(`${API_URL}/admin/answers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setAnswers(data.data);
      } else {
        setError(data.error || 'Erro ao carregar respostas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateAnswer = async (answerId, validada) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/admin/answers/${answerId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ validada })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(validada === 1 ? 'Resposta aprovada!' : 'Resposta rejeitada!');
        setSelectedAnswer(null);
        fetchAnswers();
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (err) {
      alert('Erro ao validar resposta');
    }
  };

  const parseResposta = (resposta) => {
    try {
      const parsed = JSON.parse(resposta);
      if (typeof parsed === 'object') {
        return JSON.stringify(parsed, null, 2);
      }
      return resposta;
    } catch {
      return resposta;
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>💬 Revisar Respostas</h1>
        <p>Total: {answers.length} respostas</p>
      </header>

      {/* Filtros */}
      <section className="filters-section">
        <div className="filters-row">
          <select 
            value={validadaFilter} 
            onChange={(e) => setValidadaFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas as Respostas</option>
            <option value="1">✓ Aprovadas</option>
            <option value="0">✗ Pendentes/Rejeitadas</option>
          </select>

          <button onClick={fetchAnswers} className="btn-secondary">
            🔄 Atualizar
          </button>
        </div>
      </section>

      {/* Lista de Respostas */}
      {loading ? (
        <div className="loading">Carregando respostas...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : answers.length === 0 ? (
        <div className="empty-state">
          <p>📭 Nenhuma resposta encontrada</p>
        </div>
      ) : (
        <div className="answers-list">
          {answers.map((answer) => (
            <div key={answer.id} className={`answer-card ${answer.validada === 1 ? 'validated' : 'pending'}`}>
              <div className="answer-header">
                <div className="answer-user-info">
                  <strong>{answer.usuario_nome}</strong>
                  <span className="answer-email">{answer.usuario_email}</span>
                </div>
                <span className={`validation-badge ${answer.validada === 1 ? 'approved' : 'pending'}`}>
                  {answer.validada === 1 ? '✓ Aprovada' : '⏳ Pendente'}
                </span>
              </div>

              <div className="answer-campaign-info">
                <div><strong>Campanha:</strong> {answer.campanha_titulo}</div>
                <div><strong>Pergunta:</strong> {answer.pergunta_texto}</div>
              </div>

              <div className="answer-content">
                <strong>Resposta:</strong>
                <div className="answer-text">
                  {parseResposta(answer.resposta)}
                </div>
              </div>

              <div className="answer-metadata">
                <span>📅 {new Date(answer.data_resposta).toLocaleString('pt-AO')}</span>
                {answer.tempo_resposta && (
                  <span>⏱️ {answer.tempo_resposta}s</span>
                )}
              </div>

              <div className="answer-actions">
                <button
                  onClick={() => setSelectedAnswer(answer)}
                  className="btn-secondary btn-sm"
                >
                  👁️ Ver Detalhes
                </button>
                {answer.validada !== 1 && (
                  <button
                    onClick={() => handleValidateAnswer(answer.id, 1)}
                    className="btn-success btn-sm"
                  >
                    ✓ Aprovar
                  </button>
                )}
                {answer.validada === 1 && (
                  <button
                    onClick={() => handleValidateAnswer(answer.id, 0)}
                    className="btn-danger btn-sm"
                  >
                    ✗ Rejeitar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedAnswer && (
        <AnswerDetailsModal
          answer={selectedAnswer}
          onClose={() => setSelectedAnswer(null)}
          onValidate={handleValidateAnswer}
        />
      )}
    </div>
  );
}

function AnswerDetailsModal({ answer, onClose, onValidate }) {
  const parseResposta = (resposta) => {
    try {
      const parsed = JSON.parse(resposta);
      if (typeof parsed === 'object') {
        return JSON.stringify(parsed, null, 2);
      }
      return resposta;
    } catch {
      return resposta;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👁️ Detalhes da Resposta</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
        
        <div className="modal-body">
          <div className="detail-section">
            <h3>👤 Informações do Usuário</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Nome:</strong> {answer.usuario_nome}
              </div>
              <div className="detail-item">
                <strong>Email:</strong> {answer.usuario_email}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>📋 Informações da Campanha</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Campanha:</strong> {answer.campanha_titulo}
              </div>
              <div className="detail-item">
                <strong>Pergunta:</strong> {answer.pergunta_texto}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>💬 Resposta</h3>
            <div className="detail-response">
              <pre>{parseResposta(answer.resposta)}</pre>
            </div>
          </div>

          <div className="detail-section">
            <h3>📊 Metadados</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <strong>Data:</strong> {new Date(answer.data_resposta).toLocaleString('pt-AO')}
              </div>
              {answer.tempo_resposta && (
                <div className="detail-item">
                  <strong>Tempo:</strong> {answer.tempo_resposta}s
                </div>
              )}
              <div className="detail-item">
                <strong>Status:</strong>
                <span className={`validation-badge ${answer.validada === 1 ? 'approved' : 'pending'}`}>
                  {answer.validada === 1 ? '✓ Aprovada' : '⏳ Pendente'}
                </span>
              </div>
            </div>
          </div>

          {answer.motivo_rejeicao && (
            <div className="detail-section">
              <h3>⚠️ Motivo da Rejeição</h3>
              <div className="rejection-reason">
                {answer.motivo_rejeicao}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Fechar
          </button>
          {answer.validada !== 1 && (
            <button
              onClick={() => {
                onValidate(answer.id, 1);
                onClose();
              }}
              className="btn-success"
            >
              ✓ Aprovar Resposta
            </button>
          )}
          {answer.validada === 1 && (
            <button
              onClick={() => {
                onValidate(answer.id, 0);
                onClose();
              }}
              className="btn-danger"
            >
              ✗ Rejeitar Resposta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
