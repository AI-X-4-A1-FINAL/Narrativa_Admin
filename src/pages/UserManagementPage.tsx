import React, { useState, useEffect } from "react";
import SearchBar from "../components/UserManagement/SearchBar";
import UserTable from "../components/UserManagement/UserTable";
import { useToast } from "../hooks/useToast";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import PageLayout from "../components/ui/PageLayout";
import { User, UserRole, UserPageResponse } from "types/user";
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/userService";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const [totalItems, setTotalItems] = useState<number>(0);

  const itemsPerPage = 7;

  useEffect(() => {
    const fetchUsersData = async () => {
      setIsLoading(true);
      try {
        const data: UserPageResponse = await getUsers(
          currentPage - 1,
          itemsPerPage,
          searchTerm
        );
        setUsers(data.content);
        setTotalItems(data.totalElements);
      } catch (error) {
        showToast("사용자 데이터 로드에 실패했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsersData();
  }, [currentPage, searchTerm]);

  const handleUpdateRole = async (userId: number, newRole: UserRole) => {
    // 선택한 권한과 현재 권한이 같다면 실행하지 않음
    const currentUser = users.find((user) => user.id === userId);
    if (currentUser && currentUser.role === newRole) {
      showToast("이미 해당 권한입니다.", "info");
      return;
    }

    setIsUpdating(true);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      showToast("권한이 성공적으로 변경되었습니다.", "success");
    } catch (error) {
      showToast("권한 변경에 실패했습니다.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (
    userId: number,
    newStatus: User["status"]
  ) => {
    // 현재 상태와 같은 경우 변경하지 않음
    const currentUser = users.find((user) => user.id === userId);
    if (currentUser && currentUser.status === newStatus) {
      showToast("이미 해당 상태입니다.", "info");
      return;
    }

    setIsUpdating(true);
    try {
      await updateUserStatus(userId, newStatus);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      showToast("상태가 성공적으로 변경되었습니다.", "success");
    } catch (error) {
      showToast("상태 변경에 실패했습니다.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div
        className="h-full w-full p-6 text-center"
        style={{
          backgroundImage:
            "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <PageLayout title="회원 관리">
      <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
      <UserTable
        users={users}
        onSort={(key, direction) => {
          const sortedUsers = [...users].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
          });
          setUsers(sortedUsers);
        }}
        onUpdateRole={handleUpdateRole}
        onUpdateStatus={handleUpdateStatus}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="p-4 rounded-lg">
            <LoadingAnimation />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default UserManagementPage;
