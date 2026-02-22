import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente para rotas exclusivas de usuários normais
function UserRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Apenas usuários normais (respondentes)
  if (user.tipo_usuario === 'respondente' || user.tipo_usuario === 'usuario') {
    return children;
  }

  // Redirecionar admins e clientes para seus dashboards
  if (user.tipo_usuario === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.tipo_usuario === 'cliente') {
    return <Navigate to="/client/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default UserRoute;