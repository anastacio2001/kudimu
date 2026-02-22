import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ClockIcon,
  GiftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function MainLayout({ children, activePage = 'campaigns' }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { id: 'campaigns', label: 'Início', icon: HomeIcon, path: '/campaigns' },
    { id: 'history', label: 'Histórico', icon: ClockIcon, path: '/history' },
    { id: 'rewards', label: 'Recompensas', icon: GiftIcon, path: '/rewards' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixo */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text cursor-pointer"
                onClick={() => navigate('/campaigns')}
              >
                Kudimu
              </h1>
              
              {/* Menu de navegação */}
              <nav className="hidden md:flex items-center space-x-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  
                  return (
                    <button
                      key={item.id}
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
              <div className="hidden md:block text-sm">
                <span className="font-medium text-gray-900">{user.nome?.split(' ')[0]}</span>
                <span className="ml-2 text-gray-500">•</span>
                <span className="ml-2 text-indigo-600 font-medium">{user.nivel || 'Bronze'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t">
          <nav className="flex overflow-x-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
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

      {/* Conteúdo */}
      <main className="container-custom py-8">
        {children}
      </main>
    </div>
  );
}
