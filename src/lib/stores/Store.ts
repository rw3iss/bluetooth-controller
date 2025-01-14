import ISubscribable from "./IEventEmitter";
import IStore from "./IStore";

export type StoreState = {
    data: Array<any>,
    count: number
};


export class Store implements IStore, ISubscribable {

    // store's identifier
    storeIdx = "BASE_";

    // underlying IDb reference
    store: any = undefined;

    constructor(storeIdx?) {
        if (storeIdx)
            this.storeIdx = storeIdx;
        this.store = {};
    }

    susbcribe(callback: any) {
        throw new Error("Method not implemented.");
    }

    public async add(val: any, id?: undefined | string) {
        const key = id || val.id;
        if (!key) throw `No id parameter given for Store ${this.storeIdx} add()`;
        return await this.set(key, val);
    }

    public async set(key, val) {
        this.store[key] = val;
    }

    public async get(key, defaultValue?) {
        return this.store[key];
    }

    public async remove(key) {
    }

    public async getAll() {
    }

    public async size() {
    }

    public async clear() {
    }

    public async clearAll() {
    }

    public async clearIf(condition) {
    }

}
