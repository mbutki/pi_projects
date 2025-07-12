import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MetricChart from './MetricChart';
import LatestTable from './LatestTable';

const METRICS = ["temp", "humidity", "pressure", "lux", "aqi"];

// Group historical data by metric and location
function groupByLocation(data) {
  const grouped = {};
  for (let metric of METRICS) grouped[metric] = {};

  for (let row of data) {
    for (let metric of METRICS) {
      const location = row.location;
      if (!grouped[metric][location]) grouped[metric][location] = [];
      grouped[metric][location].push({
        timestamp: row.end_ts,
        value: row[metric]
      });
    }
  }
  return grouped;
}

function App() {
  const [groupedData, setGroupedData] = useState(null);
  const [latestData, setLatestData] = useState([]);
  const [error, setError] = useState(null);

  // Poll for 5-minute medians every 60 seconds
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

    fetchMedians(); // initial load
    const interval = setInterval(fetchMedians, 60_000); // every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Poll for latest values every second
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get('/api/latest', { withCredentials: true });
        setLatestData(res.data);
      } catch (err) {
        console.error('Error fetching latest sensor data:', err);
      }
    };

    fetchLatest(); // initial load
    const interval = setInterval(fetchLatest, 1000); // every second
    return () => clearInterval(interval);
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <h1>5-Minute Sensor Medians</h1>
      {groupedData &&
        METRICS.map(metric => (
          <MetricChart
            key={metric}
            metric={metric}
            data={groupedData[metric]}
          />
        ))}
      <LatestTable latestData={latestData} />
    </div>
  );
}

export default App;

