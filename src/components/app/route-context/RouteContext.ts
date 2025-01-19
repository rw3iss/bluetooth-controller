import { routes } from 'config/routes';
import { router } from 'lib/Router';
import { useEffect } from 'preact/hooks';
import { useRoute } from 'lib/hooks/useRoute.js';

export function RouteContext() {

    const { route, routeParams } = useRoute();

    // tell the router to try to load the initial url
    useEffect(() => {
        if (!router.route) router.navigate(location.pathname);
    }, []);

    return (
        route ? (
            typeof routes[route] != 'undefined' ? routes[route](routeParams) : "Not found.") : ''
    )
}