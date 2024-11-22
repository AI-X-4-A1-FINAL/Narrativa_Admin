import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 유효한 경로 패턴을 체크하는 함수
  const isValidPath = (path: string) => {
    // 기본 경로들
    const exactPaths = ['/', '/users', '/notices', '/notices/create'];
    if (exactPaths.includes(path)) return true;

    // 동적 경로 패턴
    const dynamicPathPatterns = [
      /^\/notices\/\d+$/,
      /^\/notices\/\d+\/edit$/
    ];

    return dynamicPathPatterns.some(pattern => pattern.test(path));
  };

  if (!isValidPath(location.pathname)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;