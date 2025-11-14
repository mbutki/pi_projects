import axios from 'axios';

// API result types
export interface ErrorEntry {
    timestamp?: number | null;
    location?: string | null;
    error?: string | null;
}

export interface LatestRow {
    location: string;
    temp?: number | null;
    humidity?: number | null;
    pressure?: number | null;
    lux?: number | null;
    aqi?: number | null;
    timestamp: number;
}

export interface MedianRow {
    location: string;
    end_ts: number;
    temp?: number | null;
    humidity?: number | null;
    pressure?: number | null;
    lux?: number | null;
    aqi?: number | null;
}

// Videos endpoint returns a mapping of directory -> array of absolute URLs
export type VideosMap = Record<string, string[]>;

export async function getVideos(): Promise<VideosMap> {
    const res = await axios.get('/api/videos', { withCredentials: true });
    return res.data as VideosMap;
}

export async function getVideoDirs(): Promise<string[]> {
    const data = await getVideos();
    return Object.keys(data);
}

export async function getVideosForDir(dir: string): Promise<string[]> {
    const data = await getVideos();
    return (data[dir] ?? []) as string[];
}

export async function getErrors(): Promise<ErrorEntry[]> {
    const res = await axios.get('/api/errors', { withCredentials: true });
    return res.data as ErrorEntry[];
}

export async function getLatest(): Promise<LatestRow[]> {
    const res = await axios.get('/api/latest', { withCredentials: true });
    return res.data as LatestRow[];
}

export async function getMedians(): Promise<MedianRow[]> {
    const res = await axios.get('/api/5min-median', { withCredentials: true });
    return res.data as MedianRow[];
}

// Settings API
export type Settings = Record<string, unknown>;

export async function getSettings(): Promise<Settings> {
    const res = await axios.get('/api/settings', { withCredentials: true });
    return res.data as Settings;
}

export async function setSettings(newSettings: Settings): Promise<Settings> {
    const res = await axios.post('/api/settings', newSettings, { withCredentials: true });
    return res.data as Settings;
}

export async function getVideoLoopSeconds(): Promise<number> {
    const settings = await getSettings();
    // Prefer the explicit `videoLoopSeconds` key from the server.
    const raw = settings.videoLoopSeconds;
    const n = Number(raw ?? 60);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 60;
}

export async function setVideoLoopSeconds(seconds: number): Promise<number> {
    // Post the canonical key name `videoLoopSeconds` to the server.
    const updated = await setSettings({ videoLoopSeconds: seconds });
    const raw = updated.videoLoopSeconds;
    const n = Number(raw ?? seconds);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : seconds;
}

export async function getScreenSaverSeconds(): Promise<number> {
    const settings = await getSettings();
    const raw = settings.screenSaverSeconds;
    const n = Number(raw ?? 60);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 60;
}

export async function setScreenSaverSeconds(seconds: number): Promise<number> {
    const updated = await setSettings({ screenSaverSeconds: seconds });
    const raw = updated.screenSaverSeconds;
    const n = Number(raw ?? seconds);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : seconds;
}

export default {
    getVideos,
    getVideoDirs,
    getVideosForDir,
    getErrors,
    getLatest,
    getMedians,
    getSettings,
    setSettings,
    getVideoLoopSeconds,
    setVideoLoopSeconds,
    getScreenSaverSeconds,
    setScreenSaverSeconds,
};
