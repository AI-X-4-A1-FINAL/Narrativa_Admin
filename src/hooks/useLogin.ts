import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { useAuth } from "../components/auth/AuthContext";

const useLogin = () => {
  const { login, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${backendUrl}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data || "권한 확인 실패");
      }

      const userData = {
        id: data.uid,
        email: data.email,
        name: result.user.displayName || "사용자",
        role: data.role as "SUPER_ADMIN" | "SYSTEM_ADMIN" | "CONTENT_ADMIN" | "SUPPORT_ADMIN" | "WAITING",
        provider: "google" as const,
        profilePicture: result.user.photoURL || "",
      };

      login(userData);

      if (!data.role) {
        showToast("등록되지 않은 사용자입니다. 권한 승인이 필요합니다.", "error");
      } else {
        showToast(`환영합니다, ${data.name}.`, "success");
        navigate("/");
      }
    } catch (error: any) {
      console.error("로그인 실패:", error);
      if (error.message.includes("popup")) {
        showToast("로그인 팝업이 닫혔습니다. 다시 시도해 주세요.", "error");
      } else {
        showToast("로그인 중 문제가 발생했습니다. 다시 시도해 주세요.", "error");
      }
    }
  };

  const handleRequestApproval = async () => {
    try {
      if (!user) {
        showToast("먼저 로그인해주세요.", "error");
        return;
      }

      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        throw new Error("Firebase 토큰을 가져올 수 없습니다.");
      }

      const response = await fetch(`${backendUrl}/api/auth/register`, {
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
      showToast("권한 요청 중 문제가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    sessionStorage.removeItem("user");
    showToast("성공적으로 로그아웃되었습니다.", "success");
    navigate("/login");
  };

  return { handleLogin, handleRequestApproval, handleLogout, user };
};

export default useLogin;
