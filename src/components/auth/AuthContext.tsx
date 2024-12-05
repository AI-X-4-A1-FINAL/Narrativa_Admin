import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AdminUser, AdminRole, AdminStatus } from "../../types/admin";
import { auth } from "../../configs/firebaseConfig";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// API URL 상수 정의
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

if (!API_BASE_URL) {
  throw new Error("REACT_APP_BACKEND_URL is not defined in environment variables");
}

interface AuthContextProps {
  admin: AdminUser | null;
  userRole: AdminRole;
  setUserRole: (role: AdminRole) => void;
  login: () => void;
  logout: () => void;
  updateUserRole: (userId: number, newRole: AdminRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [userRole, setUserRole] = useState<AdminRole>("WAITING");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          
          // Firebase 토큰 검증
          const response = await fetch(`${API_BASE_URL}/api/admin/auth/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idToken: token })
          });

          if (response.ok) {
            const adminData = await response.json();
            setAdmin({
              uid: adminData.uid,
              email: adminData.email,
              username: adminData.username,
              role: adminData.role as AdminRole,
              status: adminData.status as AdminStatus,
            });
            setUserRole(adminData.role);
          } else {
            console.error('Admin verification failed:', await response.text());
            setAdmin(null);
            setUserRole("WAITING");
          }
        } else {
          setAdmin(null);
          setUserRole("WAITING");
        }
      } catch (error) {
        console.error("Auth state sync error:", error);
        setAdmin(null);
        setUserRole("WAITING");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        await auth.signOut();
        setAdmin(null);
        setUserRole("WAITING");
      } catch (error) {
        console.error("Error during sign out on unload:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const login = async () => {
    try {
      // Google 로그인 팝업을 통해 Firebase 인증
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      if (!user) throw new Error("로그인에 실패했습니다.");

      const idToken = await user.getIdToken();
      
      // 회큰 검증 먼저 시도
      try {
        const verifyResponse = await fetch(`${API_BASE_URL}/api/admin/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (verifyResponse.ok) {
          const adminData = await verifyResponse.json();
          setAdmin({
            uid: adminData.uid,
            email: adminData.email,
            username: adminData.username,
            role: adminData.role as AdminRole,
            status: adminData.status as AdminStatus,
          });
          setUserRole(adminData.role);
          return; // 이미 등록된 사용자는 여기서 종료
        }
      } catch (error) {
        console.log("Not registered user, trying registration...");
      }

      // 미등록 사용자의 경우 회원가입 진행
      const registerResponse = await fetch(`${API_BASE_URL}/api/admin/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        throw new Error(`Login failed: ${errorText}`);
      }

      // 회원가입 후 다시 verify
      const verifyResponse = await fetch(`${API_BASE_URL}/api/admin/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!verifyResponse.ok) {
        throw new Error(`Login failed: ${await verifyResponse.text()}`);
      }

      const adminData = await verifyResponse.json();
      setAdmin({
        uid: adminData.uid,
        email: adminData.email,
        username: adminData.username,
        role: adminData.role as AdminRole,
        status: adminData.status as AdminStatus,
      });
      setUserRole(adminData.role);
    } catch (error) {
      console.error("Login error:", error);
      await auth.signOut();
      setAdmin(null);
      setUserRole("WAITING");
      throw error;
    }
  };

  const updateUserRole = async (userId: number, newRole: AdminRole) => {
    try {
      const user = auth.currentUser;
      if (!user || !admin) throw new Error("No authenticated user");

      const token = await user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Role update failed: ${errorText}`);
      }

      // 역할 업데이트 성공 시 현재 사용자 정보 갱신
      if (admin.uid === userId.toString()) {
        setUserRole(newRole);
      }
    } catch (error) {
      console.error("Role update error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setAdmin(null);
      setUserRole("WAITING");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        admin, 
        userRole, 
        setUserRole, 
        login, 
        logout, 
        updateUserRole,
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
