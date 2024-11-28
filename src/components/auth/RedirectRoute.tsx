import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RedirectRoute = () => {
  const { admin } = useAuth();

  if (!admin) {
    return <Outlet />;
  }

  // 로그인된 사용자가 "WAITING"이 아닌 경우에만 리다이렉트
  if (admin && admin.role !== "WAITING") {
    return <Navigate to="/" replace />;
  }

  // 권한이 대기 중인 경우 승인 대기 페이지로 리다이렉트
  if (admin.role === "WAITING") {
    return <Navigate to="/approval-pending" replace />;
  }

  return <Outlet />;
};

export default RedirectRoute;
