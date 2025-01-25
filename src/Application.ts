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
        // install service worker for PWA download:
        this.initPWA();

        const dbManager = new IndexedDBManager(APP_ID, 1);
        if (idbTables) for (var t of idbTables) dbManager.addStore(t.name, t.indexes);

        await this.roastController.init();
    }

    initPWA() {
        console.log(`initPWA()`)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').then(function (registration) {
                    console.log('Service Worker registered with scope:', registration.scope);
                }, function (err) {
                    console.log('Service Worker registration failed:', err);
                });
            });
        }
    }
}

const Application = new _Application();
export default Application;