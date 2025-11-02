import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  HeartIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CodeBracketIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { Button, Card, CardBody, Badge, PricingCard, TimelineStep, APIEndpoint } from '../components/ui';
import { animations } from '../constants/design-system';

/**
 * NewLandingPage - Página inicial moderna e completa da Kudimu Insights
 * Com todos os serviços do documento Serviços.md integrados
 */
const NewLandingPage = () => {
  const [activePriceTab, setActivePriceTab] = useState('campanhas');

  const handleCTAClick = () => {
    window.location.href = '/cadastro';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-3xl">🧠</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
                Kudimu Insights
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#inicio" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                Início
              </a>
              <a href="#servicos" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                Serviços
              </a>
              <a href="#como-funciona" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                Como Funciona
              </a>
              <a href="#precos" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                Preços
              </a>
              <a href="#api" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors">
                API
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => window.location.href = '/login'}>
                Entrar
              </Button>
              <Button variant="primary" onClick={handleCTAClick}>
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="info" size="lg" className="mb-6">
              🚀 Inteligência Coletiva Africana
            </Badge>

            <h1 className="heading-1 mb-6">
              Transforme Participação em{' '}
              <span className="gradient-text">Progresso</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Conecte empresas, governos e cidadãos através de dados reais e recompensas justas. 
              A primeira plataforma de sondagens com IA adaptada ao contexto africano.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                variant="primary" 
                size="lg" 
                rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                onClick={handleCTAClick}
              >
                Comece Agora Grátis
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' })}
              >
                Saiba Mais
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div {...animations.fadeIn} transition={{ delay: 0.2 }}>
                <div className="text-4xl font-bold gradient-text">10.000+</div>
                <div className="text-gray-600 dark:text-gray-400 mt-2">Usuários Ativos</div>
              </motion.div>
              <motion.div {...animations.fadeIn} transition={{ delay: 0.3 }}>
                <div className="text-4xl font-bold gradient-text">500+</div>
                <div className="text-gray-600 dark:text-gray-400 mt-2">Campanhas Realizadas</div>
              </motion.div>
              <motion.div {...animations.fadeIn} transition={{ delay: 0.4 }}>
                <div className="text-4xl font-bold gradient-text">95%</div>
                <div className="text-gray-600 dark:text-gray-400 mt-2">Satisfação</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Para Quem É a Kudimu?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Soluções personalizadas para empresas, governos, ONGs, académicos e cidadãos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Empresas */}
            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <BuildingOfficeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Empresas</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Teste produtos, campanhas e entenda o mercado angolano com dados reais e segmentados.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Até 10.000 respostas validadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Análise de IA com insights preditivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Segmentação por perfil e localização</span>
                </li>
              </ul>
            </Card>

            {/* Governos e ONGs */}
            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <GlobeAltIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Governos & ONGs</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ouça a população e mapeie necessidades sociais com dados reais para políticas eficazes.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Campanhas sociais subvencionadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Relatórios detalhados por província</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Validação ética obrigatória</span>
                </li>
              </ul>
            </Card>

            {/* Académicos */}
            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <AcademicCapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Estudantes & Pesquisadores</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Planos especiais para investigação académica com preços reduzidos e suporte técnico.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>A partir de 50.000 AOA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Relatórios em formato académico</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Exportação LaTeX, Word, Zotero</span>
                </li>
              </ul>
            </Card>

            {/* Cidadãos */}
            <Card hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cidadãos</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Participe, seja ouvido e receba recompensas reais por cada contribuição valiosa.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>100% Gratuito para participar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Recompensas em dinheiro ou dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Sistema de reputação gamificado</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Continue na próxima parte... */}
    </div>
  );
};

export default NewLandingPage;
