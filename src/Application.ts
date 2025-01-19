import { idbTables } from 'config/idb.config';
import { APP_ID } from 'env';
import { IndexedDBManager } from 'lib/IndexedDBManager';
import { RoastController } from 'lib/RoastController';

class _Application {

    public roastController: RoastController;

    constructor() {
        // init globals and singletons
        this.roastController = new RoastController();
    }

    // Things to initialize before client can start...
    async init() {
        console.log(`Application.init()`)
        const dbManager = new IndexedDBManager(APP_ID, 1);
        if (idbTables) for (var t of idbTables) dbManager.addStore(t.name, t.indexes);

        await this.roastController.init();

        return Promise.resolve();
    }
}

const Application = new _Application();
export default Application;