// UserManagementPage.tsx
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
  const { showConfirm } = useConfirm();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
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
        {
          id: 13,
          name: "한소민",
          email: "somin@example.com",
          role: "ADMIN",
          registrationDate: "2023-10-12",
          status: "ACTIVE",
        },
        {
          id: 14,
          name: "오다인",
          email: "dain@example.com",
          role: "USER",
          registrationDate: "2023-09-25",
          status: "SUSPENDED",
        },
        {
          id: 15,
          name: "신영수",
          email: "youngsu@example.com",
          role: "USER",
          registrationDate: "2023-11-08",
          status: "ACTIVE",
        },
        {
          id: 16,
          name: "문예진",
          email: "yejin@example.com",
          role: "USER",
          registrationDate: "2023-10-05",
          status: "ACTIVE",
        },
        {
          id: 17,
          name: "황민준",
          email: "minjun@example.com",
          role: "USER",
          registrationDate: "2023-09-28",
          status: "ACTIVE",
        },
        {
          id: 18,
          name: "조은우",
          email: "eunwoo@example.com",
          role: "USER",
          registrationDate: "2023-11-04",
          status: "ACTIVE",
        },
        {
          id: 19,
          name: "안서영",
          email: "seoyoung@example.com",
          role: "USER",
          registrationDate: "2023-10-18",
          status: "ACTIVE",
        },
        {
          id: 20,
          name: "김도현",
          email: "dohyun@example.com",
          role: "ADMIN",
          registrationDate: "2023-09-22",
          status: "ACTIVE",
        },
        {
          id: 21,
          name: "이지훈",
          email: "jihoon@example.com",
          role: "USER",
          registrationDate: "2023-11-06",
          status: "ACTIVE",
        },
        {
          id: 22,
          name: "박수진",
          email: "sujin@example.com",
          role: "USER",
          registrationDate: "2023-10-25",
          status: "ACTIVE",
        },
        {
          id: 23,
          name: "정태윤",
          email: "taeyoon@example.com",
          role: "USER",
          registrationDate: "2023-09-19",
          status: "ACTIVE",
        },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
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
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (user.role === newRole) {
      showToast("이미 해당 권한을 가지고 있습니다.", "info");
      return;
    }

    const isConfirmed = await showConfirm({
      title: "권한 변경",
      html: `
        <div class="font-nanum">
          <p><strong>${user.name}</strong>님의 권한을</p>
          <p><strong>${user.role}</strong>에서 <strong>${newRole}</strong>(으)로 변경하시겠습니까?</p>
        </div>
      `,
      confirmButtonText: "변경",
    });

    if (isConfirmed) {
      try {
        setIsUpdating(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        );
        setUsers(updatedUsers);

        const updatedFilteredUsers = filteredUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        );
        setFilteredUsers(updatedFilteredUsers);
        showToast("권한 변경을 성공했습니다", "success");
      } catch (error) {
        showToast("권한 변경을 실패했습니다", "error");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // 상태 수정 처리
  const handleUpdateStatus = async (
    userId: number,
    newStatus: User["status"]
  ) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const statusMessages = {
      ACTIVE: "활성화",
      SUSPENDED: "정지",
      BANNED: "영구정지",
    };

    if (user.status === newStatus) {
      showToast(`이미 ${statusMessages[newStatus]} 상태입니다.`, "info");
      return;
    }

    const isConfirmed = await showConfirm({
      title: "상태 변경",
      html: `
        <div class="font-nanum">
          <p><strong>${user.name}</strong>님의 상태를</p>
          <p><strong>${statusMessages[user.status]}</strong>에서 <strong>${
        statusMessages[newStatus]
      }</strong>(으)로 변경하시겠습니까?</p>
        </div>
      `,
      confirmButtonText: "변경",
    });

    if (isConfirmed) {
      try {
        setIsUpdating(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        );
        setUsers(updatedUsers);

        const updatedFilteredUsers = filteredUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        );
        setFilteredUsers(updatedFilteredUsers);

        showToast(
          `사용자 상태를 ${statusMessages[newStatus]}로 변경했습니다`,
          "success"
        );
      } catch (error) {
        showToast("상태 변경을 실패했습니다", "error");
      } finally {
        setIsUpdating(false);
      }
    }
  };

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
