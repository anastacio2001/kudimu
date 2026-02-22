import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  TagIcon
} from '@heroicons/react/24/outline';
import { API_URL } from '../config/api';

export default function EditCampaignModal({ isOpen, onClose, onSave, campaign }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    tags: [],
    meta_participantes: 100,
    recompensa: 500,
    orcamento_total: 50000,
    data_inicio: '',
    data_fim: '',
    tempo_estimado: 10,
    localizacao_alvo: '',
    idade_min: 18,
    idade_max: 65,
    genero_target: 'todos',
    interesses_target: [],
    nivel_educacao: 'todos',
    perguntas: []
  });

  // Pré-preencher formulário quando a campanha mudar
  useEffect(() => {
    if (campaign) {
      // Parse tags se for string JSON
      let parsedTags = campaign.tags || [];
      if (typeof parsedTags === 'string') {
        try {
          parsedTags = JSON.parse(parsedTags);
        } catch (e) {
          parsedTags = [];
        }
      }
      if (!Array.isArray(parsedTags)) {
        parsedTags = [];
      }

      // Parse interesses_target se for string JSON
      let parsedInteresses = campaign.interesses_target || [];
      if (typeof parsedInteresses === 'string') {
        try {
          parsedInteresses = JSON.parse(parsedInteresses);
        } catch (e) {
          parsedInteresses = [];
        }
      }
      if (!Array.isArray(parsedInteresses)) {
        parsedInteresses = [];
      }

      // Parse perguntas se for string JSON
      let parsedPerguntas = campaign.perguntas || [];
      if (typeof parsedPerguntas === 'string') {
        try {
          parsedPerguntas = JSON.parse(parsedPerguntas);
        } catch (e) {
          parsedPerguntas = [];
        }
      }
      if (!Array.isArray(parsedPerguntas)) {
        parsedPerguntas = [];
      }

      setFormData({
        titulo: campaign.titulo || '',
        descricao: campaign.descricao || '',
        categoria: campaign.categoria || '',
        tags: parsedTags,
        meta_participantes: campaign.meta_participantes || 100,
        recompensa: campaign.recompensa || 500,
        orcamento_total: campaign.orcamento_total || 50000,
        data_inicio: campaign.data_inicio ? campaign.data_inicio.split('T')[0] : '',
        data_fim: campaign.data_fim ? campaign.data_fim.split('T')[0] : '',
        tempo_estimado: campaign.tempo_estimado || 10,
        localizacao_alvo: campaign.localizacao_alvo || '',
        idade_min: campaign.idade_min || 18,
        idade_max: campaign.idade_max || 65,
        genero_target: campaign.genero_target || 'todos',
        interesses_target: parsedInteresses,
        nivel_educacao: campaign.nivel_educacao || 'todos',
        perguntas: parsedPerguntas
      });
    }
  }, [campaign]);

  const categorias = ['Tecnologia', 'Saúde', 'Educação', 'Entretenimento', 'Negócios', 'Outros'];
  const generos = [
    { value: 'todos', label: 'Todos' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' }
  ];
  const niveisEducacao = [
    { value: 'todos', label: 'Todos os níveis' },
    { value: 'basico', label: 'Ensino Básico' },
    { value: 'medio', label: 'Ensino Médio' },
    { value: 'superior', label: 'Ensino Superior' },
    { value: 'pos', label: 'Pós-graduação' }
  ];

  const steps = [
    { id: 1, name: 'Informações Básicas' },
    { id: 2, name: 'Configurações' },
    { id: 3, name: 'Segmentação' },
    { id: 4, name: 'Revisão' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const campaignData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        categoria: formData.categoria,
        recompensa: formData.recompensa,
        meta_participantes: formData.meta_participantes,
        orcamento_total: formData.orcamento_total,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        tempo_estimado: formData.tempo_estimado,
        localizacao_alvo: formData.localizacao_alvo,
        idade_min: formData.idade_min,
        idade_max: formData.idade_max,
        genero_target: formData.genero_target,
        interesses_target: formData.interesses_target,
        nivel_educacao: formData.nivel_educacao,
        tags: formData.tags,
        perguntas: formData.perguntas
      };
      
      const response = await fetch(`${API_URL}/campaigns/${campaign.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (onSave) onSave(result.data);
        setCurrentStep(1);
        onClose();
      } else {
        setError(result.error || 'Erro ao atualizar campanha');
      }
    } catch (err) {
      console.error('Erro ao atualizar campanha:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Editar Campanha
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Atualize as informações da sua campanha
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${currentStep >= step.id 
                      ? 'bg-primary-600 border-primary-600 text-white' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className={`ml-2 text-sm font-medium hidden sm:inline
                    ${currentStep >= step.id 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 
                    ${currentStep > step.id 
                      ? 'bg-primary-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título da Campanha *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Pesquisa de Satisfação do Cliente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Descreva os objetivos e detalhes da sua campanha..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TagIcon className="h-4 w-4 inline mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Digite e pressione Enter para adicionar tags"
                />
              </div>
            </div>
          )}

          {/* Step 2: Configurações */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <UserGroupIcon className="h-4 w-4 inline mr-1" />
                    Meta de Participantes *
                  </label>
                  <input
                    type="number"
                    value={formData.meta_participantes}
                    onChange={(e) => handleInputChange('meta_participantes', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                    Recompensa (Kz) *
                  </label>
                  <input
                    type="number"
                    value={formData.recompensa}
                    onChange={(e) => handleInputChange('recompensa', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    min="0"
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
                  onChange={(e) => handleInputChange('orcamento_total', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white bg-gray-50"
                  disabled
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Calculado automaticamente: {formData.meta_participantes} × {formData.recompensa} Kz
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => handleInputChange('data_inicio', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CalendarIcon className="h-4 w-4 inline mr-1" />
                    Data de Término *
                  </label>
                  <input
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => handleInputChange('data_fim', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <ClockIcon className="h-4 w-4 inline mr-1" />
                  Tempo Estimado (minutos)
                </label>
                <input
                  type="number"
                  value={formData.tempo_estimado}
                  onChange={(e) => handleInputChange('tempo_estimado', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                />
              </div>
            </div>
          )}

          {/* Step 3: Segmentação */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Localização Alvo
                </label>
                <input
                  type="text"
                  value={formData.localizacao_alvo}
                  onChange={(e) => handleInputChange('localizacao_alvo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Luanda, Angola"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Idade Mínima
                  </label>
                  <input
                    type="number"
                    value={formData.idade_min}
                    onChange={(e) => handleInputChange('idade_min', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
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
                    onChange={(e) => handleInputChange('idade_max', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    min="13"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gênero Alvo
                </label>
                <select
                  value={formData.genero_target}
                  onChange={(e) => handleInputChange('genero_target', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  {generos.map(gen => (
                    <option key={gen.value} value={gen.value}>{gen.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nível de Educação
                </label>
                <select
                  value={formData.nivel_educacao}
                  onChange={(e) => handleInputChange('nivel_educacao', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  {niveisEducacao.map(nivel => (
                    <option key={nivel.value} value={nivel.value}>{nivel.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Revisão */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Informações Básicas
                </h4>
                <p><strong>Título:</strong> {formData.titulo}</p>
                <p><strong>Categoria:</strong> {formData.categoria}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{formData.descricao}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Configurações
                </h4>
                <p><strong>Meta:</strong> {formData.meta_participantes} participantes</p>
                <p><strong>Recompensa:</strong> {formData.recompensa} Kz por participação</p>
                <p><strong>Orçamento Total:</strong> {formData.orcamento_total} Kz</p>
                <p><strong>Período:</strong> {formData.data_inicio} até {formData.data_fim}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Segmentação
                </h4>
                <p><strong>Localização:</strong> {formData.localizacao_alvo || 'Todas'}</p>
                <p><strong>Idade:</strong> {formData.idade_min} - {formData.idade_max} anos</p>
                <p><strong>Gênero:</strong> {generos.find(g => g.value === formData.genero_target)?.label}</p>
                <p><strong>Educação:</strong> {niveisEducacao.find(n => n.value === formData.nivel_educacao)?.label}</p>
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
              
              {currentStep === 4 ? (
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
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Salvar Alterações</span>
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
    </div>
  );
}
