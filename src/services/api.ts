import { TrafficData, Metric } from '../types/dashboard';

// 더미 트래픽 데이터
const dummyTrafficData: TrafficData[] = [
  { timestamp: '2024-11-18', visitors: 120, pageViews: 450 },
  { timestamp: '2024-11-19', visitors: 200, pageViews: 600 },
  { timestamp: '2024-11-20', visitors: 150, pageViews: 500 },
  { timestamp: '2024-11-21', visitors: 180, pageViews: 580 }
];

// 더미 메트릭 데이터
const dummyMetricData: Metric[] = [
  {
    id: 1,
    title: '총 사용자',
    value: 2847,
    change: 12.5,
    icon: null // 아이콘은 컴포넌트에서 처리
  },
  {
    id: 2,
    title: '활성 사용자',
    value: 847,
    change: 7.2,
    icon: null
  },
  {
    id: 3,
    title: '일일 트래픽',
    value: 14720,
    change: -2.4,
    icon: null
  },
  {
    id: 4,
    title: '플레이 수',
    value: 5123,
    change: 5.3,
    icon: null
  }
];

export const fetchTrafficData = async (): Promise<TrafficData[]> => {
  // 실제 API 호출은 주석 처리
  // const response = await fetch(`${API_BASE_URL}/api/traffic`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch traffic data');
  // }
  // return response.json();

  // 더미 데이터 반환
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyTrafficData), 500); // 0.5초 지연
  });
};

export const fetchMetricData = async (): Promise<Metric[]> => {
  // 실제 API 호출은 주석 처리
  // const response = await fetch(`${API_BASE_URL}/api/metrics`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch metric data');
  // }
  // return response.json();

  // 더미 데이터 반환
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyMetricData), 500); // 0.5초 지연
  });
};
