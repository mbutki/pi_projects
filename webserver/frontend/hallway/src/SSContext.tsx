import { createContext, type Dispatch, type SetStateAction } from 'react';

const SSContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>([false, () => { }]);

export default SSContext;