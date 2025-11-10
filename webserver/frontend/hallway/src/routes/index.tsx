import LatestTable from '../LatestTable';
import ErrorTable from '../ErrorTable';
import GroupedMetricCharts from '../GroupedMetricCharts';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Environment,
})

function Environment() {
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