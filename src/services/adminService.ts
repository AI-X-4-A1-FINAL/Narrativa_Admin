import { AdminUser } from "../types/admin";

const API_BASE_URL = 'http://localhost:8080/api';

export const adminService = {
  // 모든 관리자 조회
  async getAllAdmins(): Promise<AdminUser[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin users');
    }

    return response.json();
  },

  // 관리자 권한 수정
  async updateAdminRole(userId: number, currentRole: AdminUser['role'], newRole: AdminUser['role']): Promise<AdminUser> {
    // 동일한 권한으로 변경하려는 경우 예외 처리
    if (currentRole === newRole) {
        throw new Error('이미 지정된 권한입니다.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role?role=${newRole}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || '권한 수정에 실패했습니다.');
    }

    return response.json();
  },

  // 관리자 상태 수정
  async updateAdminStatus(userId: number, status: AdminUser['status']): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update admin status');
    }

    return response.json();
  },

  // 관리자 등록 (Firebase 토큰 필요)
  async registerAdmin(idToken: string): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/admin/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) {
      throw new Error('Failed to register admin');
    }

    return response.json();
  },

  // Firebase 토큰 검증
  async verifyToken(idToken: string): Promise<{ uid: string; email: string; role: string | null }> {
    const response = await fetch(`${API_BASE_URL}/admin/auth/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) {
      throw new Error('Failed to verify token');
    }

    return response.json();
  },
};
