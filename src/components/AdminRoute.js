import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children, allowClients = false, adminOnly = false }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Se for adminOnly, apenas admins podem acessar
  if (adminOnly && user.tipo_usuario !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Permitir admin sempre
  if (user.tipo_usuario === 'admin') {
    return children;
  }

  // Permitir clientes se especificado
  if (allowClients && user.tipo_usuario === 'cliente') {
    return children;
  }

  // Redirecionar usuários normais para dashboard de usuário
  if (user.tipo_usuario === 'usuario') {
    return <Navigate to="/dashboard" replace />;
  }

  // Outros casos, redirecionar para login
  return <Navigate to="/login" replace />;
}

export default AdminRoute;
