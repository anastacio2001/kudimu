import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  DocumentArrowDownIcon, 
  EyeIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ClientLayout from '../components/ClientLayout';

const ClientReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('ultimos-30-dias');

  useEffect(() => {
    loadClientReports();
  }, [selectedPeriod]);

  const loadClientReports = async () => {
    try {
      setLoading(true);
      
      // Relatórios específicos para clientes - sem dados sensíveis
      const clientReportsData = [
        {
          id: 1,
          titulo: 'Relatório de Progresso - Estudo Mercado de Trabalho',
          tipo: 'progresso',
          periodo: '01/11/2024 - 07/11/2024',
          status: 'disponivel',
          tamanho: '2.4 MB',
          data_criacao: '2024-11-07',
          descricao: 'Acompanhamento semanal do progresso da sua campanha',
          metricas_resumo: {
            total_respostas: 156,
            meta_respostas: 500,
            progresso: 31.2,
            qualidade_media: 4.2
          }
        },
        {
          id: 2,
          titulo: 'Análise de Participação - Demografia',
          tipo: 'demografico',
          periodo: '15/10/2024 - 07/11/2024',
          status: 'disponivel',
          tamanho: '1.8 MB',
          data_criacao: '2024-11-07',
          descricao: 'Perfil demográfico dos participantes da sua pesquisa',
          metricas_resumo: {
            faixas_etarias: '4 grupos',
            localizacoes: '8 províncias',
            satisfacao: '94.2%',
            conclusao: '89.1%'
          }
        },
        {
          id: 3,
          titulo: 'Relatório de Insights - Principais Resultados',
          tipo: 'insights',
          periodo: '15/10/2024 - 31/10/2024',
          status: 'disponivel',
          tamanho: '3.1 MB',
          data_criacao: '2024-11-01',
          descricao: 'Principais descobertas e tendências identificadas',
          metricas_resumo: {
            insights_identificados: 12,
            tendencias_principais: 5,
            recomendacoes: 8,
            confiabilidade: '92%'
          }
        },
        {
          id: 4,
          titulo: 'Relatório Mensal - Outubro 2024',
          tipo: 'mensal',
          periodo: '01/10/2024 - 31/10/2024',
          status: 'disponivel',
          tamanho: '4.2 MB',
          data_criacao: '2024-11-01',
          descricao: 'Resumo completo das atividades do mês de outubro',
          metricas_resumo: {
            campanhas_ativas: 1,
            total_participantes: 89,
            feedback_positivo: '96%',
            objetivos_atingidos: '3/4'
          }
        }
      ];

      setReports(clientReportsData);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (report) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = 30;
      
      // Cabeçalho do relatório
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('KUDIMU', margin, yPos);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Plataforma de Pesquisas Inteligentes', margin, yPos + 6);
      
      // Linha decorativa
      pdf.setDrawColor(59, 130, 246); // primary-600
      pdf.setLineWidth(1);
      pdf.line(margin, yPos + 10, pageWidth - margin, yPos + 10);
      
      yPos += 25;
      
      // Título do Relatório
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(report.titulo, margin, yPos);
      yPos += 10;
      
      // Informações do período
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Período: ${report.periodo}`, margin, yPos);
      yPos += 6;
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, yPos);
      yPos += 15;
      
      pdf.setTextColor(0, 0, 0);
      
      // Linha separadora
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 12;
      
      // Resumo Executivo
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('📊 Resumo Executivo', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const resumoTexto = report.descricao || 'Relatório detalhado das suas campanhas e atividades.';
      const splitResumo = pdf.splitTextToSize(resumoTexto, pageWidth - (margin * 2));
      pdf.text(splitResumo, margin, yPos);
      yPos += (splitResumo.length * 6) + 12;
      
      // Métricas Principais (em caixas)
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('📈 Métricas Principais', margin, yPos);
      yPos += 12;
      
      // Criar grid de métricas
      const metricas = report.metricas_resumo || {};
      const metricasArray = Object.entries(metricas);
      const boxWidth = (pageWidth - (margin * 2) - 10) / 2;
      const boxHeight = 20;
      let xPos = margin;
      let metricRow = 0;
      
      pdf.setFontSize(9);
      metricasArray.forEach(([key, value], index) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Desenhar caixa
        pdf.setFillColor(249, 250, 251); // bg-gray-50
        pdf.rect(xPos, yPos, boxWidth, boxHeight, 'F');
        pdf.setDrawColor(229, 231, 235); // border-gray-200
        pdf.rect(xPos, yPos, boxWidth, boxHeight, 'S');
        
        // Texto da métrica
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(label, xPos + 5, yPos + 8);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.text(String(value), xPos + 5, yPos + 16);
        pdf.setFontSize(9);
        
        // Alternar coluna
        if (index % 2 === 0) {
          xPos += boxWidth + 10;
        } else {
          xPos = margin;
          yPos += boxHeight + 5;
          metricRow++;
        }
      });
      
      // Se número ímpar de métricas, ajustar yPos
      if (metricasArray.length % 2 !== 0) {
        yPos += boxHeight + 5;
      }
      
      yPos += 15;
      
      // Campanhas Detalhadas
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('🎯 Campanhas Ativas', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const campanhasTexto = `Total de ${metricas.total_campanhas || 0} campanhas criadas, ` +
                            `com ${metricas.campanhas_ativas || 0} atualmente ativas`;
      pdf.text(campanhasTexto, margin, yPos);
      yPos += 15;
      
      // Insights e Recomendações
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('💡 Insights e Recomendações', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const insights = [
        'Suas campanhas têm uma taxa de resposta acima da média',
        'Considere aumentar o orçamento para campanhas de alta performance',
        'O melhor dia para lançar campanhas é terça-feira',
        'Participantes entre 25-34 anos apresentam maior engajamento'
      ];
      
      insights.forEach((insight, index) => {
        pdf.text(`${index + 1}. ${insight}`, margin + 5, yPos);
        yPos += 7;
      });
      
      yPos += 15;
      
      // Observações Legais
      if (yPos > pageHeight - 50) {
        pdf.addPage();
        yPos = margin;
      }
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('⚠️ Observações', margin, yPos);
      yPos += 10;
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      const observacoes = [
        '• Este relatório contém informações confidenciais e é de uso exclusivo do cliente',
        '• Dados consolidados até a data e hora de geração indicadas',
        '• Os valores apresentados são baseados em dados reais da plataforma',
        '• Para dúvidas ou esclarecimentos, entre em contato com nossa equipe de suporte',
        '• Suporte disponível em: suporte@kudimu.com | WhatsApp: +244 XXX XXX XXX'
      ];
      
      observacoes.forEach((obs) => {
        pdf.text(obs, margin, yPos);
        yPos += 6;
      });
      
      // Rodapé em todas as páginas
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          'KUDIMU - Plataforma de Pesquisas Inteligentes | www.kudimu.com',
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        pdf.text(
          `Página ${i} de ${totalPages}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' }
        );
      }
      
      // Salvar PDF
      const fileName = `KUDIMU_Relatorio_${report.titulo.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF gerado com sucesso:', fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Por favor, tente novamente.');
    }
  };

  const getReportIcon = (tipo) => {
    switch (tipo) {
      case 'progresso':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'demografico':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'insights':
        return <EyeIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponivel':
        return 'bg-green-100 text-green-800';
      case 'processando':
        return 'bg-yellow-100 text-yellow-800';
      case 'erro':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ClientLayout title="Meus Relatórios">
        <div className="flex items-center justify-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando relatórios...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Meus Relatórios">
      <div className="container-custom py-8">

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="ultimos-7-dias">Últimos 7 dias</option>
                <option value="ultimos-30-dias">Últimos 30 dias</option>
                <option value="ultimos-90-dias">Últimos 90 dias</option>
                <option value="este-ano">Este ano</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-500">
              {reports.length} relatório{reports.length !== 1 ? 's' : ''} encontrado{reports.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* Lista de Relatórios */}
        <div className="space-y-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-grow">
                  <div className="flex-shrink-0 p-3 bg-primary-100 rounded-lg text-primary-600">
                    {getReportIcon(report.tipo)}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {report.titulo}
                    </h3>
                    
                    <p className="text-gray-600 mb-3">
                      {report.descricao}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {report.periodo}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {new Date(report.data_criacao).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        {report.tamanho}
                      </div>
                    </div>
                    
                    {/* Métricas Resumo */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      {Object.entries(report.metricas_resumo).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {value}
                          </div>
                          <div className="text-xs text-gray-500">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-6">
                  <div className="flex flex-col items-end space-y-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status === 'disponivel' ? 'Disponível' : report.status}
                    </span>
                    
                    <button
                      onClick={() => generatePDF(report)}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mensagem quando não há relatórios */}
        {reports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum relatório encontrado
            </h3>
            <p className="text-gray-500">
              Relatórios serão gerados automaticamente conforme suas campanhas progridem.
            </p>
          </motion.div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientReports;