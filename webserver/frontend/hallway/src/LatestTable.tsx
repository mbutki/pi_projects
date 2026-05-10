import React, { useState, useEffect } from 'react';
import { getLatest } from './api';
import type { LatestRow } from './api';

function LatestTable(): React.ReactElement | null {
  const [latestData, setLatestData] = useState<LatestRow[]>([]);

  useEffect(() => {
    // Initial fetch to populate immediately
    getLatest().then(setLatestData).catch(err => console.error('Initial fetch failed:', err));

    // Open the Server-Sent Events stream
    const eventSource = new EventSource('/api/latest/sse');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLatestData(data);
      } catch (err) {
        console.error('Failed to parse SSE data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error. EventSource will attempt to reconnect automatically.', err);
    };

    return () => eventSource.close();
  }, []);

  const format = (val: number | null | undefined, decimals = 1) => val != null ? val.toFixed(decimals) : '—';

  if (!latestData || latestData.length === 0) return <p>No current sensor data.</p>;

  return (
    <div style={{ marginTop: 40 }}>
      <h1>Live Sensor Data</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th scope="col" style={{ border: '1px solid #ddd', padding: '8px' }}>Location</th>
            <th scope="col" style={{ border: '1px solid #ddd', padding: '8px' }}>Temp (°F)</th>
            <th scope="col" style={{ border: '1px solid #ddd', padding: '8px' }}>Humidity (%)</th>
            <th scope="col" style={{ border: '1px solid #ddd', padding: '8px' }}>Pressure (Pa)</th>
            <th scope="col" style={{ border: '1px solid #ddd', padding: '8px' }}>Lux</th>
            <th scope="col" style={{ border: '1px solid #ddd', padding: '8px' }}>AQI</th>
            <th scope="col" style={{ border: '1px solid #ddd', padding: '8px' }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {latestData.map((row: LatestRow) => (
            <tr key={row.location}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.location}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{format(row.temp)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{format(row.humidity)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{format(row.pressure)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{format(row.lux)}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.aqi ?? '—'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(row.timestamp * 1000).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LatestTable;
