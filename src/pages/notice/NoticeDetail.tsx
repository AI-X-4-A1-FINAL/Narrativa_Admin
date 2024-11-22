import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Clock, User } from 'lucide-react';
import { Notice } from '../../types/notice';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from 'hooks/useToast';

// Mock data
const notice: Notice = {
  id: 1,
  title: "시스템 점검 안내",
  content: `안녕하세요. 시스템 점검 안내드립니다.

점검 일시: 2024년 12월 1일 새벽 2시 ~ 4시
점검 내용: 
- 서버 안정성 개선
- 보안 업데이트 적용
- 신규 기능 배포

점검 시간 동안에는 서비스 이용이 제한될 수 있습니다.
이용에 참고 부탁드립니다.

※ 점검 시간은 작업 상황에 따라 변동될 수 있습니다.`,
  status: "PUBLISHED",
  admin_user_id: 1,
  createdAt: "2024-11-22T09:00:00",
  updatedAt: "2024-11-22T09:00:00"
};

const NoticeDetail = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  
  const handleBack = () => {
    navigate(`/notices`);
  };

  const handleEdit = () => {
    navigate(`/notices/${notice.id}/edit`);
  };

  const handleDelete = async () => {
    const isConfirmed = await showConfirm({
      title: '공지사항을 삭제하시겠습니까?',
      html: '삭제된 공지사항은 복구할 수 없습니다.',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    });

    if (isConfirmed) {
      try {
        // API 나중에 추가
        console.log('Deleting notice', notice.id);
        
        showToast(`삭제되었습니다`, 'success');

        navigate('/notices');
        
      } catch (error) {
        showToast(`삭제 중 오류가 발생했습니다.`, 'error');
      }
    }
  };

  const StatusBadge = ({ status }: { status: Notice['status'] }) => {
    const statusColors = {
      DRAFT: 'bg-gray-100 text-gray-600 font-nanum',
      PUBLISHED: 'bg-green-100 text-green-600 font-nanum',
      ARCHIVED: 'bg-yellow-100 text-yellow-600 font-nanum'
    };

    const statusLabels = {
      DRAFT: '초안',
      PUBLISHED: '게시됨',
      ARCHIVED: '보관됨'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full w-full p-6"
    style={{
        backgroundImage: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 font-nanum font-bold text-pointer hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 font-nanum font-bold text-gray-600 bg-white hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit2 className="w-4 h-4" />
            수정
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 font-nanum font-bold text-red-600 bg-white hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </button>
        </div>
      </div>

      {/* Notice Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-2">
          <StatusBadge status={notice.status} />
          <h1 className="text-2xl font-nanum font-bold text-gray-800">{notice.title}</h1>
        </div>

        <div className="flex items-center gap-4 font-nanum text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            관리자 {notice.admin_user_id}
          </div>
          <div className="flex items-center gap-1 font-nanum">
            <Clock className="w-4 h-4" />
            {formatDate(notice.createdAt)}
          </div>
          {notice.updatedAt !== notice.createdAt && (
            <div className="text-gray-400 font-nanum">
              (수정됨: {formatDate(notice.updatedAt)})
            </div>
          )}
        </div>

        {notice.status === 'DRAFT' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800">
              <span className="font-nanum font-medium">초안 상태의 공지사항입니다</span>
            </div>
            <p className="mt-1 font-nanum text-sm text-yellow-700">
              이 공지사항은 아직 발행되지 않은 초안입니다. 발행하기 전에는 일반 사용자에게 보이지 않습니다.
            </p>
          </div>
        )}

        <div className="prose max-w-none">
          {notice.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 font-nanum text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;