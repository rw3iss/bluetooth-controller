import { Fn } from 'lib/Types';

export default class BluetoothDevice {

    private device: any;
    private listeners: Array<Fn>;

    constructor(device) {
        this.device = device;
        this.listeners = [];
    }

    static async selectDevice() {
        return new Promise((resolve, reject) => {
            try {
                if (navigator.bluetooth) {
                    navigator.bluetooth.requestDevice({ acceptAllDevices: true })
                        .then(device => {
                            console.log(`Got device:`, device)
                            const conn = new BluetoothDevice(device);
                            resolve(conn);
                        })
                        .catch(error => { console.error(error); });
                } else {
                    alert("No bluetooth enabled?");
                }
            } catch (e) {
                throw e;
            }
        });
    }

    public sendCommand(c) {
        console.log(`BLE.send`, c)
        //this.device.send(...);
    }

    public addListener(l) {
        this.listeners.push(l);
    };
}