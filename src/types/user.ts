export type UserRole = "USER" | "VIP";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  registrationDate: string;
  lastLoginAt: string | null;
}

export interface UserTableProps {
  users: User[];
  onSort: (key: keyof User, direction: "asc" | "desc") => void;
  onUpdateRole: (userId: number, newRole: UserRole) => void;
  onUpdateStatus: (userId: number, newStatus: UserStatus) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const USER_ROLES: UserRole[] = ["USER", "VIP"];

export const USER_STATUS_ACTIONS: {
  value: UserStatus;
  label: string;
  color: string;
}[] = [
  { value: "ACTIVE", label: "활성화", color: "text-green-600" },
  { value: "INACTIVE", label: "비활성화", color: "text-gray-600" },
  { value: "BANNED", label: "차단됨", color: "text-red-600" },
];
