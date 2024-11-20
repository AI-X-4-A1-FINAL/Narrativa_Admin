import { useState, useEffect } from 'react';
import { TrafficData, Metric } from '../types/dashboard';
import { fetchTrafficData, fetchMetricData } from '../services/api';

export const useDashboardData = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [traffic, metric] = await Promise.all([
          fetchTrafficData(),
          fetchMetricData()
        ]);

        setTrafficData(traffic);
        setMetrics(metric);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { trafficData, metrics, loading, error };
};
