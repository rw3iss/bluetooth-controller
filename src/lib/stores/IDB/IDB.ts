/* Usage:

// init:
this.db = new IDB();
this.db.open(DBNAME, version?);
this.db.newStore(DBNAME, { autoIncrement: true }, [
    { name: 'id', key: 'id', params: { unique: true } },
    { name: 'word, language', key: [ 'word', 'language' ], params: { unique: true } },
]);

// get:
let existing = await this.db.get(DBNAME, 'word, language', [word.word, word.language]);

// insert:
let o = await this.db.insert(DBNAME, word);

*/

import { APP_ID } from 'env';
import { getLogger } from "lib/utils/logging";

// todo: queue all operations (such as clear, and delete) and execute when initialized/onupgradeneeded
// todo: wrap all in try/catch


const { log, warn, error } = getLogger('idb', { color: 'green', enabled: false });

// for some reason esbuild or browsersync don't like window
const win: any = typeof window == 'undefined' ? {} : window;

type StoreDef = {
    name: string; // Store name
    options: {};  // Store options
    indexes: {}   // optional indexes used for searching
}

export class IDB {

    public static dbs: Array<IDB> = []; // reference array for all instantiated DBs

    name = undefined;
    version = undefined;

    isOpen = false;         // if it's ready
    isReady = false;        // if its open and ready (upgrades complete)
    isInitialized = false   // if the stores have been instantiated

    db: any = undefined;    // underlying opened DB instance

    _storeDefs: Array<StoreDef> = [];   // the user-registered pending definitions
    public stores: Array<any> = [];             // the instantiated stores

    readyListeners = [];

    constructor(name?, version?) {
        this.name = name || 'app-db';
        this.version = version || 1;
        let indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
        if (!indexedDB) {
            if (typeof window != 'undefined') throw "Your browser doesn't support a stable version of IndexedDB.";
            return;
        }
        let IDBTransaction = win.IDBTransaction || win.webkitIDBTransaction || win.msIDBTransaction || { READ_WRITE: "readwrite" };
        let IDBKeyRange = win.IDBKeyRange || win.webkitIDBKeyRange || win.msIDBKeyRange;
        Object.defineProperty(window, 'IDBTransaction', { value: IDBTransaction });
        Object.defineProperty(window, 'IDBKeyRange', { value: IDBKeyRange });
    }

    // static accessor so UI/clients can retrieve an instance of their DB anywhere
    public static getDb(name) {
        return this.dbs.find(db => db.name == name);
    }

    // returns the main/default app db instance
    public static getDefaultDb = () => {
        return IDB.getDb(APP_ID);
    }

    // opens the db and initializes any preconfigured stores
    async init(schema?) {
        log(`init()`, schema)
        if (schema) {
            for (var t of schema) this.newStore(t.name, t.options, t.indexes);
        }
        log(`opening...`)
        await this.open();
    }

    async open(): Promise<IDB> {
        return new Promise((resolve, reject) => {
            try {
                let db;
                let indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
                if (!indexedDB) {
                    if (typeof window != 'undefined') throw "Your browser doesn't support a stable version of IndexedDB.";
                    return;
                }
                log('OPENING IDB', this.name, this.version)
                var request = win.indexedDB.open(this.name, this.version);

                // create stores
                request.onupgradeneeded = (e) => {
                    this.db = e.target.result;
                    if (this.db) {
                        this.db.onerror = (e) => console.error(`Error upgrading iDB:`, e);
                        warn('IDB Upgrade needed! ... ', e.target)
                        this.createStores();
                        log(`Store creation done.`)
                    }
                };

                // handle operations after success (stores are ready)
                request.onsuccess = (e) => {
                    if (!this.db) this.db = e.target.result;
                    log('IDB OPENED', this.db)

                    this.db.onversionchange = function () {
                        //!important when version change is detected close the database immediately
                        this.db.close() // hint:1
                        log(`Need version change`)
                    }

                    IDB.dbs.push(this);

                    this.isOpen = true;
                    this.isReady = true;
                    //this.initializeStores();
                    this.execQueuedCommands();
                    this.emitReady();

                    resolve(this);
                };

                request.onerror = (e) => {
                    console.error('IDB open error! ', e.target.error)
                    this.isOpen = false;
                    reject(e);
                };
            } catch (e) {
                reject(e);
            }
        });
    }

    onReady = (cb) => {
        this.readyListeners.push(cb);
    }

    emitReady = () => {
        this.readyListeners.forEach(l => {
            l();
        });
    }

    execQueuedCommands() {
        // todo:
    }

    // creates the registered stores, when the DB is ready.
    createStores() {
        if (!this.isInitialized) {
            log('Initializing IDB stores...', this._storeDefs);
            for (var s of this._storeDefs) this.createStore(s.name, s.options, s.indexes);
            this.isInitialized = true;
        } else {
            warn('(IDB already initialized?)')
        }
    }

    // registers a new store to be created.
    // todo:  this should return a store with an interface... ?
    newStore(storeName, options?, indexes?) {
        log(`newStore()`, storeName);
        if (this._storeDefs.find(s => s.name == storeName))
            throw "This store exists already: " + storeName;
        this._storeDefs.push({
            name: storeName,
            options: options || {},
            indexes: indexes || {}
        });
        // if system is already initialized, register the store now:
        if (this.isInitialized) {
            console.log(`  system already initialized.`)
            return this.createStore(storeName, options, indexes);
        }
    }

    // registers a new store to be created.
    // todo:  this should return a store with an interface... ?
    getStore(storeName) {
        return this.stores.find(s => s.name == storeName);
    }

