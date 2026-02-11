import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import * as api from '../api';
import { queryKeys } from '../queryKeys';

const OPTIONS: { label: string; seconds: number }[] = [
    { label: '10 Sec', seconds: 10 },
    { label: '1 Min', seconds: 60 },
    { label: '10 Min', seconds: 600 },
    { label: '30 Min', seconds: 1800 },
];

const Settings: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: loopSec, isLoading } = useQuery({ queryKey: queryKeys.videoLoop, queryFn: api.getVideoLoopSeconds, staleTime: 1000 * 60 });

    const [isSaving, setIsSaving] = useState(false);

    const mutation = useMutation({
        mutationFn: (s: number) => api.setVideoLoopSeconds(s),
        onSuccess: (newSeconds: number) => {
            // update cached value so VideoPlayer and UI reflect new setting instantly
            queryClient.setQueryData(queryKeys.videoLoop, newSeconds);
        },
        onSettled: () => {
            setIsSaving(false);
        },
    });

    const handleClick = (seconds: number) => {
        setIsSaving(true);
        mutation.mutate(seconds);
    };

    // Screensaver setting
    const { data: screenSec, isLoading: screenLoading } = useQuery({ queryKey: queryKeys.screenSaver, queryFn: api.getScreenSaverSeconds, staleTime: 1000 * 60 });
    const [isSavingScreen, setIsSavingScreen] = useState(false);
    const screenMutation = useMutation({
        mutationFn: (s: number) => api.setScreenSaverSeconds(s),
        onSuccess: (newSeconds: number) => {
            queryClient.setQueryData(queryKeys.screenSaver, newSeconds);
        },
        onSettled: () => setIsSavingScreen(false),
    });
    const handleScreenClick = (seconds: number) => {
        setIsSavingScreen(true);
        screenMutation.mutate(seconds);
    };

    return (
        <div className='small-button'>
            <section style={{ marginBottom: 20 }}>
                <h2>Video Loop Length</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {OPTIONS.map((opt) => {
                        const active = !isLoading && loopSec === opt.seconds;
                        return (
                            <button
                                key={opt.label}
                                onClick={() => handleClick(opt.seconds)}
                                className={active ? 'active' : ''}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                    {isSaving && <span>Saving...</span>}
                </div>
            </section>

            <section>
                <h2>Screensaver Delay</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {OPTIONS.map((opt) => {
                        const active = !screenLoading && screenSec === opt.seconds;
                        return (
                            <button
                                key={opt.label}
                                onClick={() => handleScreenClick(opt.seconds)}
                                className={active ? 'active' : ''}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                    {isSavingScreen && <span>Saving...</span>}
                </div>
            </section>
        </div>
    );
};

// Export the file-based Route after the component declaration so Settings is defined.
export const Route = createFileRoute('/settings')({
    component: Settings,
});
