import { routes } from 'config/routes';
import { useRoute } from 'lib/hooks';
import { router } from 'lib/Router';
import { useEffect } from 'preact/hooks';

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