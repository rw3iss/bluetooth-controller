import EventService from 'lib/EventService';
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
