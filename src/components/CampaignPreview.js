import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  UsersIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const CampaignPreview = ({ formData, analiseIA }) => {
  const [previewMode, setPreviewMode] = useState('resumo'); // resumo, perguntas, analytics
  const [metricas, setMetricas] = useState(null);

  useEffect(() => {
    // Calcular métricas previstas
    if (formData && formData.meta_respostas && formData.recompensa_por_resposta) {
      const respostasPorDia = formData.meta_respostas / (formData.tempo_estimado || 10);
      const custoTotal = formData.meta_respostas * formData.recompensa_por_resposta;
      const custoPorDia = custoTotal / (formData.tempo_estimado || 10);
      
      // Estimativas baseadas em dados históricos
      const taxaConclusaoEstimada = 85; // %
      const tempoMedioResposta = 4.5; // minutos
      const qualidadeEsperada = 4.2; // de 5
      
      setMetricas({
        respostasPorDia: Math.round(respostasPorDia),
        custoTotal: custoTotal,
        custoPorDia: Math.round(custoPorDia),
        taxaConclusao: taxaConclusaoEstimada,
        tempoMedioResposta: tempoMedioResposta,
        qualidadeEsperada: qualidadeEsperada,
        roi: 3.2,
        alcanceEstimado: formData.meta_respostas * 2.5, // visitantes vs respostas
        diasParaConclusao: formData.tempo_estimado || 10
      });
    }
  }, [formData]);

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <EyeIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            Preencha os dados para ver a prévia
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setPreviewMode('resumo')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            previewMode === 'resumo'
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <EyeIcon className="w-5 h-5 inline mr-2" />
          Resumo
        </button>
        <button
          onClick={() => setPreviewMode('perguntas')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            previewMode === 'perguntas'
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Perguntas ({formData.perguntas?.length || 0})
        </button>
        <button
          onClick={() => setPreviewMode('analytics')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            previewMode === 'analytics'
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <ChartBarIcon className="w-5 h-5 inline mr-2" />
          Previsões IA
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* RESUMO */}
          {previewMode === 'resumo' && (
            <motion.div
              key="resumo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {formData.titulo || 'Título da Campanha'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.descricao || 'Descrição da campanha aparecerá aqui'}
                </p>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                  <UsersIcon className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.meta_respostas || 0}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Meta Respostas</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.recompensa_por_resposta || 0} Kz
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Por Resposta</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                  <ClockIcon className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.tempo_estimado || 0}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Dias</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4">
                  <SparklesIcon className="w-6 h-6 text-yellow-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.orcamento_total?.toLocaleString() || 0} Kz
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Orçamento Total</p>
                </div>
              </div>

              {/* Público-Alvo */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  Público-Alvo
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Localização:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.localizacao_alvo || 'Nacional'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Idade:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.idade_min || 18} - {formData.idade_max || 65} anos
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Gênero:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.genero_target || 'Todos'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Educação:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formData.nivel_educacao || 'Todos'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PERGUNTAS */}
          {previewMode === 'perguntas' && (
            <motion.div
              key="perguntas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {formData.perguntas && formData.perguntas.length > 0 ? (
                formData.perguntas.map((pergunta, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {idx + 1}. {pergunta.pergunta || 'Pergunta sem texto'}
                      </p>
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs ml-2">
                        {pergunta.tipo?.replace('_', ' ') || 'texto'}
                      </span>
                    </div>

                    {/* Preview de opções */}
                    {pergunta.tipo === 'multipla_escolha' && pergunta.opcoes && (
                      <div className="mt-3 space-y-2">
                        {pergunta.opcoes.filter(o => o).map((opcao, opIdx) => (
                          <div
                            key={opIdx}
                            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                          >
                            <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{opcao}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {pergunta.tipo === 'texto_livre' && (
                      <div className="mt-3">
                        <textarea
                          disabled
                          placeholder="Resposta em texto livre..."
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                          rows={3}
                        />
                      </div>
                    )}

                    {pergunta.tipo === 'escala' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{pergunta.label_min || 'Mínimo'}</span>
                          <div className="flex gap-2">
                            {Array.from({ length: (pergunta.escala_max || 5) - (pergunta.escala_min || 1) + 1 }).map((_, i) => (
                              <div
                                key={i}
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium"
                              >
                                {(pergunta.escala_min || 1) + i}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">{pergunta.label_max || 'Máximo'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhuma pergunta adicionada ainda
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ANALYTICS IA */}
          {previewMode === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Taxa de Sucesso Prevista */}
              {analiseIA && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                        Taxa de Sucesso Prevista
                      </p>
                      <p className="text-4xl font-bold text-green-900 dark:text-green-100">
                        {analiseIA.taxa_sucesso_prevista || 85}%
                      </p>
                    </div>
                    <CheckCircleIcon className="w-12 h-12 text-green-600" />
                  </div>
                </div>
              )}

              {/* Métricas Previstas */}
              {metricas && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Respostas/Dia</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metricas.respostasPorDia}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metricas.taxaConclusao}%
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tempo Médio</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metricas.tempoMedioResposta} min
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">ROI Estimado</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metricas.roi}x
                    </p>
                  </div>
                </div>
              )}

              {/* Custo Projetado */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Projeção de Custos
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Custo por dia:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {metricas?.custoPorDia.toLocaleString()} Kz
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Custo total:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {metricas?.custoTotal.toLocaleString()} Kz
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Custo por resposta:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.recompensa_por_resposta} Kz
                    </span>
                  </div>
                </div>
              </div>

              {/* Alertas/Avisos */}
              {analiseIA?.validacao_etica?.alertas && analiseIA.validacao_etica.alertas.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                        Avisos da IA
                      </h4>
                      {analiseIA.validacao_etica.alertas.map((alerta, idx) => (
                        <p key={idx} className="text-sm text-yellow-700 dark:text-yellow-300">
                          • {alerta.mensagem}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CampaignPreview;
