import * as eventbus from 'eventbusjs';

class _EventService {

    debug = false;

    // fire event
    dispatch(name, data?) {
        if (this.debug)
            console.log('EVENT:', name, data);

        eventbus.dispatch(name, data);
    }

    subscribe(event, cb) {
        eventbus.addEventListener(event, cb);
    }

    unsubscribe(event, cb) {
        eventbus.removeEventListener(event, cb);
    }

}

const EventService = new _EventService();
export default EventService;