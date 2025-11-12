import React, { useState } from 'react';
import { ScreenSaverContext } from './ScreenSaverContextValue';

export const ScreenSaverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isScreenSaved, setIsScreenSaved] = useState(false);

    return (
        <ScreenSaverContext.Provider value={{ isScreenSaved, setIsScreenSaved }}>
            {children}
        </ScreenSaverContext.Provider>
    );
};
