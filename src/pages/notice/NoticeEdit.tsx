import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft } from 'lucide-react';
import { Notice, NoticeStatus } from '../../types/notice';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from 'hooks/useToast';
import LoadingAnimation from '../../components/ui/LoadingAnimation';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link', 'image'
];

// Mock Data
const mockNotice: Notice = {
  id: 1,
  title: "시스템 점검 안내",
  content: `<h2>시스템 점검 안내</h2>
<p>안녕하세요. 시스템 점검 안내드립니다.</p>
<p><strong>점검 일시:</strong> 2024년 12월 1일 새벽 2시 ~ 4시</p>
<p><strong>점검 내용:</strong></p>
<ul>
  <li>서버 안정성 개선</li>
  <li>보안 업데이트 적용</li>
  <li>신규 기능 배포</li>
</ul>
<p>점검 시간 동안에는 서비스 이용이 제한될 수 있습니다.<br/>이용에 참고 부탁드립니다.</p>
<p style="color: red;">※ 점검 시간은 작업 상황에 따라 변동될 수 있습니다.</p>`,
  status: "PUBLISHED",
  admin_user_id: 1,
  createdAt: "2024-11-22T09:00:00",
  updatedAt: "2024-11-22T09:00:00"
};

const NoticeEdit = () => {
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<NoticeStatus>('DRAFT');
  const [originalNotice, setOriginalNotice] = useState<Notice | null>(null);

  useEffect(() => {
    // 실제 구현시에는 API 호출로 데이터를 가져옵니다
    const fetchNotice = async () => {
      try {
        // const response = await noticeService.getNoticeById(id);
        // const noticeData = response.data;
        const noticeData = mockNotice; // Mock data 사용

        setTitle(noticeData.title);
        setContent(noticeData.content);
        setStatus(noticeData.status);
        setOriginalNotice(noticeData);
      } catch (error) {
        showToast(`공지사항을 불러오는데 실패했습니다.`, 'error');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchNotice();
  }, [showToast]);

  const hasChanges = () => {
    if (!originalNotice) return false;
    return (
      title !== originalNotice.title ||
      content !== originalNotice.content ||
      status !== originalNotice.status
    );
  };

  const handleBack = async () => {
    if (hasChanges()) {
      const confirmed = await showConfirm({
        title: '변경사항이 있습니다',
        html: '저장하지 않은 변경사항이 있습니다.<br/>페이지를 나가시겠습니까?',
        confirmButtonText: '나가기',
        cancelButtonText: '취소'
      });
      if (confirmed) {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast(`제목을 입력해주세요.`, 'error');
    }

    if (!content.trim()) {
      showToast(`내용을 입력해주세요.`, 'error');
      return;
    }

    if (!hasChanges()) {
      showToast(`변경사항이 없습니다`, 'info');
      return;
    }

    const confirmMessage = status === 'PUBLISHED' 
      ? '변경된 내용을\n 게시하시겠습니까?' 
      : '변경된 내용을\n 임시저장하시겠습니까?';

    const confirmed = await showConfirm({
      title: confirmMessage,
      confirmButtonText: status === 'PUBLISHED' ? '게시' : '저장',
    });

    if (confirmed) {
      try {
        setIsLoading(true);
        // API 호출 부분
        // await noticeService.updateNotice({
        //   id: originalNotice!.id,
        //   title,
        //   content,
        //   status,
        // });

        // 성공 메시지
        showToast(status === 'PUBLISHED' ? '게시되었습니다' : '임시저장되었습니다', 'success');
        
        // 목록으로 이동
        window.history.back();
      } catch (error) {
        showToast(`수정 중 오류가 발생했습니다.`, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (initialLoading) {
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
    <div className="h-full w-full p-6 text-left relative"
    style={{
        backgroundImage: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 font-nanum font-bold text-pointer hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            목록으로
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-nanum font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지사항 제목을 입력하세요"
            className="w-full px-4 py-2 font-nanum text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pointer"
          />
        </div>

        {/* Editor */}
        <div className="min-h-[50dvh] max-h-[45dvh] overflow-auto">
          <label htmlFor="content" className="block text-sm font-nanum font-medium text-gray-700 mb-1">
            내용
          </label>
          <div className="h-80 border rounded-lg lg:h-96">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="h-full"
            />
          </div>
        </div>

        {/* Status and Creation Info */}
        <div className="flex items-start justify-between border-t pt-6 absolute bottom-0 left-0 right-0 bg-white shadow-lg px-6 py-4">
          <div className="space-y-4">
            <div>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as NoticeStatus)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pointer"
              >
                <option value="DRAFT">임시저장</option>
                <option value="PUBLISHED">게시</option>
                <option value="ARCHIVED">보관</option>
              </select>
            </div>
            {originalNotice && (
              <div className="text-sm font-nanum text-gray-500 hidden lg:block">
                <p>작성일: {new Date(originalNotice.createdAt).toLocaleString()}</p>
                <p>최종 수정일: {new Date(originalNotice.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 font-nanum text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !hasChanges()}
              className="px-4 py-2 font-nanum text-white bg-pointer rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? '저장 중...' : '수정하기'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NoticeEdit;