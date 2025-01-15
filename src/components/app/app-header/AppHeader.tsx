import Link from 'components/basic/link/Link';
import { useRoute } from 'lib/hooks';
import './AppHeader.scss';

const AppHeader = (props = {}) => {

    const { route } = useRoute();
    // constructor() {
    //     super();
    //     this.setState({ route: 'test2' });
    //     EventService.subscribe('route-change', this.onRouteChange);
    // }

    // onRouteChange = (e) => {
    //     console.log(`ROUTE CHANGE`, e)
    //     this.setState({ route: e.target.route });
    // }

    function routeClass(r) {
        return route == r ? 'active' : '';
    }

    return (
        <header class="app-header">
            <Link to="/" class={routeClass('/')}>Rrroast</Link>
            <Link to="/roast" class="">Roast</Link>
            <Link to="/profiles" class="">Profiles</Link>
            <Link to="/history" class="">History</Link>
            <Link to="/config" class="">Config</Link>
            ROUTE: {route}
        </header>
    );

}

export default AppHeader;