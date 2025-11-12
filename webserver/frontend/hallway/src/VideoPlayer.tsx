import { useEffect, useState, useRef, useContext, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ScreenSaverContext from './ScreenSaverContextValue';

interface VideoPlayerProps {
    dir: string;
    urls: string[];
    autoFullScreen: boolean;
}

function VideoPlayer({ dir, urls, autoFullScreen }: VideoPlayerProps) {
    const [curVideoUrl, setCurVideoUrl] = useState<string>();

    function getRandomElement(arr: string[]) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    useEffect(() => {
        const pickUrl = async () => {
            setCurVideoUrl(getRandomElement(urls)); // show only the latest 10
        };

        pickUrl();
        const interval = setInterval(pickUrl, 60000); // refresh every 60 seconds
        return () => clearInterval(interval);
    }, [urls]);

    const fileType = curVideoUrl ? curVideoUrl.split('.').pop() : 'gif';
    let content = <></>;
    if (fileType === 'gif') {
        content = <img src={curVideoUrl} />;
    } else if (fileType === 'mp4') {
        content = (
            <video
                src={curVideoUrl}
                autoPlay
                loop
                muted
                playsInline
            />
        );
    }


    return (
        <div className="video-thumbnail">
            <h1>{dir}</h1>
            <FullscreenComponent autoFullScreen={autoFullScreen}>
                {content}
            </FullscreenComponent>
        </div >
    );
}

interface FullscreenComponentProps {
    children: React.ReactNode;
    autoFullScreen: boolean;
}

function FullscreenComponent({ children, autoFullScreen }: FullscreenComponentProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isCssFullscreen, setIsCssFullscreen] = useState(false);
    const ctx = useContext(ScreenSaverContext);
    const setIsScreenSaved = useMemo(() => (ctx ? ctx.setIsScreenSaved : () => { }), [ctx]);
    const navigate = useNavigate();

    useEffect(() => {
        if (autoFullScreen) {
            // Use CSS fullscreen for immediate effect without user gesture
            setIsCssFullscreen(true);
            setIsScreenSaved(true);
        }
    }, [autoFullScreen, setIsScreenSaved]);

    // Hide cursor and scrollbar on body when in fullscreen
    useEffect(() => {
        if (isCssFullscreen) {
            // Use setTimeout to ensure styles are applied after React finishes rendering
            const timeoutId = setTimeout(() => {
                // Hide scrollbar
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';

                // Hide cursor on all elements
                const existingStyle = document.getElementById('fullscreen-hide-cursor');
                if (existingStyle) {
                    existingStyle.remove();
                }

                const styleElement = document.createElement('style');
                styleElement.id = 'fullscreen-hide-cursor';
                styleElement.innerHTML = '* { cursor: none !important; }';
                document.head.appendChild(styleElement);
            }, 0);

            return () => {
                clearTimeout(timeoutId);
            };
        } else {
            // Restore scrollbar
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';

            // Restore cursor
            const styleElement = document.getElementById('fullscreen-hide-cursor');
            if (styleElement) {
                styleElement.remove();
            }
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            const styleElement = document.getElementById('fullscreen-hide-cursor');
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, [isCssFullscreen]);

    const toggleFullscreen = () => {
        if (!elementRef.current) return;

        // Toggle CSS fullscreen and navigate back to videos
        if (isCssFullscreen) {
            setIsCssFullscreen(false);
            setIsScreenSaved(false);
            navigate({ to: '/videos' });
        }
    };

    return (
        <div
            ref={elementRef}
            className={`fullscreen-root ${isCssFullscreen ? 'css-fullscreen' : 'fullscreen-thumb'}`}
            onClick={toggleFullscreen}
            style={{
                cursor: isCssFullscreen ? 'none' : 'pointer',
                position: isCssFullscreen ? 'fixed' : 'relative',
                top: isCssFullscreen ? 0 : 'auto',
                left: isCssFullscreen ? 0 : 'auto',
                width: isCssFullscreen ? '100vw' : 'auto',
                height: isCssFullscreen ? '100vh' : 'auto',
                zIndex: isCssFullscreen ? 9999 : 'auto',
                backgroundColor: isCssFullscreen ? 'black' : 'transparent',
                display: isCssFullscreen ? 'flex' : 'block',
                alignItems: isCssFullscreen ? 'center' : 'normal',
                justifyContent: isCssFullscreen ? 'center' : 'normal',
                overflow: isCssFullscreen ? 'hidden' : 'visible',
            }}
        >
            {children}
        </div>
    );
}



export default VideoPlayer;
