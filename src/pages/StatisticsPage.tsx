import React from 'react';
import { Users, Activity, Globe, Gamepad, Clock } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import TrafficChart from '../components/dashboard/TrafficChart';
import { useDashboardData } from '../hooks/useDashboardData';
import LoadingAnimation from '../components/LoadingAnimation';
import PageLayout from '../components/PageLayout';


const StatisticsPage: React.FC = () => {
  const TitleRight = (
    <div className="flex items-center space-x-2">
      <Clock className="h-5 w-5 text-pointer" />
      <span className="text-sm font-nanum text-pointer">
        최근 업데이트: {new Date().toLocaleString()}
      </span>
    </div>
  );

  const { trafficData, metrics, loading, error } = useDashboardData();

  const iconMapping = {
    '총 사용자': <Users className="h-6 w-6" />,
    '활성 사용자': <Activity className="h-6 w-6" />,
    '일일 트래픽': <Globe className="h-6 w-6" />,
    '플레이 수': <Gamepad className="h-6 w-6" />,
  };

  if (loading) {
    return (
    <div className="h-full w-full flex flex-col justify-center p-6 text-center" 
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
    return <div className="text-center text-red-500">에러: {error.message}</div>;
  }

  return (
    <PageLayout 
      title="관리자 대시보드" 
      rightElement={TitleRight}
    >

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
    </PageLayout>
  );
};

export default StatisticsPage;
