import { useEffect, useState, useRef, useContext } from 'react';
import { ScreenSaverContext } from './ScreenSaverContext';

function VideoPlayer({ dir, urls }) {
    const [curVideoUrl, setCurVideoUrl] = useState();

    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    useEffect(() => {
        const pickUrl = async () => {
            setCurVideoUrl(getRandomElement(urls)); // show only the latest 10
        };

        pickUrl();
        const interval = setInterval(pickUrl, 5000); // refresh every 5 seconds
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
                type="video/mp4"
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
            <FullscreenComponent>
                {content}
            </FullscreenComponent>
        </div >
    );
}

function FullscreenComponent({ children }) {
    const elementRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { isScreenSaved, setIsScreenSaved } = useContext(ScreenSaverContext);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isFull = document.fullscreenElement === elementRef.current;
            setIsFullscreen(isFull);
            setIsScreenSaved(isFull);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        if (!elementRef.current) return;

        if (document.fullscreenElement === elementRef.current) {
            await document.exitFullscreen();
        } else {
            try {
                await elementRef.current.requestFullscreen();
            } catch (err) {
                console.warn('Fullscreen request failed (needs user gesture):', err);
            }
        }
    };

    return (
        <div
            ref={elementRef}
            className={`fullscreen-root ${isFullscreen ? 'fullscreen-active' : 'fullscreen-thumb'}`}
            onClick={toggleFullscreen}
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            {children}
        </div>
    );
}



export default VideoPlayer;
