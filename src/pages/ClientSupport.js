import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import ClientLayout from '../components/ClientLayout';

const ClientSupport = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'technical',
    message: '',
    priority: 'normal'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envio
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ subject: '', category: 'technical', message: '', priority: 'normal' });
    }, 3000);
  };

  const faqs = [
    {
      question: 'Como criar uma campanha?',
      answer: 'Vá para Campanhas > Criar Nova Campanha. Você pode usar o Modo Express com IA ou criar manualmente. Preencha os detalhes, adicione perguntas e publique.'
    },
    {
      question: 'Como adicionar créditos à minha conta?',
      answer: 'Acesse Orçamento > Adicionar Créditos. Escolha o valor, faça a transferência bancária para o IBAN fornecido e envie o comprovante. O admin confirmará em até 24h.'
    },
    {
      question: 'Quais métodos de pagamento são aceitos?',
      answer: 'Aceitamos transferência bancária BAI (IBAN: AO06.0040.0000.3514.1269.1010.8), Multicaixa Express e Unitel Money.'
    },
    {
      question: 'Como exportar os resultados das campanhas?',
      answer: 'Na página de Analytics da campanha, clique em "Exportar Dados" e escolha o formato (PDF, Excel ou CSV).'
    },
    {
      question: 'Posso pausar uma campanha ativa?',
      answer: 'Sim! Vá para Campanhas, clique na campanha e selecione "Pausar". Você pode reativá-la a qualquer momento.'
    },
    {
      question: 'Como funciona o sistema de AI Insights?',
      answer: 'O AI Insights analisa automaticamente as respostas das suas campanhas usando Workers AI da Cloudflare, gerando clusters, sentimentos e recomendações inteligentes.'
    },
    {
      question: 'Qual a diferença entre os planos?',
      answer: 'Starter: 5 campanhas/mês, 50 respostas. Growth: 20 campanhas/mês, 200 respostas, AI Insights. Enterprise: Ilimitado, suporte prioritário, white label.'
    },
    {
      question: 'Como fazer upgrade de plano?',
      answer: 'Acesse Assinatura > Fazer Upgrade. Escolha o novo plano, faça o pagamento e seu plano será ativado automaticamente após confirmação.'
    }
  ];

  const resources = [
    {
      title: 'Guia de Início Rápido',
      description: 'Aprenda os fundamentos da plataforma em 5 minutos',
      icon: BookOpenIcon,
      link: '#'
    },
    {
      title: 'Documentação da API',
      description: 'Integre Kudimu com seus sistemas',
      icon: DocumentTextIcon,
      link: '#'
    },
    {
      title: 'Vídeos Tutoriais',
      description: 'Assista tutoriais passo a passo',
      icon: ChatBubbleLeftRightIcon,
      link: '#'
    }
  ];

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Como Podemos Ajudar?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Estamos aqui para resolver suas dúvidas
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.a
            href="https://wa.me/244923456789"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChatBubbleLeftRightIcon className="h-10 w-10 mb-3" />
            <h3 className="text-lg font-semibold mb-1">WhatsApp</h3>
            <p className="text-green-100 text-sm">Resposta em minutos</p>
            <p className="text-white font-medium mt-2">+244 923 456 789</p>
          </motion.a>

          <motion.a
            href="tel:+244923456789"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <PhoneIcon className="h-10 w-10 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Telefone</h3>
            <p className="text-blue-100 text-sm">Seg-Sex 8h-18h</p>
            <p className="text-white font-medium mt-2">+244 923 456 789</p>
          </motion.a>

          <motion.a
            href="mailto:suporte@kudimu.ao"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <EnvelopeIcon className="h-10 w-10 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Email</h3>
            <p className="text-purple-100 text-sm">Resposta em 24h</p>
            <p className="text-white font-medium mt-2">suporte@kudimu.ao</p>
          </motion.a>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              {[
                { id: 'contact', label: 'Abrir Ticket', icon: ChatBubbleLeftRightIcon },
                { id: 'faq', label: 'FAQ', icon: QuestionMarkCircleIcon },
                { id: 'resources', label: 'Recursos', icon: BookOpenIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Contact Form Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircleIcon className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Ticket Enviado!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Recebemos sua solicitação e responderemos em breve.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Categoria
                        </label>
                        <select
                          value={contactForm.category}
                          onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="technical">Problema Técnico</option>
                          <option value="billing">Pagamento/Faturamento</option>
                          <option value="campaign">Dúvida sobre Campanha</option>
                          <option value="account">Gestão de Conta</option>
                          <option value="other">Outro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prioridade
                        </label>
                        <select
                          value={contactForm.priority}
                          onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="low">Baixa</option>
                          <option value="normal">Normal</option>
                          <option value="high">Alta</option>
                          <option value="urgent">Urgente</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Assunto
                      </label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="Descreva brevemente o problema"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mensagem
                      </label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Descreva detalhadamente seu problema ou dúvida..."
                        rows="6"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Enviar Ticket
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 cursor-pointer"
                  >
                    <summary className="flex items-start justify-between font-semibold text-gray-900 dark:text-white list-none">
                      <span className="flex-1">{faq.question}</span>
                      <QuestionMarkCircleIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 ml-4 group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="mt-3 text-gray-600 dark:text-gray-400 pl-2">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </motion.div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <a
                      key={index}
                      href={resource.link}
                      className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <Icon className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-3" />
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {resource.description}
                      </p>
                    </a>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

        {/* Support Hours */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Horário de Atendimento
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p><strong>WhatsApp/Telefone:</strong> Segunda a Sexta, 8h às 18h (Hora de Luanda)</p>
                <p><strong>Email:</strong> 24/7 - Resposta em até 24h úteis</p>
                <p><strong>Suporte Prioritário:</strong> Disponível para planos Growth e Enterprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientSupport;
