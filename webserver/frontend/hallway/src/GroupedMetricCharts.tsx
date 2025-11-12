// GroupedMetricCharts.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import MetricChart from './MetricChart';
import React from 'react';

type MetricKey = 'temp' | 'humidity' | 'pressure' | 'lux' | 'aqi';

const METRICS: MetricKey[] = ['temp', 'humidity', 'pressure', 'lux', 'aqi'];

interface SeriesPoint {
  timestamp: number;
  value: number | null;
}

type LocationSeries = Record<string, SeriesPoint[]>;

type GroupedData = Record<MetricKey, LocationSeries>;

function groupByLocation(data: any[]): GroupedData {
  const grouped: Partial<GroupedData> = {};
  for (let metric of METRICS) grouped[metric] = {};

  for (let row of data) {
    for (let metric of METRICS) {
      const location: string = row.location;
      if (!grouped[metric]![location]) grouped[metric]![location] = [];
      grouped[metric]![location].push({
        timestamp: row.end_ts,
        value: row[metric],
      });
    }
  }
  return grouped as GroupedData;
}

function GroupedMetricCharts(): React.ReactElement | null {
  const [groupedData, setGroupedData] = useState<GroupedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedians = async () => {
      try {
        const res = await axios.get('/api/5min-median', { withCredentials: true });
        setGroupedData(groupByLocation(res.data));
        setError(null);
      } catch (err) {
        console.error('Error fetching medians:', err);
        setError('Failed to fetch sensor data');
      }
    };

    fetchMedians();
    const interval = setInterval(fetchMedians, 60_000); // Every 60 secs
    return () => clearInterval(interval);
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!groupedData) return null;

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
