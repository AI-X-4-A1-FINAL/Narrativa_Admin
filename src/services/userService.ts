import axios from "axios";
import { User, UserRole, UserPageResponse } from "../types/user";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getUsers = async (
  page: number,
  size: number,
  search?: string
): Promise<UserPageResponse> => {
  const response = await fetch(
    `${BASE_URL}/api/admin/users?page=${page}&size=${size}${
      search ? `&search=${search}` : ""
    }`
  );
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const updateUserRole = async (
  userId: number,
  role: UserRole
): Promise<void> => {
  await axios.patch(`${BASE_URL}/api/admin/users/${userId}/role`, { role });
};

export const updateUserStatus = async (
  userId: number,
  status: User["status"]
): Promise<void> => {
  await axios.patch(`${BASE_URL}/api/admin/users/${userId}/status`, { status });
};
