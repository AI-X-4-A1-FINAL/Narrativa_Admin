export interface Metric {
    id: number;
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
  }
  
  export interface TrafficData {
    timestamp: string;
    visitors: number;
    pageViews: number;
  }
  
  export interface DashboardProps {
    trafficData: TrafficData[];
  }