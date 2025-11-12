import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import VideoPlayer from '../../VideoPlayer';
import axios from 'axios';

type DirMap = Map<string, string[]>;



const VideosGrid: React.FC = () => {
    // Use the module-scoped Route which we will export below. Cast to the expected map type.
    const dir2videoUrls = (Route.useLoaderData as unknown as () => DirMap)();
    const entries = [...dir2videoUrls.entries()] as [string, string[]][];

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
    loader: async (): Promise<DirMap> => {
        const res = await axios.get('/api/videos', { withCredentials: true });
        const data = res.data as Record<string, string[]>;
        const entries = Object.entries(data).map(([dir, urls]) => [dir, urls as string[]] as [string, string[]]);
        return new Map<string, string[]>(entries);
    },
});

export default VideosGrid;

