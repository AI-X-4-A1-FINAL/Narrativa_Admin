import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Notice, NoticeStatus } from '../../types/notice';
import PageLayout from '../../components/ui/PageLayout';
import LoadingAnimation from '../../components/ui/LoadingAnimation';
import axios from 'axios';

const NoticeList = () => {
  const ITEMS_PER_PAGE = 5;
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Notice[]>(`${process.env.REACT_APP_BACKEND_URL}/api/notices`);
        setNotices(response.data);
      } catch (err) {
        setError('공지사항을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const getFilteredNotices = () => {
    if (!searchKeyword.trim()) return notices;
    
    return notices.filter((notice) =>
      notice.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  };

  const getPaginatedNotices = () => {
    const filtered = getFilteredNotices();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredNotices().length / ITEMS_PER_PAGE);
  };

  const getEmptyItems = () => {
    const currentItems = getPaginatedNotices().length;
    return Array(ITEMS_PER_PAGE - currentItems).fill(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCurrentPage(1);
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleNoticeClick = (id: number) => {
    navigate(`/notices/${id}`);
  };

  const handleCreateClick = () => {
    navigate('/notices/create');
  };

  const StatusBadge = ({ status }: { status: NoticeStatus }) => {
    const statusColors = {
      ACTIVE: 'bg-green-100 font-nanum text-green-600',
      INACTIVE: 'bg-gray-100 font-nanum text-gray-600'
    };
  
    const statusLabels = {
      ACTIVE: '게시됨',
      INACTIVE: '비활성'
    };

    return (
    <span className={`px-2 py-1 text-xs rounded ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
  );
  };

  const EmptyItem = () => (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="p-4 h-[100px]"></div>
    </div>
  );

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

  const TitleRight = (
    <button
      onClick={handleCreateClick}
      className="flex items-center gap-2 px-4 py-2 bg-pointer font-nanum text-white rounded-lg hover:bg-pointer"
    >
      <Plus className="w-4 h-4 font-nanum" />
      새 공지사항
    </button>
  );

  if (loading) {
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

  if (error) {
    return (
      <div className="h-full w-full p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <PageLayout 
      title="공지사항" 
      rightElement={TitleRight}
    >
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pointer"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 font-nanum text-white rounded-lg hover:bg-gray-900"
          >
            검색
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow">
        {getFilteredNotices().length === 0 ? (
          <div className="h-[480px] p-8 text-center font-nanum text-gray-500">
            {searchKeyword ? "검색 결과가 없습니다." : "공지사항이 없습니다."}
          </div>
        ) : (
          <>
            {getPaginatedNotices().map((notice) => (
              <div
                key={notice.id}
                onClick={() => handleNoticeClick(notice.id)}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={notice.status} />
                      <h3 className="font-medium font-nanum text-gray-800">{notice.title}</h3>
                    </div>
                    <div className="lg:flex lg:flex-col items-end hidden">
                      <span className="text-sm font-nanum text-gray-500">
                        작성: {formatDate(notice.createdAt)}
                      </span>
                      {notice.updatedAt !== notice.createdAt && (
                        <span className="text-xs font-nanum text-gray-400">
                          수정: {formatDate(notice.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{notice.content}</p>
                  <div className="mt-2 text-xs font-nanum text-gray-500 hidden lg:block">
                    관리자 ID: {notice.createdBy}
                  </div>
                </div>
              </div>
            ))}
            {getEmptyItems().map((_, index) => (
              <EmptyItem key={`empty-${index}`} />
            ))}
          </>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-600">
          {currentPage} / {getTotalPages() || 1}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, getTotalPages()))}
          disabled={currentPage === getTotalPages()}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </PageLayout>
  );
};

export default NoticeList;