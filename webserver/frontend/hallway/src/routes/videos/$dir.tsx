import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import VideoPlayer from '../../VideoPlayer';

interface VideoPageLoaderData {
    dir: string;
    urls: string[];
}

const VideoPage: React.FC = () => {
    const { dir, urls } = Route.useLoaderData() as VideoPageLoaderData;

    if (!urls.length) return <div>No videos found for {dir}</div>;
    return (
        <div>
            <VideoPlayer dir={dir} urls={urls} autoFullScreen={true} />
        </div>
    );
}

export const Route = createFileRoute('/videos/$dir')({
    component: VideoPage,
    loader: async ({ params }: any): Promise<VideoPageLoaderData> => {
        // Server returns absolute URLs, so use them directly.
        const res = await axios.get('/api/videos', { withCredentials: true });
        const data = res.data as Record<string, string[]>;
        const dirParam = params?.dir as string;
        const urls = (data[dirParam] ?? []) as string[];
        return { dir: dirParam, urls };
    },
});

export default VideoPage;
