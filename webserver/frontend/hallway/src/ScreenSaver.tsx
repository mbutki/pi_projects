import { useContext, useEffect, useState } from "react";
import { ScreenSaverProvider, ScreenSaverContext } from "./ScreenSaverContext";
import { useNavigate } from "@tanstack/react-router";
import axios from "axios";

function ScreenSaverInner() {
    const { isScreenSaved } = useContext(ScreenSaverContext);
    const navigate = useNavigate();
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
