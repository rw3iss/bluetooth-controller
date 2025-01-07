import { AppShell } from './components/app-shell/AppShell.js';
import { BLEDevice } from './components/ble-device/BLEDevice.js';
import { Button } from './components/button/Button.js';

customElements.define('app-shell', AppShell);
customElements.define('wc-button', Button);
customElements.define('ble-device', BLEDevice);