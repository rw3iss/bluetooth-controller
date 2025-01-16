import IStore from '../IStore';
import { IDB } from './IDB';

export default class IDbStore implements IStore {

    // store's identifier
    storeIdx = "Store_";

    // underlying IDb references
    db: any = undefined;
    store: any = undefined;

    constructor(db: IDB, storeIdx?, opts?) {
        if (storeIdx) this.storeIdx = storeIdx;
        this.store = this.db.getStoreOrCreate(this.storeIdx, opts);
    }

    public async add(val: any, id?: undefined | string) {
        const key = id || val.id;
        if (!key) throw `No id parameter given for Store ${this.storeIdx} add()`;
        return await this.set(key, val);
    }

    public async set(key, val) {
        return await this.db.set(this.storeIdx, val, key);
    }

    public async get(key, defaultValue?) {
        let v = await this.db.get(this.storeIdx, key);
        return (!v && defaultValue) ? defaultValue : v;
    }

    public async remove(key) {
        return await this.db.delete(this.storeIdx, key);
    }

    public async getAll() {
        return await this.db.getAll(this.storeIdx);
    }

    public async getAllKeys() {
        return await this.db.getAllKeys(this.storeIdx);
    }

    public async size() {
        return await v.size(this.storeIdx);
    }

    public async clear() {
        return await this.clearAll();
    }

    public async clearAll() {
        return await this.db.clearAll(this.storeIdx);
    }

    public async clearIf(condition) {
        return await this.db.clearIf(this.storeIdx, condition);
    }

    public async onReady(cb) {
        this.db.onReady(cb);
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
