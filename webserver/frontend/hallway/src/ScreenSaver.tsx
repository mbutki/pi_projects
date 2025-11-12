import { useContext, useEffect, useState } from "react";
import { ScreenSaverProvider } from "./ScreenSaverContext";
import ScreenSaverContext from './ScreenSaverContextValue';
import { useNavigate, useLocation } from "@tanstack/react-router";
import axios from "axios";

function ScreenSaverInner() {
    const ctx = useContext(ScreenSaverContext);
    if (!ctx) throw new Error('ScreenSaverContext must be used within a ScreenSaverProvider');
    const { isScreenSaved, setIsScreenSaved } = ctx;
    const navigate = useNavigate();
    const location = useLocation();
    const [videoDirs, setVideoDirs] = useState<string[]>([]);

    // Fetch available video directories on mount
    useEffect(() => {
        const fetchVideoDirs = async () => {
            try {
                const res = await axios.get('/api/videos', { withCredentials: true });
                const data = res.data as Record<string, string[]>;
                const dirs = Object.keys(data);
                setVideoDirs(dirs);
            } catch (err) {
                console.error('Failed to fetch video directories', err);
            }
        };

        fetchVideoDirs();
    }, []);

    // Reset isScreenSaved when navigating to non-video-detail routes
    useEffect(() => {
        // If we're not on a /videos/xxx route, ensure screensaver state is false
        if (!location.pathname.match(/^\/videos\/[^/]+$/)) {
            setIsScreenSaved(false);
        }
    }, [location.pathname, setIsScreenSaved]);

    // Screensaver logic: navigate to random video if no fullscreen for 10 seconds
    useEffect(() => {
        if (videoDirs.length === 0) return; // Wait until we have video directories

        const saveScreen = () => {
            if (!isScreenSaved) {
                // Pick a random directory
                const randomDir = videoDirs[Math.floor(Math.random() * videoDirs.length)];
                navigate({ to: `/videos/${randomDir}` });
            }
        };

        // Check every 10 seconds
        const interval = setInterval(saveScreen, 10000);
        return () => clearInterval(interval);
    }, [isScreenSaved, navigate, videoDirs]);

    return null; // doesn't render anything visible
}

function ScreenSaver({ children }: { children: React.ReactNode }) {
    return (
        <ScreenSaverProvider>
            {children}
            <ScreenSaverInner />
        </ScreenSaverProvider>
    );
}

export default ScreenSaver;
