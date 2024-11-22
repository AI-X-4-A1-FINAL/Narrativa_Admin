// src/types/notice.ts

// Notice Status Enum
export type NoticeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Base Notice Type (공통 필드)
export interface NoticeBase {
  title: string;
  content: string;
  status: NoticeStatus;
}

// Notice Type (전체 Notice 타입)
export interface Notice extends NoticeBase {
  id: number;
  admin_user_id: number;
  createdAt: string;
  updatedAt: string;
}

// Create Notice Input Type (생성 시 필요한 필드)
export interface NoticeCreate extends NoticeBase {
  admin_user_id: number;
}

// Update Notice Input Type (수정 시 필요한 필드)
export interface NoticeUpdate {
  id: number;
  title?: string;
  content?: string;
  status?: NoticeStatus;
}

// Notice List Response Type (목록 조회 응답 타입)
export interface NoticeListResponse {
  notices: Notice[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}