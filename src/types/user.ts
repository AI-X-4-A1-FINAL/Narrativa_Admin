export type Role =
  | "SUPER_ADMIN"
  | "SYSTEM_ADMIN"
  | "CONTENT_ADMIN"
  | "SUPPORT_ADMIN"
  | "WAITING"
  | "USER";

export type User = {
  id: string | number; // 숫자와 문자열을 모두 지원하도록 통합
  name: string;
  email: string;
  role: Role; // Role 타입 재사용
  registrationDate?: string; // 선택적 포함
  status?: "ACTIVE" | "SUSPENDED" | "BANNED"; // 선택적 포함
  provider?: string; // 프로필 제공자
  profilePicture?: string; // 프로필 사진 URL
};

export interface UserTableProps {
  users: User[]; // User 타입 사용
  onSort: (key: keyof User, direction: "asc" | "desc") => void;
  onUpdateRole: (userId: string | number, newRole: Role) => void;
  onUpdateStatus: (userId: string | number, newStatus: User["status"]) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// 예제 데이터로 사용할 ROLES 및 STATUS_ACTIONS
export const ROLES: Role[] = [
  "USER",
  "SUPER_ADMIN",
  "SYSTEM_ADMIN",
  "CONTENT_ADMIN",
  "SUPPORT_ADMIN",
  "WAITING",
];

export const STATUS_ACTIONS: { value: User["status"]; label: string; color: string }[] = [
  { value: "ACTIVE", label: "활성화", color: "text-green-600" },
  { value: "SUSPENDED", label: "정지", color: "text-yellow-600" },
  { value: "BANNED", label: "영구정지", color: "text-red-600" },
];
