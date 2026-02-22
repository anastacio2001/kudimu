import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Zap, CheckCircle, AlertTriangle, TrendingUp, Target, Clock } from 'lucide-react';

const API_URL = 'http://localhost:8787';

const ExpressCampaignCreator = ({ onClose, onCampaignCreated }) => {
  const [etapa, setEtapa] = useState('input'); // input, generating, preview, success
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [campanhaGerada, setCampanhaGerada] = useState(null);
  const [analiseIA, setAnaliseIA] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categorias = [
    'Alimentação', 'Transporte', 'Tecnologia', 'Saúde', 'Educação',
    'Entretenimento', 'Moda', 'Finanças', 'Imobiliário', 'Serviços', 'Outro'
  ];

  const handleGerarComIA = async () => {
    if (descricao.trim().length < 10) {
      setError('Descreva sua pesquisa com pelo menos 10 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    setEtapa('generating');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ai/generate-campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          descricao: descricao,
          categoria: categoria || 'Geral',
          modo: 'express'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar campanha');
      }

      setCampanhaGerada(data.data.campanha_gerada);
      setAnaliseIA(data.data.analise_ia);
      setEtapa('preview');

    } catch (err) {
      setError(err.message || 'Erro ao conectar com a IA');
      setEtapa('input');
    } finally {
      setLoading(false);
    }
  };

  const handlePublicar = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Criar campanha completa no sistema
      const response = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...campanhaGerada,
          data_inicio: new Date().toISOString(),
          data_fim: new Date(Date.now() + campanhaGerada.duracao_sugerida * 24 * 60 * 60 * 1000).toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao publicar campanha');
      }

      setEtapa('success');
      
      setTimeout(() => {
        if (onCampaignCreated) {
          onCampaignCreated(data.data);
        }
        onClose();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Erro ao publicar campanha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Modo Express</h2>
                <p className="text-purple-100 text-sm">IA cria sua campanha em 60 segundos ✨</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* ETAPA 1: INPUT */}
            {etapa === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-purple-900 mb-1">Como funciona?</h3>
                      <p className="text-sm text-purple-700">
                        Descreva o que você quer pesquisar. Nossa IA vai criar título, perguntas, 
                        calcular orçamento ideal e sugerir público-alvo automaticamente!
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O que você quer pesquisar? *
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex: Quero saber a opinião dos angolanos sobre aplicativos de delivery de comida em Luanda. Quais apps eles usam, quanto gastam, o que acham do serviço..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      Quanto mais detalhes, melhor será o resultado da IA
                    </p>
                    <p className={`text-xs ${descricao.length < 10 ? 'text-gray-400' : descricao.length < 500 ? 'text-green-600' : 'text-red-600'}`}>
                      {descricao.length}/500
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGerarComIA}
                    disabled={descricao.trim().length < 10 || loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Gerar com IA
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 2: GENERATING */}
            {etapa === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12"
              >
                <div className="text-center space-y-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Wand2 className="w-16 h-16 text-purple-600" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      IA trabalhando na sua campanha...
                    </h3>
                    <p className="text-gray-600">
                      Analisando contexto, gerando perguntas e otimizando orçamento
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-3">
                    {['Analisando descrição...', 'Gerando título otimizado...', 'Criando perguntas inteligentes...', 'Calculando orçamento ideal...', 'Validando ética...'].map((text, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.3 }}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                        {text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ETAPA 3: PREVIEW */}
            {etapa === 'preview' && campanhaGerada && analiseIA && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Taxa de Sucesso */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-green-700 font-medium">Taxa de Sucesso Prevista</p>
                        <p className="text-3xl font-bold text-green-900">{analiseIA.taxa_sucesso_prevista}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-700">Confiança: {analiseIA.confianca}</p>
                      <p className="text-xs text-green-600">Tempo estimado: {analiseIA.tempo_estimado_conclusao}</p>
                    </div>
                  </div>
                </div>

                {/* Validação Ética */}
                {analiseIA.validacao_etica && !analiseIA.validacao_etica.aprovado && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-2">Alertas Éticos</h4>
                        {analiseIA.validacao_etica.alertas.map((alerta, idx) => (
                          <p key={idx} className="text-sm text-yellow-700 mb-1">• {alerta.mensagem}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações Básicas */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">{campanhaGerada.titulo}</h3>
                  <p className="text-gray-700">{campanhaGerada.descricao}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {campanhaGerada.categoria}
                    </span>
                    {campanhaGerada.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Orçamento */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-indigo-600" />
                      <p className="text-sm text-gray-600">Meta</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{campanhaGerada.meta_respostas}</p>
                    <p className="text-xs text-gray-500">respostas</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      <p className="text-sm text-gray-600">Recompensa</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{campanhaGerada.recompensa_por_resposta}</p>
                    <p className="text-xs text-gray-500">Kz/resposta</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <p className="text-sm text-gray-600">Total</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{campanhaGerada.orcamento_estimado.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Kz</p>
                  </div>
                </div>

                {/* Perguntas */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Perguntas Geradas ({campanhaGerada.perguntas.length})</h4>
                  <div className="space-y-3">
                    {campanhaGerada.perguntas.map((pergunta, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-900">{idx + 1}. {pergunta.pergunta}</p>
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium ml-2">
                            {pergunta.tipo.replace('_', ' ')}
                          </span>
                        </div>
                        {pergunta.opcoes && (
                          <div className="mt-2 space-y-1">
                            {pergunta.opcoes.map((opcao, opIdx) => (
                              <p key={opIdx} className="text-sm text-gray-600 ml-4">• {opcao}</p>
                            ))}
                          </div>
                        )}
                        {pergunta.tipo === 'escala' && (
                          <p className="text-sm text-gray-600 mt-2 ml-4">
                            Escala {pergunta.escala_min} a {pergunta.escala_max} 
                            ({pergunta.label_min} → {pergunta.label_max})
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Público-Alvo */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Público-Alvo Sugerido</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Localização:</p>
                      <p className="font-medium text-gray-900">{campanhaGerada.publico_alvo.localizacao}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Idade:</p>
                      <p className="font-medium text-gray-900">
                        {campanhaGerada.publico_alvo.idade_min} - {campanhaGerada.publico_alvo.idade_max} anos
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gênero:</p>
                      <p className="font-medium text-gray-900">{campanhaGerada.publico_alvo.genero}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Educação:</p>
                      <p className="font-medium text-gray-900">{campanhaGerada.publico_alvo.educacao.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEtapa('input')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Gerar Novamente
                  </button>
                  <button
                    onClick={handlePublicar}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Publicar Campanha
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 4: SUCCESS */}
            {etapa === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-block mb-6"
                >
                  <CheckCircle className="w-20 h-20 text-green-600" />
                </motion.div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Campanha Publicada! 🎉
                </h3>
                <p className="text-gray-600 mb-2">
                  Sua pesquisa foi criada em menos de 1 minuto
                </p>
                <p className="text-sm text-gray-500">
                  Redirecionando para o dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ExpressCampaignCreator;
