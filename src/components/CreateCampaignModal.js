import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  SparklesIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';
import AIAssistantSidebar from './AIAssistantSidebar';

export default function CreateCampaignModal({ isOpen, onClose, onSave }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showAISidebar, setShowAISidebar] = useState(true);
  const [validacaoEtica, setValidacaoEtica] = useState(null);
  const [orcamentoOtimo, setOrcamentoOtimo] = useState(null);
  const [formData, setFormData] = useState({
    // Informações básicas
    titulo: '',
    descricao: '',
    categoria: '',
    tags: [],
    
    // Configurações
    meta_respostas: 100,
    recompensa_por_resposta: 500,
    orcamento_total: 50000,
    data_inicio: '',
    data_fim: '',
    tempo_estimado: 10,
    
    // Targeting
    localizacao_alvo: '',
    idade_min: 18,
    idade_max: 65,
    genero_target: 'todos',
    interesses_target: [],
    nivel_educacao: 'todos',
    
    // Perguntas
    perguntas: [
      {
        id: 1,
        tipo: 'multipla_escolha',
        pergunta: '',
        opcoes: ['', ''],
        obrigatoria: true
      }
    ]
  });

  const steps = [
    { id: 1, title: 'Informações Básicas', icon: QuestionMarkCircleIcon },
    { id: 2, title: 'Configurações', icon: CurrencyDollarIcon },
    { id: 3, title: 'Público-Alvo', icon: UserGroupIcon },
    { id: 4, title: 'Perguntas', icon: QuestionMarkCircleIcon },
    { id: 5, title: 'Revisão', icon: ClockIcon }
  ];

  const categorias = [
    'Alimentação', 'Transporte', 'Tecnologia', 'Educação', 'Saúde',
    'Entretenimento', 'Moda', 'Finanças', 'Meio Ambiente', 'Política'
  ];

  const interessesDisponiveis = [
    'Tecnologia', 'Esportes', 'Música', 'Cinema', 'Leitura', 'Viagem',
    'Culinária', 'Moda', 'Arte', 'Negócios', 'Educação', 'Saúde'
  ];

  const tiposPerguntas = [
    { value: 'multipla_escolha', label: 'Múltipla Escolha' },
    { value: 'texto_livre', label: 'Texto Livre' },
    { value: 'escala', label: 'Escala (1-10)' },
    { value: 'sim_nao', label: 'Sim/Não' },
    { value: 'data', label: 'Data' },
    { value: 'numero', label: 'Número' }
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Você precisa estar logado para criar uma campanha');
        setLoading(false);
        return;
      }

      // Preparar dados para envio
      const campaignData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria: formData.categoria,
        recompensa: formData.recompensa_por_resposta,
        meta_participantes: formData.meta_respostas,
        orcamento_total: formData.orcamento_total,
        data_inicio: formData.data_inicio || new Date().toISOString(),
        data_fim: formData.data_fim,
        tempo_estimado: formData.tempo_estimado,
        perguntas: formData.perguntas,
        // Targeting
        localizacao_alvo: formData.localizacao_alvo,
        idade_min: formData.idade_min,
        idade_max: formData.idade_max,
        genero_target: formData.genero_target,
        interesses_target: formData.interesses_target,
        nivel_educacao: formData.nivel_educacao,
        tags: formData.tags
      };

      const response = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
      });

      const result = await response.json();

      if (result.success) {
        // Notificar sucesso
        if (onSave) {
          onSave(result.data);
        }
        // Resetar formulário
        setCurrentStep(1);
        setError('');
        onClose();
      } else {
        setError(result.error || 'Erro ao criar campanha');
      }
    } catch (err) {
      console.error('Erro ao criar campanha:', err);
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addPergunta = () => {
    const newPergunta = {
      id: Date.now(),
      tipo: 'multipla_escolha',
      pergunta: '',
      opcoes: ['', ''],
      obrigatoria: true
    };
    setFormData({
      ...formData,
      perguntas: [...formData.perguntas, newPergunta]
    });
  };

  const removePergunta = (id) => {
    setFormData({
      ...formData,
      perguntas: formData.perguntas.filter(p => p.id !== id)
    });
  };

  const updatePergunta = (id, updates) => {
    setFormData({
      ...formData,
      perguntas: formData.perguntas.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    });
  };

  const addOpcao = (perguntaId) => {
    updatePergunta(perguntaId, {
      opcoes: [...formData.perguntas.find(p => p.id === perguntaId).opcoes, '']
    });
  };

  const removeOpcao = (perguntaId, opcaoIndex) => {
    const pergunta = formData.perguntas.find(p => p.id === perguntaId);
    const novasOpcoes = pergunta.opcoes.filter((_, index) => index !== opcaoIndex);
    updatePergunta(perguntaId, { opcoes: novasOpcoes });
  };

  const updateOpcao = (perguntaId, opcaoIndex, valor) => {
    const pergunta = formData.perguntas.find(p => p.id === perguntaId);
    const novasOpcoes = [...pergunta.opcoes];
    novasOpcoes[opcaoIndex] = valor;
    updatePergunta(perguntaId, { opcoes: novasOpcoes });
  };

  // FUNÇÃO AI: Otimizar orçamento
  const otimizarOrcamento = async () => {
    if (!formData.categoria || !formData.meta_respostas) {
      return;
    }

    setLoadingAI(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ai/optimize-budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          meta_respostas: formData.meta_respostas,
          categoria: formData.categoria,
          duracao_dias: formData.tempo_estimado || 14
        })
      });

      const data = await response.json();
      if (data.success) {
        setOrcamentoOtimo(data.data);
      }
    } catch (err) {
      console.error('Erro ao otimizar orçamento:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // FUNÇÃO AI: Validar ética
  const validarEtica = async () => {
    if (!formData.titulo || !formData.descricao) {
      return;
    }

    setLoadingAI(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ai/validate-ethics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: formData.titulo,
          descricao: formData.descricao,
          perguntas: formData.perguntas.map(p => ({ pergunta: p.pergunta }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setValidacaoEtica(data.data);
      }
    } catch (err) {
      console.error('Erro ao validar ética:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // FUNÇÃO AI: Gerar perguntas automaticamente
  const gerarPerguntasIA = async () => {
    if (!formData.descricao || formData.descricao.length < 10) {
      return;
    }

    setLoadingAI(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ai/generate-campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          descricao: formData.descricao,
          categoria: formData.categoria,
          modo: 'assisted'
        })
      });

      const data = await response.json();
      if (data.success && data.data.campanha_gerada.perguntas) {
        setAiSuggestions(data.data);
        // Opção: aplicar automaticamente
        // setFormData({
        //   ...formData,
        //   perguntas: data.data.campanha_gerada.perguntas
        // });
      }
    } catch (err) {
      console.error('Erro ao gerar perguntas:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Aplicar sugestão de orçamento otimizado
  const aplicarOrcamentoOtimo = () => {
    if (orcamentoOtimo?.recomendacao) {
      setFormData({
        ...formData,
        recompensa_por_resposta: orcamentoOtimo.recomendacao.recompensa_por_resposta,
        orcamento_total: orcamentoOtimo.recomendacao.orcamento_total
      });
    }
  };

  // Aplicar perguntas sugeridas pela IA
  const aplicarPerguntasIA = () => {
    if (aiSuggestions?.campanha_gerada?.perguntas) {
      setFormData({
        ...formData,
        perguntas: aiSuggestions.campanha_gerada.perguntas.map((p, idx) => ({
          id: Date.now() + idx,
          ...p,
          obrigatoria: true
        }))
      });
      setAiSuggestions(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="flex gap-4 max-w-7xl w-full max-h-[90vh]">
        {/* MODAL PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex-1 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Criar Nova Campanha
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Passo {currentStep} de 5 • Modo Assistido com IA
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAISidebar(!showAISidebar)}
                className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                {showAISidebar ? 'Ocultar' : 'Mostrar'} IA
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${
                  step.id <= currentStep ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <step.icon className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Passo 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título da Campanha *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Ex: Pesquisa sobre Hábitos Alimentares em Luanda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Descreva o objetivo da sua pesquisa..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: alimentação, saúde, urbano"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Passo 2: Configurações */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta de Respostas *
                  </label>
                  <input
                    type="number"
                    value={formData.meta_respostas}
                    onChange={(e) => setFormData({...formData, meta_respostas: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recompensa por Resposta (Kz) *
                  </label>
                  <input
                    type="number"
                    value={formData.recompensa_por_resposta}
                    onChange={(e) => setFormData({...formData, recompensa_por_resposta: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Orçamento Total (Kz)
                </label>
                <input
                  type="number"
                  value={formData.orcamento_total}
                  onChange={(e) => setFormData({...formData, orcamento_total: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Estimativa: {(formData.meta_respostas * formData.recompensa_por_resposta).toLocaleString()} Kz
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tempo Estimado (minutos)
                </label>
                <input
                  type="number"
                  value={formData.tempo_estimado}
                  onChange={(e) => setFormData({...formData, tempo_estimado: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                />
              </div>
            </div>
          )}

          {/* Passo 3: Público-Alvo */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Localização
                </label>
                <select
                  value={formData.localizacao_alvo}
                  onChange={(e) => setFormData({...formData, localizacao_alvo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Qualquer localização</option>
                  <option value="Luanda">Luanda</option>
                  <option value="Benguela">Benguela</option>
                  <option value="Huambo">Huambo</option>
                  <option value="Lobito">Lobito</option>
                  <option value="Nacional">Nacional</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idade Mínima
                  </label>
                  <input
                    type="number"
                    value={formData.idade_min}
                    onChange={(e) => setFormData({...formData, idade_min: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="13"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idade Máxima
                  </label>
                  <input
                    type="number"
                    value={formData.idade_max}
                    onChange={(e) => setFormData({...formData, idade_max: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="13"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gênero
                  </label>
                  <select
                    value={formData.genero_target}
                    onChange={(e) => setFormData({...formData, genero_target: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nível de Educação
                  </label>
                  <select
                    value={formData.nivel_educacao}
                    onChange={(e) => setFormData({...formData, nivel_educacao: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="basico">Ensino Básico</option>
                    <option value="medio">Ensino Médio</option>
                    <option value="superior">Ensino Superior</option>
                    <option value="pos_graduacao">Pós-Graduação</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interesses (opcional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {interessesDisponiveis.map((interesse) => (
                    <label key={interesse} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.interesses_target.includes(interesse)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              interesses_target: [...formData.interesses_target, interesse]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              interesses_target: formData.interesses_target.filter(i => i !== interesse)
                            });
                          }
                        }}
                        className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{interesse}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Passo 4: Perguntas */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Perguntas da Pesquisa
                </h3>
                <button
                  onClick={addPergunta}
                  className="inline-flex items-center px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Adicionar
                </button>
              </div>

              {formData.perguntas.map((pergunta, index) => (
                <div key={pergunta.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Pergunta {index + 1}
                    </h4>
                    {formData.perguntas.length > 1 && (
                      <button
                        onClick={() => removePergunta(pergunta.id)}
                        className="p-1 text-red-600 hover:text-red-700 rounded"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tipo de Pergunta
                        </label>
                        <select
                          value={pergunta.tipo}
                          onChange={(e) => updatePergunta(pergunta.id, { tipo: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {tiposPerguntas.map((tipo) => (
                            <option key={tipo.value} value={tipo.value}>
                              {tipo.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={pergunta.obrigatoria}
                            onChange={(e) => updatePergunta(pergunta.id, { obrigatoria: e.target.checked })}
                            className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Pergunta obrigatória
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pergunta
                      </label>
                      <input
                        type="text"
                        value={pergunta.pergunta}
                        onChange={(e) => updatePergunta(pergunta.id, { pergunta: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Digite sua pergunta..."
                        required
                      />
                    </div>

                    {(pergunta.tipo === 'multipla_escolha' || pergunta.tipo === 'sim_nao') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Opções de Resposta
                        </label>
                        {pergunta.opcoes.map((opcao, opcaoIndex) => (
                          <div key={opcaoIndex} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={opcao}
                              onChange={(e) => updateOpcao(pergunta.id, opcaoIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder={`Opção ${opcaoIndex + 1}`}
                            />
                            {pergunta.opcoes.length > 2 && (
                              <button
                                onClick={() => removeOpcao(pergunta.id, opcaoIndex)}
                                className="p-2 text-red-600 hover:text-red-700 rounded"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addOpcao(pergunta.id)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          + Adicionar opção
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Passo 5: Revisão */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Revisão da Campanha
              </h3>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Informações Básicas
                </h4>
                <p><strong>Título:</strong> {formData.titulo}</p>
                <p><strong>Categoria:</strong> {formData.categoria}</p>
                <p><strong>Descrição:</strong> {formData.descricao}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Configurações
                </h4>
                <p><strong>Meta:</strong> {formData.meta_respostas} respostas</p>
                <p><strong>Recompensa:</strong> {formData.recompensa_por_resposta} Kz por resposta</p>
                <p><strong>Orçamento Estimado:</strong> {(formData.meta_respostas * formData.recompensa_por_resposta).toLocaleString()} Kz</p>
                <p><strong>Tempo Estimado:</strong> {formData.tempo_estimado} minutos</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Público-Alvo
                </h4>
                <p><strong>Localização:</strong> {formData.localizacao_alvo || 'Qualquer'}</p>
                <p><strong>Idade:</strong> {formData.idade_min} - {formData.idade_max} anos</p>
                <p><strong>Gênero:</strong> {formData.genero_target}</p>
                {formData.interesses_target.length > 0 && (
                  <p><strong>Interesses:</strong> {formData.interesses_target.join(', ')}</p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Perguntas ({formData.perguntas.length})
                </h4>
                {formData.perguntas.map((pergunta, index) => (
                  <div key={pergunta.id} className="mb-2">
                    <p><strong>{index + 1}.</strong> {pergunta.pergunta}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tipo: {tiposPerguntas.find(t => t.value === pergunta.tipo)?.label}
                      {pergunta.obrigatoria && ' (Obrigatória)'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1 || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              
              {currentStep === 5 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Criando...</span>
                    </>
                  ) : (
                    <span>Criar Campanha</span>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Assistant Sidebar */}
      <AIAssistantSidebar
        showSidebar={showAISidebar}
        currentStep={currentStep}
        formData={formData}
        validacaoEtica={validacaoEtica}
        orcamentoOtimo={orcamentoOtimo}
        aiSuggestions={aiSuggestions}
        loadingAI={loadingAI}
        onValidarEtica={validarEtica}
        onOtimizarOrcamento={otimizarOrcamento}
        onGerarPerguntas={gerarPerguntasIA}
        onAplicarOrcamento={aplicarOrcamentoOtimo}
        onAplicarPerguntas={aplicarPerguntasIA}
      />
      </div>
    </div>
  );
}
