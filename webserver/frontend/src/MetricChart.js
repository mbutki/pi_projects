import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#a83279', '#32a852', '#d83232'];

// Combine data across locations into shared timestamped rows (preserving minute-level info)
function combineByTimestamp(locationData) {
  const timestamps = new Set();
  Object.values(locationData).forEach(series => {
    series.forEach(point => timestamps.add(point.timestamp));
  });

  const sorted = Array.from(timestamps).sort((a, b) => a - b);

  return sorted.map(ts => {
    const row = {
      timestamp: ts * 1000, // convert to ms for recharts
    };
    for (const [loc, series] of Object.entries(locationData)) {
      const point = series.find(p => p.timestamp === ts);
      row[loc] = point?.value ?? null;
    }
    return row;
  });
}

  const ONE_HOUR_MS = 60 * 60 * 1000;
  const TOTAL_HOURS = 48;

function MetricChart({ metric, data }) {
  const [hiddenLines, setHiddenLines] = useState(new Set());

  const nowDate = new Date();
  nowDate.setMinutes(0, 0, 0); // Round to hour
  const now = nowDate.getTime();
  const startTime = now - TOTAL_HOURS * ONE_HOUR_MS;

  const hourlyTicks = useMemo(
    () => Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => startTime + i * ONE_HOUR_MS),
    [startTime]
  );

  const combinedData = useMemo(() => {
    if (!data) return [];

    const all = combineByTimestamp(data);

    // Only include points within the 48-hour window
    return all.filter(point => point.timestamp >= startTime && point.timestamp <= now);
  }, [data, startTime, now]);

  const handleLegendClick = (e) => {
    const loc = e.dataKey;
    setHiddenLines(prev => {
      const copy = new Set(prev);
      copy.has(loc) ? copy.delete(loc) : copy.add(loc);
      return copy;
    });
  };



  return (
    <div style={{ marginBottom: 40 }}>
      <h2>{metric.charAt(0).toUpperCase() + metric.slice(1)}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={[startTime, now]}
            ticks={hourlyTicks}  // Show vertical lines on the hour
            tickFormatter={(ts) =>
              new Date(ts).toLocaleTimeString([], { hour: 'numeric', hour12: true })
            }
            tick={{ fontSize: 12, angle: -45, textAnchor: 'end' }}
          />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip
            labelFormatter={(ts) =>
              new Date(ts).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })
            }
          />
          <Legend onClick={handleLegendClick} />
          {data &&
            Object.entries(data).map(([location], i) => (
              <Line
                key={location}
                type="monotone"
                dataKey={location}
                stroke={COLORS[i % COLORS.length]}
                dot={false}
                connectNulls
                isAnimationActive={false}
                hide={hiddenLines.has(location)}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default React.memo(MetricChart);
