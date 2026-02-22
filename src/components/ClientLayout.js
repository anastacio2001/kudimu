import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  WalletIcon,
  CreditCardIcon,
  LightBulbIcon,
  CogIcon,
  UserCircleIcon,
  LifebuoyIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import NotificationButton from './NotificationButton';

export default function ClientLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/client/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/client/campaigns', icon: ClipboardDocumentListIcon, label: 'Campanhas' },
    { path: '/client/credits', icon: CreditCardIcon, label: 'Créditos' },
    { path: '/client/budget', icon: WalletIcon, label: 'Orçamento' },
    { path: '/client/ai-insights', icon: LightBulbIcon, label: 'AI Insights' },
    { path: '/client/reports', icon: ChartBarIcon, label: 'Relatórios' }
  ];

  const accountItems = [
    { path: '/client/subscription', icon: CreditCardIcon, label: 'Assinatura' },
    { path: '/client/profile', icon: UserCircleIcon, label: 'Perfil' },
    { path: '/client/settings', icon: CogIcon, label: 'Configurações' },
    { path: '/client/support', icon: LifebuoyIcon, label: 'Suporte' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header com Navegação */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div 
                className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-transparent bg-clip-text cursor-pointer"
                onClick={() => navigate('/client/dashboard')}
              >
                Kudimu
              </div>
              <div className="text-gray-400">|</div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title || 'Cliente'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Menu de Navegação Principal */}
              <nav className="hidden lg:flex items-center space-x-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              
              {/* Dropdown Menu Conta */}
              <div className="hidden md:block relative group">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                  <UserCircleIcon className="h-5 w-5" />
                  <span>{JSON.parse(localStorage.getItem('user') || '{}').nome || 'Cliente'}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {accountItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <span>Sair</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <nav className="space-y-1">
                {[...menuItems, ...accountItems].map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <span>Sair</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
