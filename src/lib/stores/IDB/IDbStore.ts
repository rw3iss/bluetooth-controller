import IStore from '../IStore';
import IDB from './IDB';

export default class IDbStore implements IStore {

    // store's identifier
    storeIdx = "BASE_";

    // underlying IDb reference
    store: any = undefined;

    constructor(storeIdx?) {
        if (storeIdx)
            this.storeIdx = storeIdx;

        this.store = IDB.getStore(this.storeIdx);
        if (!this.store) this.store = IDB.newStore(this.storeIdx);
    }

    public async add(val: any, id?: undefined | string) {
        const key = id || val.id;
        if (!key) throw `No id parameter given for Store ${this.storeIdx} add()`;
        return await this.set(key, val);
    }

    public async set(key, val) {
        return await IDB.set(this.storeIdx, val, key);
    }

    public async get(key, defaultValue?) {
        let v = await IDB.get(this.storeIdx, key);
        return (!v && defaultValue) ? defaultValue : v;
    }

    public async remove(key) {
        return await IDB.delete(this.storeIdx, key);
    }

    public async getAll() {
        return await IDB.getAll(this.storeIdx);
    }

    public async getAllKeys() {
        return await IDB.getAllKeys(this.storeIdx);
    }

    public async size() {
        return await IDB.size(this.storeIdx);
    }

    public async clear() {
        return await this.clearAll();
    }

    public async clearAll() {
        return await IDB.clearAll(this.storeIdx);
    }

    public async clearIf(condition) {
        return await IDB.clearIf(this.storeIdx, condition);
    }

    public async onReady(cb) {
        IDB.onReady(cb);
    }
    // public clearIf(condition) {
    //     let removeKeys: any[] = [];
    //     let size = Cache.size();
    //     for (let i = 0; i < size; i++) {
    //         let key = Cache.key(i);
    //         if (condition(i, key, Cache.get(key))) {
    //             removeKeys.push(key);
    //         }
    //     }

    //     removeKeys.forEach(k => {
    //         IDB.delete(k);
    //     });
    // }

}
