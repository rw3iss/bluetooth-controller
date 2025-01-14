import storage from 'better-local-storage-fallback';
import { tryJsonParse, tryJsonStringify } from 'lib/utils/ObjUtils';
import { getLogger } from './logging';

const { log, warn } = getLogger('Cache', { color: 'magenta', enabled: false });

log(`storage`, storage)

export default class Cache {

    static get(id, parseJson = true) {
        // Look in local storage for object
        let key = id; // this._getClassTypeName(id);
        let str = storage.getItem(key);
        log(`get()`, id, '=', str);

        if (str != null) {
            try {
                let object = parseJson ? tryJsonParse(str) : str;
                return object;
            } catch (e) {
                return null;
            }
        }

        return str;
    }

    static set(key, value) {
        log(`set()`, key, '=', typeof value, value);
        let v = value;
        if (v != null && v != undefined) v = tryJsonStringify(value);
        storage.setItem(key, v);
    }

    static del(key) {
        Cache.remove(key);
    }

    static remove(key) {
        log(`remove()`, key);
        storage.removeItem(key);
    }

    static key(index): string | undefined {
        return storage.getKey(index);
    }

    static size() {
        return storage.size();
    }

    static clear() {
        log(`clear()`, key);
        return storage.clear();
    }

    // static _getClassTypeName(id: string): string {
    //     return id;
    // }

}

// TODO: combine with backend shared