import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import VideoPlayer from '../../VideoPlayer';
import { useQuery } from '@tanstack/react-query';

const VideoPage: React.FC = () => {
    // Derive the dir param from the current pathname to avoid tight coupling to router internals
    const dir = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() ?? '' : '';

    const fetchVideos = async (): Promise<string[]> => {
        const res = await axios.get('/api/videos', { withCredentials: true });
        const data = res.data as Record<string, string[]>;
        return (data[dir] ?? []) as string[];
    };

    const { data: urls = [] } = useQuery<string[]>({
        queryKey: ['videos', dir],
        queryFn: fetchVideos,
        refetchOnWindowFocus: false,
    });

    if (!urls.length) return <div>No videos found for {dir}</div>;
    return (
        <div>
            <VideoPlayer dir={dir} urls={urls} autoFullScreen={true} />
        </div>
    );
}

export const Route = createFileRoute('/videos/$dir')({
    component: VideoPage,
});

export default VideoPage;
