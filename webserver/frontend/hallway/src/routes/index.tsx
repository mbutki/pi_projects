import LatestTable from '../LatestTable';
import ErrorTable from '../ErrorTable';
import GroupedMetricCharts from '../GroupedMetricCharts';
import { createFileRoute } from '@tanstack/react-router'
import React from 'react';

const Sensors: React.FC = () => {
    return (
        <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }}>
            <LatestTable />
            <br />
            <ErrorTable />
            <br />
            <GroupedMetricCharts />
        </div>
    );
}

export const Route = createFileRoute('/')({
    component: Sensors,
})

export default Sensors;