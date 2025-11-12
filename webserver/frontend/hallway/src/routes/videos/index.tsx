import { createFileRoute, Link } from '@tanstack/react-router';
import VideoPlayer from '../../VideoPlayer';
import axios from 'axios';

export const Route = createFileRoute('/videos/')({
    component: VideosGrid, // reference the component right below
    loader: async () => {
        const res = await axios.get('/api/videos', { withCredentials: true });
        const data = res.data as Record<string, string[]>;
        const normalizedEntries = Object.entries(data).map(([dir, urls]) => {
            const fixed = Array.isArray(urls) ? urls.map(u => (u.startsWith('/') ? u : `/${u}`)) : [];
            return [dir, fixed] as [string, string[]];
        });
        return new Map<string, string[]>(normalizedEntries);
    },
});

export default function VideosGrid() {
    const dir2videoUrls = Route.useLoaderData();
    const entries = [...dir2videoUrls.entries()];

    return (
        <div className="video-grid">
            {entries.map(([dir, urls]) => (
                <Link key={dir} to={`/videos/${dir}`}>
                    <VideoPlayer key={dir} dir={dir} urls={urls} autoFullScreen={false} />
                </Link>
            ))}
        </div>
    );
}

