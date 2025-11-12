import React from 'react';

export interface ScreenSaverContextType {
    isScreenSaved: boolean;
    setIsScreenSaved: (value: boolean) => void;
}

// Context value is exported from a file that doesn't export components so fast-refresh rules are happy
export const ScreenSaverContext = React.createContext<ScreenSaverContextType | undefined>(undefined);

export default ScreenSaverContext;
