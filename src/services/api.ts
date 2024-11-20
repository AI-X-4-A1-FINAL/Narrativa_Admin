import { TrafficData } from '../types/dashboard';

export const fetchTrafficData = async (): Promise<TrafficData[]> => {
  const response = await fetch('/api/traffic');
  if (!response.ok) {
    throw new Error('Failed to fetch traffic data');
  }
  return response.json();
};