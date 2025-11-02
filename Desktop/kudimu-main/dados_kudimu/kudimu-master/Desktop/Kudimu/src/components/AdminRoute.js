import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.tipo_usuario !== 'admin') {
    return <Navigate to="/campaigns" replace />;
  }

  return children;
}

export default AdminRoute;
