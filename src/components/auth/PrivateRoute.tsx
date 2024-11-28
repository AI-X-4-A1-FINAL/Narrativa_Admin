import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
  const { admin } = useAuth();
  const location = useLocation();

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // 유효한 경로 확인
  const isValidPath = (path: string) => {
    const exactPaths = [
      "/",
      "/users",
      "/notices",
      "/notices/create",
      "/admins",
    ];
    if (exactPaths.includes(path)) return true;

    const dynamicPathPatterns = [/^\/notices\/\d+$/, /^\/notices\/\d+\/edit$/];

    return dynamicPathPatterns.some((pattern) => pattern.test(path));
  };

  // 유효하지 않은 경로로 접근 시 404 페이지로 리다이렉트
  if (!isValidPath(location.pathname)) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
