import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  ClipboardDocumentListIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import NotificationButton from './NotificationButton';

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: HomeIcon, label: 'Dashboard' },
    { path: '/admin/users', icon: UsersIcon, label: 'Usuários' },
    { path: '/admin/campaigns', icon: ClipboardDocumentListIcon, label: 'Campanhas' },
    { path: '/admin/answers', icon: ChatBubbleLeftRightIcon, label: 'Respostas' },
    { path: '/admin/analytics', icon: ChartBarIcon, label: 'Analytics' }
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
                onClick={() => navigate('/admin')}
              >
                Kudimu
              </div>
              <div className="text-gray-400">|</div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title || 'Admin'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Menu de Navegação */}
              <nav className="hidden md:flex items-center space-x-1">
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
              
              <NotificationButton />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {JSON.parse(localStorage.getItem('user') || '{}').nome || 'Admin'}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 dark:hover:text-red-500 transition-colors font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
