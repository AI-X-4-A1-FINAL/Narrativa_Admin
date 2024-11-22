import axios from 'axios';
import type { Notice, NoticeCreate, NoticeUpdate } from '../types/notice';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const noticeService = {
  // 공지사항 목록 조회
  async getNotices(page: number = 1, limit: number = 10) {
    const response = await axios.get(`${API_URL}/notices?page=${page}&limit=${limit}`);
    return response.data;
  },

  // 공지사항 상세 조회
  async getNoticeById(id: number) {
    const response = await axios.get(`${API_URL}/notices/${id}`);
    return response.data;
  },

  // 공지사항 생성
  async createNotice(notice: NoticeCreate) {
    const response = await axios.post(`${API_URL}/notices`, notice);
    return response.data;
  },

  // 공지사항 수정
  async updateNotice(notice: NoticeUpdate) {
    const response = await axios.put(`${API_URL}/notices/${notice.id}`, notice);
    return response.data;
  },

  // 공지사항 삭제
  async deleteNotice(id: number) {
    const response = await axios.delete(`${API_URL}/notices/${id}`);
    return response.data;
  },

  // 공지사항 검색
  async searchNotices(keyword: string, page: number = 1, limit: number = 10) {
    const response = await axios.get(
      `${API_URL}/notices/search?keyword=${keyword}&page=${page}&limit=${limit}`
    );
    return response.data;
  }
};