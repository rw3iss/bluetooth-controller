import { createContext } from '@lit/context';

export class AppContext {

    constructor() {
    }

}

export const appContext = createContext<AppContext>('app');
