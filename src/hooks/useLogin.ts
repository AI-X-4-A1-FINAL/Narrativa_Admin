import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";
import { useToast } from "./useToast";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async () => {
    try {
      await login();
      showToast("로그인 성공!", "success");
      navigate("/");
    } catch (error: any) {
      showToast(
        error.message || "로그인 중 오류가 발생했습니다.",
        "error"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast("로그아웃 되었습니다.", "success");
      navigate("/login");
    } catch (error: any) {
      showToast(
        error.message || "로그아웃 중 오류가 발생했습니다.",
        "error"
      );
    }
  };

  return { handleLogin, handleLogout };
};

export default useLogin;
