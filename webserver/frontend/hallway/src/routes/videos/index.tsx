import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import VideoPlayer from '../../VideoPlayer';
import { useQuery } from '@tanstack/react-query';
import { getVideos } from '../../api';
import { queryKeys } from '../../queryKeys';

const VideosGrid: React.FC = () => {
    const { data: dataMap, isLoading, error } = useQuery({ queryKey: queryKeys.videos, queryFn: getVideos });
    const dir2videoUrls = dataMap ? new Map<string, string[]>(Object.entries(dataMap)) : new Map<string, string[]>();

    if (isLoading) return <div>Loading videos…</div>;
    if (error) return <div>Failed to load videos</div>;

    const entries = Array.from(dir2videoUrls.entries()) as [string, string[]][];

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

