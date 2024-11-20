import React from 'react';
import { Metric } from '../../types/dashboard';

interface MetricCardProps {
  metric: Metric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-nanum font-semibold text-pointer">
          {metric.title}
        </h3 >
        <div className="text-pointer">{metric.icon}</div>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-nanum font-semibold text-black">{metric.value.toLocaleString()}</div>
        <p className={`text-xs font-nanum font-semibold ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}% 전주 대비
        </p>
      </div>
    </div>
  );
};

export default MetricCard;