// GroupedMetricCharts.js
import MetricChart from './MetricChart';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMedians } from './api';
import type { MedianRow } from './api';
import { queryKeys } from './queryKeys';

type MetricKey = 'temp' | 'humidity' | 'pressure' | 'lux' | 'aqi';

const METRICS: MetricKey[] = ['temp', 'humidity', 'pressure', 'lux', 'aqi'];

interface SeriesPoint {
  timestamp: number;
  value: number | null;
}

type LocationSeries = Record<string, SeriesPoint[]>;

type GroupedData = Record<MetricKey, LocationSeries>;

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

  const { data: medianRows, error } = useQuery<MedianRow[]>({
    queryKey: queryKeys.medians,
    queryFn: getMedians,
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
