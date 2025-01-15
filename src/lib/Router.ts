import { routes } from 'app/config/routes.js';
import EventService from 'lib/EventService';
import RouteParser from 'routes';

export class Router {

    public route = undefined;
    public routeParams = undefined;

    parser: RouteParser | undefined = undefined;

    constructor() {
        this.parser = RouteParser();
        this.registerRoutes(routes);

        window.addEventListener("popstate", (e) => {
            if (e.state?.url) {
                this.loadUrl(e.state?.url);
            }
        });
    }


    public registerRoutes = (routes) => {
        if (this.parser) {
            Object.keys(routes).forEach(r => this.parser!.addRoute(r, this.onRouteChange));
        }
    }

    // change page url and load the route
    public navigate = (url) => {
        console.log(`navigate`, url);
        let r = this.loadUrl(url);
        if (!r && url != '/page-not-found') return this.navigate('/page-not-found');
        window.history.pushState({ url, params: r.params }, "", url);
        //this.dispatchEvent();
    }

    // load the given (already changed) url route
    public loadUrl = (url) => {
        let r = this.parser.match(url);
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
        this.routeParams = r.params;
        console.log(`Router.onRouteChange`, r)
        EventService.dispatch('route-change', r);
        //if (this.onChangeCallback) this.onChangeCallback(r);
    }
}

export const router = new Router();