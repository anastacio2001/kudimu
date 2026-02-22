import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, CheckCircleIcon, SparklesIcon, TrendingUpIcon } from '@heroicons/react/24/outline';
import { campaignTemplates, applyTemplateToFormData } from '../utils/campaignTemplates';

const TemplatesLibraryModal = ({ isOpen, onClose, onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularidade'); // popularidade, taxa_sucesso, tempo

  if (!isOpen) return null;

  const categorias = ['Todos', ...new Set(campaignTemplates.map(t => t.categoria))];

  const filteredTemplates = campaignTemplates
    .filter(t => {
      const matchCategory = selectedCategory === 'Todos' || t.categoria === selectedCategory;
      const matchSearch = searchTerm === '' || 
        t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popularidade') return b.total_usos - a.total_usos;
      if (sortBy === 'taxa_sucesso') return b.taxa_sucesso - a.taxa_sucesso;
      if (sortBy === 'tempo') return parseInt(a.tempo_medio) - parseInt(b.tempo_medio);
      return 0;
    });

  const handleSelectTemplate = (template) => {
    const formData = applyTemplateToFormData(template);
    onSelectTemplate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <SparklesIcon className="w-8 h-8" />
                Biblioteca de Templates
              </h2>
              <p className="text-indigo-100 mt-1">
                {campaignTemplates.length} templates profissionais prontos para usar
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex flex-wrap gap-3">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="popularidade">Mais Usado</option>
              <option value="taxa_sucesso">Maior Taxa de Sucesso</option>
              <option value="tempo">Mais Rápido</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum template encontrado com os filtros atuais
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleSelectTemplate(template)}
                >
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{template.icone}</span>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {template.nome}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                          {template.categoria}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {template.descricao}
                  </p>

                  {/* Métricas */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <TrendingUpIcon className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-700 dark:text-green-400 font-bold">
                          {template.taxa_sucesso}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Sucesso</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700 dark:text-blue-400 font-bold">
                          {template.total_usos}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Usos</p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-purple-700 dark:text-purple-400 font-bold">
                          {template.tempo_medio}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Tempo</p>
                    </div>
                  </div>

                  {/* Perguntas Preview */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {template.perguntas_exemplo.length} perguntas incluídas:
                    </p>
                    <div className="space-y-1">
                      {template.perguntas_exemplo.slice(0, 2).map((p, idx) => (
                        <p key={idx} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          • {p.pergunta}
                        </p>
                      ))}
                      {template.perguntas_exemplo.length > 2 && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                          +{template.perguntas_exemplo.length - 2} perguntas...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      💡 Insights:
                    </p>
                    {template.insights.slice(0, 2).map((insight, idx) => (
                      <p key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                        • {insight}
                      </p>
                    ))}
                  </div>

                  {/* Botão de Ação */}
                  <button
                    className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm group-hover:bg-indigo-700"
                  >
                    Usar Este Template
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 Dica: Templates são editáveis. Use-os como base e personalize conforme necessário.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TemplatesLibraryModal;
