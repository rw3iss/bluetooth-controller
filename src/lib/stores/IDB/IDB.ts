/* Usage:

// init:
this.db = new IDB();
this.db.open(DBNAME);
this.db.newStore(DBNAME, { autoIncrement: true }, [
    { name: 'id', key: 'id', params: { unique: true } },
    { name: 'word, language', key: [ 'word', 'language' ], params: { unique: true } },
]);

// get:
let existing = await this.db.get(DBNAME, 'word, language', [word.word, word.language]);

// insert:
let o = await this.db.insert(DBNAME, word);

*/

import { getLogger } from "lib/utils/logging";

// todo: queue all operations (such as clear, and delete) and execute when initialized/onupgradeneeded
// todo: wrap all in try/catch

// this number must be increased for new DB changes to take effect and register themselves on existing clients.
const DB_VERSION = 1;

const { log, warn } = getLogger('idb', { color: 'green', enabled: true });

// for some reason esbuild or browsersync don't like window
const win: any = typeof window == 'undefined' ? {} : window;

type StoreDef = {
    name: string; // Store name
    options: {};  // Store options
    indexes: {}   // optional indexes used for searching
}

class IDB {

    isOpen = false;         // if it's ready
    isReady = false;        // if its open and ready (upgrades complete)
    isInitialized = false   // if the stores have been instantiated
    db: any = undefined;    // underlying opened DB instance
    _storeDefs: Array<StoreDef> = [];        // the user-registered pending definitions
    public stores = {};            // the instantiated stores
    readyListeners = [];

    constructor() {
        let indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
        if (!indexedDB) {
            if (typeof window != 'undefined') {
                throw "Your browser doesn't support a stable version of IndexedDB.";
            }
            return;
        }
        let IDBTransaction = win.IDBTransaction || win.webkitIDBTransaction || win.msIDBTransaction || { READ_WRITE: "readwrite" };
        let IDBKeyRange = win.IDBKeyRange || win.webkitIDBKeyRange || win.msIDBKeyRange;
        Object.defineProperty(window, 'IDBTransaction', { value: IDBTransaction });
        Object.defineProperty(window, 'IDBKeyRange', { value: IDBKeyRange });
    }

    open(dbName) {
        let indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
        if (!indexedDB) {
            if (typeof window != 'undefined') {
                throw "Your browser doesn't support a stable version of IndexedDB.";
            }
            return;
        }
        log('OPENING IDB - version:', DB_VERSION)
        var request = win.indexedDB.open(dbName, DB_VERSION);

        // create stores after upgrade/ready
        request.onupgradeneeded = (e) => {
            this.db = e.target.result;
            warn('IDB Upgrade needed! ... ', e.target)
            this.isOpen = true;
            this.initializeStores();
        };

        // handle operations after success
        request.onsuccess = (e) => {
            log('IDB OPENED')
            this.db = e.target.result;
            this.isOpen = true;
            this.isReady = true;
            this.initializeStores();
            this.execQueuedCommands();
            this.emitReady();
        };

        request.onerror = (e) => {
            console.error('IDB open error! ', e.target.error)
            this.isOpen = false;
        };

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

    // registers a new store to be created.
    // todo:  this should return a store with an interface... ?
    newStore(storeName, options?, indexes?) {
        if (this._storeDefs.find(s => s.name == storeName))
            throw "This store exists already: " + storeName;
        this._storeDefs.push({
            name: storeName,
            options: options || {},
            indexes: indexes || {}
        });
        // if system is already initialized, register the store now:
        if (this.isInitialized) {
            return this.createStore(storeName, options, indexes);
        }
    }

    // registers a new store to be created.
    // todo:  this should return a store with an interface... ?
    getStore(storeName) {
        return this._storeDefs.find(s => s.name == storeName);
    }

    get(storeName, key, index?) {
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

    getAll(storeName) {
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

    getAllKeys(storeName) {
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

    set(storeName, object, key?) {
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

    update(storeName, object, key?) {
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

    // creates the registered stores when DB is ready.
    initializeStores() {
        if (!this.isInitialized) {
            log('Initializing IDB stores...',);
            this._storeDefs.forEach(s => {
                this.createStore(s.name, s.options, s.indexes);
            });
            this.isInitialized = true;
        } else {
            warn('(IDB already initialized?)')
        }
    }

    // Instantiates a new store with IndexedDB. Assumes the DB is ready.
    private createStore(storeName, options?, indexes?) {
        let store;
        log('create store', storeName, this.db)

        const _create = () => {
            this.db.createObjectStore(storeName, options);
            if (indexes && indexes.length) {
                indexes.map(i => {
                    store.createIndex(i.name, i.key, i.params);
                });
            }

            this.stores[storeName] = store;
            return store;
        }

        if (this.isOpen) {
            try {
                if (this.isReady) {
                    // query if store exists
                    if (this.db.objectStoreNames.contains(storeName)) {
                        const txn = this.db.transaction(storeName, "readwrite");
                        store = txn.objectStore(storeName);
                        if (store) {
                            // console.log('found existing store...', storeName, store)
                            return store;
                        }
                    }
                }

                return _create();
            } catch (e) {
                // TODO: HANDLE THIS....
                console.error('create store error', e);
            }
        } else {
            return undefined;
        }
    }

}

// Todo: move initialization and instance to app start.

const idb = new IDB();
idb.open('App');

export default idb;