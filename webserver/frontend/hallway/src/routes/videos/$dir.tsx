import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import VideoPlayer from '../../VideoPlayer';
import { useQuery } from '@tanstack/react-query';
import { getVideosForDir } from '../../api';
import { queryKeys } from '../../queryKeys';

const VideoPage: React.FC = () => {
    // Derive the dir param from the current pathname to avoid tight coupling to router internals
    const dir = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() ?? '' : '';

    const { data: urls = [] } = useQuery<string[]>({
        queryKey: queryKeys.videosFor(dir),
        queryFn: () => getVideosForDir(dir),
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
