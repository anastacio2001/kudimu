import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

// Detectar se estamos em desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';

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
        setCampaign(data.data);
        
        // Garantir que questions é sempre um array
        let questionsArray = data.data.questions || [];
        
        // Se questions é uma string, tentar parsear como JSON
        if (typeof questionsArray === 'string') {
          try {
            questionsArray = JSON.parse(questionsArray);
          } catch (e) {
            console.error('Erro ao parsear questions:', e);
            questionsArray = [];
          }
        }
        
        // Garantir que é um array
        if (!Array.isArray(questionsArray)) {
          questionsArray = [];
        }
        
        console.log('[QuestionnaireScreen] Questions carregadas:', questionsArray);
        setQuestions(questionsArray);
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
    return isQuestionAnswered(currentQuestion.id);
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
    const unansweredQuestions = questions.filter(q => !isQuestionAnswered(q.id));
    
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
        pergunta_id: q.id, // Usar q.id em vez de q.pergunta_id
        resposta: answers[q.id].resposta,
        tempo_resposta: answers[q.id].tempo_resposta || 0
      }));

      const requestData = {
        campanha_id: parseInt(campaignId),
        respostas: respostasArray,
        tempo_total: totalTime
      };

      const response = await fetch(`${API_URL}/campaigns/${campaignId}/answers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
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
      setError('Erro ao conectar com o servidor: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const answer = answers[question.id]?.resposta || '';

    switch (question.type) {
      case 'multiple_choice':
        const opcoes = question.options || [];
        
        return (
          <div className="space-y-3">
            {opcoes.map((opcao, index) => (
              <label
                key={index}
                className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  answer === opcao
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800'
                }`}
              >
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={opcao}
                  checked={answer === opcao}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className={`ml-3 text-sm font-medium ${
                  answer === opcao 
                    ? 'text-blue-900 dark:text-blue-100' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {opcao}
                </span>
                {answer === opcao && (
                  <span className="ml-auto text-blue-500">✓</span>
                )}
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <div>
            <textarea
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
              placeholder="Digite sua resposta aqui..."
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              rows={5}
            />
          </div>
        );

      case 'rating':
        const escalaMax = question.scale || 5;
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>1 (Muito baixo)</span>
              <span>{escalaMax} (Muito alto)</span>
            </div>
            <div className="px-2">
              <input
                type="range"
                min="1"
                max={escalaMax}
                value={answer || 1}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="text-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 font-semibold">
                ⭐ Valor selecionado: {answer || 1}
              </span>
            </div>
          </div>
        );

      case 'yes_no':
        return (
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'Sim', emoji: '✅', color: 'green' },
              { value: 'Não', emoji: '❌', color: 'red' }
            ].map((option, index) => (
              <label
                key={option.value}
                className={`relative flex flex-col items-center p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  answer === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                }`}
              >
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={option.value}
                  checked={answer === option.value}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="sr-only"
                />
                <span className="text-3xl mb-2">{option.emoji}</span>
                <span className={`text-lg font-semibold ${
                  answer === option.value 
                    ? `text-${option.color}-900 dark:text-${option.color}-100` 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {option.value}
                </span>
                {answer === option.value && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </label>
            ))}
          </div>
        );

      default:
        return (
          <div>
            <input
              type="text"
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Digite sua resposta..."
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          </div>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout activePage="campaigns">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Carregando questionário</h2>
            <p className="text-gray-600 dark:text-gray-400">Aguarde um momento...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout activePage="campaigns">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Ops! Algo deu errado</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/campaigns')} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Voltar para Campanhas
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Campaign not found state
  if (!campaign || questions.length === 0) {
    return (
      <MainLayout activePage="campaigns">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Questionário não encontrado</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Esta campanha não possui perguntas disponíveis ou foi removida.</p>
            <button 
              onClick={() => navigate('/campaigns')} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Voltar para Campanhas
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).filter(id => answers[id]?.resposta).length;

  return (
    <MainLayout activePage="campaigns">
      {/* Campaign Info Banner */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{campaign.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">Questionário de pesquisa</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            💰 {campaign.reward} pontos
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">⏰</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pergunta {currentQuestionIndex + 1} de {questions.length}
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {answeredCount} de {questions.length} perguntas respondidas
            </p>
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            {/* Question Header */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {currentQuestionIndex + 1}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-blue-500">
                    {currentQuestion.type === 'multiple_choice' && '📝'}
                    {currentQuestion.type === 'text' && '✍️'}
                    {currentQuestion.type === 'rating' && '⭐'}
                    {currentQuestion.type === 'yes_no' && '✅'}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {currentQuestion.type === 'multiple_choice' && 'Múltipla escolha'}
                    {currentQuestion.type === 'text' && 'Texto livre'}
                    {currentQuestion.type === 'rating' && `Escala de 1 a ${currentQuestion.scale || 5}`}
                    {currentQuestion.type === 'yes_no' && 'Sim/Não'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>
                {currentQuestion.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {currentQuestion.description}
                  </p>
                )}
              </div>
            </div>

            {/* Question Content */}
            <div className="ml-16">
              {renderQuestion(currentQuestion)}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || answeredCount < questions.length}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      ✈️ Enviar Respostas
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Indicators */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-center space-x-2 flex-wrap">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentQuestionIndex
                      ? 'bg-blue-500 ring-2 ring-blue-200 ring-offset-2 dark:ring-offset-gray-800'
                      : isQuestionAnswered(q.id)
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  title={`Pergunta ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
