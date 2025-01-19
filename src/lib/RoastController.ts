import BluetoothDevice from 'lib/BluetoothDevice';
import { Fn } from 'lib/Types';
import { IndexedDBManager } from './IndexedDBManager.js';
import { IDbSavedState, STATE_STORE, wrapState } from './hooks/useSavedState.js';

const event = (name, data = {}) => ({
    name,
    data
});

export const DEFAULT_ROAST_STATE = () => ({
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
});

const ROAST_STATE = 'roast';

// manages a live roast across the app, and listens for events from the connection to update the state.
export class RoastController {

    // current roast state
    public roast = DEFAULT_ROAST_STATE();

    private device: BluetoothDevice | undefined = undefined;

    private listeners: Array<Fn> = [];

    // tick time to report new data
    private updateIntervalMs = 1000;
    private updateTimeout; // the timeout object

    constructor() { }

    public async init(restore = true) {
        const db = IndexedDBManager.getDb();
        if (db && restore) {
            const s: IDbSavedState | undefined = await db.get(STATE_STORE, ROAST_STATE);
            console.log(`See saved roast state?`, s)
            if (s) this.roast = s.state;
        }
    }

    public async save(state) {
        const db = IndexedDBManager.getDb();
        if (db) {
            await db.put(STATE_STORE, wrapState(ROAST_STATE, state));
        }
    }

    public connectDevice(device) {
        this.device = device;
        if (this.device) {
            this.device.addListener(this.onDeviceEvent);
        }
    }

    onDeviceEvent(e) {
        console.log(`device event`, e)
    }

    public addListener(l) {
        this.listeners.push(l);
    };

    public removeListener(l) {
        this.listeners = this.listeners.filter(_l => _l != l);
    };

    private emitEvent(e) {
        this.listeners.forEach(l => l(e));
    }

    // updates and persists the state, and notifies listeners
    setState = (key, value) => {
        this.roast[key] = value;
        console.log(`setState:`, key, this.roast[key]);
    };

    public start() {
        console.log(`start roast`);
        if (this.roast.isStarted) throw "Roast is already started. Stop it first.";
        this.setState('isStarted', true);
        this.setState('timeStarted', new Date());
        this.updateTimeout = setInterval(this.onTick, this.updateIntervalMs);
        this.emitEvent(event('roast-started'));
    };

    onTick = () => {
        this.setState('timeRunningMs', this.roast.timeRunningMs + this.updateIntervalMs);
        if (!this.roast.isPaused) {
            // check automation actions
        }
    };

    public togglePause() {
        this.setState('isPaused', !this.roast.isPaused);
        console.log(`roast toggle pause`);
        this.emitEvent(event(this.roast.isPaused ? 'roast-paused' : 'roast-unpaused'));
    };

    public stop() {
        this.setState('isStarted', false);
        this.emitEvent(event('roast-stopped++'));
        console.log(`roast stopped.`, this.roast)
    };

    public eject() {
        //this.setState('isStarted', false);
        this.setState('ejectOn', true);
        this.emitEvent(event('roast-ejected'));
        console.log(`roast ejected.`, this.roast)
    };
}
