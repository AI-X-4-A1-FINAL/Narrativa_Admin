import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../configs/firebaseConfig';
import { RootState } from '../../store';
import { setLogoutStartTime } from '../../store/authSlice';
import { AdminUser, AdminRole, AdminStatus } from '../../types/admin';

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
  resetLogoutTimer: () => void;
  logoutStartTime: number | null;
  getIdToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { logoutStartTime } = useSelector((state: RootState) => state.auth);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [userRole, setUserRole] = useState<AdminRole>("WAITING");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // 세션 스토리지에서 로그아웃 타이머 복원
    const storedLogoutStartTime = sessionStorage.getItem("logoutStartTime");
    if (storedLogoutStartTime) {
      const elapsedTime = Date.now() - Number(storedLogoutStartTime);
      const remainingTime = 1800000 - elapsedTime; // 30분 - 경과 시간
      if (remainingTime > 0) {
        dispatch(setLogoutStartTime(Number(storedLogoutStartTime)));
        logoutTimerRef.current = setTimeout(() => {
          logout();
        }, remainingTime);
      } else {
        logout();
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      try {
        if (user) {
          const token = await user.getIdToken();
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
            
            // 저장된 로그아웃 시간이 없을 때만 새로운 타이머 시작
            if (!sessionStorage.getItem("logoutStartTime")) {
              startLogoutTimer();
            }
          } else {
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
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const startLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    const currentTime = Date.now();
    dispatch(setLogoutStartTime(currentTime));
    sessionStorage.setItem("logoutStartTime", currentTime.toString());

    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, 1800000);
  };

  const resetLogoutTimer = () => {
    startLogoutTimer();
  };

  const getIdToken = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user");
    }
    return user.getIdToken();
  };

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      if (!user) throw new Error("로그인에 실패했습니다.");

      const idToken = await user.getIdToken();
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
        startLogoutTimer();
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      await auth.signOut();
      setAdmin(null);
      setUserRole("WAITING");
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      await auth.signOut();
      setAdmin(null);
      setUserRole("WAITING");
      sessionStorage.removeItem("logoutStartTime");
    } catch (error) {
      console.error("Logout error:", error);
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

      if (admin.uid === userId.toString()) {
        setUserRole(newRole);
      }
    } catch (error) {
      console.error("Role update error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        userRole: admin?.role || "WAITING",
        setUserRole,
        login,
        logout,
        updateUserRole,
        isLoading,
        resetLogoutTimer,
        logoutStartTime,
        getIdToken
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