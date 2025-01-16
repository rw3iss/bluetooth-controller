import CacheStore from './Cache/CacheStore';
import { defaultDb } from './IDB/IDB';
import IDbStore from './IDB/IDbStore';
import IStore from './IStore';


// Uses IndexedDB as the data store, or falls back to an available in-memory Cache (local storage, etc).
export default class IDbOrCacheStore implements IStore {

    // store's identifier
    storeIdx = "BASE_";

    // underlying IDb reference
    store: any = undefined;

    idbSupported = true;

    constructor(storeIdx?, db?) {
        if (storeIdx) this.storeIdx = storeIdx;

        const win: any = typeof window == 'undefined' ? {} : window;
        let indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB;
        if (!indexedDB) {
            this.idbSupported = false;
            this.store = new CacheStore(this.storeIdx);
        } else {
            this.store = new IDbStore(db || defaultDb(), this.storeIdx);
        }
    }

    public async add(val: any, id?: undefined | string) {
        const key = id || val.id;
        if (!key) throw `No id parameter given for Store ${this.storeIdx} add()`;
        return await this.store.set(key, val);
    }

    public async set(key, val) {
        return await this.store.set(key, val);
    }

    public async get(key, defaultValue?) {
        return await this.store.get(key, defaultValue);
    }

    public async remove(key) {
        return await this.store.remove(key);
    }

    public async getAll() {
        return await this.store.getAll();
    }

    public async getAllKeys() {
        return await this.store.getAllKeys();
    }

    public async size() {
        return await this.store.size();
    }

    public async clear() {
        return await this.clearAll();
    }

    public async clearAll() {
        return await this.store.clearAll();
    }

    public async clearIf(condition) {
        return await this.store.clearIf(condition);
    }

    public async printAll() {
        let d = await this.getAll();
    }

    public async onReady(cb) {
        this.store.onReady(cb);
    }

}
