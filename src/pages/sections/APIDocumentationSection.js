import React from 'react';
import { motion } from 'framer-motion';
import { CodeBracketIcon, KeyIcon, ChartBarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const APIDocumentationSection = () => {
  const benefits = [
    {
      icon: React.createElement(ChartBarIcon, { className: "w-8 h-8" }),
      title: 'Dados Agregados',
      description: 'Acesse insights consolidados e segmentados das suas campanhas'
    },
    {
      icon: React.createElement(ShieldCheckIcon, { className: "w-8 h-8" }),
      title: 'Segurança Total',
      description: 'Dados anonimizados e criptografados com tokens JWT'
    },
    {
      icon: React.createElement(CodeBracketIcon, { className: "w-8 h-8" }),
      title: 'Integração Simples',
      description: 'REST API documentada para fácil integração com seus sistemas'
    },
    {
      icon: React.createElement(KeyIcon, { className: "w-8 h-8" }),
      title: 'Acesso Controlado',
      description: 'Autenticação segura e limites personalizáveis'
    }
  ];

  return React.createElement('section', {
    id: 'api',
    className: 'py-20 bg-gray-50 dark:bg-gray-900'
  },
    React.createElement('div', { className: 'container mx-auto px-4' },
      React.createElement('div', {
        className: 'text-center mb-16'
      },
        React.createElement('h2', {
          className: 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'
        }, ' API de Dados Kudimu'),
        React.createElement('p', {
          className: 'text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'
        }, 'Integre os insights das suas campanhas diretamente nos seus sistemas')
      ),
      React.createElement('div', {
        className: 'grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16'
      },
        benefits.map((benefit, index) =>
          React.createElement('div', {
            key: index,
            className: 'bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow'
          },
            React.createElement('div', {
              className: 'text-primary-600 dark:text-primary-400 mb-4'
            }, benefit.icon),
            React.createElement('h3', {
              className: 'text-lg font-semibold text-gray-900 dark:text-white mb-2'
            }, benefit.title),
            React.createElement('p', {
              className: 'text-gray-600 dark:text-gray-400 text-sm'
            }, benefit.description)
          )
        )
      ),
      React.createElement('div', {
        className: 'text-center bg-primary-50 dark:bg-primary-900/20 rounded-xl p-8'
      },
        React.createElement('h3', {
          className: 'text-2xl font-bold text-gray-900 dark:text-white mb-4'
        }, 'Pronto para Integrar?'),
        React.createElement('p', {
          className: 'text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto'
        }, 'Entre em contato conosco para discutir suas necessidades e receber acesso personalizado à nossa API de dados.'),
        React.createElement('button', {
          className: 'bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors'
        }, ' Agendar Demonstração')
      )
    )
  );
};

export default APIDocumentationSection;