    // Instantiates a new store with IndexedDB. Assumes the DB is ready.
    private createStore(storeName, options?, indexes?) {
        let store;
        log('create store', storeName, options)

        //if (this.isOpen) {
        try {
            // query if store exists
            if (this.db) {
                if (this.db.objectStoreNames.contains(storeName)) {
                    store = this.getStore(storeName);
                    //const txn = this.db.transaction(storeName, "readwrite");
                    //store = txn.objectStore(storeName);
                    //console.log('found existing store...', storeName, store)
                } else {
                    store = this.db.createObjectStore(storeName, options);
                    if (indexes && indexes.length) {
                        indexes.map(i => store.createIndex(i.name, i.key, i.params));
                    }
                    this.stores.push(store);
                    console.log(`Created`, storeName, store)
                }
            } else {
                console.error(`createStore error: db is not initialized`)
            }
            return store;
        } catch (e) {
            // TODO: HANDLE THIS....
            console.error('createStore error:', e);
        }
    }

    getStoreOrCreate(storeName, opts?) {
        let s = this.getStore(storeName);
        if (!s) s = this.createStore(storeName, opts);
        return s;
    }

    async get(storeName, key, index?) {
        return new Promise((resolve, reject) => {
            if (this.isReady) {
                try {
                    const txn = this.db.transaction(storeName, "readwrite"); //IDBTransaction.READ_WRITE);
                    const q = index ?
                        txn.objectStore(storeName).index(index).get(key) :
                        txn.objectStore(storeName).get(key);

                    q.onsuccess = function (e) {
                        return resolve(q.result);
                    };

                    q.onerror = function (e) {
                        console.error('Error getting IDB store item:', storeName, key, e)
                        return reject(e);
                    };

                    q.oncomplete = function (e) { };
                } catch (e) {
                    console.error('IDB get exception!', storeName, key, e)
                    return reject(e);
                }
            } else {
                return resolve(undefined);
            }
        });
    }

    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            if (this.isReady) {
                try {
                    const txn = this.db.transaction(storeName, "readwrite"); //IDBTransaction.READ_WRITE);
                    const q = txn.objectStore(storeName).getAll();

                    q.onsuccess = function (e) {
                        return resolve(q.result);
                    };

                    q.onerror = function (e) {
                        return reject(e);
                    };

                    q.oncomplete = function (e) { };
                } catch (e) {
                    console.error('IDB getAll exception!', storeName, key, e)
                    return reject(e);
                }
            } else {
                return resolve(undefined);
            }
        });
    }

    async getAllKeys(storeName) {
        return new Promise((resolve, reject) => {
            if (this.isReady) {
                const txn = this.db.transaction(storeName, "readwrite"); //IDBTransaction.READ_WRITE);
                const q = txn.objectStore(storeName).getAllKeys();
                q.onsuccess = (e) => resolve(q.result);
                q.onerror = (e) => reject(e);
                q.oncomplete = function (e) { };
            } else {
                return resolve(undefined);
            }
        });
    }

    async set(storeName, object, key?) {
        return new Promise((resolve, reject) => {
            if (this.isReady && key) {
                try {
                    const txn = this.db.transaction(storeName, "readwrite"); //IDBTransaction.READ_WRITE);
                    let q = txn.objectStore(storeName).put(object, key);

                    q.onsuccess = function (e) {
                        return resolve(e.target.result);
                    };

                    q.onerror = function (e) {
                        console.error('Error setting IDB store item:', storeName, object, key, e)
                        return reject(e);
                    }
                } catch (e) {
                    console.error('IDB set exception!', storeName, key, object)
                    return reject(e);
                }
            } else {
                return resolve(undefined);
            }
        });
    }

    async update(storeName, object, key?) {
        return new Promise((resolve, reject) => {
            if (this.isReady) {
                try {
                    const txn = this.db.transaction(storeName, "readwrite"); //IDBTransaction.READ_WRITE);
                    const q = txn.objectStore(storeName).put(object, key);
                    q.onsuccess = (e) => resolve(object);
                    txn.onerror = (e) => reject(e);
                    q.oncomplete = () => { };
                } catch (e) {
                    console.error('IDB update exception!', storeName, key, object)
                    return reject(e);
                }
            } else {
                return resolve(undefined)
            }
        });
    }

    delete(storeName, key) {
        if (this.isInitialized) {
            return this.db.transaction([storeName], "readwrite")
                .objectStore(storeName)
                .delete(key);
        }
    }

    clearAll(storeName) {
        if (this.isInitialized) {
            return this.db.transaction([storeName], "readwrite")
                .objectStore(storeName)
                .clear();
        }
    }

    clearIf(storeName, condition) {
        if (this.isReady) {
            const txn = this.db.transaction([storeName], "readwrite");
            let store = txn.objectStore(storeName);

            if (store) {
                let removeKeys: any[] = [];
                let t = store.getAllKeys();

                t.onsuccess = async (r) => {
                    if (t.result) {
                        let allKeys = t.result;

                        for (let i = 0; i < allKeys.length; i++) {
                            let key = allKeys[i];
                            if (condition(i, key, await this.get(storeName, key))) {
                                removeKeys.push(key);
                            }
                        }

                        removeKeys.forEach(k => {
                            this.delete(storeName, k);
                        });
                    }
                };

            }
        }
    }

    size(storeName) {
        if (this.isInitialized) {
            var request = this.db.transaction([storeName], "readwrite")
                .objectStore(storeName)
                .count();
            return request.result;
        }
    }

}