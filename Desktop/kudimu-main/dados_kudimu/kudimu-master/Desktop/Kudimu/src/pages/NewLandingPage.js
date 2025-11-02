import React from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { Button, Card } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import PricingSection from './sections/PricingSection';
import ComoFuncionaSection from './sections/ComoFuncionaSection';
import APIDocumentationSection from './sections/APIDocumentationSection';
import { DiferenciaisSection, ResultadosSection, ImpactoSection } from './sections/FeatureSections';
import Footer from './sections/Footer';

/**
 * NewLandingPage - Landing Page moderna e completa com todas as seções
 * Integra todos os serviços do Serviços.md
 */
const NewLandingPage = () => {
  const { theme } = useTheme();

  const handleCTAClick = () => {
    // Implementar navegação para signup/cadastro
    window.location.href = '/signup';
  };

  const handleContactClick = () => {
    // Implementar navegação para contato
    window.location.href = '#contato';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text">
                Kudimu
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#servicos" className="text-sm font-medium hover:text-primary-600 transition-colors">
                Serviços
              </a>
              <a href="#precos" className="text-sm font-medium hover:text-primary-600 transition-colors">
                Preços
              </a>
              <a href="#como-funciona" className="text-sm font-medium hover:text-primary-600 transition-colors">
                Como Funciona
              </a>
              <a href="#api" className="text-sm font-medium hover:text-primary-600 transition-colors">
                API
              </a>
              <a href="#sobre" className="text-sm font-medium hover:text-primary-600 transition-colors">
                Sobre
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = '/login'}>
                Entrar
              </Button>
              <Button variant="primary" size="sm" onClick={handleCTAClick}>
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
            >
              <span className="mr-2">🚀</span>
              Inteligência Coletiva Africana
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Decisões baseadas em{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text">
                insights reais
              </span>
              {' '}de angolanos
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Plataforma de pesquisas com IA que conecta empresas, governos e cidadãos. 
              Dados confiáveis, análise inteligente, recompensas justas.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button variant="primary" size="lg" onClick={handleCTAClick}>
                Criar Campanha Grátis
              </Button>
              <Button variant="secondary" size="lg" onClick={handleContactClick}>
                Falar com Consultor
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">10.000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Campanhas Realizadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfação</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Soluções Para Todos</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Da pequena empresa ao governo, do estudante ao cidadão comum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Empresas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
                    <BuildingOfficeIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Para Empresas</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Teste produtos, meça satisfação, tome decisões com dados reais do mercado angolano
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChartBarIcon className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Até 10k respostas</span>
                    </li>
                    <li className="flex items-start">
                      <BoltIcon className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>IA preditiva</span>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheckIcon className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Relatórios executivos</span>
                    </li>
                  </ul>
                  <Button variant="primary" className="w-full mt-6" onClick={handleCTAClick}>
                    Ver Planos
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Governos & ONGs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-4">
                    <GlobeAltIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Governos & ONGs</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Políticas públicas informadas por dados, campanhas sociais subvencionadas
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChartBarIcon className="w-4 h-4 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Campanhas de impacto</span>
                    </li>
                    <li className="flex items-start">
                      <BoltIcon className="w-4 h-4 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Preços especiais</span>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheckIcon className="w-4 h-4 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Validação ética</span>
                    </li>
                  </ul>
                  <Button variant="primary" className="w-full mt-6" onClick={handleCTAClick}>
                    Solicitar Proposta
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Académicos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                    <AcademicCapIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Académicos</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Pesquisa científica, teses, estudos sociais com preços especiais para estudantes
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChartBarIcon className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>A partir de 50.000 AOA</span>
                    </li>
                    <li className="flex items-start">
                      <BoltIcon className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Formato académico</span>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheckIcon className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Suporte metodológico</span>
                    </li>
                  </ul>
                  <Button variant="primary" className="w-full mt-6" onClick={handleCTAClick}>
                    Ver Planos
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Cidadãos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-2 border-primary-200 dark:border-primary-800">
                <div className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                    <UserGroupIcon className="w-6 h-6" />
                  </div>
                  <div className="inline-block px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold mb-2">
                    100% GRATUITO
                  </div>
                  <h3 className="text-xl font-bold mb-2">Para Cidadãos</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Sua opinião vale dinheiro. Responda pesquisas e ganhe recompensas reais
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <ChartBarIcon className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Cadastro grátis</span>
                    </li>
                    <li className="flex items-start">
                      <BoltIcon className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Recompensas em dinheiro</span>
                    </li>
                    <li className="flex items-start">
                      <ShieldCheckIcon className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Dados protegidos</span>
                    </li>
                  </ul>
                  <Button variant="primary" className="w-full mt-6" onClick={handleCTAClick}>
                    Cadastrar Grátis
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection onCTAClick={handleCTAClick} />

      {/* Como Funciona Section */}
      <ComoFuncionaSection />

      {/* Diferenciais Section */}
      <DiferenciaisSection />

      {/* API Documentation Section */}
      <APIDocumentationSection />

      {/* Resultados Section */}
      <ResultadosSection />

      {/* Impacto Section */}
      <ImpactoSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NewLandingPage;
