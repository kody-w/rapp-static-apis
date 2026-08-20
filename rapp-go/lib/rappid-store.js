// rapp-go/lib/rappid-store.js — local-first persistence for species catalogs
// and individual dimension registries. No private state leaves this browser.

const DB_VERSION = 1;
const DB_LIVE = 'rapp-go-v2';
const DB_DEMO = 'rapp-go-v2-demo';

function databaseName(demo) {
  return demo ? DB_DEMO : DB_LIVE;
}

function openDatabase({ demo = false, indexedDBImpl = globalThis.indexedDB } = {}) {
  return new Promise((resolve, reject) => {
    if (!indexedDBImpl) { reject(new Error('IndexedDB is unavailable')); return; }
    let request, settled = false;
    const finish = (error, db = null) => {
      if (settled) {
        if (db) try { db.close(); } catch {}
        return;
      }
      settled = true;
      if (error) reject(error); else resolve(db);
    };
    try { request = indexedDBImpl.open(databaseName(demo), DB_VERSION); }
    catch (error) { finish(error); return; }
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('organisms')) {
        const organisms = db.createObjectStore('organisms', { keyPath: 'rappid' });
        organisms.createIndex('ancestor', 'ancestor.objectHash', { unique: false });
        organisms.createIndex('species', 'species.id', { unique: false });
        organisms.createIndex('parent', 'parent.rappid', { unique: false });
      }
      if (!db.objectStoreNames.contains('catalogs')) {
        db.createObjectStore('catalogs', { keyPath: 'id' });
      }
    };
    request.onsuccess = event => finish(null, event.target.result);
    request.onerror = () => finish(request.error || new Error('RAPPID store open failed'));
    request.onblocked = () => finish(new Error('RAPPID store open blocked'));
  });
}

function transact(storeName, mode, operation, options) {
  return openDatabase(options).then(db => new Promise((resolve, reject) => {
    let settled = false;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      try { db.close(); } catch {}
      if (error) reject(error); else resolve(value);
    };
    let tx;
    try {
      tx = db.transaction(storeName, mode);
      operation(tx.objectStore(storeName), finish);
    } catch (error) {
      finish(error);
      return;
    }
    tx.onerror = () => finish(tx.error || new Error(`${storeName} transaction failed`));
    tx.onabort = () => finish(tx.error || new Error(`${storeName} transaction aborted`));
  }));
}

export function saveOrganism(organism, options = {}) {
  return transact('organisms', 'readwrite', (store, finish) => {
    store.put(organism);
    store.transaction.oncomplete = () => finish(null, organism);
  }, options);
}

export function getOrganism(rappid, options = {}) {
  return transact('organisms', 'readonly', (store, finish) => {
    const request = store.get(rappid);
    request.onsuccess = () => finish(null, request.result || null);
    request.onerror = () => finish(request.error || new Error('organism read failed'));
  }, options);
}

export function listOrganisms(options = {}) {
  return transact('organisms', 'readonly', (store, finish) => {
    const request = store.getAll();
    request.onsuccess = () => finish(null, request.result || []);
    request.onerror = () => finish(request.error || new Error('organism list failed'));
  }, options);
}

export function saveCatalog(catalog, options = {}) {
  return transact('catalogs', 'readwrite', (store, finish) => {
    store.put(catalog);
    store.transaction.oncomplete = () => finish(null, catalog);
  }, options);
}

export function listCatalogs(options = {}) {
  return transact('catalogs', 'readonly', (store, finish) => {
    const request = store.getAll();
    request.onsuccess = () => finish(null, request.result || []);
    request.onerror = () => finish(request.error || new Error('catalog list failed'));
  }, options);
}

export function listBasketCarts({
  demo = false,
  indexedDBImpl = globalThis.indexedDB
} = {}) {
  return new Promise((resolve, reject) => {
    if (!indexedDBImpl) { reject(new Error('IndexedDB is unavailable')); return; }
    let request, settled = false;
    const finish = (error, value, db = null) => {
      if (settled) {
        if (db) try { db.close(); } catch {}
        return;
      }
      settled = true;
      if (db) try { db.close(); } catch {}
      if (error) reject(error); else resolve(value);
    };
    try { request = indexedDBImpl.open(demo ? 'rapp-basket-demo' : 'rapp-basket', 1); }
    catch (error) { finish(error); return; }
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('eggs')) db.createObjectStore('eggs', { keyPath: 'id' });
    };
    request.onsuccess = event => {
      const db = event.target.result;
      if (settled) { try { db.close(); } catch {} return; }
      let tx;
      try { tx = db.transaction('eggs', 'readonly'); }
      catch (error) { finish(error, null, db); return; }
      const read = tx.objectStore('eggs').getAll();
      read.onsuccess = () => {
        const carts = (read.result || []).map(record => record.egg).filter(Boolean);
        finish(null, carts, db);
      };
      read.onerror = () => {
        const error = read.error || new Error('basket read failed');
        finish(error, null, db);
      };
      tx.onabort = () => {
        const error = tx.error || new Error('basket read aborted');
        finish(error, null, db);
      };
    };
    request.onerror = () => finish(request.error || new Error('basket open failed'));
    request.onblocked = () => finish(new Error('basket open blocked'));
  });
}
