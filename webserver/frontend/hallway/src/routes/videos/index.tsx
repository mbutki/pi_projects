import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import VideoPlayer from '../../VideoPlayer';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

type DirMap = Map<string, string[]>;

const fetchVideos = async (): Promise<DirMap> => {
    const res = await axios.get('/api/videos', { withCredentials: true });
    const data = res.data as Record<string, string[]>;
    const entries = Object.entries(data).map(([dir, urls]) => [dir, urls as string[]] as [string, string[]]);
    return new Map<string, string[]>(entries);
};

const VideosGrid: React.FC = () => {
    const { data: dir2videoUrls, isLoading, error } = useQuery<DirMap, unknown>({
        queryKey: ['videos'],
        queryFn: fetchVideos,
    });

    if (isLoading) return <div>Loading videos…</div>;
    if (error) return <div>Failed to load videos</div>;

    const entries = dir2videoUrls ? Array.from(dir2videoUrls.entries()) as [string, string[]][] : [];

    return (
        <div className="video-grid">
            {entries.map(([dir, urls]) => (
                <Link key={dir} to={("/videos/" + dir) as unknown as string}>
                    <VideoPlayer dir={dir} urls={urls} autoFullScreen={false} />
                </Link>
            ))}
        </div>
    );
}

// Export the file-based Route after the component declaration so VideosGrid is defined.
export const Route = createFileRoute('/videos/')({
    component: VideosGrid,
});

export default VideosGrid;

