import { BLEDevice } from './components/app/ble-device/BLEDevice.js';
import { Accordian } from './components/basic/accordian/Accordian.js';
import { AccordianItem } from './components/basic/accordian/AccordianItem.js';
import { AppHeader } from './components/basic/app-header/AppHeader';
import { AppRouter } from './components/basic/app-router/AppRouter';
import { AppShell } from './components/basic/app-shell/AppShell.js';
import { AppContext } from './components/basic/AppContext/AppContext';
import { Link } from './components/basic/link/Link.js';
import { PageConfig } from './components/pages/page-config/PageConfig.js';
import { PageHome } from './components/pages/page-home/PageHome.js';
import { PageNotFound } from './components/pages/page-not-found/PageNotFound.js';
import { PageProfiles } from './components/pages/page-profiles/PageProfiles.js';
import { PageRoastHistory } from './components/pages/page-roast-history/PageRoastHistory.js';
import { PageRoast } from './components/pages/page-roast/PageRoast.js';

customElements.define('app-shell', AppShell);
customElements.define('app-router', AppRouter);
customElements.define('app-header', AppHeader);
customElements.define('app-link', Link);

customElements.define('accordian-list', Accordian);
customElements.define('accordian-item', AccordianItem);
customElements.define('ble-device', BLEDevice);

customElements.define('page-home', PageHome);
customElements.define('page-roast', PageRoast);
customElements.define('page-roast-history', PageRoastHistory);
customElements.define('page-profiles', PageProfiles);
customElements.define('page-config', PageConfig);
customElements.define('page-not-found', PageNotFound);
