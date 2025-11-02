import React, { useState, useEffect } from 'react';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function AIInsights({ navigateTo }) {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spamTest, setSpamTest] = useState('');
  const [spamResult, setSpamResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/campaigns`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setCampaigns(data.data);
      }
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
    }
  };

  const generateInsights = async (campaignId) => {
    setLoading(true);
    setError('');
    setInsights(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ai/campaign-insights/${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setInsights(data.data);
        setSelectedCampaign(campaignId);
      } else {
        setError(data.error || 'Erro ao gerar insights');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const testSpamDetection = async () => {
    if (!spamTest.trim()) {
      setError('Digite um texto para testar');
      return;
    }

    setLoading(true);
    setError('');
    setSpamResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ai/detect-spam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: spamTest })
      });

      const data = await response.json();
      
      if (data.success) {
        setSpamResult(data.data);
      } else {
        setError(data.error || 'Erro ao detectar spam');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insights-container">
      <div className="ai-header">
        <h1>🤖 AI Insights</h1>
        <p>Análise inteligente de campanhas e detecção de spam com Workers AI</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Seção de Insights de Campanhas */}
      <div className="section">
        <h2>📊 Insights de Campanhas</h2>
        <p className="section-description">
          Gere insights inteligentes sobre campanhas usando análise de sentimentos e IA
        </p>

        <div className="campaigns-grid">
          {campaigns.map((campaign) => (
            <div key={campaign.campanha_id} className="campaign-card">
              <h3>{campaign.titulo}</h3>
              <div className="campaign-meta">
                <span>📝 {campaign.total_respostas || 0} respostas</span>
                <span>👥 {campaign.participantes_unicos || 0} participantes</span>
              </div>
              <button
                className="btn-generate"
                onClick={() => generateInsights(campaign.campanha_id)}
                disabled={loading || !campaign.total_respostas}
              >
                {loading && selectedCampaign === campaign.campanha_id ? '⏳ Analisando...' : '🚀 Gerar Insights'}
              </button>
            </div>
          ))}
        </div>

        {insights && (
          <div className="insights-result">
            <h3>📈 Insights: {insights.campaign_title}</h3>
            
            <div className="insight-stat">
              <span className="label">Total de Respostas:</span>
              <span className="value">{insights.total_answers}</span>
            </div>

            <div className="insight-section">
              <h4>😊 Sentimento Geral</h4>
              <div className={`sentiment-badge sentiment-${insights.insights.overall_sentiment}`}>
                {insights.insights.overall_sentiment === 'positivo' && '😊 Positivo'}
                {insights.insights.overall_sentiment === 'neutro' && '😐 Neutro'}
                {insights.insights.overall_sentiment === 'negativo' && '😞 Negativo'}
              </div>
            </div>

            <div className="insight-section">
              <h4>⭐ Score de Satisfação</h4>
              <div className="satisfaction-score">
                <div className="score-bar">
                  <div 
                    className="score-fill"
                    style={{ width: `${insights.insights.satisfaction_score * 10}%` }}
                  />
                </div>
                <span className="score-text">{insights.insights.satisfaction_score}/10</span>
              </div>
            </div>

            <div className="insight-section">
              <h4>🔍 Principais Descobertas</h4>
              <ul>
                {insights.insights.key_findings?.map((finding, idx) => (
                  <li key={idx}>{finding}</li>
                ))}
              </ul>
            </div>

            <div className="insight-section">
              <h4>💡 Temas Comuns</h4>
              <div className="themes">
                {insights.insights.common_themes?.map((theme, idx) => (
                  <span key={idx} className="theme-tag">{theme}</span>
                ))}
              </div>
            </div>

            <div className="insight-section">
              <h4>🎯 Recomendações</h4>
              <ul>
                {insights.insights.recommendations?.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Seção de Detecção de Spam */}
      <div className="section">
        <h2>🛡️ Detecção de Spam</h2>
        <p className="section-description">
          Teste o detector de spam usando Workers AI para identificar respostas inválidas
        </p>

        <div className="spam-detector">
          <textarea
            value={spamTest}
            onChange={(e) => setSpamTest(e.target.value)}
            placeholder="Digite ou cole um texto para testar se é spam..."
            rows={5}
          />
          <button
            className="btn-test"
            onClick={testSpamDetection}
            disabled={loading || !spamTest.trim()}
          >
            {loading ? '⏳ Analisando...' : '🔍 Detectar Spam'}
          </button>
        </div>

        {spamResult && (
          <div className={`spam-result ${spamResult.is_spam ? 'is-spam' : 'not-spam'}`}>
            <div className="spam-verdict">
              {spamResult.is_spam ? '🚫 SPAM DETECTADO' : '✅ TEXTO VÁLIDO'}
            </div>
            <div className="spam-details">
              <div className="detail-row">
                <span className="label">Confiança:</span>
                <span className="value">{(spamResult.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="detail-row">
                <span className="label">Motivo:</span>
                <span className="value">{spamResult.reason}</span>
              </div>
            </div>
          </div>
        )}

        <div className="spam-examples">
          <h4>Exemplos de Teste:</h4>
          <button 
            className="btn-example"
            onClick={() => setSpamTest('Eu gosto muito deste produto, a qualidade é excelente e o atendimento foi ótimo. Recomendo!')}
          >
            ✅ Texto Válido
          </button>
          <button 
            className="btn-example"
            onClick={() => setSpamTest('asdjkasd jkasd jkasd jkasd jkasd')}
          >
            🚫 Texto Spam
          </button>
          <button 
            className="btn-example"
            onClick={() => setSpamTest('sim')}
          >
            ⚠️ Resposta Curta
          </button>
        </div>
      </div>

      <style jsx>{`
        .ai-insights-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .ai-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .ai-header h1 {
          font-size: 42px;
          margin: 0 0 10px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ai-header p {
          color: #666;
          font-size: 16px;
        }

        .section {
          background: white;
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .section h2 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 28px;
        }

        .section-description {
          color: #666;
          margin: 0 0 25px 0;
        }

        .alert {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .alert-error {
          background: #fee;
          color: #c33;
          border-left: 4px solid #c33;
        }

        .campaigns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .campaign-card {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          transition: border-color 0.2s;
        }

        .campaign-card:hover {
          border-color: #667eea;
        }

        .campaign-card h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
        }

        .campaign-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          font-size: 14px;
          color: #666;
        }

        .btn-generate {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-generate:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-generate:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .insights-result {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 25px;
          margin-top: 25px;
        }

        .insights-result h3 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 22px;
        }

        .insight-stat {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background: white;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .insight-section {
          margin-bottom: 25px;
        }

        .insight-section h4 {
          margin: 0 0 12px 0;
          color: #555;
          font-size: 16px;
        }

        .sentiment-badge {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 16px;
        }

        .sentiment-positivo {
          background: #d4edda;
          color: #155724;
        }

        .sentiment-neutro {
          background: #fff3cd;
          color: #856404;
        }

        .sentiment-negativo {
          background: #f8d7da;
          color: #721c24;
        }

        .satisfaction-score {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .score-bar {
          flex: 1;
          height: 24px;
          background: #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
          transition: width 0.3s ease;
        }

        .score-text {
          font-weight: 600;
          color: #333;
          min-width: 50px;
        }

        .insight-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .insight-section li {
          margin-bottom: 8px;
          color: #555;
          line-height: 1.6;
        }

        .themes {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .theme-tag {
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .spam-detector {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 25px;
        }

        .spam-detector textarea {
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }

        .spam-detector textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .btn-test {
          padding: 14px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-test:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-test:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spam-result {
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 25px;
        }

        .spam-result.is-spam {
          background: #f8d7da;
          border: 2px solid #f5c6cb;
        }

        .spam-result.not-spam {
          background: #d4edda;
          border: 2px solid #c3e6cb;
        }

        .spam-verdict {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .spam-result.is-spam .spam-verdict {
          color: #721c24;
        }

        .spam-result.not-spam .spam-verdict {
          color: #155724;
        }

        .spam-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
        }

        .detail-row .label {
          font-weight: 600;
          color: #555;
        }

        .detail-row .value {
          color: #333;
        }

        .spam-examples h4 {
          margin: 0 0 15px 0;
          color: #555;
          font-size: 16px;
        }

        .spam-examples {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .btn-example {
          padding: 10px 16px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .btn-example:hover {
          border-color: #667eea;
          background: #f8f9fa;
        }

        @media (max-width: 768px) {
          .campaigns-grid {
            grid-template-columns: 1fr;
          }

          .spam-examples {
            flex-direction: column;
          }

          .btn-example {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
