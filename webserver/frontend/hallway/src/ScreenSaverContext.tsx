import { createContext, useState } from "react";

export const ScreenSaverContext = createContext({
    isScreenSaved: false,
    setIsScreenSaved: (_value: boolean) => { },
});

export const ScreenSaverProvider = ({ children }: { children: React.ReactNode }) => {
    const [isScreenSaved, setIsScreenSaved] = useState(false);

    return (
        <ScreenSaverContext.Provider value={{ isScreenSaved, setIsScreenSaved }}>
            {children}
        </ScreenSaverContext.Provider>
    )
}
