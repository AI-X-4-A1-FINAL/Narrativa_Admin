import React from 'react';
import { Users, Activity, Globe, Gamepad, Clock } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import TrafficChart from '../components/dashboard/TrafficChart';
import { useDashboardData } from '../hooks/useDashboardData';
import LoadingAnimation from '../components/LoadingAnimation';

const StatisticsPage: React.FC = () => {
  const { trafficData, metrics, loading, error } = useDashboardData();

  // 아이콘 매핑
  const iconMapping = {
    '총 사용자': <Users className="h-6 w-6" />,
    '활성 사용자': <Activity className="h-6 w-6" />,
    '일일 트래픽': <Globe className="h-6 w-6" />,
    '플레이 수': <Gamepad className="h-6 w-6" />,
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <div className="text-center text-red-500">에러: {error.message}</div>;
  }

  return (
    <div className="p-4 space-y-6 bg-white">
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center space-y-2 lg:space-y-0">
        <h1 className="text-2xl font-nanum font-bold text-pointer">관리자 대시보드</h1>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-pointer" />
          <span className="text-sm font-nanum text-pointer">
            최근 업데이트: {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* 주요 메트릭 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={{
              ...metric,
              icon: iconMapping[metric.title] || null,
            }}
          />
        ))}
      </div>

      {/* 트래픽 차트 */}
      <TrafficChart data={trafficData} />
    </div>
  );
};

export default StatisticsPage;
