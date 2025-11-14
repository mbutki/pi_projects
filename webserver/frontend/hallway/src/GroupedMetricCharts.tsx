// GroupedMetricCharts.js
import axios from 'axios';
import MetricChart from './MetricChart';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

type MetricKey = 'temp' | 'humidity' | 'pressure' | 'lux' | 'aqi';

const METRICS: MetricKey[] = ['temp', 'humidity', 'pressure', 'lux', 'aqi'];

interface SeriesPoint {
  timestamp: number;
  value: number | null;
}

type LocationSeries = Record<string, SeriesPoint[]>;

type GroupedData = Record<MetricKey, LocationSeries>;

interface MedianRow {
  location: string;
  end_ts: number;
  temp?: number | null;
  humidity?: number | null;
  pressure?: number | null;
  lux?: number | null;
  aqi?: number | null;
}

function groupByLocation(data: MedianRow[]): GroupedData {
  const grouped: Partial<GroupedData> = {};
  for (const metric of METRICS) grouped[metric] = {};

  for (const row of data) {
    for (const metric of METRICS) {
      const location: string = row.location;
      if (!grouped[metric]![location]) grouped[metric]![location] = [];
      grouped[metric]![location].push({
        timestamp: row.end_ts,
        value: (row as unknown as Record<string, number | null>)[metric] ?? null,
      });
    }
  }
  return grouped as GroupedData;
}

function GroupedMetricCharts(): React.ReactElement | null {

  const fetchMedians = async (): Promise<MedianRow[]> => {
    const res = await axios.get('/api/5min-median', { withCredentials: true });
    return res.data as MedianRow[];
  };

  const { data: medianRows, error } = useQuery<MedianRow[]>({
    queryKey: ['medians'],
    queryFn: fetchMedians,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
  });

  if (error) return <p style={{ color: 'red' }}>Failed to fetch sensor data</p>;
  if (!medianRows) return null;

  const groupedData = groupByLocation(medianRows);

  return (
    <div style={{ marginTop: 40 }}>
      <h1>5-Minute Sensor Medians</h1>
      {METRICS.map(metric => (
        <MetricChart
          key={metric}
          metric={metric}
          data={groupedData[metric]}
        />
      ))}
    </div>
  );
}

export default GroupedMetricCharts;
