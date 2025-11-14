// Centralized react-query keys

export const queryKeys = {
    videos: ['videos'] as const,
    videoDirs: ['videoDirs'] as const,
    videosFor: (dir: string) => ['videos', dir] as const,
    errors: ['errors'] as const,
    latest: ['latest'] as const,
    medians: ['medians'] as const,
} as const;

export type QueryKey = readonly unknown[];

export default queryKeys;
