import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  DocumentArrowDownIcon, 
  EyeIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('ultimos-30-dias');
  const [selectedClient, setSelectedClient] = useState('todos');
  const [selectedType, setSelectedType] = useState('todos');

  useEffect(() => {
    loadAdminReports();
  }, [selectedPeriod, selectedClient, selectedType]);

  const loadAdminReports = async () => {
    try {
      setLoading(true);
      
      // Relatórios administrativos completos com dados sensíveis
      const adminReportsData = [
        {
          id: 1,
          titulo: 'Relatório Financeiro Mensal - Novembro 2024',
          tipo: 'financeiro',
          cliente: 'Instituto Nacional de Estatística',
          periodo: '01/11/2024 - 07/11/2024',
          status: 'disponivel',
          tamanho: '5.2 MB',
          data_criacao: '2024-11-07',
          prioridade: 'alta',
          descricao: 'Análise completa de receitas, custos e margem de lucro',
          metricas_admin: {
            receita_total: 85000,
            custos_operacionais: 74880,
            margem_lucro: 13.5,
            clientes_ativos: 3,
            campanhas_realizadas: 5,
            horas_trabalhadas: 240
          },
          alertas: [
            'Margem de lucro abaixo da meta (15%)',
            'Custos operacionais 8% acima do orçado'
          ]
        },
        {
          id: 2,
          titulo: 'Auditoria de Qualidade - Campanhas Ativas',
          tipo: 'qualidade',
          cliente: 'Múltiplos Clientes',
          periodo: '01/11/2024 - 07/11/2024',
          status: 'disponivel',
          tamanho: '3.8 MB',
          data_criacao: '2024-11-07',
          prioridade: 'alta',
          descricao: 'Relatório detalhado de qualidade e validação de dados',
          metricas_admin: {
            campanhas_auditadas: 12,
            respostas_validadas: 1240,
            taxa_aprovacao: 94.2,
            tempo_medio_validacao: 18,
            alertas_qualidade: 3,
            intervencoes_necessarias: 2
          },
          alertas: [
            'Campanha #3456 - Taxa de rejeição elevada (12%)',
            'Cliente XYZ - Necessita revisão de metodologia'
          ]
        },
        {
          id: 3,
          titulo: 'Performance Operacional - Equipe',
          tipo: 'operacional',
          cliente: 'Interno',
          periodo: '25/10/2024 - 07/11/2024',
          status: 'disponivel',
          tamanho: '2.1 MB',
          data_criacao: '2024-11-07',
          prioridade: 'media',
          descricao: 'Análise de produtividade e performance da equipe',
          metricas_admin: {
            colaboradores_ativos: 8,
            produtividade_media: 87,
            horas_extras: 45,
            taxa_satisfaction_equipe: 4.3,
            projetos_entregues: 7,
            atrasos_reportados: 2
          },
          alertas: [
            'Meta de produtividade atingida',
            'Aumento de 15% em horas extras'
          ]
        },
        {
          id: 4,
          titulo: 'Análise de ROI por Cliente - Q4 2024',
          tipo: 'roi',
          cliente: 'Todos os Clientes',
          periodo: '01/10/2024 - 07/11/2024',
          status: 'disponivel',
          tamanho: '4.7 MB',
          data_criacao: '2024-11-07',
          prioridade: 'alta',
          descricao: 'Retorno sobre investimento e valor por cliente',
          metricas_admin: {
            receita_por_cliente: 28333,
            custo_aquisicao_cliente: 12500,
            lifetime_value: 85000,
            taxa_retencao: 92,
            margem_media_projetos: 18.5,
            projetos_renovados: 85
          },
          alertas: [
            'Cliente Premium - ROI 35% acima da média',
            'Oportunidade de upselling identificada'
          ]
        },
        {
          id: 5,
          titulo: 'Relatório de Compliance e Auditoria',
          tipo: 'compliance',
          cliente: 'Interno',
          periodo: '01/01/2024 - 07/11/2024',
          status: 'processando',
          tamanho: '6.3 MB',
          data_criacao: '2024-11-07',
          prioridade: 'critica',
          descricao: 'Conformidade com regulamentações e políticas internas',
          metricas_admin: {
            politicas_verificadas: 24,
            conformidade_geral: 96,
            incidentes_reportados: 1,
            acoes_corretivas: 3,
            certificacoes_validas: 5,
            proxima_auditoria: '2024-12-15'
          },
          alertas: [
            'Certificação ISO expira em 30 dias',
            'Política de privacidade requer atualização'
          ]
        },
        {
          id: 6,
          titulo: 'Dashboard Executivo - Métricas Estratégicas',
          tipo: 'executivo',
          cliente: 'Board/Diretoria',
          periodo: '01/11/2024 - 07/11/2024',
          status: 'disponivel',
          tamanho: '1.9 MB',
          data_criacao: '2024-11-07',
          prioridade: 'critica',
          descricao: 'KPIs estratégicos e métricas de alto nível para diretoria',
          metricas_admin: {
            crescimento_receita: 23,
            novos_contratos: 2,
            satisfaction_cliente: 4.7,
            market_share: 12,
            eficiencia_operacional: 89,
            inovacao_score: 7.8
          },
          alertas: [
            'Meta de crescimento trimestral atingida',
            'Novo concorrente identificado no mercado'
          ]
        }
      ];

      setReports(adminReportsData);
    } catch (error) {
      console.error('Erro ao carregar relatórios administrativos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAdminPDF = async (report) => {
    try {
      const pdf = new jsPDF();
      
      // Cabeçalho administrativo
      pdf.setFontSize(20);
      pdf.text('KUDIMU - Relatório Administrativo', 20, 30);
      
      pdf.setFontSize(16);
      pdf.text(report.titulo, 20, 50);
      
      pdf.setFontSize(12);
      pdf.text(`Cliente: ${report.cliente}`, 20, 70);
      pdf.text(`Período: ${report.periodo}`, 20, 80);
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 90);
      pdf.text(`Prioridade: ${report.prioridade.toUpperCase()}`, 20, 100);
      
      // Linha separadora
      pdf.line(20, 110, 190, 110);
      
      // Alertas importantes
      if (report.alertas && report.alertas.length > 0) {
        pdf.setFontSize(14);
        pdf.text('⚠️ ALERTAS IMPORTANTES', 20, 130);
        
        let yPos = 145;
        pdf.setFontSize(11);
        report.alertas.forEach((alerta, index) => {
          pdf.text(`${index + 1}. ${alerta}`, 25, yPos);
          yPos += 10;
        });
        yPos += 10;
      }
      
      // Métricas administrativas
      let yPos = 170;
      pdf.setFontSize(14);
      pdf.text('📊 MÉTRICAS ADMINISTRATIVAS', 20, yPos);
      yPos += 15;
      
      pdf.setFontSize(11);
      Object.entries(report.metricas_admin).forEach(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        let displayValue = value;
        
        // Formatação especial para valores monetários e percentuais
        if (key.includes('receita') || key.includes('custo') || key.includes('value')) {
          displayValue = `${value.toLocaleString('pt-BR')} AOA`;
        } else if (key.includes('taxa') || key.includes('margem') || key.includes('crescimento')) {
          displayValue = `${value}%`;
        }
        
        pdf.text(`${label}: ${displayValue}`, 25, yPos);
        yPos += 10;
      });
      
      // Análise executiva
      yPos += 15;
      pdf.setFontSize(14);
      pdf.text('📋 ANÁLISE EXECUTIVA', 20, yPos);
      yPos += 15;
      
      pdf.setFontSize(11);
      const analiseTexto = report.descricao;
      const splitAnalise = pdf.splitTextToSize(analiseTexto, 170);
      pdf.text(splitAnalise, 20, yPos);
      
      // Observações confidenciais
      yPos = 250;
      pdf.setFontSize(10);
      pdf.setTextColor(200, 0, 0);
      pdf.text('🔒 CONFIDENCIAL - USO ADMINISTRATIVO APENAS', 20, yPos);
      pdf.text('Este relatório contém informações comerciais sensíveis', 20, yPos + 10);
      
      // Rodapé
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.text('KUDIMU Admin Dashboard | Acesso Restrito', 20, 280);
      
      pdf.save(`ADMIN_${report.titulo.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF administrativo:', error);
    }
  };

  const getReportIcon = (tipo) => {
    switch (tipo) {
      case 'financeiro':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'qualidade':
        return <ChartBarIcon className="h-5 w-5" />;
      case 'operacional':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'roi':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'compliance':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'executivo':
        return <BuildingOfficeIcon className="h-5 w-5" />;
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

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'critica':
        return 'bg-red-100 text-red-800';
      case 'alta':
        return 'bg-orange-100 text-orange-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baixa':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando relatórios administrativos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Admin */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Relatórios Administrativos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Dashboards executivos, análises financeiras e métricas operacionais
          </p>
        </motion.div>

        {/* Filtros Avançados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="ultimos-7-dias">Últimos 7 dias</option>
                <option value="ultimos-30-dias">Últimos 30 dias</option>
                <option value="ultimos-90-dias">Últimos 90 dias</option>
                <option value="este-trimestre">Este trimestre</option>
                <option value="este-ano">Este ano</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cliente
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="todos">Todos os clientes</option>
                <option value="instituto">Instituto Nacional de Estatística</option>
                <option value="banco">Banco Nacional</option>
                <option value="ministerio">Ministério da Educação</option>
                <option value="interno">Relatórios Internos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="todos">Todos os tipos</option>
                <option value="financeiro">Financeiro</option>
                <option value="qualidade">Qualidade</option>
                <option value="operacional">Operacional</option>
                <option value="roi">ROI</option>
                <option value="compliance">Compliance</option>
                <option value="executivo">Executivo</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadAdminReports}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {reports.length} relatório{reports.length !== 1 ? 's' : ''} administrativo{reports.length !== 1 ? 's' : ''} encontrado{reports.length !== 1 ? 's' : ''}
          </div>
        </motion.div>

        {/* Lista de Relatórios Administrativos */}
        <div className="space-y-6">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-grow">
                  <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900 rounded-lg text-primary-600 dark:text-primary-400">
                    {getReportIcon(report.tipo)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {report.titulo}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.prioridade)}`}>
                        {report.prioridade.charAt(0).toUpperCase() + report.prioridade.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {report.descricao}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500 mb-4">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                        {report.cliente}
                      </div>
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
                    
                    {/* Alertas */}
                    {report.alertas && report.alertas.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">⚠️ Alertas:</h4>
                        <div className="space-y-1">
                          {report.alertas.map((alerta, alertIndex) => (
                            <div key={alertIndex} className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">
                              {alerta}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Métricas Administrativas */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                      {Object.entries(report.metricas_admin).slice(0, 6).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {typeof value === 'number' && (key.includes('receita') || key.includes('custo') || key.includes('value'))
                              ? `${(value / 1000).toFixed(0)}K`
                              : value.toString()
                            }
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
                      {report.status === 'disponivel' ? 'Disponível' : 
                       report.status === 'processando' ? 'Processando' : report.status}
                    </span>
                    
                    <button
                      onClick={() => generateAdminPDF(report)}
                      disabled={report.status !== 'disponivel'}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${
                        report.status === 'disponivel'
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
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
              Nenhum relatório administrativo encontrado
            </h3>
            <p className="text-gray-500">
              Ajuste os filtros para encontrar os relatórios desejados.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;