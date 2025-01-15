import BluetoothDevice from 'lib/BluetoothDevice';
import { Fn } from 'src/lib/Types';

// manages a live roast across the app, and listens for events from the connection to update the state.
export class RoastController {

    private device: BluetoothDevice | undefined = undefined;

    private listeners: Array<Fn> = [];

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

    };

}