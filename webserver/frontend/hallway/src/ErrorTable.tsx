import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

interface ErrorEntry {
  timestamp?: number | null;
  location?: string | null;
  error?: string | null;
}

function ErrorTable(): React.ReactElement {
  const fetchErrors = async (): Promise<ErrorEntry[]> => {
    const res = await axios.get('/api/errors', { withCredentials: true });
    return res.data.slice(0, 10) as ErrorEntry[];
  };

  const { data: errors = [] } = useQuery<ErrorEntry[]>({
    queryKey: ['errors'],
    queryFn: fetchErrors,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });

  return (
    <div style={{ marginTop: 40 }}>
      <h1>Recent Errors</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Error</th>
          </tr>
        </thead>
        <tbody>
          {errors.length === 0 ? (
            <tr>
              <td style={tdStyle} colSpan={3} align="center">
                No recent errors
              </td>
            </tr>
          ) : (
            errors.map((err: ErrorEntry, index: number) => (
              <tr key={index}>
                <td style={tdStyle}>
                  {err && err.timestamp ? new Date(err.timestamp * 1000).toLocaleString() : '—'}
                </td>
                <td style={tdStyle}>{err && err.location ? err.location : '-'}</td>
                <td style={tdStyle}>{err && err.error ? err.error : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  borderBottom: '2px solid #ccc',
  padding: '8px',
};

const tdStyle: React.CSSProperties = {
  padding: '8px',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top',
};

export default ErrorTable;
