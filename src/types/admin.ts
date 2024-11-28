// types/admin.ts

export type AdminRole =
  | "SUPER_ADMIN"
  | "SYSTEM_ADMIN"
  | "CONTENT_ADMIN"
  | "SUPPORT_ADMIN"
  | "WAITING";

export type AdminStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
  provider?: "google";
}

export interface AdminTableProps {
  admins: AdminUser[];
  onSort: (key: keyof AdminUser, direction: "asc" | "desc") => void;
  onUpdateRole: (
    userId: number,
    currentRole: AdminRole,
    newRole: AdminRole
  ) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  currentUserRole: AdminRole;
}

export const ADMIN_ROLES: AdminRole[] = [
  "SUPER_ADMIN",
  "SYSTEM_ADMIN",
  "CONTENT_ADMIN",
  "SUPPORT_ADMIN",
  "WAITING",
];

export const ADMIN_STATUS_ACTIONS: {
  value: AdminStatus;
  label: string;
  color: string;
}[] = [
  { value: "ACTIVE", label: "활성화", color: "text-green-600" },
  { value: "INACTIVE", label: "비활성화", color: "text-gray-600" },
  { value: "SUSPENDED", label: "정지", color: "text-red-600" },
];

export interface AdminSearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}
