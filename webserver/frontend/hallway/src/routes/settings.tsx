import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
//import axios from 'axios';

type SettingsData = Map<string, string[]>;

const Settings: React.FC = () => {
    return (
        <>
            <div className='settings'>
                Video Loop Length
                <button>10 Sec</button>
                <button>1 Min</button>
                <button>10 Min</button>
                <button>30 Min</button>
            </div>
        </>
    );
}

// Export the file-based Route after the component declaration so Settings is defined.
export const Route = createFileRoute('/settings')({
    component: Settings,
    loader: async (): Promise<SettingsData> => {
        /*const res = await axios.get('/api/settings', {withCredentials: true });
                    const data = res.data as Record<string, string[]>;
        const entries = Object.entries(data).map(([dir, urls]) => [dir, urls as string[]] as [string, string[]]);
                    return new Map<string, string[]>(entries);*/
        return new Map<string, string[]>();
    },
});
