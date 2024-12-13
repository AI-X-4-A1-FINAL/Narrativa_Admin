import axios from "axios";
import { AdminUser, AdminStatus } from "../types/admin";
import { getAuth } from "firebase/auth";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const adminService = {
  // Auth 관련
  verifyToken: async (idToken: string) => {
    const response = await axios.post(`${BASE_URL}/api/auth/verify`, {
      idToken,
    });
    return response.data;
  },

  registerAdmin: async (idToken: string) => {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      idToken,
    });
    return response.data;
  },

  updateLastLogin: async (userId: number) => {
    const response = await axios.patch(
      `${BASE_URL}/api/admin/users/${userId}/last-login`
    );
    return response.data;
  },

  // Admin 관리 관련
  getAllAdmins: async () => {
    const auth = getAuth();
    const idToken = await auth.currentUser?.getIdToken();

    const response = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data.data;
  },

  updateAdminRole: async (
    userId: number,
    currentRole: AdminUser["role"],
    newRole: AdminUser["role"]
  ) => {
    if (currentRole === newRole) {
      throw new Error("이미 지정된 권한입니다.");
    }

    const auth = getAuth();
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) throw new Error("로그인이 필요합니다.");

    const response = await axios.patch(
      `${BASE_URL}/api/admin/users/${userId}/role`,
      { role: newRole },
      {
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );
    return response.data.data;
  },

  updateAdminStatus: async (userId: number, newStatus: AdminStatus) => {
    const auth = getAuth();
    const idToken = await auth.currentUser?.getIdToken();
    
    if (!idToken) {
      throw new Error("인증 토큰이 없습니다.");
    }

    const response = await fetch(
      `${BASE_URL}/api/admin/users/${userId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      throw new Error("상태 수정에 실패했습니다.");
    }

    const result = await response.json();
    return result.data;
  },
};
