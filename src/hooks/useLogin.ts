import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { useAuth } from "../components/auth/AuthContext";
import { AdminRole, AdminUser } from "../types/admin";

const useLogin = () => {
  const { login, admin } = useAuth();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${backendUrl}/api/admin/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data || "권한 확인 실패");
      }

      // 권한이 없는 경우
      if (!data.role || data.role === "WAITING") {
        const adminData: AdminUser = {
          id: data.uid,
          username: result.user.displayName || "관리자",
          email: data.email,
          role: "WAITING",
          status: "INACTIVE",
          lastLoginAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          profilePicture: result.user.photoURL || "",
        };

        login(adminData);
        showToast(
          "등록되지 않은 사용자입니다.\n 권한 승인이 필요합니다.",
          "error"
        );
        return;
      }

      // 권한이 있는 경우
      const adminData: AdminUser = {
        id: data.uid,
        username: result.user.displayName || "관리자",
        email: data.email,
        role: data.role as AdminRole,
        status: "ACTIVE",
        lastLoginAt: new Date().toISOString(),
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profilePicture: result.user.photoURL || "",
      };

      login(adminData);
      showToast(`환영합니다, ${data.username}님!`, "success");
      navigate("/");
    } catch (error: any) {
      console.error("로그인 실패:", error);
      if (error.message.includes("popup")) {
        showToast("로그인 팝업이 닫혔습니다. 다시 시도해 주세요.", "error");
      } else {
        showToast(
          "로그인 중 문제가 발생했습니다. 다시 시도해 주세요.",
          "error"
        );
      }
    }
  };

  const handleRequestApproval = async () => {
    try {
      if (!admin) {
        showToast("먼저 로그인해주세요.", "error");
        return;
      }

      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        throw new Error("Firebase 토큰을 가져올 수 없습니다.");
      }

      const response = await fetch(`${backendUrl}/api/admin/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const data = await response.text();
        showToast(data, "success");
      } else {
        const errorText = await response.text();
        showToast(errorText, "error");
      }
    } catch (error: any) {
      console.error("권한 요청 실패:", error);
      showToast(
        "권한 요청 중 문제가 발생했습니다. 다시 시도해주세요.",
        "error"
      );
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("admin");

    showToast("로그아웃 완료!\n 안전하게 로그아웃되었습니다.", "success");

    navigate("/login");
  };

  return { handleLogin, handleRequestApproval, handleLogout, admin };
};

export default useLogin;
