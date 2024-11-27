import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { User, Role, UserTableProps, ROLES, STATUS_ACTIONS } from "../../types/user";

const UserTable: React.FC<UserTableProps> = ({
  users,
  onSort,
  onUpdateRole,
  onUpdateStatus,
  currentPage,
  onPageChange,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);

  const itemsPerPage = 7;
  const totalPages = Math.ceil(Math.max(users.length, 1) / itemsPerPage);

  const handleSort = (key: keyof User) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = users.slice(startIndex, endIndex);

    const emptyRows = Array(itemsPerPage - currentData.length).fill(null);
    return [...currentData, ...emptyRows];
  };

  const renderSortIcon = (key: keyof User) => {
    if (sortConfig.key !== key) {
      return <div className="w-4 h-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleRoleUpdate = (userId: string, newRole: Role) => {
    onUpdateRole(userId, newRole);
    setOpenDropdownId(null);
  };

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "SUSPENDED":
        return "text-yellow-600";
      case "BANNED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusLabel = (status: User["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "활성화";
      case "SUSPENDED":
        return "정지";
      case "BANNED":
        return "영구정지";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4 font-nanum">
      <div className="relative overflow-hidden shadow-md sm:rounded-lg bg-white">
        {/* 제목 */}
        <div className="grid grid-cols-5 bg-gray-50 text-xs uppercase font-medium text-gray-700 h-12">
          <div className="px-6 flex items-center">
            <button
              onClick={() => handleSort("name")}
              className="flex items-center space-x-1 hover:text-gray-900"
            >
              <span>이름</span>
              {renderSortIcon("name")}
            </button>
          </div>
          <div className="px-6 flex items-center">
            <button
              onClick={() => handleSort("email")}
              className="flex items-center space-x-1 hover:text-gray-900"
            >
              <span>이메일</span>
              {renderSortIcon("email")}
            </button>
          </div>
          <div className="px-6 flex items-center">
            <button
              onClick={() => handleSort("role")}
              className="flex items-center space-x-1 hover:text-gray-900"
            >
              <span>권한</span>
              {renderSortIcon("role")}
            </button>
          </div>
          <div className="px-6 flex items-center">
            <span>상태</span>
          </div>
          <div className="px-6 flex items-center">
            <button
              onClick={() => handleSort("registrationDate")}
              className="flex items-center space-x-1 hover:text-gray-900"
            >
              <span>가입 날짜</span>
              {renderSortIcon("registrationDate")}
            </button>
          </div>
        </div>

        {/* 항목 */}
        <div className="divide-y divide-gray-200">
          {getCurrentPageData().map((user, index) => (
            <div
              key={user?.id || `empty-${index}`}
              className="grid grid-cols-5 hover:bg-gray-50 transition-colors h-16"
            >
              <div className="px-6 flex items-center font-medium text-gray-900">
                {user?.name || "\u00A0"}
              </div>
              <div className="px-6 flex items-center text-gray-700">
                {user?.email || "\u00A0"}
              </div>
              <div className="px-6 flex items-center relative">
                {user ? (
                  <div className="relative w-full">
                    <button
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === user.id ? null : user.id)
                      }
                      className="flex items-center justify-between w-full px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <span>{user.role}</span>
                      <ChevronsUpDown className="w-4 h-4 ml-2" />
                    </button>
                    {openDropdownId === user.id && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                        <ul className="py-1">
                          {ROLES.map((role) => (
                            <li key={role}>
                              <button
                                onClick={() => handleRoleUpdate(user.id, role)}
                                className="flex items-center justify-between w-full px-3 py-1.5 text-sm hover:bg-gray-100"
                              >
                                <span>{role}</span>
                                {user.role === role && (
                                  <Check className="w-4 h-4 text-pointer" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  "\u00A0"
                )}
              </div>
              {/* 상태 드롭다운 */}
              <div className="px-6 flex items-center relative">
                {user ? (
                  <div className="relative w-full">
                    <button
                      onClick={() =>
                        setOpenStatusDropdownId(
                          openStatusDropdownId === user.id ? null : user.id
                        )
                      }
                      className={`flex items-center justify-between w-full px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${getStatusColor(
                        user.status
                      )}`}
                    >
                      <span>{getStatusLabel(user.status)}</span>
                      <ChevronsUpDown className="w-4 h-4 ml-2" />
                    </button>
                    {openStatusDropdownId === user.id && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                        <ul className="py-1">
                          {STATUS_ACTIONS.map((status) => (
                            <li key={status.value}>
                              <button
                                onClick={() => {
                                  onUpdateStatus(user.id, status.value);
                                  setOpenStatusDropdownId(null);
                                }}
                                className={`flex items-center justify-between w-full px-3 py-1.5 text-sm hover:bg-gray-100 ${status.color}`}
                              >
                                <span>{status.label}</span>
                                {user.status === status.value && (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  "\u00A0"
                )}
              </div>
              <div className="px-6 flex items-center text-gray-700">
                {user?.registrationDate || "\u00A0"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            총 <span className="font-semibold">{users.length}</span> 명의 사용자
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 text-sm rounded-md 
                  ${
                    currentPage === page
                      ? "bg-pointer text-white"
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
