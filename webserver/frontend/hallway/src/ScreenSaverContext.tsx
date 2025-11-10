import { createContext, useState } from "react";

export const ScreenSaverContext = createContext({
    isScreenSaved: false,
    setIsScreenSaved: () => { },
});

export const ScreenSaverProvider = ({ children }) => {
    const [isScreenSaved, setIsScreenSaved] = useState(false);

    return (
        <ScreenSaverContext.Provider value={{ isScreenSaved, setIsScreenSaved }}>
            {children}
        </ScreenSaverContext.Provider>
    )
}
