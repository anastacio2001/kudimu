import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SparklesIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AIAssistantSidebar = ({
  showSidebar,
  currentStep,
  formData,
  validacaoEtica,
  orcamentoOtimo,
  aiSuggestions,
  loadingAI,
  onValidarEtica,
  onOtimizarOrcamento,
  onGerarPerguntas,
  onAplicarOrcamento,
  onAplicarPerguntas
}) => {
  return (
    <AnimatePresence>
      {showSidebar && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-white" />
              <h3 className="text-lg font-bold text-white">Assistente IA</h3>
            </div>
            <p className="text-purple-100 text-sm mt-1">
              Otimizações em tempo real
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Validação Ética */}
            {currentStep >= 1 && formData.titulo && formData.descricao && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      Validação Ética
                    </h4>
                  </div>
                  <button
                    onClick={onValidarEtica}
                    disabled={loadingAI}
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loadingAI ? '...' : 'Verificar'}
                  </button>
                </div>
                
                {validacaoEtica ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {validacaoEtica.aprovado ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className={`text-sm font-medium ${validacaoEtica.aprovado ? 'text-green-700' : 'text-yellow-700'}`}>
                        {validacaoEtica.status === 'aprovado' ? 'Aprovado' : 'Requer Revisão'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Qualidade:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${validacaoEtica.pontuacao_qualidade}%` }}
                        />
                      </div>
                      <span className="font-medium">{validacaoEtica.pontuacao_qualidade}%</span>
                    </div>

                    {validacaoEtica.problemas && validacaoEtica.problemas.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium text-red-700">Problemas:</p>
                        {validacaoEtica.problemas.map((p, idx) => (
                          <p key={idx} className="text-xs text-red-600">• {p.mensagem}</p>
                        ))}
                      </div>
                    )}

                    {validacaoEtica.avisos && validacaoEtica.avisos.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium text-yellow-700">Avisos:</p>
                        {validacaoEtica.avisos.map((a, idx) => (
                          <p key={idx} className="text-xs text-yellow-600">• {a.mensagem}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">
                    Clique em "Verificar" para validar conteúdo ético e evitar campanhas problemáticas.
                  </p>
                )}
              </div>
            )}

            {/* Otimização de Orçamento */}
            {currentStep >= 2 && formData.categoria && formData.meta_respostas && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <LightBulbIcon className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100">
                      Otimizar Orçamento
                    </h4>
                  </div>
                  <button
                    onClick={onOtimizarOrcamento}
                    disabled={loadingAI}
                    className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loadingAI ? '...' : 'Calcular'}
                  </button>
                </div>
                
                {orcamentoOtimo ? (
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Recompensa Ideal:</p>
                      <p className="text-2xl font-bold text-green-700">
                        {orcamentoOtimo.recomendacao.recompensa_por_resposta} Kz
                      </p>
                      <p className="text-xs text-gray-500">
                        Orçamento total: {orcamentoOtimo.recomendacao.orcamento_total.toLocaleString()} Kz
                      </p>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-gray-600">
                        <strong>Confiança:</strong> {orcamentoOtimo.recomendacao.confianca}
                      </p>
                      <p className="text-gray-600">
                        <strong>ROI estimado:</strong> {orcamentoOtimo.recomendacao.roi_estimado}x
                      </p>
                      <p className="text-gray-600">
                        <strong>Campanhas analisadas:</strong> {orcamentoOtimo.analise.campanhas_analisadas}
                      </p>
                    </div>

                    <button
                      onClick={onAplicarOrcamento}
                      className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Aplicar Recomendação
                    </button>

                    {orcamentoOtimo.cenarios && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium text-gray-700">Cenários Alternativos:</p>
                        {orcamentoOtimo.cenarios.map((c, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded p-2 text-xs">
                            <p className="font-medium text-gray-900 dark:text-white">{c.nome}</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {c.recompensa} Kz • {c.taxa_sucesso_estimada}% sucesso
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">
                    Baseado em análise de campanhas similares, a IA calcula o orçamento ideal para maximizar ROI.
                  </p>
                )}
              </div>
            )}

            {/* Gerar Perguntas com IA */}
            {currentStep === 4 && formData.descricao && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                      Gerar Perguntas
                    </h4>
                  </div>
                  <button
                    onClick={onGerarPerguntas}
                    disabled={loadingAI}
                    className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loadingAI ? '...' : 'Gerar'}
                  </button>
                </div>
                
                {aiSuggestions?.campanha_gerada?.perguntas ? (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600">
                      IA gerou {aiSuggestions.campanha_gerada.perguntas.length} perguntas otimizadas:
                    </p>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {aiSuggestions.campanha_gerada.perguntas.map((p, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-3 text-xs">
                          <div className="flex items-start justify-between mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {idx + 1}. {p.pergunta}
                            </span>
                            <span className="text-purple-600 text-xs ml-2">
                              {p.tipo.replace('_', ' ')}
                            </span>
                          </div>
                          {p.opcoes && (
                            <div className="mt-1 ml-3 space-y-0.5">
                              {p.opcoes.slice(0, 3).map((op, opIdx) => (
                                <p key={opIdx} className="text-gray-600">• {op}</p>
                              ))}
                              {p.opcoes.length > 3 && (
                                <p className="text-gray-500">... +{p.opcoes.length - 3} opções</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={onAplicarPerguntas}
                      className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Usar Estas Perguntas
                    </button>

                    <p className="text-xs text-purple-700">
                      💡 Taxa de sucesso prevista: {aiSuggestions.analise_ia?.taxa_sucesso_prevista}%
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">
                    A IA pode gerar perguntas profissionais automaticamente baseadas na sua descrição.
                  </p>
                )}
              </div>
            )}

            {/* Dicas Contextuais */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <LightBulbIcon className="w-4 h-4 text-yellow-600" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Dica
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {currentStep === 1 && "Seja específico na descrição para melhores resultados da IA."}
                {currentStep === 2 && "Recompensas de 500-800 Kz têm melhor taxa de resposta."}
                {currentStep === 3 && "Público muito amplo dilui resultados. Seja específico."}
                {currentStep === 4 && "4-6 perguntas é o ideal para engajamento."}
                {currentStep === 5 && "Revise tudo antes de publicar. Mudanças após são limitadas."}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAssistantSidebar;
