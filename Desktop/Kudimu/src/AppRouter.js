import React, { useState, useEffect } from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import CampaignsScreen from './screens/CampaignsScreen';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCampaigns from './pages/AdminCampaigns';
import AdminAnswers from './pages/AdminAnswers';
import AIInsights from './pages/AIInsights';
import ReportsPage from './pages/ReportsPage';
import './styles/admin.css';

function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Carregar usuário do localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    // Listener para mudanças de rota
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handleRouteChange = () => {
    setCurrentRoute(window.location.pathname);
  };

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentRoute(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigateTo('/');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirecionar admin para painel admin
    if (userData.perfil === 'admin') {
      navigateTo('/admin/dashboard');
    } else {
      navigateTo('/campaigns');
    }
  };

  // Proteção de rotas admin
  const isAdmin = user && user.perfil === 'admin';

  // Navbar
  const renderNavbar = () => {
    if (!user) return null;

    return (
      <nav className="app-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h2>🎯 Kudimu Insights</h2>
          </div>
          <div className="navbar-menu">
            {isAdmin ? (
              <>
                <a href="/admin/dashboard" onClick={(e) => { e.preventDefault(); navigateTo('/admin/dashboard'); }}>
                  📊 Dashboard
                </a>
                <a href="/admin/users" onClick={(e) => { e.preventDefault(); navigateTo('/admin/users'); }}>
                  👥 Usuários
                </a>
                <a href="/admin/campaigns" onClick={(e) => { e.preventDefault(); navigateTo('/admin/campaigns'); }}>
                  📋 Campanhas
                </a>
                <a href="/admin/answers" onClick={(e) => { e.preventDefault(); navigateTo('/admin/answers'); }}>
                  💬 Respostas
                </a>
                <a href="/admin/ai-insights" onClick={(e) => { e.preventDefault(); navigateTo('/admin/ai-insights'); }}>
                  🤖 AI Insights
                </a>
                <a href="/admin/reports" onClick={(e) => { e.preventDefault(); navigateTo('/admin/reports'); }}>
                  📊 Relatórios
                </a>
              </>
            ) : (
              <>
                <a href="/campaigns" onClick={(e) => { e.preventDefault(); navigateTo('/campaigns'); }}>
                  📋 Campanhas
                </a>
                <a href="/rewards" onClick={(e) => { e.preventDefault(); navigateTo('/rewards'); }}>
                  💰 Recompensas
                </a>
              </>
            )}
            <div className="navbar-user">
              <span>{user.nome}</span>
              <button onClick={handleLogout} className="btn-logout">
                🚪 Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  // Rotas
  const renderRoute = () => {
    // Rotas públicas
    if (currentRoute === '/' || currentRoute === '/login') {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo} />;
    }

    if (currentRoute === '/signup' || currentRoute === '/cadastro') {
      return <SignupScreen navigateTo={navigateTo} />;
    }

    // Rotas protegidas - requer autenticação
    if (!user) {
      navigateTo('/login');
      return <LoginScreen onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo} />;
    }

    // Rotas de Admin
    if (currentRoute.startsWith('/admin')) {
      if (!isAdmin) {
        return (
          <div className="access-denied">
            <h1>🚫 Acesso Negado</h1>
            <p>Você não tem permissão para acessar esta área.</p>
            <button onClick={() => navigateTo('/campaigns')} className="btn-primary">
              Voltar para Campanhas
            </button>
          </div>
        );
      }

      switch (currentRoute) {
        case '/admin/dashboard':
          return <AdminDashboard />;
        case '/admin/users':
          return <AdminUsers />;
        case '/admin/campaigns':
          return <AdminCampaigns />;
        case '/admin/answers':
          return <AdminAnswers />;
        case '/admin/ai-insights':
          return <AIInsights navigateTo={navigateTo} />;
        case '/admin/reports':
          return <ReportsPage />;
        default:
          return <AdminDashboard />;
      }
    }

    // Rotas de usuário normal
    if (currentRoute === '/campaigns') {
      return <CampaignsScreen user={user} />;
    }

    if (currentRoute === '/rewards') {
      return (
        <div className="page-container">
          <h1>💰 Minhas Recompensas</h1>
          <p>Em construção...</p>
        </div>
      );
    }

    // 404
    return (
      <div className="page-not-found">
        <h1>404 - Página não encontrada</h1>
        <button onClick={() => navigateTo(isAdmin ? '/admin/dashboard' : '/campaigns')} className="btn-primary">
          Voltar ao Início
        </button>
      </div>
    );
  };

  return (
    <div className="app">
      {renderNavbar()}
      <main className="app-main">
        {renderRoute()}
      </main>
    </div>
  );
}

export default AppRouter;
