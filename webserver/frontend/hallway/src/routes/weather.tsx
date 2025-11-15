import { createFileRoute } from '@tanstack/react-router'
import React from 'react';

const Weather: React.FC = () => {
    return (
        <div >
            Retro Weather Comming Soon!
        </div>
    );
}

export const Route = createFileRoute('/weather')({
    component: Weather,
})

export default Weather;