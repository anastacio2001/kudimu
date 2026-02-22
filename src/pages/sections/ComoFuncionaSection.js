import React from 'react';
import { motion } from 'framer-motion';
import { TimelineStep } from '../../components/ui';

/**
 * ComoFuncionaSection - "Como Funciona" com 2 timelines (Empresas e Usuários)
 */
export const ComoFuncionaSection = () => {
  return (
    <section id="como-funciona" className="py-20 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">Como Funciona</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Simples para empresas, recompensador para usuários
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Para Empresas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-8 text-center lg:text-left">
              Para Empresas e Governos
            </h3>
            <div className="space-y-8">
              <TimelineStep
                number={1}
                icon="📝"
                title="Criar Campanha"
                description="Defina suas perguntas e objetivos. Use nossa IA para sugestões ou crie manualmente."
                delay={0}
              />
              <TimelineStep
                number={2}
                icon="🎯"
                title="Definir Público-Alvo"
                description="Segmente por província, idade, género, profissão. Escolha até 10.000 respostas."
                delay={0.1}
              />
              <TimelineStep
                number={3}
                icon="📊"
                title="Receber Insights com IA"
                description="Dados em tempo real, análise de sentimento, previsões e relatório PDF executivo."
                delay={0.2}
              />
            </div>
          </motion.div>

          {/* Para Usuários */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-8 text-center lg:text-left">
              Para Usuários Angolanos
            </h3>
            <div className="space-y-8">
              <TimelineStep
                number={1}
                icon="✍️"
                title="Cadastrar com Telefone"
                description="Registo simples e seguro. Verificação por SMS. Aceite os termos de privacidade."
                delay={0}
              />
              <TimelineStep
                number={2}
                icon="📱"
                title="Responder Campanhas"
                description="Escolha temas do seu interesse. Respostas rápidas (2-5 min). Ganhe pontos por cada participação."
                delay={0.1}
              />
              <TimelineStep
                number={3}
                icon="💰"
                title="Ganhar Recompensas"
                description="Acumule pontos, suba de nível de reputação. Troque por dinheiro (Unitel Money, Movicel Money)."
                delay={0.2}
              />
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#cadastro"
              className="btn-primary px-8 py-3 text-lg"
            >
              Começar Grátis
            </a>
            <a
              href="#contato"
              className="btn-secondary px-8 py-3 text-lg"
            >
              Falar com Consultor
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComoFuncionaSection;
