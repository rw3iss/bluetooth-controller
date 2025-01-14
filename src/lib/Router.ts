import { routes } from 'app/config/routes.js';
import EventService from 'lib/EventService';
import RouteParser from 'routes';

export class Router {

    public route = undefined;
    router: RouteParser | undefined = undefined;
    onChangeCallback: ((r) => void) | undefined = undefined;

    constructor(onChangeCallback?) {
        if (onChangeCallback) this.onChangeCallback = onChangeCallback;
        this.router = RouteParser();
        this.registerRoutes(routes);

        window.addEventListener("popstate", (e) => {
            if (e.state?.url) {
                this.loadUrl(e.state?.url);
            }
        });

    }

    // register a parent method to call when the route changes
    public setRouteChangedCallback = (cb) => {
        this.onChangeCallback = cb;
    }

    public registerRoutes = (routes) => {
        if (this.router) {
            Object.keys(routes).forEach(r => this.router!.addRoute(r, this.onRouteChange));
        }
    }

    // change page url and load the route
    public navigate = (url) => {
        let r = this.loadUrl(url);
        if (!r && url != '/page-not-found') return this.navigate('/page-not-found');
        window.history.pushState({ url, params: r.params }, "", url);
        //this.dispatchEvent();
    }


    // load the given (already changed) url route
    public loadUrl = (url) => {
        let r = this.router.match(url);
        if (r) {
            r.fn(r);
            return r;
        } else {
            return false;
        }
    }

    // auto-change handler from url change.
    onRouteChange = (r) => {
        this.route = r.route;
        // todo: fire event
        EventService.dispatch('route-change', r);
        console.log(`onRouteChange`, r)
        if (this.onChangeCallback) this.onChangeCallback(r);
    }
}