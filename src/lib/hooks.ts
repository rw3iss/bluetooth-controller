import EventService from 'lib/EventService';
import IDbOrCacheStore from 'lib/stores/IDbOrCacheStore';
import { useEffect, useState } from 'preact/hooks';

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

// export function useViewState(id, def) {
//     this.id = id;

//     const [viewState, setViewState] = useState(def);

//     // todo: react to IDB dep?
//     useEffect(() => {
//         if (!this.store) this.store = new IDbOrCacheStore(`view-state`);

//         (async function () {
//             const s = await this.store.get(this.id);
//             if (s) setViewState(s);
//         })();
//     }, []);

//     // if a new state is provided, it will also set the new viewState
//     async function saveViewState(newState?) {
//         // todo: should set after useEffect change if flagged?
//         if (newState) setViewState(newState);
//         await this.store.set(this.id, newState || viewState);
//     }

//     return { viewState, setViewState, saveViewState };
// }

export function useSavedState(id, def) {
    this.id = id;

    const [state, setState] = useState(def);

    // todo: react to IDB dep?
    useEffect(() => {
        if (!this.store) this.store = new IDbOrCacheStore(`saved-states`);

        (async function () {
            const s = await this.store.get(this.id);
            if (s) setState(s);
        })();
    }, []);

    // if a new state is provided, it will also set the new viewState
    async function saveState(newState?) {
        // todo: should set after useEffect change if flagged?
        if (newState) setState(newState);
        await this.store.set(this.id, newState || state);
    }

    return { state, setState, saveState };
}