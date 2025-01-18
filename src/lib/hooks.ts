import EventService from 'lib/EventService';
import { useEffect, useState } from 'preact/hooks';
import { IDB } from './stores/IDB/IDB';
import { IndexedDBManager } from './stores/IDB/IndexedDBManager';

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

// export function useStore(id, dbName?) {
//     const db = IndexedDBManager.getDefaultDb();
//     console.log(`use store`, id, dbName, db, db.getStore(id));
//     if (db) return db.getStore(id);
//     return undefined;
// };

type IDbStateWrapper = {
    id: string,
    state: {}
}
const STATE_STORE = 'saved-states';
/**
 * Manages storing and retrieving saved data to IndexedDB for arbitrary components.
 * @param id The id for the saved state.
 * @param def The default state prior to loading any from the DB.
 * @param waitFor Prevent setting the state to default immediately,
 * and instead wait to try and load the stored data.
 * If no data is found the default is set.
 * @returns The current stored state, and a setter to persist a new state to the DB.
 */
export function useSavedState(id: string, def: {}, waitFor = true) {
    const [state, setState] = useState(waitFor ? undefined : def);

    // load saved state on mount, or otherwise set the default state
    useEffect(() => {
        //console.log(`useSavedState effect`, id);
        (async function () {
            const db = IndexedDBManager.getDefaultDb();
            if (db) {
                const s: IDbStateWrapper | undefined = await db.get(STATE_STORE, id);
                setState(s ? s.state : def);
            } else {
                console.error(`no db in useSavedState get?`)
            }
        })();
    }, []);

    // when state changes, save to db
    useEffect(() => {
        async function save() {
            const db = IndexedDBManager.getDefaultDb();
            if (db) {
                if (state) { // must do this so default undefined state does not trigger
                    //console.log(`useSavedState changed`, id, state);
                    const stateWrapper: IDbStateWrapper = { id, state };
                    await db.put(STATE_STORE, stateWrapper);
                }
            } else {
                console.error(`no db in useSavedState put?`)
            }
        }
        save();
    }, [state]);

    return { state, setState };
}