import { useEffect, useState } from 'react';
import axios from 'axios';

function ErrorTable() {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const res = await axios.get('/api/errors', { withCredentials: true });
        setErrors(res.data.slice(0, 10)); // show only the latest 10
      } catch (err) {
        console.error('Error fetching /api/errors:', err);
        setErrors([]); // optional: clear table on error
      }
    };

    fetchErrors();
    const interval = setInterval(fetchErrors, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

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
              <td style={tdStyle} colSpan="3" align="center">
                No recent errors
              </td>
            </tr>
          ) : (
            errors.map((err, index) => (
              <tr key={index}>
                <td style={tdStyle}>
                  {err.timestamp ? new Date(err.timestamp * 1000).toLocaleString() : '—'}
                </td>
                <td style={tdStyle}>{err.location ?? '-'}</td>
                <td style={tdStyle}>{err.error ?? '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  borderBottom: '2px solid #ccc',
  padding: '8px',
};

const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top',
};

export default ErrorTable;
