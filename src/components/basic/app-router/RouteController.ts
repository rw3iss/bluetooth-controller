import { ReactiveController, ReactiveControllerHost } from 'lit';

export class RouteController implements ReactiveController {
    host: ReactiveControllerHost;

    route = undefined;

    constructor(host: ReactiveControllerHost) {
        (this.host = host).addController(this);
    }

    hostConnected() {
    }

    hostDisconnected() {
    }
}
