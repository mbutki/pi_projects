// VideosDataContext.tsx
import { createContext, useContext } from 'react';

export const VideosDataContext = createContext<Map<string, string[]> | null>(null);

export const useVideosData = () => {
    const context = useContext(VideosDataContext);
    if (!context) {
        throw new Error('useVideosData must be used within a VideosDataProvider');
    }
    return context;
};
