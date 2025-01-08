import { AppHeader } from './components/basic/app-header/AppHeader';
import { AppRouter } from './components/basic/app-router/AppRouter';
import { AppShell } from './components/basic/app-shell/AppShell.js';
import { AppContext } from './components/basic/AppContext/AppContext';
import { Link } from './components/basic/link/Link';
import { BLEDevice } from './components/ble-device/BLEDevice.js';
import { PageHome } from './components/page-home/PageHome';

customElements.define('app-shell', AppShell);
customElements.define('app-context', AppContext);
customElements.define('app-router', AppRouter);
customElements.define('app-header', AppHeader);
customElements.define('ble-device', BLEDevice);
customElements.define('page-home', PageHome);
customElements.define('app-link', Link);