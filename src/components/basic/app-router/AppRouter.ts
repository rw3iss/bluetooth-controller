import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import Router from 'routes';

const routes = {
    "/": (r) => `<page-home/>`,
    "/settings": (r) => `<page-settings/>`,
    "/device/:id": (r) => `<page-device id="${r.params.id}"/>`
};

class Rrr {
    router = undefined;
    onChangeCallback = undefined;
    route = undefined;

    constructor(onChangeCallback) {
        this.onChangeCallback = onChangeCallback;
        this.router = Router();
        this.loadRoutes();
    }

    public navigate = (url) => {
        console.log(`navigate`, url);
    }

    private loadRoutes = () => {
        if (this.router) {
            Object.keys(routes).forEach(r => this.router.addRoute(r, this.onRouteChange));
        }
    }

    // load the given (already changed) url route
    private loadRoute = (url) => {
        let r = this.router.match(url);
        if (r) {
            console.log(`loadRoute`, url, r);
            r.fn(r);
        } else {
            //
        }
    }

    // auto-change handler from url change.
    onRouteChange = (r) => {
        console.log(`onRouteChange`, r)

        let r = this.router.match(url);
        if (r) {
            console.log(`loadRoute`, url, r);
            r.fn(r);
        } else {
            //
        }

        this.route = r.route;
        this.component = routes[r.route](r);
    }
}

export class AppRouter extends LitElement {

    router: Router = undefined;

    @property({ type: String }) route = '/';

    component: string | undefined = undefined;

    connectedCallback() {
        super.connectedCallback()

        this.router = new Rrr(this.onRouteChange);
        console.log(`AppRouter connected`, location.pathname, this.router.routes);
        this.router.loadRoute(location.pathname);
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    // auto-change handler from url change.
    onRouteChange = (r) => {
        console.log(`onRouteChange`, r)
        this.route = r.route;
        this.component = routes[r.route](r);
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.component || "Not found"}
      `;
    }
}
