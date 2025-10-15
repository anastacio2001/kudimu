import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import './ReportsPage.css';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_URL = 'https://kudimu-api.l-anastacio001.workers.dev';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30'); // 7, 30, 90 dias
  const [overview, setOverview] = useState(null);
  const [campaignStats, setCampaignStats] = useState([]);
  const [userPerformance, setUserPerformance] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportsData();
  }, [period]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Buscar dados de overview
      const overviewRes = await fetch(`${API_URL}/reports/overview?days=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const overviewData = await overviewRes.json();
      if (overviewData.success) {
        setOverview(overviewData.data);
      }

      // Buscar estatísticas de campanhas
      const campaignsRes = await fetch(`${API_URL}/reports/campaigns?days=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const campaignsData = await campaignsRes.json();
      if (campaignsData.success) {
        setCampaignStats(campaignsData.data.campaigns || []);
      }

      // Buscar performance do usuário logado
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        const perfRes = await fetch(`${API_URL}/reports/user/${user.id}?days=${period}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const perfData = await perfRes.json();
        if (perfData.success) {
          setUserPerformance(perfData.data);
        }
      }

    } catch (err) {
      console.error('Erro ao buscar relatórios:', err);
      setError('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const token = localStorage.getItem('token');
    const exportUrl = `${API_URL}/reports/export?days=${period}&format=csv`;
    
    fetch(exportUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kudimu-report-${period}days.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => console.error('Erro ao exportar:', err));
  };

  // Configuração do gráfico de evolução temporal
  const getTimelineChartData = () => {
    if (!overview || !overview.daily_stats) return null;

    const labels = overview.daily_stats.map(stat => {
      const date = new Date(stat.date);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Respostas',
          data: overview.daily_stats.map(stat => stat.respostas),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Novos Usuários',
          data: overview.daily_stats.map(stat => stat.novos_usuarios),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  // Configuração do gráfico de campanhas por tema
  const getCampaignsByThemeData = () => {
    if (!campaignStats || campaignStats.length === 0) return null;

    const themes = {};
    campaignStats.forEach(campaign => {
      const theme = campaign.tema || 'Outros';
      themes[theme] = (themes[theme] || 0) + 1;
    });

    return {
      labels: Object.keys(themes),
      datasets: [{
        label: 'Campanhas por Tema',
        data: Object.values(themes),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2
      }]
    };
  };

  // Configuração do gráfico de taxa de aprovação
  const getApprovalRateData = () => {
    if (!overview) return null;

    const totalRespostas = overview.total_respostas || 1;
    const aprovadas = overview.respostas_aprovadas || 0;
    const pendentes = overview.respostas_pendentes || 0;
    const rejeitadas = totalRespostas - aprovadas - pendentes;

    return {
      labels: ['Aprovadas', 'Pendentes', 'Rejeitadas'],
      datasets: [{
        data: [aprovadas, pendentes, rejeitadas],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2
      }]
    };
  };

  // Configuração do gráfico de performance do usuário
  const getUserPerformanceData = () => {
    if (!userPerformance) return null;

    return {
      labels: ['Campanhas\nCompletas', 'Taxa de\nAprovação', 'Tempo Médio\n(min)', 'Reputação'],
      datasets: [{
        label: 'Sua Performance',
        data: [
          userPerformance.campanhas_completas || 0,
          userPerformance.taxa_aprovacao || 0,
          userPerformance.tempo_medio_min || 0,
          (userPerformance.reputacao || 0) / 10 // Escala reduzida para visualização
        ],
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 2
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-page">
        <div className="error-container">
          <h2>❌ Erro</h2>
          <p>{error}</p>
          <button onClick={fetchReportsData} className="btn-retry">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="reports-header">
        <div className="header-content">
          <button onClick={() => navigate('/campaigns')} className="btn-back">
            ← Voltar
          </button>
          <div className="header-title">
            <h1>📊 Relatórios e Analytics</h1>
            <p>Análise detalhada de desempenho e métricas</p>
          </div>
        </div>

        <div className="header-controls">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="period-select"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>

          <button onClick={exportToCSV} className="btn-export">
            📥 Exportar CSV
          </button>
        </div>
      </div>

      {/* Cards de Overview */}
      {overview && (
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              👥
            </div>
            <div className="card-content">
              <span className="card-label">Total de Usuários</span>
              <span className="card-value">{overview.total_usuarios || 0}</span>
              <span className="card-trend positive">+{overview.novos_usuarios || 0} novos</span>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              📝
            </div>
            <div className="card-content">
              <span className="card-label">Total de Campanhas</span>
              <span className="card-value">{overview.total_campanhas || 0}</span>
              <span className="card-trend positive">{overview.campanhas_ativas || 0} ativas</span>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              💬
            </div>
            <div className="card-content">
              <span className="card-label">Total de Respostas</span>
              <span className="card-value">{overview.total_respostas || 0}</span>
              <span className="card-trend positive">
                {overview.respostas_aprovadas || 0} aprovadas
              </span>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              💰
            </div>
            <div className="card-content">
              <span className="card-label">Total Distribuído</span>
              <span className="card-value">{overview.total_recompensas?.toFixed(2) || '0.00'} AOA</span>
              <span className="card-trend neutral">
                {overview.total_pontos || 0} pontos
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="charts-grid">
        {/* Evolução Temporal */}
        {getTimelineChartData() && (
          <div className="chart-card large">
            <h3>📈 Evolução Temporal</h3>
            <div className="chart-container">
              <Line data={getTimelineChartData()} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Campanhas por Tema */}
        {getCampaignsByThemeData() && (
          <div className="chart-card">
            <h3>🎯 Campanhas por Tema</h3>
            <div className="chart-container">
              <Doughnut data={getCampaignsByThemeData()} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Taxa de Aprovação */}
        {getApprovalRateData() && (
          <div className="chart-card">
            <h3>✅ Taxa de Aprovação</h3>
            <div className="chart-container">
              <Pie data={getApprovalRateData()} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Performance do Usuário */}
        {getUserPerformanceData() && (
          <div className="chart-card large">
            <h3>⭐ Sua Performance</h3>
            <div className="chart-container">
              <Bar data={getUserPerformanceData()} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Top Campanhas */}
      {campaignStats && campaignStats.length > 0 && (
        <div className="top-campaigns">
          <h3>🏆 Top 10 Campanhas (por respostas)</h3>
          <div className="campaigns-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th>Tema</th>
                  <th>Respostas</th>
                  <th>Taxa Aprovação</th>
                  <th>Recompensa Média</th>
                </tr>
              </thead>
              <tbody>
                {campaignStats.slice(0, 10).map((campaign, index) => (
                  <tr key={campaign.id}>
                    <td className="rank">{index + 1}</td>
                    <td className="title">{campaign.titulo}</td>
                    <td>
                      <span className="theme-badge">{campaign.tema || 'N/A'}</span>
                    </td>
                    <td className="number">{campaign.total_respostas || 0}</td>
                    <td className="number">
                      {campaign.taxa_aprovacao ? `${campaign.taxa_aprovacao}%` : 'N/A'}
                    </td>
                    <td className="number">{campaign.recompensa_media?.toFixed(2) || '0.00'} AOA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
