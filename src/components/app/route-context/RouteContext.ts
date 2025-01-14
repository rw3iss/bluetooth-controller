import { routes } from 'app/config/routes.js';
import EventService from 'lib/EventService';
import { router } from 'lib/Router';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

// subscribes to the global router and renders the current route output
export class RouteContext extends LitElement {

    @property({ type: String }) route = '';

    // rendered route action/component
    component: string | undefined = undefined;

    connectedCallback() {
        super.connectedCallback()
        EventService.subscribe('route-change', this.onRouteChange);

        // route app to the initial url
        if (router) router.navigate(this.route || location.pathname);
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        EventService.unsubscribe('route-change', this.onRouteChange);
    }

    // auto-change handler from url change.
    onRouteChange = (e) => {
        const r = e.target;
        //console.log(`onRouteChange`, r)
        if (r?.route && routes[r.route]) {
            this.route = r.route;
            this.component = routes[r.route](r);
        } else {
            this.component = undefined;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.component}
      `;
    }
}
