import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import RedirectRoute from "./components/auth/RedirectRoute";

import AppLayout from "./components/ui/AppLayout";
import LoginPage from "./pages/login/LoginPage";

import StatisticsPage from "./pages/StatisticsPage";
import UserManagementPage from "./pages/UserManagementPage";
import AdminManagementPage from "./pages/AdminManagementPage";
import NotFoundPage from "./components/util/NotFoundPage";
import ApprovalPendingPage from "./pages/login/ApprovalPendingPage";

import NoticeList from "./pages/notice/NoticeList";
import NoticeDetail from "./pages/notice/NoticeDetail";
import NoticeCreate from "./pages/notice/NoticeCreate";
import NoticeEdit from "./pages/notice/NoticeEdit";

import "./assets/css/customScroll.css";

const Root: React.FC = () => {
  return (
    <AuthProvider>
      <div className="custom-scroll-container ">
        <Router>
          <Routes>
            <Route element={<RedirectRoute />}>
              {/* 로그인 페이지 */}
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* 승인 대기 페이지 */}
            <Route path="/approval-pending" element={<ApprovalPendingPage />} />

            {/* 인증된 사용자 */}
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<StatisticsPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="admins" element={<AdminManagementPage />} />
                <Route path="notices" element={<NoticeList />} />
                <Route path="notices/create" element={<NoticeCreate />} />
                <Route path="notices/:id" element={<NoticeDetail />} />
                <Route path="notices/:id/edit" element={<NoticeEdit />} />
              </Route>
            </Route>

            {/* 404 페이지 */}
            <Route path="/404" element={<NotFoundPage />} />

            {/* 모든 잘못된 경로를 404로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default Root;
