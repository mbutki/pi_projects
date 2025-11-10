import { createFileRoute, Link } from '@tanstack/react-router';
import VideoPlayer from '../../VideoPlayer';
//import VideosGrid from '../../VideosGrid';
import axios from 'axios';

export const Route = createFileRoute('/videos')({
    component: Videos,
    loader: async ({ params }) => {
        try {
            const response = await axios.get('/api/videos', { withCredentials: true });
            return new Map(Object.entries(response.data));
        } catch (err) {
            console.error('Failed to fetch video list', err)
            throw new Error('Failed to fetch video list')
        }
    },
})

function Videos() {
    const dir2videoUrls = Route.useLoaderData(); // assume a Map or object

    const entries = dir2videoUrls instanceof Map
        ? [...dir2videoUrls.entries()]
        : Object.entries(dir2videoUrls);

    return (
        <div className="video-grid">
            {entries.map(([dir, urls]) => (
                <VideoPlayer key={dir} dir={dir} urls={urls} />
            ))}
        </div>
    );
}

/*export const Route = createFileRoute('/videos')({
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
                    <VideoPlayer key={dir} dir={dir} urls={urls} />
                </Link>
            ))}
        </div>
    );
}*/

