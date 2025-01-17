
// // Example usage:
// const dbManager = new IndexedDBManager('MyDB', 1);
// dbManager.addStore('books', ['title', 'author']);
// dbManager.addStore('authors', ['name', 'nationality']);

// // Using the database:
// async function testDB() {
//     await dbManager.put('books', { id: 1, title: "Book Title", author: "John Doe" });
//     const book = await dbManager.get<{ id: number; title: string; author: string }>('books', 1);
//     console.log(book); // Should log the book details
// }

// testDB().then(() => dbManager.closeDB());

export class IndexedDBManager {
    private db: IDBDatabase | null = null;
    private dbName: string;
    private version: number;
    private stores: { [name: string]: string[] } = {};

    constructor(dbName: string, version: number = 1) {
        this.dbName = dbName;
        this.version = version;
    }

    private openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => {
                reject(`Database error: ${event.target?.error}`);
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db as IDBDatabase);
            };

            request.onupgradeneeded = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                this.upgradeDB(event);
            };
        });
    }

    private upgradeDB(event: IDBVersionChangeEvent) {
        const db = (event.target as IDBOpenDBRequest).result;

        // Iterate through the stores defined in this class
        for (const [storeName, indexes] of Object.entries(this.stores)) {
            if (!db.objectStoreNames.contains(storeName)) {
                const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });

                for (const index of indexes) {
                    objectStore.createIndex(index, index, { unique: false });
                }
            }
        }
    }

    public addStore(storeName: string, indexNames: string[]) {
        this.stores[storeName] = indexNames;
        // If the database is already open, we might want to trigger an upgrade here
        // However, for simplicity, we'll assume upgrades happen on next open
    }

    public async put<T>(storeName: string, value: T): Promise<void> {
        if (!this.db) {
            await this.openDB();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(storeName, 'readwrite');
            const objectStore = transaction.objectStore(storeName);

            const request = objectStore.put(value);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
        if (!this.db) {
            await this.openDB();
        }

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(storeName, 'readonly');
            const objectStore = transaction.objectStore(storeName);

            const request = objectStore.get(key);
            request.onsuccess = () => resolve(request.result);
        });
    }

    public closeDB() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}
