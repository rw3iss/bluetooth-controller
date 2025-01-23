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

    timeStarted: new Date(),
    timeRunningMs: 0,

    currentTemp: 0,
    targetTemp: 0,

    heaterOn: false,
    motorOn: false,
    exhaustOn: false,
    ejectOn: false,
    coolingOn: false
});

const ROAST_STATE_ID = 'roast';

// manages a live roast across the app, and listens for events from the connection to update the state.
export class RoastController {

    // current roast state
    public roast = DEFAULT_ROAST_STATE();

    private device: BluetoothDevice | undefined = undefined;

    private listeners: Array<Fn> = [];

    // tick time to report new data
    private updateIntervalMs = 1000;
    private updateTimeout; // timeout handle

    constructor() { }

    public async init(restore = true) {
        const db = IndexedDBManager.getDb();
        if (db && restore) {
            const s: IDbSavedState | undefined = await db.get(STATE_STORE, ROAST_STATE_ID);
            //console.log(`See saved roast state?`, s)
            if (s) this.roast = s.state;
            if (this.roast?.isStarted && !this.roast.isPaused) {
                // resume roasting...
                //if (confirm("Resume running roast?")) {
                this.updateTimeout = setInterval(this.onTick, this.updateIntervalMs);
                //}
            }
        }
    }

    public async save(state) {
        console.log(`save`, state)
        if (state) this.roast = state;
        const db = IndexedDBManager.getDb();
        if (db) {
            await db.put(STATE_STORE, wrapState(ROAST_STATE_ID, this.roast));
        }
    }

    // public connectDevice(device) {
    //     this.device = device;
    //     if (this.device) {
    //         this.device.addListener(this.onDeviceEvent);
    //     }
    // }

    // onDeviceEvent(e) {
    //     console.log(`device event`, e)
    // }

    // updates and persists the state, and notifies listeners
    setState = (key, value, save = false) => {
        this.roast[key] = value;
        if (save) this.save(this.roast);
    };

    updateState = (state, save = false) => {
        Object.assign(this.roast, state);
        console.log(`state updated?`, this.roast)
        if (save) this.save(this.roast);
    };

    onTick = () => {
        this.setState('timeRunningMs', this.roast.timeRunningMs + this.updateIntervalMs, false);
        if (!this.roast.isPaused) {
            // check automation actions
        }
        this.emitEvent(event('tick'));
    };

    public start = () => {
        console.log(`start roast`);
        if (this.roast.isStarted) throw "Roast is already started. Stop it first.";
        // todo: set multiple state, default
        this.updateState({
            timeStarted: new Date(),
            timeRunningMs: 0,
            motorOn: true,
            heaterOn: true,
            ejectOn: false,
            isPaused: false,
            isStarted: false
        }, true);
        this.updateTimeout = setInterval(this.onTick, this.updateIntervalMs);
        this.emitEvent(event('roast-started'));
    };

    public togglePause() {
        const paused = !this.roast.isPaused;
        this.setState('isPaused', paused);
        if (!paused) {
            this.updateTimeout = setInterval(this.onTick, this.updateIntervalMs);
        } else {
            clearInterval(this.updateTimeout);
        }
        this.emitEvent(event(paused ? 'roast-paused' : 'roast-unpaused'));
    };

    public stop() {
        this.setState('isStarted', false, true);
        this.emitEvent(event('roast-stopped'));
        console.log(`roast stopped.`, this.roast)
    };

    public eject() {
        //this.setState('isStarted', false);
        this.updateState({
            ejectOn: true,
            isPaused: false,
            isStarted: false
        }, true);
        this.emitEvent(event('roast-ejected'));
        console.log(`roast ejected.`, this.roast)
    };

    public addListener(l) {
        this.listeners.push(l);
    };

    public removeListener(l) {
        this.listeners = this.listeners.filter(_l => _l != l);
    };

    private emitEvent(e) {
        this.listeners.forEach(l => l(e));
    };
}
