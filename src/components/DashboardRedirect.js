import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirecionar baseado no tipo de usuário
  switch (user.tipo_usuario) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'cliente':
      return <Navigate to="/client/dashboard" replace />;
    case 'usuario':
    default:
      // Todos usuários normais vão para campanhas (tela única)
      return <Navigate to="/campaigns" replace />;
  }
};

export default DashboardRedirect;