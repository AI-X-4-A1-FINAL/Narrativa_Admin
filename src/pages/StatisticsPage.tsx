import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import PageLayout from "../components/ui/PageLayout";
import LoadingAnimation from "../components/ui/LoadingAnimation";
import { RefreshCw, TrendingUp } from 'lucide-react';
import { useToast } from "../hooks/useToast";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BasicStats {
  currentTraffic: number;
  totalDailyTraffic: number;
  totalUsers: number;
  gamesByGenre: Record<string, number>;
  timestamp: string;
}

const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<BasicStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { showToast } = useToast();

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const auth = getAuth();

  const [targetGroupHealth, setTargetGroupHealth] = useState<Record<string, any[]>>({});
  
  const fetchTargetGroupHealth = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/health/target-groups`, {
        headers: {
          Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`
        }
      });
      setTargetGroupHealth(response.data);
    } catch (error) {
      console.error('AWS 배포현황 조회 에러:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await axios.get(`${BASE_URL}/api/admin/stats/basic`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      setStats(response.data);
    } catch (err) {
      console.error('통계 데이터 조회 에러:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchTargetGroupHealth()
      ]);
      showToast("새로고침 완료", "success");
    } catch (error) {
      showToast("새로고침 실패", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchStats(),
      fetchTargetGroupHealth()
    ]);
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full p-6 text-center">
        <LoadingAnimation />
      </div>
    );
  }

  const doughnutData = {
    labels: stats ? Object.keys(stats.gamesByGenre) : [],
    datasets: [
      {
        data: stats ? Object.values(stats.gamesByGenre) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
    cutout: '70%',
  };

  return (
    <PageLayout 
      title="통계 대시보드"
      rightElement={stats?.timestamp && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            조회시간: {new Date(stats.timestamp).toLocaleString('ko-KR')}
          </span>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-8 h-8 p-1 bg-white hover:bg-gray-100 rounded-full transition-all 
            hover:shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center"
            aria-label="새로고침"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}
    >
      <div className="space-y-6 overflow-y-auto">
        {/* 첫번째줄 데이터 */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="grid grid-row-1 sm:grid-row-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700">오늘의 총 트래픽</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.totalDailyTraffic}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700">총 사용자 수</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.totalUsers}</p>
            </div>
          </div>  

          <div className="grid grid-row-1 sm:grid-row-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700">추가예정 항목</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">추가예정 항목</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700">추가예정 항목</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">추가예정 항목</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
            <h2 className="text-lg font-semibold text-gray-700">AWS 배포현황</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {Object.entries(targetGroupHealth).map(([groupName, healthDescriptions]) => (
                <div key={groupName} className="p-4 bg-gray-50 rounded-lg">
                  {healthDescriptions.map((description, index) => (
                    <div key={index}>
                      <h3 className="text-md font-semibold text-gray-600">{description.targetId}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">{groupName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          description.state === 'healthy' ? 'bg-green-100 text-green-800' :
                          description.state === 'unhealthy' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {description.state}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 두번째줄 데이터 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 장르별 게임 실행 횟수 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">장르별 게임 실행 횟수</h2>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {stats && Object.entries(stats.gamesByGenre).map(([genre, count]) => (
                <div 
                  key={genre} 
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-sm text-gray-600">{genre}</span>
                  <span className="text-sm font-medium text-blue-600">
                    {count.toLocaleString()}회
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-600">총계</span>
                <span className="text-sm font-semibold text-blue-600">
                  {stats && Object.values(stats.gamesByGenre)
                    .reduce((a, b) => (a as number) + (b as number), 0)
                    .toLocaleString()}회
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">장르별 게임 실행 비율</h2>
            <div className="flex items-center justify-center">
              <div className="w-[200px] h-[200px]">
                <Doughnut 
                  data={doughnutData} 
                  options={{
                    ...doughnutOptions,
                    plugins: {
                      ...doughnutOptions.plugins,
                      tooltip: {
                        callbacks: {
                          label: function(context: any) {
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${percentage}%`;
                          }
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default StatisticsPage;