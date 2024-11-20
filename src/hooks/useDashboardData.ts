import { useState, useEffect } from 'react';
import { TrafficData } from '../types/dashboard';
import { fetchTrafficData } from '../services/api';

export const useDashboardData = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [traffic] = await Promise.all([
          fetchTrafficData(),
        ]);
        
        setTrafficData(traffic);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { trafficData, loading, error };
};