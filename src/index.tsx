import { idbTables } from 'config/idb.config';
import { APP_ID } from 'env';
import { IDB } from 'lib/stores/IDB/IDB';
import { render } from 'preact';
import App from './components/app/App.js';

// initialize app db.
const initApp = async () => {

    const idb: IDB = new IDB(APP_ID);
    await idb.init(idbTables);

    render(<App />, document.body);

}

initApp();