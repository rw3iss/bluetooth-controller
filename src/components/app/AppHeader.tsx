import Component from 'lib/Component';
import EventService from 'lib/EventService';
import { v } from 'lib/h.js';

export default class AppHeader extends Component {

    constructor() {
        super();
        this.setState({ route: 'test2' });
        EventService.subscribe('route-change', this.onRouteChange);
    }

    onRouteChange = (e) => {
        console.log(`ROUTE CHANGE`, e)
        this.setState({ route: e.target.route });
    }

    render() {
        return (
            <div class="app-header">

                APP HEADER
                <br />
                {this.state.route}

            </div>
        );
    }

}