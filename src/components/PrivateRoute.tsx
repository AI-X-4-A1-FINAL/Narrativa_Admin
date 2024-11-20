import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isValidPath = ['/user-management', '/notice-management', '/'].includes(
    location.pathname
  );

  if (!isValidPath) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
