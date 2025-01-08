import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import Router from 'routes';

const routes = {
    "/": (r) => `<page-home/>`,
    "/settings": (r) => `<page-settings/>`,
    "/device/:id": (r) => `<page-device id="${r.params.id}"/>`,
    "/page-not-found": (r) => `<page-not-found/>`,
};

class Rrr {

    router: Router | undefined = undefined;
    onChangeCallback: ((r) => void) | undefined = undefined;
    route = undefined;

    constructor(onChangeCallback?) {
        if (onChangeCallback) this.onChangeCallback = onChangeCallback;
        this.router = Router();
        this.loadRoutes();

        window.addEventListener("popstate", (e) => {
            console.log(`pop state`, e.state)
            if (e.state?.url) {
                this.loadRoute(e.state?.url);
            }
        });
    }

    public setRouteChangedCallback = (cb) => {
        this.onChangeCallback = cb;
    }

    public navigate = (url) => {
        console.log(`navigate`, url);
        if (!this.loadRoute(url) && url != '/page-not-found') {
            this.navigate('/page-not-found');
        } else {
            window.history.pushState({ url }, "", url);
        }
    }

    private loadRoutes = () => {
        if (this.router) {
            Object.keys(routes).forEach(r => this.router.addRoute(r, this.onRouteChange));
        }
    }

    // load the given (already changed) url route
    public loadRoute = (url) => {
        let r = this.router.match(url);
        if (r) {
            r.fn(r);
            return true;
        } else {
            return false;
        }
        // if (r) {
        //     console.log(`loadRoute`, url, r);
        //     r.fn(r);
        //     return true;
        // } else {
        //     return false;
        // }
    }

    // auto-change handler from url change.
    onRouteChange = (r) => {
        console.log(`onRouteChange`, r)
        this.route = r.route;
        if (this.onChangeCallback) this.onChangeCallback(r.route, r);
    }
}

// global router instance that any component can use, that is tied to the web component AppRouter below.
export const router = new Rrr();

export class AppRouter extends LitElement {

    router: Router = undefined;

    @property({ type: String }) route = '/';

    component: string | undefined = undefined;

    connectedCallback() {
        super.connectedCallback()

        if (router) {
            router.setRouteChangedCallback(this.onRouteChanged);
            console.log(`AppRouter connected`, location.pathname);
            router.navigate(location.pathname);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    // auto-change handler from url change.
    onRouteChanged = (url, r) => {
        console.log(`onRouteChanged`, url, r)
        if (r?.route && routes[r.route]) {
            this.route = r.route;
            this.component = routes[r.route]();
        } else {
            this.component = undefined;
            //this.component = "<span>Not Found</span>";
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.component}
      `;
    }
}
