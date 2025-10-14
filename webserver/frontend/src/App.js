import React from 'react';
import LatestTable from './LatestTable';
import ErrorTable from './ErrorTable';
import GroupedMetricCharts from './GroupedMetricCharts';

function App() {
  return (
    <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
      <LatestTable />
      <br/>
      <ErrorTable />
      <br/>
      <GroupedMetricCharts />
    </div>
  );
}

export default App;
