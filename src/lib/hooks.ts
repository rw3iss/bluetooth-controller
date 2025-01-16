import EventService from 'lib/EventService';
import { useEffect, useState } from 'preact/hooks';
import { IDB } from './stores/IDB/IDB';

export function useRoute() {
    const [route, setRoute] = useState(undefined);
    const [routeParams, setRouteParams] = useState(undefined);

    useEffect(() => {
        function handleRouteChange(e) {
            setRoute(e.target.route);
            setRouteParams(e.target.params);
        }

        EventService.subscribe('route-change', handleRouteChange);
        return () => {
            EventService.unsubscribe('route-change', handleRouteChange);
        };
    });

    return { route, routeParams };
}

// todo: should be data wrapper, not IDB specific
export function useDatabase(name?) {
    // todo: can useEffect to wait for IDB to be ready and DB created?
    const db = name ? IDB.getDb(name) : IDB.getDefaultDb();
    return [db];
}

export function useSavedState(id, def) {
    this.store = undefined;
    this.id = id;

    const [state, setState] = useState(def);
    const [db] = useDatabase();

    useEffect(() => {
        if (db && !this.store) this.store = db.getStoreOrCreate(`saved-states`);
        (async function () {
            if (this.store) {
                console.log(`getting saved state`, this.id, this.store)
                const s = await this.store.get(this.id);
                console.log(`state`, s)
                if (s) setState(s);
            }
        })();
    }, [db]);

    // if a new state is provided, it will also set the new viewState
    async function saveState(newState?) {
        console.log(`saveState`, newState)
        // todo: should set after useEffect change if flagged?
        if (newState) setState(newState);
        if (this.store) await this.store.set(this.id, newState || state);
    }

    return { state, setState, saveState };
}