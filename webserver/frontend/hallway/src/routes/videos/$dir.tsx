import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import VideoPlayer from '../../VideoPlayer';

export const Route = createFileRoute<{ dir: string }>('/videos/$dir')({
    component: VideoPage,
    loader: async ({ params }: any) => {
        // Fetch video list (don't call React hooks inside loaders). Normalize URLs like parent.
        const res = await axios.get('/api/videos', { withCredentials: true });
        const data = res.data as Record<string, string[]>;
        const normalizedEntries = Object.entries(data).map(([dir, urls]) => {
            const fixed = Array.isArray(urls)
                ? urls.map((u) => (u.startsWith('/') ? u : `/${u}`))
                : [];
            return [dir, fixed] as [string, string[]];
        });
        const dir2videoUrls = new Map<string, string[]>(normalizedEntries);
        const dirParam = params?.dir as string;
        const urls = dir2videoUrls.get(dirParam) || [];
        return { dir: dirParam, urls };
    },
});

function VideoPage() {
    const { dir, urls } = Route.useLoaderData();

    if (!urls.length) return <div>No videos found for {dir}</div>;
    // <div className="video-fullscreen">
    return (
        <div>
            <VideoPlayer key={dir} dir={dir} urls={urls} autoFullScreen={true} />
        </div>
    );
}
