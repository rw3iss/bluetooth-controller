import Link from 'components/basic/link/Link';
import { useRoute } from 'lib/hooks/useRoute.js';
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

    function routeClass(r, other?) {
        return (route == r ? 'active' : '') + (other ? ` ${other}` : '');
    }

    return (
        <header class="app-header">
            <Link to="/roast" className={routeClass('/roast', 'logo')}>
                <img src="/public/images/bean_logo.png" />
                <span class="name">Rrroast</span>
            </Link>
            <Link to="/profiles" className={routeClass('/profiles')}>Profiles</Link>
            <Link to="/history" className={routeClass('/history')}>History</Link>
            <Link to="/config" className={routeClass('/config')}>Config</Link>
            {/* <div className="last">&nbsp;</div> */}
        </header>
    );

}

export default AppHeader;