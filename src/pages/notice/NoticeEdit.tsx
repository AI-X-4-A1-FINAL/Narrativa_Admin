import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft } from 'lucide-react';
import { Notice } from '../../types/notice';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';
import LoadingAnimation from '../../components/ui/LoadingAnimation';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ]
};

const QUILL_FORMATS = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link', 'image'
];

interface NoticeFormProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  status: 'ACTIVE' | 'INACTIVE';
  setStatus: (value: 'ACTIVE' | 'INACTIVE') => void;
  originalNotice: Notice | null;
  isLoading: boolean;
  hasChanges: () => boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const NoticeForm = ({
  title,
  setTitle,
  content,
  setContent,
  status,
  setStatus,
  originalNotice,
  isLoading,
  hasChanges,
  onSubmit,
  onCancel
}: NoticeFormProps) => {
  const quillRef = useRef<ReactQuill>(null);

  return (
  <form onSubmit={onSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
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

    <div className="min-h-[50dvh] max-h-[45dvh] overflow-auto">
      <label htmlFor="content" className="block text-sm font-nanum font-medium text-gray-700 mb-1">
        내용
      </label>
      <div className="h-80 border rounded-lg lg:h-96">
        <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={QUILL_MODULES}
            formats={QUILL_FORMATS}
            className="h-full"
            preserveWhitespace
          />
      </div>
    </div>

    <div className="flex items-start justify-between border-t pt-6 absolute bottom-0 left-0 right-0 bg-white shadow-lg px-6 py-4">
      <div className="space-y-4">
        <div>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pointer"
          >
            <option value="INACTIVE">임시저장</option>
            <option value="ACTIVE">게시</option>
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
          onClick={onCancel}
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
 );
}

const NoticeEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [originalNotice, setOriginalNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchNotice = async () => {
      if (!id) return;

      try {
        if (mounted) setInitialLoading(true);
        
        const response = await axios.get<Notice>(
          `${process.env.REACT_APP_BACKEND_URL}/api/notices/${id}`
        );
        
        if (mounted) {
          setTitle(response.data.title);
          setContent(response.data.content);
          setStatus(response.data.status);
          setOriginalNotice(response.data);
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to fetch notice:', error);
          setError('공지사항을 불러오는데 실패했습니다.');
          showToast('공지사항을 불러오는데 실패했습니다.', 'error');
        }
      } finally {
        if (mounted) setInitialLoading(false);
      }
    };

    fetchNotice();

    return () => {
      mounted = false;
    };
  }, [id]);

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
        navigate('/notices');
      }
    } else {
      navigate('/notices');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title.trim()) {
      showToast('제목을 입력해주세요.', 'error');
      return;
    }
  
    const cleanContent = (html: string): string => {
      const allowedTags = {
        p: '\n',          // 단락
        br: '\n',         // 줄바꿈
      };
    
      let text = html;
      
      // 허용된 태그들을 텍스트로 변환
      Object.entries(allowedTags).forEach(([tag, replacement]) => {
        text = text.replace(new RegExp(`<${tag}[^>]*>`, 'g'), replacement)
                  .replace(new RegExp(`</${tag}>`, 'g'), '');
      });
      
      // 나머지 HTML 태그 제거
      text = text.replace(/<[^>]*>/g, '');
      
      // 연속된 줄바꿈 정리
      text = text.replace(/\n{3,}/g, '\n\n');
      
      return text.trim();
    };
  
    const processedContent = cleanContent(content);
  
    if (!processedContent.trim()) {
      showToast('내용을 입력해주세요.', 'error');
      return;
    }
  
    const confirmMessage = status === 'ACTIVE' 
      ? '변경된 내용을\n 게시하시겠습니까?' 
      : '변경된 내용을\n 임시저장하시겠습니까?';
  
    const confirmed = await showConfirm({
      title: confirmMessage,
      confirmButtonText: status === 'ACTIVE' ? '게시' : '저장',
    });
  
    if (!confirmed || !originalNotice) return;
  
    try {
      setLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        showToast('로그인이 필요합니다.', 'error');
        return;
      }
  
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/notices/${id}`,
        { 
          title, 
          content: processedContent,  // 처리된 콘텐츠 사용
          status 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Firebase-Token': currentUser.uid
          }
        }
      );
  
      showToast(status === 'ACTIVE' ? '게시되었습니다' : '임시저장되었습니다', 'success');
      navigate('/notices');
    } catch (error) {
      console.error('Failed to update notice:', error);
      showToast('수정 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div 
        className="h-full w-full flex justify-center items-center p-6"
        style={{
          backgroundImage: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
      >
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full p-6 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/notices')}
          className="mt-4 px-4 py-2 text-pointer hover:text-white font-nanum"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div 
      className="h-full w-full p-6 text-left relative"
      style={{
        backgroundImage: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 font-nanum font-bold text-pointer hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </button>
      </div>

      <NoticeForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        status={status}
        setStatus={setStatus}
        originalNotice={originalNotice}
        isLoading={loading}
        hasChanges={hasChanges}
        onSubmit={handleSubmit}
        onCancel={handleBack}
      />
    </div>
  );
};

export default NoticeEdit;