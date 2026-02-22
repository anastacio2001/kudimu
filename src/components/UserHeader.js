import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  ClockIcon, 
  GiftIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/campaigns', label: 'Campanhas', icon: ClipboardDocumentListIcon },
    { path: '/history', label: 'Histórico', icon: ClockIcon },
    { path: '/rewards', label: 'Recompensas', icon: GiftIcon },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate('/dashboard')}>
              Kudimu
            </h1>
            
            {/* Menu de navegação */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User info e logout */}
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="font-medium text-gray-900">{user.nome}</span>
              <span className="ml-2 text-gray-500">•</span>
              <span className="ml-2 text-indigo-600 font-medium">{user.nivel || 'Bronze'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t">
        <nav className="flex overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center px-4 py-3 min-w-[80px] ${
                  isActive 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
