/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const DB_NAME = 'pro-thumbnail-cache';
const STORE_NAME = 'generated-thumbnails';
const DB_VERSION = 1;
const MAX_CACHE_ITEMS = 50; // Limit the number of cached items to prevent unbounded growth.

let db: IDBDatabase | null = null;

/**
 * Initializes and opens the IndexedDB database.
 * @returns A promise that resolves with the database instance.
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening IndexedDB. Caching will be disabled.');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        const store = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

/**
 * Stores a value in the IndexedDB cache and handles automatic cleanup of old entries.
 * @param key The cache key.
 * @param value The value to store (can be a large object or data URL).
 * @returns A promise that resolves with an object indicating if cleanup occurred.
 */
export const setCache = (key: string, value: any): Promise<{ cleanupOccurred: boolean }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbInstance = await initDB();
      const transaction = dbInstance.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      transaction.onerror = () => {
        console.error('Transaction error while setting cache.', transaction.error);
        reject('Transaction error.');
      };

      // This transaction will add/update the item and then trigger cleanup.
      const putRequest = store.put({ key, value, timestamp: Date.now() });

      putRequest.onsuccess = () => {
        // After successfully adding, check the count for cleanup.
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          const count = countRequest.result;
          if (count > MAX_CACHE_ITEMS) {
            const index = store.index('timestamp');
            const cursorRequest = index.openCursor(); // Oldest items first
            let itemsToDelete = count - MAX_CACHE_ITEMS;

            cursorRequest.onsuccess = (event) => {
              const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
              if (cursor && itemsToDelete > 0) {
                cursor.delete();
                itemsToDelete--;
                cursor.continue();
              }
            };
            resolve({ cleanupOccurred: true });
          } else {
            resolve({ cleanupOccurred: false });
          }
        };
        countRequest.onerror = () => resolve({ cleanupOccurred: false }); // Fail silently on count error
      };
      putRequest.onerror = () => resolve({ cleanupOccurred: false }); // Fail silently on put error

    } catch (error) {
      console.error("Failed to initiate set item in IndexedDB cache:", error);
      // Don't crash the app, resolve with no cleanup.
      resolve({ cleanupOccurred: false });
    }
  });
};


/**
 * Retrieves a value from the IndexedDB cache.
 * @param key The cache key.
 * @returns A promise that resolves with the cached value or null if not found.
 */
export const getCache = (key: string): Promise<any | null> => {
    return new Promise(async (resolve) => {
        try {
            const dbInstance = await initDB();
            const transaction = dbInstance.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onsuccess = () => {
                const result = request.result;
                resolve(result ? result.value : null);
            };

            request.onerror = () => {
                 console.error("Error getting cache item:", request.error);
                 resolve(null);
            };

        } catch (error) {
            console.error("Failed to get item from IndexedDB cache:", error);
            resolve(null); // Don't crash
        }
    });
};
