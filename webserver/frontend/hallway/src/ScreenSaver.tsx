import { useContext, useEffect } from "react";
import { ScreenSaverProvider, ScreenSaverContext } from "./ScreenSaverContext";
import { useNavigate } from "@tanstack/react-router";

function ScreenSaverInner() {
    const { isScreenSaved } = useContext(ScreenSaverContext);
    const navigate = useNavigate();

    /*useEffect(() => {
        const saveScreen = () => {
            if (!isScreenSaved) {
                navigate({ to: '/videos' });
            }
        };

        // Initial check + repeat every 10s
        saveScreen();
        const interval = setInterval(saveScreen, 10000);
        return () => clearInterval(interval);
    }, [isScreenSaved, navigate]);*/

    return null; // doesn’t render anything visible
}

function ScreenSaver({ children }) {
    return (
        <ScreenSaverProvider>
            {children}
            <ScreenSaverInner />
        </ScreenSaverProvider>
    );
}

export default ScreenSaver;
