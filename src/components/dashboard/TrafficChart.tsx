import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrafficData } from '../../types/dashboard';

interface TrafficChartProps {
  data: TrafficData[];
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-lg font-nanum font-semibold text-pointer">트래픽 현황</h2>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* 방문자 수 막대 */}
            <Bar dataKey="visitors" fill="#433878" name="방문자" />
            {/* 페이지 뷰 막대 */}
            <Bar dataKey="pageViews" fill="#7E60BF" name="페이지뷰" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficChart;
