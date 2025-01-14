import { Fn } from 'lib/types/Types';
import Cache from 'lib/utils/Cache';
import { getLogger } from 'lib/utils/logging';
import StoreInterface from '../IStore';

const { log, warn } = getLogger('CacheStore', { color: 'magenta', enabled: false });

// todo: could do smarter key management... not have to iterate through entire localstorage of all stores.


// BaseStore - a simple LocalStorage scope-based mechanism. The scope is derived from the store's prefix (storeIdx).
export default class CacheStore implements StoreInterface {

    storeIdx = "BASE_";

    constructor(storeIdx?) {
        if (storeIdx)
            this.storeIdx = storeIdx;
    }

    public add(item: any) {
        let id = item.id || item.uid;
        if (!id) throw "No id or uid present on object. Cannot add() to store.";
        Cache.set(`${this.storeIdx}${id}`, item);
    }

    public set(key: string, val: any) {
        Cache.set(`${this.storeIdx}${key}`, val);
    }

    public get(key: string, defaultValue?: any) {
        log(`get()`, this.storeIdx, key, defaultValue ?? '')
        let r = Cache.get(`${this.storeIdx}${key}`);
        return r != null ? r : defaultValue;
    }

    public remove(key: string) {
        Cache.remove(`${this.storeIdx}${key}`);
    }

    public getAll() {
        let data = {};
        let cs = Cache.size();
        for (let i = 0; i < cs; i++) {
            let key = Cache.key(i);
            if (!key) throw `No key for catch item ${i}`;
            if (key?.startsWith(this.storeIdx)) {
                data[key.replace(this.storeIdx, '')] = Cache.get(key);
            }
        }
        return data;
    }

    public getAllKeys() {
        let keys = [];
        let size = Cache.size();
        for (let i = 0; i < size; i++) {
            let ck = Cache.key(i);
            if (ck) keys.push();
        }
        return keys;
    }

    public size() {
        let count = 0;
        let l = Cache.size();
        for (let i = 0; i < l; i++) {
            let key = Cache.key(i);
            if (key?.startsWith(this.storeIdx)) { count++ }
        }
        return count;
    }

    // clears all values with this store prefix.
    public clear() {
        this.clearIf((i: number, key: string, val: any) => {
            return (key?.startsWith(this.storeIdx));
        });
    }

    public async clearAll() {
        return this.clear();
    }

    public async clearIf(condition: Fn) {
        let removeKeys: any[] = [];
        let size = Cache.size();
        for (let i = 0; i < size; i++) {
            let key = Cache.key(i);
            if (condition(i, key, Cache.get(key))) {
                removeKeys.push(key);
            }
        }

        removeKeys.forEach(k => {
            Cache.remove(k);
        });
    }

    public async onReady(cb: Fn) {
        // do nothing, always ready;
        // todo: should call onReady after init anyway...
    }

}
