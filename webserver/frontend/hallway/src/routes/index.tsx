import LatestTable from '../LatestTable';
import ErrorTable from '../ErrorTable';
import SensorHeader from '../SensorHeader';
import GroupedMetricCharts from '../GroupedMetricCharts';
import { createFileRoute } from '@tanstack/react-router'
import { type FC, useState } from 'react';

function selectTab(tab: string) {
    switch (tab) {
        case 'live':
            return <LatestTable />;
        case 'errors':
            return <ErrorTable />;
        case 'graphs':
            return <GroupedMetricCharts />;
    }
    return <></>;
}

const Sensors: FC = () => {
    const [tab, setTab] = useState('live');

    function handleClick(tabName: string) {
        setTab(tabName);
    }

    return (
        <div style={{ maxWidth: 1200, margin: 'auto', padding: 20 }} className='sensors'>
            <SensorHeader tab={tab} onClick={handleClick} />
            {selectTab(tab)}
        </div >
    );
}

export const Route = createFileRoute('/')({
    component: Sensors,
})

export default Sensors;