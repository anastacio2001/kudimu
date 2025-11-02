import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { Button, Input } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';

// Detecta se está em desenvolvimento local
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8787'  // Ambiente local de desenvolvimento
  : 'https://kudimu-api.l-anastacio001.workers.dev';  // Ambiente de produção

/**
 * NewLoginScreen - Tela de login moderna com Tailwind CSS
 */
const NewLoginScreen = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (data.success) {
        // Salvar token
        localStorage.setItem('token', data.data.token);
        
        // Buscar dados completos do usuário
        const userResponse = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.data.token}`
          }
        });

        const userData = await userResponse.json();

        if (userData.success) {
          localStorage.setItem('user', JSON.stringify(userData.data));
          
          // Redirecionar baseado no tipo de usuário
          if (userData.data.tipo_usuario === 'admin') {
            navigate('/admin');
          } else {
            navigate('/campaigns');
          }
        } else {
          localStorage.setItem('user', JSON.stringify(data.data));
          navigate('/campaigns');
        }
      } else {
        setError(data.error || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: SparklesIcon,
      title: 'Ganhe Recompensas',
      description: 'Participe de pesquisas e acumule pontos'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sistema de Reputação',
      description: 'Suba de nível e desbloqueie benefícios'
    },
    {
      icon: GiftIcon,
      title: 'Resgates Rápidos',
      description: 'Converta seus pontos em prêmios reais'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Logo and Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text">
                Kudimu
              </h1>
            </motion.div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Bem-vindo de volta! 👋
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Entre para continuar participando de campanhas
            </p>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      {error}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <Link to="/recuperar-senha" className="font-medium text-primary-600 hover:text-primary-500">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  Não tem uma conta?
                </span>
              </div>
            </div>

            {/* Signup Link */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center"
            >
              <Link
                to="/signup"
                className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-primary-600 text-sm font-medium rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              >
                Criar nova conta
              </Link>
            </motion.div>
          </motion.form>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              ← Voltar para página inicial
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Features (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-purple-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Participe de pesquisas <br />e ganhe recompensas! 🎁
            </h2>
            <p className="text-xl text-purple-100 mb-12">
              Sua opinião vale muito. Ajude empresas a entenderem melhor Angola e ganhe por isso.
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <feature.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-purple-100">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              <div>
                <div className="text-3xl font-bold">5K+</div>
                <div className="text-purple-200 text-sm">Usuários Ativos</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100+</div>
                <div className="text-purple-200 text-sm">Campanhas</div>
              </div>
              <div>
                <div className="text-3xl font-bold">18</div>
                <div className="text-purple-200 text-sm">Províncias</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default NewLoginScreen;
