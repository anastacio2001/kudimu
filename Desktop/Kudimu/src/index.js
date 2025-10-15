import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeNotifications } from './utils/pushNotifications';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);

// Inicializa sistema de notificações após o app carregar
if (process.env.NODE_ENV === 'production') {
  // Em produção, inicializa automaticamente
  setTimeout(() => {
    initializeNotifications().then((initialized) => {
      if (initialized) {
        console.log('✅ Sistema de notificações inicializado');
      }
    });
  }, 2000);
}
