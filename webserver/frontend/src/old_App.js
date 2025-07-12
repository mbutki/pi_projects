import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import MetricChart from './MetricChart';
import LatestTable from './LatestTable';

const METRICS = ["temp", "humidity", "pressure", "lux", "aqi"];

function groupByLocation(data) {
  const grouped = {};
  for (let metric of METRICS) grouped[metric] = {};

  for (let row of data) {
    for (let metric of METRICS) {
      const location = row.location;
      if (!grouped[metric][location]) grouped[metric][location] = [];
      grouped[metric][location].push({
        timestamp: row.end_ts,  // 👈 raw number
        value: row[metric]
      });
    }
  }
  return grouped;
}

// Combine each metric's location data into a single series per timestamp
function combineByTimestamp(locationData) {
  const timestampsSet = new Set();
  Object.values(locationData).forEach(series => {
    series.forEach(point => timestampsSet.add(point.timestamp));
  });

  const sortedTimestamps = Array.from(timestampsSet).sort((a, b) => a - b); // sort numerically

  return sortedTimestamps.map(ts => {
    const entry = {
      timestamp: ts,
      timeLabel: new Date(ts * 1000).toLocaleTimeString(), // human-readable
    };
    for (const [location, series] of Object.entries(locationData)) {
      const point = series.find(p => p.timestamp === ts);
      entry[location] = point ? point.value : null;
    }
    return entry;
  });
}

function App() {
  const [groupedData, setGroupedData] = useState(null);
  const [latestData, setLatestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch historical 5-min medians
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/5min-median', { withCredentials: true });
        setGroupedData(groupByLocation(res.data));
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch sensor data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // WebSocket for real-time sensor_latest updates
  useEffect(() => {
    const ws = new WebSocket('ws://192.168.86.117:80');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'latest') {
        setLatestData(message.data);
      }
    };
    ws.onerror = (err) => console.error("WebSocket error", err);
    return () => ws.close();
  }, []);

  if (loading) return <p>Loading sensor data...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <h1>5-Minute Sensor Medians</h1>
      {METRICS.map(metric => (
        <MetricChart
          key={metric}
          metric={metric}
          data={groupedData ? groupedData[metric] : null}
        />
      ))}
      <LatestTable latestData={latestData} />
    </div>
  );
}

export default App;
