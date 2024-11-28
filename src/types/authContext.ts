import { AdminUser, AdminRole } from "./admin";

interface AuthContextProps {
  admin: AdminUser | null;
  userRole: AdminRole;
  setUserRole: (role: AdminRole) => void;
  login: (adminUser: AdminUser) => void;
  logout: () => void;
  updateUserRole: (newRole: AdminRole) => void;
}

export default AuthContextProps;
