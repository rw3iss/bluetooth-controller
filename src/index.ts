import { AppHeader } from './components/app/app-header/AppHeader.js';
import { AppShell } from './components/app/app-shell/AppShell.js';
import { BLEDevice } from './components/app/BLE/ble-device/BLEDevice.js';
import { Menu } from './components/app/menu/Menu';
import { MenuItem } from './components/app/menu/MenuItem';
import { RouteContext } from './components/app/route-context/RouteContext.js';
import { Accordian } from './components/basic/accordian/Accordian.js';
import { AccordianItem } from './components/basic/accordian/AccordianItem.js';
import { Link } from './components/basic/link/Link.js';
import { PageConfig } from './components/pages/page-config/PageConfig.js';
import { PageHome } from './components/pages/page-home/PageHome.js';
import { PageNotFound } from './components/pages/page-not-found/PageNotFound.js';
import { PageProfiles } from './components/pages/page-profiles/PageProfiles.js';
import { PageRoastHistory } from './components/pages/page-roast-history/PageRoastHistory.js';
import { PageRoast } from './components/pages/page-roast/PageRoast.js';

customElements.define('app-header', AppHeader);
customElements.define('app-shell', AppShell);
customElements.define('app-link', Link);
customElements.define('route-context', RouteContext);
customElements.define('x-menu', Menu);
customElements.define('menu-item', MenuItem);

customElements.define('accordian-list', Accordian);
customElements.define('accordian-item', AccordianItem);
customElements.define('ble-device', BLEDevice);

customElements.define('page-home', PageHome);
customElements.define('page-roast', PageRoast);
customElements.define('page-roast-history', PageRoastHistory);
customElements.define('page-profiles', PageProfiles);
customElements.define('page-config', PageConfig);
customElements.define('page-not-found', PageNotFound);
