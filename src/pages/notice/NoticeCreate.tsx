import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ArrowLeft } from "lucide-react";
import { NoticeStatus } from "../../types/notice";
import { useConfirm } from "../../hooks/useConfirm";
import { useToast } from "hooks/useToast";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "link",
  "image",
];

const NoticeCreate = () => {
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleBack = () => {
    if (title.trim() || content.trim()) {
      showConfirm({
        title: "작성 중인 내용이 있습니다",
        html: "페이지를 나가면 작성 중인 내용이 사라집니다.<br/>계속하시겠습니까?",
        confirmButtonText: "나가기",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result) {
          navigate('/notices');
        }
      });
    } else {
      navigate('/notices');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title.trim()) {
      showToast(`제목을 입력해주세요.`, "error");
      return;
    }
  
    const cleanContent = (html: string): string => {
      const allowedTags = {
        p: '\n',          // 단락
        br: '\n',         // 줄바꿈
      };
    
      let text = html;
      
      Object.entries(allowedTags).forEach(([tag, replacement]) => {
        text = text.replace(new RegExp(`<${tag}[^>]*>`, 'g'), replacement)
                  .replace(new RegExp(`</${tag}>`, 'g'), '');
      });
      
      text = text.replace(/<[^>]*>/g, '');
      text = text.replace(/\n{3,}/g, '\n\n');
      
      return text.trim();
    };
  
    const processedContent = cleanContent(content);  // 함수 실행
  
    if (!processedContent.trim()) {  // 처리된 콘텐츠 검사
      showToast(`내용을 입력해주세요.`, "error");
      return;
    }
  
    const confirmMessage = status === "ACTIVE"
      ? "공지사항을 게시하시겠습니까?"
      : "공지사항을 임시저장하시겠습니까?";
  
    const confirmed = await showConfirm({
      title: confirmMessage,
      confirmButtonText: status === "ACTIVE" ? "게시" : "저장",
    });
  
    if (confirmed) {
      try {
        setIsLoading(true);
        
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/notices`,
          {
            title,
            content: processedContent,  // 처리된 콘텐츠 전송
            status
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Firebase-Token': currentUser?.uid
            }
          }
        );
  
        showToast(
          status === "ACTIVE" ? "게시되었습니다" : "임시저장되었습니다",
          "success"
        );
  
        navigate('/notices');
      } catch (error) {
        console.error('Failed to create notice:', error);
        showToast("저장 중 오류가 발생했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="h-full w-full p-6 relative"
      style={{
        backgroundImage:
          "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
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
      <form
        onSubmit={handleSubmit}
        className="h-auto space-y-6 bg-white rounded-lg shadow p-6"
      >
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block font-nanum text-sm font-medium text-gray-700 mb-1"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지사항 제목을 입력하세요"
            className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pointer"
          />
        </div>

        {/* Editor */}
        <div className="min-h-[50dvh] max-h-[45dvh] overflow-auto">
          <label
            htmlFor="content"
            className="block font-nanum text-sm font-medium text-gray-700 mb-1"
          >
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

        {/* Footer */}
        <div className="flex items-start justify-between border-t pt-6 absolute bottom-0 left-0 right-0 bg-white shadow-lg px-6 py-4">
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
              className="px-3 py-2 border font-nanum border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pointer"
            >
              <option value="INACTIVE">임시저장</option>
              <option value="ACTIVE">게시</option>
            </select>
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
              disabled={isLoading}
              className="px-4 py-2 font-nanum text-white bg-pointer rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading
                ? "저장 중..."
                : status === "ACTIVE"
                ? "게시"
                : "임시저장"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NoticeCreate;