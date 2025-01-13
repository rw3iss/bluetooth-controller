
export class AppContext {

    public route = undefined;

}


import { createContext } from '@lit/context';
export const appContext = createContext<AppContext>('app');