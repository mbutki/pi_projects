import { useState, type ReactNode, type FC } from 'react';
import { ScreenSaverContext } from './ScreenSaverContextValue';

export const ScreenSaverProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isScreenSaved, setIsScreenSaved] = useState(false);

    return (
        <ScreenSaverContext.Provider value={{ isScreenSaved, setIsScreenSaved }}>
            {children}
        </ScreenSaverContext.Provider>
    );
};
