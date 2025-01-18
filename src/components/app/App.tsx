import { RouteContext } from 'components/app/route-context/RouteContext';
import { AdminTools } from 'components/basic/ui-admin-tools/AdminTools';
import { idbTables } from 'config/idb.config';
import { APP_ID } from 'env';
import { IndexedDBManager } from 'lib/IndexedDBManager';
import { useEffect } from 'preact/hooks';
import AppHeader from './app-header/AppHeader';

import "./App.scss";

const App = () => {

    useEffect(() => {
        // Init app db:
        const dbManager = new IndexedDBManager(APP_ID, 1);
        if (idbTables) for (var t of idbTables) dbManager.addStore(t.name, t.indexes);

        return () => async function () {
            // This isn't really necessary since it should/won't ever unmount?
            const db = IndexedDBManager.getDb(APP_ID);
            if (db) await db.closeDB();
        };
    })

    return (
        <main id="app">

            <AppHeader />

            <div className="context">
                <RouteContext />
            </div>

            <AdminTools />

        </main>
    );

}

export default App;