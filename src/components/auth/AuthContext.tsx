import React, { createContext, useContext, useState, ReactNode } from "react";
import { AdminUser, AdminRole } from "../../types/admin";

interface AuthContextProps {
  admin: AdminUser | null;
  userRole: AdminRole;
  setUserRole: (role: AdminRole) => void;
  login: (adminUser: AdminUser) => void;
  logout: () => void;
  updateUserRole: (newRole: AdminRole) => void;
  updateProfile?: (photoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const storedAdmin = sessionStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });

  const [userRole, setUserRole] = useState<AdminRole>(() => {
    return admin ? admin.role : "WAITING";
  });

  const login = (adminUser: AdminUser) => {
    setAdmin(adminUser);
    setUserRole(adminUser.role);
    sessionStorage.setItem("admin", JSON.stringify(adminUser));
  };

  const logout = () => {
    setAdmin(null);
    setUserRole("WAITING");
    sessionStorage.removeItem("admin");
  };

  const updateUserRole = (newRole: AdminRole) => {
    if (admin) {
      const updatedAdminUser = { ...admin, role: newRole };
      setAdmin(updatedAdminUser);
      setUserRole(newRole);
      sessionStorage.setItem("admin", JSON.stringify(updatedAdminUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ admin, userRole, setUserRole, login, logout, updateUserRole }}
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
