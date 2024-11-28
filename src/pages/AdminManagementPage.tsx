import React, { useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import PageLayout from "../components/ui/PageLayout";
import { AdminUser } from "../types/admin";
import { adminService } from "../services/adminService";
import AdminSearchBar from "../components/adminManagement/AdminSearchBar";
import AdminTable from "../components/adminManagement/AdminTable";
import { useAuth } from "../components/auth/AuthContext";

const AdminManagementPage: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();
  const { admin } = useAuth();

  const fetchAdmins = async () => {
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
      setFilteredAdmins(data);
    } catch (error: any) {
      showToast(
        error.message || "관리자 목록을 불러오는데 실패했습니다.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    const searchValue = term.trim().toLowerCase();
    if (!searchValue) {
      setFilteredAdmins(admins);
      return;
    }

    const filtered = admins.filter(
      (admin) =>
        admin.username.toLowerCase().includes(searchValue) ||
        admin.email.toLowerCase().includes(searchValue)
    );
    setFilteredAdmins(filtered);
  };

  const handleUpdateRole = async (
    userId: number,
    currentRole: AdminUser["role"],
    newRole: AdminUser["role"]
  ) => {
    setIsUpdating(true);
    try {
      await adminService.updateAdminRole(userId, currentRole, newRole);
      await fetchAdmins();
      showToast("관리자 권한이 성공적으로 수정되었습니다.", "success");
    } catch (error: any) {
      showToast(error.message || "권한 수정에 실패했습니다.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSort = (key: keyof AdminUser, direction: "asc" | "desc") => {
    setCurrentPage(1);
    const sorted = [...filteredAdmins].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (key === "lastLoginAt" || key === "createdAt" || key === "updatedAt") {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredAdmins(sorted);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full p-6 text-center">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <PageLayout title="관리자 권한 관리">
      <div className="space-y-6">
        <AdminSearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <AdminTable
          admins={filteredAdmins}
          onSort={handleSort}
          onUpdateRole={handleUpdateRole}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          currentUserRole={admin?.role || "WAITING"}
        />
      </div>
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-4 rounded-lg">
            <LoadingAnimation />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AdminManagementPage;
