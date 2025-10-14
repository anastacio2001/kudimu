import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './QuestionnaireScreen.css';

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function QuestionnaireScreen() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  
  const [campaign, setCampaign] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    fetchCampaignDetails();
    loadSavedProgress();
  }, [campaignId]);

  useEffect(() => {
    // Salvar progresso automaticamente a cada 10 segundos
    const interval = setInterval(() => {
      saveProgress();
    }, 10000);

    return () => clearInterval(interval);
  }, [answers]);

  useEffect(() => {
    // Resetar timer quando muda de pergunta
    setQuestionStartTime(Date.now());
  }, [currentQuestionIndex]);

  const fetchCampaignDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setCampaign(data.data.campaign);
        setQuestions(data.data.questions || []);
      } else {
        setError(data.error || 'Erro ao carregar campanha');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProgress = () => {
    const saved = localStorage.getItem(`questionnaire_${campaignId}`);
    if (saved) {
      const { answers: savedAnswers, currentIndex } = JSON.parse(saved);
      setAnswers(savedAnswers || {});
      setCurrentQuestionIndex(currentIndex || 0);
    }
  };

  const saveProgress = () => {
    localStorage.setItem(`questionnaire_${campaignId}`, JSON.stringify({
      answers,
      currentIndex: currentQuestionIndex,
      timestamp: Date.now()
    }));
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        resposta: value,
        tempo_resposta: Math.floor((Date.now() - questionStartTime) / 1000)
      }
    }));
  };

  const isQuestionAnswered = (questionId) => {
    return answers[questionId] && answers[questionId].resposta !== '';
  };

  const canGoNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return isQuestionAnswered(currentQuestion.pergunta_id);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Validar se todas as perguntas foram respondidas
    const unansweredQuestions = questions.filter(q => !isQuestionAnswered(q.pergunta_id));
    
    if (unansweredQuestions.length > 0) {
      setError(`Por favor, responda todas as ${questions.length} perguntas antes de enviar.`);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const totalTime = Math.floor((Date.now() - startTime) / 1000);

      // Preparar respostas no formato esperado pelo backend
      const respostasArray = questions.map(q => ({
        pergunta_id: q.pergunta_id,
        resposta: answers[q.pergunta_id].resposta,
        tempo_resposta: answers[q.pergunta_id].tempo_resposta
      }));

      const response = await fetch(`${API_URL}/answers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campanha_id: parseInt(campaignId),
          respostas: respostasArray,
          tempo_total: totalTime
        })
      });

      const data = await response.json();

      if (data.success) {
        // Limpar progresso salvo
        localStorage.removeItem(`questionnaire_${campaignId}`);
        
        // Navegar para tela de confirmação com dados da resposta
        navigate('/confirmation', {
          state: {
            campaign,
            recompensa: data.data.recompensa,
            pontos: data.data.pontos,
            validacao: data.data.validacao
          }
        });
      } else {
        setError(data.error || 'Erro ao enviar respostas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const answer = answers[question.pergunta_id]?.resposta || '';

    switch (question.tipo) {
      case 'multipla_escolha':
        const opcoes = typeof question.opcoes === 'string' 
          ? JSON.parse(question.opcoes) 
          : question.opcoes;
        
        return (
          <div className="question-options">
            {opcoes.map((opcao, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={`question_${question.pergunta_id}`}
                  value={opcao}
                  checked={answer === opcao}
                  onChange={(e) => handleAnswerChange(question.pergunta_id, e.target.value)}
                />
                <span className="option-text">{opcao}</span>
              </label>
            ))}
          </div>
        );

      case 'texto_livre':
        return (
          <textarea
            className="text-input"
            placeholder="Digite sua resposta aqui..."
            value={answer}
            onChange={(e) => handleAnswerChange(question.pergunta_id, e.target.value)}
            rows={5}
          />
        );

      case 'escala':
        const escalaMax = question.opcoes ? parseInt(question.opcoes) : 5;
        return (
          <div className="scale-input">
            <div className="scale-labels">
              <span>1</span>
              <span>{escalaMax}</span>
            </div>
            <input
              type="range"
              min="1"
              max={escalaMax}
              value={answer || 1}
              onChange={(e) => handleAnswerChange(question.pergunta_id, e.target.value)}
              className="scale-slider"
            />
            <div className="scale-value">Valor selecionado: {answer || 1}</div>
          </div>
        );

      case 'sim_nao':
        return (
          <div className="question-options yes-no">
            <label className="option-label">
              <input
                type="radio"
                name={`question_${question.pergunta_id}`}
                value="Sim"
                checked={answer === 'Sim'}
                onChange={(e) => handleAnswerChange(question.pergunta_id, e.target.value)}
              />
              <span className="option-text">✓ Sim</span>
            </label>
            <label className="option-label">
              <input
                type="radio"
                name={`question_${question.pergunta_id}`}
                value="Não"
                checked={answer === 'Não'}
                onChange={(e) => handleAnswerChange(question.pergunta_id, e.target.value)}
              />
              <span className="option-text">✗ Não</span>
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            className="text-input"
            placeholder="Digite sua resposta..."
            value={answer}
            onChange={(e) => handleAnswerChange(question.pergunta_id, e.target.value)}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="questionnaire-container">
        <div className="loading">⏳ Carregando questionário...</div>
      </div>
    );
  }

  if (!campaign || questions.length === 0) {
    return (
      <div className="questionnaire-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Questionário não encontrado</h2>
          <p>Esta campanha não possui perguntas disponíveis.</p>
          <button onClick={() => navigate('/campaigns')} className="btn-back">
            Voltar para Campanhas
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).filter(id => answers[id]?.resposta).length;

  return (
    <div className="questionnaire-container">
      {/* Header com informações da campanha */}
      <div className="questionnaire-header">
        <button onClick={() => navigate('/campaigns')} className="btn-back-small">
          ← Voltar
        </button>
        <div className="campaign-info-header">
          <h2>{campaign.titulo}</h2>
          <span className="reward-badge">💰 {campaign.recompensa_por_resposta} pontos</span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-text">
            Pergunta {currentQuestionIndex + 1} de {questions.length}
          </span>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-hint">
          {answeredCount} de {questions.length} perguntas respondidas
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Pergunta atual */}
      <div className="question-card">
        <div className="question-number">Pergunta {currentQuestionIndex + 1}</div>
        <h3 className="question-text">{currentQuestion.texto}</h3>
        {currentQuestion.descricao && (
          <p className="question-description">{currentQuestion.descricao}</p>
        )}
        
        <div className="question-type-badge">
          {currentQuestion.tipo === 'multipla_escolha' && '📝 Múltipla escolha'}
          {currentQuestion.tipo === 'texto_livre' && '✍️ Texto livre'}
          {currentQuestion.tipo === 'escala' && '📊 Escala'}
          {currentQuestion.tipo === 'sim_nao' && '✓ Sim/Não'}
        </div>

        {renderQuestion(currentQuestion)}
      </div>

      {/* Navegação */}
      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn-nav btn-previous"
        >
          ← Anterior
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="btn-nav btn-next"
          >
            Próxima →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || answeredCount < questions.length}
            className="btn-nav btn-submit"
          >
            {submitting ? '⏳ Enviando...' : '🚀 Enviar Respostas'}
          </button>
        )}
      </div>

      {/* Indicador de perguntas */}
      <div className="questions-indicator">
        {questions.map((q, index) => (
          <div
            key={q.pergunta_id}
            className={`indicator-dot ${index === currentQuestionIndex ? 'active' : ''} ${isQuestionAnswered(q.pergunta_id) ? 'answered' : ''}`}
            onClick={() => setCurrentQuestionIndex(index)}
          />
        ))}
      </div>

      
    </div>
  );
}
