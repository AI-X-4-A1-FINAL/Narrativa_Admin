import React, { useState, useEffect } from "react";
import SearchBar from "../components/UserManagement/SearchBar";
import UserTable from "../components/UserManagement/UserTable";
import { useToast } from "../hooks/useToast";
import { useConfirm } from "../hooks/useConfirm";
import LoadingAnimation from "../components/LoadingAnimation";
import PageLayout from '../components/PageLayout';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  registrationDate: string;
  status: "ACTIVE" | "SUSPENDED" | "BANNED";
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showConfirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from API
        const mockUsers: User[] = [
          {
            id: 1,
            name: "홍길동",
            email: "hong@example.com",
            role: "USER",
            registrationDate: "2023-11-01",
            status: "ACTIVE",
          },
          {
            id: 2,
            name: "김철수",
            email: "kim@example.com",
            role: "ADMIN",
            registrationDate: "2023-10-15",
            status: "ACTIVE",
          },
          {
            id: 3,
            name: "이영희",
            email: "lee@example.com",
            role: "USER",
            registrationDate: "2023-09-21",
            status: "ACTIVE",
          },
          {
            id: 4,
            name: "박지민",
            email: "jimin@example.com",
            role: "USER",
            registrationDate: "2023-11-05",
            status: "ACTIVE",
          },
          {
            id: 5,
            name: "최유리",
            email: "yuri@example.com",
            role: "USER",
            registrationDate: "2023-10-28",
            status: "ACTIVE",
          },
          {
            id: 6,
            name: "정민수",
            email: "minsu@example.com",
            role: "USER",
            registrationDate: "2023-11-02",
            status: "SUSPENDED",
          },
          {
            id: 7,
            name: "강다희",
            email: "dahee@example.com",
            role: "USER",
            registrationDate: "2023-10-20",
            status: "ACTIVE",
          },
          {
            id: 8,
            name: "윤서준",
            email: "seojun@example.com",
            role: "ADMIN",
            registrationDate: "2023-09-15",
            status: "ACTIVE",
          },
          {
            id: 9,
            name: "임하늘",
            email: "sky@example.com",
            role: "USER",
            registrationDate: "2023-11-07",
            status: "BANNED",
          },
          {
            id: 10,
            name: "송미나",
            email: "mina@example.com",
            role: "USER",
            registrationDate: "2023-10-01",
            status: "ACTIVE",
          },
          {
            id: 11,
            name: "백승호",
            email: "seungho@example.com",
            role: "USER",
            registrationDate: "2023-09-30",
            status: "ACTIVE",
          },
          {
            id: 12,
            name: "류지원",
            email: "jiwon@example.com",
            role: "USER",
            registrationDate: "2023-11-03",
            status: "ACTIVE",
          },
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        showToast("사용자 데이터 로드에 실패했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 검색 필터
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    const searchValue = term.trim();
    if (!searchValue) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      return (
        user.name.includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
  };

  // 정렬 로직
  const handleSort = (key: keyof User, direction: "asc" | "desc") => {
    setCurrentPage(1);
    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sorted);
  };

  // 권한 수정 처리
  const handleUpdateRole = async (userId: number, newRole: string) => {
    // ... (role update logic)
  };

  // 상태 수정 처리
  const handleUpdateStatus = async (
    userId: number,
    newStatus: User["status"]
  ) => {
    // ... (status update logic)
  };

  if (isLoading) {
    return (
      <div className="h-full w-full p-6 text-center" 
      style={{
        backgroundImage: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <PageLayout title="회원 관리">
      <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
      <UserTable
        users={filteredUsers}
        onSort={handleSort}
        onUpdateRole={handleUpdateRole}
        onUpdateStatus={handleUpdateStatus}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
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