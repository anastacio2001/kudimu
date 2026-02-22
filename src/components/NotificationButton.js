import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellIcon } from '@heroicons/react/24/outline';
import NotificationCenter from './NotificationCenter';

const NotificationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  useEffect(() => {
    // Verificar notificações não lidas periodicamente
    const checkNotifications = async () => {
      try {
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const API_URL = isDevelopment ? 'http://127.0.0.1:8787' : 'https://kudimu-api.l-anastacio001.workers.dev';
        
        const token = localStorage.getItem('token');
        if (!token) {
          return; // Não tentar fazer fetch sem token
        }
        
        const response = await fetch(`${API_URL}/notifications/unread-count`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Se houver erro 403/401, apenas usar mock sem logar
          setUnreadCount(0);
          return;
        }

        const result = await response.json();
        
        if (result.success) {
          const newCount = result.data.count;
          if (newCount > unreadCount) {
            setHasNewNotifications(true);
            setTimeout(() => setHasNewNotifications(false), 3000); // Remove animação após 3s
          }
          setUnreadCount(newCount);
        } else {
          setUnreadCount(0);
        }
      } catch (error) {
        // Silenciar erros de rede para não poluir console
        setUnreadCount(0);
      }
    };

    // Verificar imediatamente
    checkNotifications();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkNotifications, 30000);

    return () => clearInterval(interval);
  }, [unreadCount]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    setHasNewNotifications(false);
  };

  return (
    <>
      <motion.button
        onClick={toggleNotifications}
        className="relative p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={hasNewNotifications ? {
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : {}}
        transition={{
          duration: 0.5,
          repeat: hasNewNotifications ? 2 : 0
        }}
      >
        <BellIcon className="h-5 w-5 text-gray-600" />
        
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
        
        {hasNewNotifications && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"
          />
        )}
      </motion.button>

      <NotificationCenter 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default NotificationButton;