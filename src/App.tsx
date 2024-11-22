import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RedirectRoute from './components/RedirectRoute';

import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import StatisticsPage from './pages/StatisticsPage';
import UserManagementPage from './pages/UserManagementPage';
import NotFoundPage from './pages/NotFoundPage';

import NoticeList from './pages/notice/NoticeList';
import NoticeDetail from './pages/notice/NoticeDetail';
import NoticeCreate from './pages/notice/NoticeCreate';
import NoticeEdit from './pages/notice/NoticeEdit';

const Root: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* 로그인 페이지 */}
            <Route element={<RedirectRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* 인증된 사용자 */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<StatisticsPage />} />
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/notices" element={<NoticeList />} />
              <Route path="/notices/create" element={<NoticeCreate />} />
              <Route path="/notices/:id" element={<NoticeDetail />} />
              <Route path="/notices/:id/edit" element={<NoticeEdit />} />
            </Route>

            {/* 404 페이지 */}
            <Route path="/404" element={<NotFoundPage />} />

            {/* 모든 잘못된 경로를 404로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
};

export default Root;
