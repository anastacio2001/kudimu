import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';

// Detecta se está em desenvolvimento local
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8787'  // Ambiente local de desenvolvimento
  : 'https://kudimu-api.l-anastacio001.workers.dev';  // Ambiente de produção

/**
 * NewSignupScreen - Tela de cadastro moderna com multi-step form
 */
const NewSignupScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    localizacao: '',
    codigo_indicacao: '',
    acceptTerms: false
  });

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengths = [
      { score: 0, label: 'Muito fraca', color: 'bg-red-500' },
      { score: 1, label: 'Fraca', color: 'bg-orange-500' },
      { score: 2, label: 'Razoável', color: 'bg-yellow-500' },
      { score: 3, label: 'Boa', color: 'bg-blue-500' },
      { score: 4, label: 'Forte', color: 'bg-green-500' },
      { score: 5, label: 'Muito forte', color: 'bg-green-600' }
    ];

    return strengths[score];
  };

  const passwordStrength = getPasswordStrength(formData.senha);

  // Validation rules
  const validations = {
    nome: formData.nome.length >= 3,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
    senha: formData.senha.length >= 8,
    telefone: formData.telefone.length >= 9,
    localizacao: formData.localizacao.length >= 3,
    acceptTerms: formData.acceptTerms
  };

  const canProceedStep1 = validations.nome && validations.email;
  const canProceedStep2 = validations.senha && passwordStrength.score >= 2;
  const canSubmit = Object.values(validations).every(Boolean);

  const handleNext = () => {
    if (currentStep === 1 && canProceedStep1) {
      setCurrentStep(2);
    } else if (currentStep === 2 && canProceedStep2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          telefone: formData.telefone,
          localizacao: formData.localizacao,
          codigo_indicacao: formData.codigo_indicacao || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        
        // Show success message if referred
        if (formData.codigo_indicacao && data.message.includes('bônus')) {
          alert(data.message);
        }
        
        // Show success animation then redirect
        setTimeout(() => {
          navigate('/campaigns');
        }, 1500);
      } else {
        setError(data.error || 'Erro ao criar conta. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Dados Pessoais', icon: UserIcon },
    { number: 2, title: 'Segurança', icon: LockClosedIcon },
    { number: 3, title: 'Localização', icon: MapPinIcon }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text">
              Kudimu
            </h1>
          </motion.div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Criar Nova Conta 🚀
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Junte-se à comunidade e comece a ganhar recompensas
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex items-center">
                <div className="flex flex-col items-center w-full">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: currentStep >= step.number ? 1 : 0.9 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckIcon className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span className={`mt-2 text-xs font-medium ${
                    currentStep >= step.number
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          layout
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
            >
              <div className="flex items-start">
                <XMarkIcon className="h-5 w-5 text-red-400 mt-0.5" />
                <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Nome */}
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="nome"
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="João Silva"
                      />
                      {formData.nome && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          {validations.nome ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {formData.nome && !validations.nome && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        Nome deve ter pelo menos 3 caracteres
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="seu@email.com"
                      />
                      {formData.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          {validations.email ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {formData.email && !validations.email && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        Email inválido
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Senha *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="senha"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.senha && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Força da senha:
                          </span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.score >= 3 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            className={`h-full ${passwordStrength.color} transition-all`}
                          />
                        </div>

                        {/* Password Requirements */}
                        <div className="mt-3 space-y-2">
                          <div className={`flex items-center text-xs ${
                            formData.senha.length >= 8 ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {formData.senha.length >= 8 ? (
                              <CheckIcon className="w-4 h-4 mr-2" />
                            ) : (
                              <XMarkIcon className="w-4 h-4 mr-2" />
                            )}
                            Mínimo 8 caracteres
                          </div>
                          <div className={`flex items-center text-xs ${
                            /[a-z]/.test(formData.senha) && /[A-Z]/.test(formData.senha) ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {/[a-z]/.test(formData.senha) && /[A-Z]/.test(formData.senha) ? (
                              <CheckIcon className="w-4 h-4 mr-2" />
                            ) : (
                              <XMarkIcon className="w-4 h-4 mr-2" />
                            )}
                            Letras maiúsculas e minúsculas
                          </div>
                          <div className={`flex items-center text-xs ${
                            /\d/.test(formData.senha) ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {/\d/.test(formData.senha) ? (
                              <CheckIcon className="w-4 h-4 mr-2" />
                            ) : (
                              <XMarkIcon className="w-4 h-4 mr-2" />
                            )}
                            Pelo menos um número
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location & Terms */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Telefone */}
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="telefone"
                        type="tel"
                        required
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="+244 900 000 000"
                      />
                      {formData.telefone && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          {validations.telefone ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XMarkIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Localização */}
                  <div>
                    <label htmlFor="localizacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Província *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="localizacao"
                        required
                        value={formData.localizacao}
                        onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="">Selecione sua província</option>
                        <option value="Luanda">Luanda</option>
                        <option value="Benguela">Benguela</option>
                        <option value="Huambo">Huambo</option>
                        <option value="Huíla">Huíla</option>
                        <option value="Cabinda">Cabinda</option>
                        <option value="Cuando Cubango">Cuando Cubango</option>
                        <option value="Cunene">Cunene</option>
                        <option value="Bié">Bié</option>
                        <option value="Moxico">Moxico</option>
                        <option value="Lunda Norte">Lunda Norte</option>
                        <option value="Lunda Sul">Lunda Sul</option>
                        <option value="Malanje">Malanje</option>
                        <option value="Uíge">Uíge</option>
                        <option value="Zaire">Zaire</option>
                        <option value="Bengo">Bengo</option>
                        <option value="Cuanza Norte">Cuanza Norte</option>
                        <option value="Cuanza Sul">Cuanza Sul</option>
                        <option value="Namibe">Namibe</option>
                      </select>
                    </div>
                  </div>

                  {/* Código de Indicação (Opcional) */}
                  <div>
                    <label htmlFor="codigo_indicacao" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Código de Indicação <span className="text-gray-400 text-xs">(Opcional - Ganhe 50 AOA!)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="codigo_indicacao"
                        type="text"
                        value={formData.codigo_indicacao}
                        onChange={(e) => setFormData({ ...formData, codigo_indicacao: e.target.value.toUpperCase() })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-mono"
                        placeholder="KUDI-XXXX"
                        maxLength={9}
                      />
                    </div>
                    {formData.codigo_indicacao && (
                      <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                        🎁 Você ganhará 50 AOA de bônus ao se cadastrar!
                      </p>
                    )}
                  </div>

                  {/* Terms & Privacy */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          type="checkbox"
                          checked={formData.acceptTerms}
                          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                          Aceito os termos e condições *
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Li e concordo com os{' '}
                          <Link to="/termos" className="text-primary-600 hover:text-primary-500">
                            Termos de Uso
                          </Link>{' '}
                          e{' '}
                          <Link to="/privacidade" className="text-primary-600 hover:text-primary-500">
                            Política de Privacidade
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-start space-x-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                    <ShieldCheckIcon className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-primary-800 dark:text-primary-200">
                      <p className="font-medium mb-1">Seus dados estão seguros</p>
                      <p className="text-primary-700 dark:text-primary-300">
                        Usamos criptografia de ponta para proteger suas informações pessoais.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-3">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleBack}
                  className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Voltar
                </motion.button>
              )}

              {currentStep < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2)
                  }
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  Próximo
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Criando conta...
                    </>
                  ) : (
                    <>
                      Criar Conta
                      <CheckCircleIcon className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Fazer login
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            ← Voltar para página inicial
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NewSignupScreen;
