import { useContext, useEffect, useState } from "react";
import SSContext from './SSContext';
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useQuery } from '@tanstack/react-query';
import { getVideoDirs } from './api';
import { queryKeys } from './queryKeys';

function ScreenSaverInner() {
    const [isScreenSaved, setIsScreenSaved] = useContext(SSContext);
    const navigate = useNavigate();
    const location = useLocation();

    const { data: videoDirs = [] } = useQuery<string[]>({
        queryKey: queryKeys.videoDirs,
        queryFn: getVideoDirs,
        refetchInterval: 60_000,
        refetchOnWindowFocus: false,
    });

    // Reset isScreenSaved when navigating to non-video-detail routes
    useEffect(() => {
        // If we're not on a /videos/xxx route, ensure screensaver state is false
        if (!location.pathname.match(/^\/videos\/[^/]+$/)) {
            setIsScreenSaved(false);
        }
    }, [location.pathname, setIsScreenSaved]);

    const { data: screenSaverSec } = useQuery({ queryKey: queryKeys.screenSaver, queryFn: () => import('./api').then(m => m.getScreenSaverSeconds()), staleTime: 1000 * 60 });

    // Screensaver logic: navigate to random video if no user interaction after configured seconds
    useEffect(() => {
        if (videoDirs.length === 0 || isScreenSaved) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);

            const ms = (screenSaverSec ?? 60) * 1000;
            timeoutId = setTimeout(() => {
                const randomDir = videoDirs[Math.floor(Math.random() * videoDirs.length)];
                navigate({ to: `/videos/${randomDir}` });
            }, ms);
        };

        // Initialize timer
        resetTimer();

        // Listen for activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(name => document.addEventListener(name, resetTimer, true));

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(name => document.removeEventListener(name, resetTimer, true));
        };
    }, [isScreenSaved, navigate, videoDirs, screenSaverSec]);

    return null; // doesn't render anything visible
}

function ScreenSaver({ children }: { children: React.ReactNode }) {
    const [isScreenSaved, setIsScreenSaved] = useState(false);

    return (
        <SSContext value={[isScreenSaved, setIsScreenSaved]}>
            {children}
            <ScreenSaverInner />
        </SSContext >
    );
}

export default ScreenSaver;
