import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as api from '../api';

const TRIANGLE_SKETCHES = [
    'triangle16_attractor',
    'triangle16_ember',
    'triangle16_partical_fft',
    'triangle16_rings',
    'triangle16_snake',
    'triangle16_wavefronts',
];

const Devices: React.FC = () => {
    const [lastResult, setLastResult] = useState<string | null>(null);

    const [isRunning, setIsRunning] = useState(false);

    const mutation = useMutation({
        mutationFn: (sketch: string) => api.runTriangleSketch(sketch),
        onSuccess: (data) => {
            if (data && data.ok) {
                setLastResult(`Started ${String(data.stdout || '')}`);
            } else if (data && data.error) {
                setLastResult(`Error: ${data.error}`);
            } else {
                setLastResult(JSON.stringify(data));
            }
        },
        onError: (err) => {
            setLastResult(String(err));
        },
        onSettled: () => setIsRunning(false),
    });

    const triggerSketch = (sketch: string) => {
        setIsRunning(true);
        setLastResult(`Triggering ${sketch}...`);
        mutation.mutate(sketch);
    };

    return (
        <div className='small-button'>
            <h2>Triangle Sketches</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TRIANGLE_SKETCHES.map((s) => (
                    <button key={s} onClick={() => triggerSketch(s)} disabled={isRunning}>
                        {s}
                    </button>
                ))}
            </div>
            <div style={{ marginTop: 12 }}>
                {isRunning && <span>Running on pi-triangle...</span>}
                {lastResult && <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{lastResult}</div>}
            </div>
        </div>
    );
}

export const Route = createFileRoute('/devices')({
    component: Devices,
})

export default Devices;