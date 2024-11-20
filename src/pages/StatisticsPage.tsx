import React, { useState, useEffect } from 'react';
import { Users, Activity, Globe, Gamepad, Clock } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import TrafficChart from '../components/dashboard/TrafficChart';

interface Metric {
  id: number;
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

interface TrafficData {
  timestamp: string;
  visitors: number;
  pageViews: number;
}

const StatisticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);

  useEffect(() => {
    // 더미 메트릭 데이터 설정
    const dummyMetrics: Metric[] = [
      {
        id: 1,
        title: '총 사용자',
        value: 2847,
        change: 12.5,
        icon: <Users className="h-6 w-6" />
      },
      {
        id: 2,
        title: '활성 사용자',
        value: 847,
        change: 7.2,
        icon: <Activity className="h-6 w-6" />
      },
      {
        id: 3,
        title: '일일 트래픽',
        value: 14720,
        change: -2.4,
        icon: <Globe className="h-6 w-6" />
      },
      {
        id: 4,
        title: '플레이 수',
        value: 5123,
        change: 5.3,
        icon: <Gamepad className="h-6 w-6" />
      }
    ];
    setMetrics(dummyMetrics);

    // 더미 트래픽 데이터 설정
    const dummyTrafficData: TrafficData[] = [
      { timestamp: '2024-11-18', visitors: 120, pageViews: 450 },
      { timestamp: '2024-11-19', visitors: 200, pageViews: 600 },
      { timestamp: '2024-11-20', visitors: 150, pageViews: 500 },
      { timestamp: '2024-11-21', visitors: 180, pageViews: 580 }
    ];
    setTrafficData(dummyTrafficData);
  }, []);

  return (
    <div className="p-4 space-y-6 bg-white">
      <div className="flex justify-between items-center">
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
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* 트래픽 차트 */}
      <TrafficChart data={trafficData} />
    </div>
  );
};

export default StatisticsPage;
