import EventService from 'lib/EventService';
import { useEffect, useState } from 'preact/hooks';
import { IDB } from './stores/IDB/IDB';
import IDbStore from './stores/IDB/IDbStore';

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
    const [db, setDb] = useState(name ? IDB.getDb(name) : IDB.getDefaultDb());

    useEffect(() => {
        if (!db) {
            const _db = IDB.getDb(name ? IDB.getDb(name) : IDB.getDefaultDb());
            if (_db) setDb(_db);
        }
        console.log(`db?`, db)
    }, []);

    return [db];
}

export function useStore(db, id) {
    let store;
    if (db) {
        // todo: use anon AI, ie. db.getStore('');s
        store = new IDbStore(db, id);
    }
    return store;
};

export async function useSavedState(id, def) {
    const [db] = useDatabase();
    const store = useStore(db, id);
    const [state, setState] = useState(store.get(id) || def);

    // load saved state on mount
    useEffect(() => {
        if (db && store) {
            //setStore(new IDbStore(db, 'saved-states'));
            console.log(`store before state?`, store, store.get(id));
            (async function () {
                const s = await store.get(id);
                if (s) setState(s);
            })();
        } else {
            console.log(`no db or store?`)
        }
    }, []);

    // when state changes, save to db
    useEffect(() => {
        async function save() {
            console.log(`state changed`, id, store, state);
            if (store) {
                store.set(id, state);
                console.log(`test:`, store.get(id))
            } else {
                console.log(`no store for save?`, id)
            }
        }
        save();
    }, [state]);

    return { state, setState };
}