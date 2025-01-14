import { routes } from 'app/config/routes.js';
import { router } from 'components/app/App';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

// subscribes to the global router and renders the current route output
export class RouteContext extends LitElement {

    @property({ type: String }) route = '/';

    // rendered route action/component
    component: string | undefined = undefined;

    connectedCallback() {
        super.connectedCallback()

        if (router) { // global router
            router.setRouteChangedCallback(this.onRouteChanged);
            router.navigate(location.pathname);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    // auto-change handler from url change.
    onRouteChanged = (r) => {
        //console.log(`onRouteChanged`, r)
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
