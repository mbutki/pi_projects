import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLatest } from './api';
import type { LatestRow } from './api';
import { queryKeys } from './queryKeys';

function LatestTable(): React.ReactElement | null {
  const { data: latestData = [] } = useQuery<LatestRow[]>({
    queryKey: queryKeys.latest,
    queryFn: getLatest,
    refetchInterval: 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });

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
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.temp != null ? row.temp.toFixed(1) : '—'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.humidity != null ? row.humidity.toFixed(1) : '—'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.pressure != null ? row.pressure.toFixed(1) : '—'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.lux != null ? row.lux.toFixed(1) : '—'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.aqi != null ? row.aqi : '—'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(row.timestamp * 1000).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LatestTable;
