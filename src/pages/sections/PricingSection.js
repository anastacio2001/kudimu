import React from 'react';
import { PricingCard } from '../../components/ui';

/**
 * PricingSection - Seção completa de preços com todas as tabelas do Serviços.md
 */
export const PricingSection = ({ onCTAClick }) => {
  return (
    <section id="precos" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">Planos e Preços</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Soluções flexíveis em Kwanza (AOA) para todas as necessidades
          </p>
        </div>

        {/* Campanhas */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">Campanhas Individuais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Campanha Essencial */}
            <PricingCard
              title="Campanha Essencial"
              description="Ideal para pequenas empresas e ONGs locais"
              price="100.000"
              period="Por campanha"
              features={[
                'Até 1.000 respostas',
                'Relatório simples com gráficos',
                '3-5 perguntas',
                'Segmentação básica',
                'Suporte por email',
                'Entrega em 5-7 dias'
              ]}
              ctaText="Começar"
              onCtaClick={onCTAClick}
            />

            {/* Campanha Avançada */}
            <PricingCard
              title="Campanha Avançada"
              description="Para produtos e políticas públicas"
              price="300.000 - 800.000"
              period="Por campanha"
              highlighted={true}
              badge="Mais Popular"
              features={[
                'Até 10.000 respostas',
                'Perguntas ilimitadas',
                'Análise com IA completa',
                'Segmentação avançada por perfil',
                'Insights preditivos',
                'Relatório PDF executivo',
                'Mapas de calor e visualizações',
                'Suporte prioritário'
              ]}
              ctaText="Começar"
              ctaVariant="primary"
              onCtaClick={onCTAClick}
            />

            {/* Campanha Social */}
            <PricingCard
              title="Campanha Social"
              description="Projetos de impacto subvencionados"
              price="50.000"
              period="Por campanha"
              badge="Impacto Social"
              features={[
                'Até 500 respostas',
                'Validação ética obrigatória',
                'Relatório simplificado',
                'Para ONGs e projetos sociais',
                'Suporte técnico básico',
                'Aprovação necessária'
              ]}
              ctaText="Solicitar"
              onCtaClick={onCTAClick}
            />
          </div>
        </div>

        {/* Assinaturas */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-12">Assinaturas Mensais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Assinatura Mensal */}
            <PricingCard
              title="Assinatura Mensal"
              description="Monitoramento contínuo"
              price="250.000 - 600.000"
              period="Por mês"
              features={[
                'Painel de controle em tempo real',
                '2 campanhas incluídas por mês',
                'Campanhas adicionais com desconto',
                'Dashboard interativo',
                'Análise histórica',
                'API de dados (básica)',
                'Relatórios mensais automáticos',
                'Suporte dedicado'
              ]}
              ctaText="Assinar"
              onCtaClick={onCTAClick}
            />

            {/* API de Dados */}
            <PricingCard
              title="API de Dados"
              description="Integração externa"
              price="Sob consulta"
              period="Personalizado"
              features={[
                'Token de acesso JWT',
                'Limites por volume negociáveis',
                'Dados agregados e anônimos',
                'Endpoints REST completos',
                'Documentação técnica',
                'Logs e auditoria em R2',
                '1.000 req/mês (plano básico)',
                'SLA garantido'
              ]}
              ctaText="Contatar"
              onCtaClick={() => window.location.href = '#contato'}
            />
          </div>
        </div>

        {/* Planos Académicos */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-4">Planos Académicos</h3>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            Preços especiais para estudantes, pesquisadores e profissionais independentes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Estudante */}
            <PricingCard
              title="Plano Estudante"
              description="Para licenciatura e mestrado"
              price="50.000"
              period="Por campanha"
              features={[
                'Até 500 respostas',
                'Relatório básico',
                'Validação ética obrigatória',
                'Comprovativo institucional',
                'Email .edu ou declaração',
                'Exportação em PDF',
                'Suporte técnico'
              ]}
              ctaText="Solicitar"
              onCtaClick={onCTAClick}
            />

            {/* Plano Pesquisa */}
            <PricingCard
              title="Pesquisa Académica"
              description="Para doutoramento e pesquisa"
              price="120.000"
              period="Por campanha"
              highlighted={true}
              features={[
                'Até 1.500 respostas',
                'Relatório completo',
                'Segmentação avançada',
                'Formato académico (tese)',
                'Exportação LaTeX, Word, Zotero',
                'Gráficos e tabelas',
                'Suporte metodológico'
              ]}
              ctaText="Solicitar"
              onCtaClick={onCTAClick}
            />

            {/* Plano Profissional */}
            <PricingCard
              title="Profissional Independente"
              description="Consultores e jornalistas"
              price="180.000"
              period="Por campanha"
              features={[
                'Até 3.000 respostas',
                'Relatório com IA',
                'Análise de sentimento',
                'Visualizações avançadas',
                'Dados exportáveis',
                'Suporte técnico prioritário',
                'Sessão de consultoria'
              ]}
              ctaText="Solicitar"
              onCtaClick={onCTAClick}
            />
          </div>
        </div>

        {/* Serviços Adicionais */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-12">Serviços Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: '🎯',
                title: 'Criação Assistida de Campanha',
                description: 'Ajuda na estruturação das perguntas e público-alvo',
                price: '20.000 - 50.000 AOA'
              },
              {
                icon: '🌍',
                title: 'Tradução para Línguas Locais',
                description: 'Umbundu, Kimbundu, Kikongo',
                price: '15.000 AOA'
              },
              {
                icon: '📊',
                title: 'Relatório Visual Personalizado',
                description: 'Gráficos, mapa de calor, nuvem de palavras',
                price: '30.000 - 80.000 AOA'
              },
              {
                icon: '📄',
                title: 'Exportação Formato Académico',
                description: 'PDF com estrutura de tese (intro, método, resultados)',
                price: '25.000 AOA'
              },
              {
                icon: '🧪',
                title: 'Simulação de Campanha',
                description: 'Teste com dados fictícios para validação metodológica',
                price: '10.000 AOA'
              },
              {
                icon: '💬',
                title: 'Suporte Técnico 1:1',
                description: 'Sessão de 30 min com especialista Kudimu',
                price: '15.000 AOA'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <h4 className="font-semibold mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                <div className="text-primary-600 dark:text-primary-400 font-semibold">{service.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💳 Aceitamos pagamentos via Unitel Money, Movicel Money e e-Kwanza<br />
            🔒 Todos os dados são anonimizados e protegidos
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
