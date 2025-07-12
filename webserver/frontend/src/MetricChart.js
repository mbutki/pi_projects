import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#a83279', '#32a852', '#d83232'];

function combineByTimestamp(locationData) {
  const timestamps = new Set();
  Object.values(locationData).forEach(series => {
    series.forEach(point => timestamps.add(point.timestamp));
  });

  const sorted = Array.from(timestamps).sort((a, b) => a - b);

  return sorted.map(ts => {
    const row = {
      timestamp: ts,
      timeLabel: new Date(ts * 1000).toLocaleTimeString(),
    };
    for (const [loc, series] of Object.entries(locationData)) {
      const point = series.find(p => p.timestamp === ts);
      row[loc] = point?.value ?? null;
    }
    return row;
  });
}

function MetricChart({ metric, data }) {
  const [hiddenLines, setHiddenLines] = useState(new Set());

  const combinedData = useMemo(() => {
    if (!data) return [];
    return combineByTimestamp(data);
  }, [data]);

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
      <h3>{metric.charAt(0).toUpperCase() + metric.slice(1)}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeLabel" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend onClick={handleLegendClick} />
          {data &&
            Object.entries(data).map(([location], i) => (
              <Line
                type="monotone"
                dataKey={location}
                stroke={COLORS[i % COLORS.length]}
                dot={false}
                connectNulls={true}
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

