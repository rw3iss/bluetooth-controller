export interface IStore {

    add(item: any, id?: string | undefined);

    set(key: string, val: any);

    get(key: string, defaultValue?: any);

    getAll();

    size();

    remove(key: string);

    clear();

    clearIf(condition);

}