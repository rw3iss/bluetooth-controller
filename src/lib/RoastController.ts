import BluetoothDevice from 'lib/BluetoothDevice';
import { Fn } from 'src/lib/Types';

// manages a live roast across the app, and listens for events from the connection to update the state.
export class RoastController {

    // current roast state
    roast = {
        isStarted: false,
        isPaused: false,
        timeStarted: undefined,
        timeRunningMs: 0,
        currentTemp: 0,
        heaterOn: false,
        motorOn: false,
        exhaustOn: false,
        ejectOn: false,
        coolingOn: false
    };

    private device: BluetoothDevice | undefined = undefined;

    private listeners: Array<Fn> = [];

    // tick time to report new data
    private updateIntervalMs = 1000;
    private updateTimeout; // the timeout object

    constructor() {
    }

    connectDevice(device) {
        this.device = device;
        if (this.device) {
            this.device.addListener(this.onDeviceEvent);
        }
    }

    onDeviceEvent(e) {
        console.log(`device event`, e)
    }

    addListener(l) {
        // todo
        this.listeners.push(l);
    };

    // updates and persists the state, and notifies listeners
    private setState(key, value) {
        this.roast[key] = value;
        console.log(`setState:`, this.roast[key]);
    }

    start() {
        console.log(`start roast`);
        if (this.roast.isStarted) throw "Roast is already started.";
        this.setState('isStarted', true);
        this.setState('timeStarted', new Date());
        this.updateTimeout = setInterval(this.onTick, this.updateIntervalMs);
    }

    onTick() {
        console.log(`roast tick`);
        this.setState('timeRunningMs', this.roast.timeRunningMs + this.updateIntervalMs);
        if (!this.roast.isPaused) {
            // check automation actions
        }
    }

    togglePause() {
        this.setState('isPaused', !this.roast.isPaused);
        console.log(`roast toggle pause`);
    };

    stop() {
        this.setState('isStarted', false);
        console.log(`roast stopped.`, this.roast)
    };

}
