import React from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  ShieldCheckIcon,
  GiftIcon,
  ServerIcon,
  DevicePhoneMobileIcon,
  HeartIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

/**
 * DiferenciaisSection - Por que escolher Kudimu?
 */
export const DiferenciaisSection = () => {
  const diferenciais = [
    {
      icon: SparklesIcon,
      title: 'IA Africana',
      description: 'Workers AI da Cloudflare treinado com contexto angolano e africano'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sistema de Reputação',
      description: '4 níveis gamificados que incentivam qualidade e honestidade'
    },
    {
      icon: GiftIcon,
      title: 'Recompensas Reais',
      description: 'Unitel Money, Movicel Money. Dinheiro de verdade, não pontos fictícios'
    },
    {
      icon: ServerIcon,
      title: 'Infraestrutura Global',
      description: 'Cloudflare Workers + D1 + R2. Rápido, seguro e escalável'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Mobile First',
      description: 'App React Native + Web responsivo para qualquer dispositivo'
    },
    {
      icon: HeartIcon,
      title: 'Impacto Social',
      description: 'Democratização de dados e protagonismo para cidadãos angolanos'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">Por Que Kudimu?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A primeira plataforma de insights coletivos feita em Angola para África
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {diferenciais.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 hover:shadow-xl transition-all"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * ResultadosSection - Case study real
 */
export const ResultadosSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12"
          >
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Resultados Reais</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Case: Empresa Telecomunicações - Lançamento de Produto
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <BuildingOfficeIcon className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">5.000+</div>
                <div className="text-gray-600 dark:text-gray-400">Respostas coletadas</div>
              </div>
              <div className="text-center">
                <MapPinIcon className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">18</div>
                <div className="text-gray-600 dark:text-gray-400">Províncias alcançadas</div>
              </div>
              <div className="text-center">
                <ClockIcon className="w-12 h-12 text-pink-600 dark:text-pink-400 mx-auto mb-3" />
                <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">72h</div>
                <div className="text-gray-600 dark:text-gray-400">Tempo de coleta</div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Insights Gerados</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckBadgeIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>78% de aceitação</strong> do novo plano de dados entre jovens 18-25 anos
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckBadgeIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Preço ideal identificado</strong>: 3.500 AOA (reduzido de 5.000 AOA)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckBadgeIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Segmentação regional</strong>: Luanda e Benguela com maior demanda
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckBadgeIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Sentiment score: 0.82</strong> (muito positivo)
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/**
 * ImpactoSection - Impacto social e números
 */
export const ImpactoSection = () => {
  const stats = [
    {
      icon: UsersIcon,
      value: '10.000+',
      label: 'Usuários Angolanos',
      description: 'De todas as 18 províncias'
    },
    {
      icon: HeartIcon,
      value: '100%',
      label: 'Inclusão',
      description: 'Gratuito para cidadãos'
    },
    {
      icon: ChartBarIcon,
      value: '95%',
      label: 'Dados Confiáveis',
      description: 'Sistema de reputação'
    },
    {
      icon: TrophyIcon,
      value: '#1',
      label: 'Protagonismo',
      description: 'Voz africana, dados africanos'
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4">Impacto Social</h2>
          <p className="text-lg text-gray-400">
            Democratizando o acesso a dados e recompensando a participação cidadã
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 text-white mb-4">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-purple-400 text-transparent bg-clip-text">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-4xl mx-auto text-center"
        >
          <blockquote className="text-2xl font-light italic text-gray-300 mb-4">
            "Kudimu não é só uma plataforma de pesquisas. É um movimento de democratização de dados e protagonismo africano."
          </blockquote>
          <cite className="text-primary-400 font-semibold">— Fundadores Kudimu</cite>
        </motion.div>
      </div>
    </section>
  );
};
