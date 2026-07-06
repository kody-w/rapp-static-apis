// rapp-go/lib/basket.js — keepToBasket copied BYTE-FOR-BYTE from
// hologram/index.html@e4a776caf7aecdec28fa2c1b803b3c1eda5454eb (L421-444).
// The only change is the `export` keyword and this header.
//
// Byte-identical IndexedDB semantics on purpose: db `rapp-basket` v1, store
// `eggs`, keyPath `id`, record `{id, egg, title, born, addedAt}`. The Weather
// Cabinet's kept-strip and the Companion read this exact store with zero glue and
// no DB-version bump — a caught sky is indistinguishable from a cabinet/companion
// egg. Do NOT change the db name, version, store, keyPath, or record shape.
//
// This function rejects on error exactly like the original; callers wrap the
// `await keepToBasket(cart)` in try/catch so a full/blocked DB degrades gracefully
// (per the rapp-go storage policy) without changing this writer's semantics.

export async function keepToBasket(cart) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('rapp-basket', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('eggs'))
        db.createObjectStore('eggs', { keyPath: 'id' });
    };
    req.onsuccess = e => {
      const db = e.target.result;
      const tx = db.transaction('eggs', 'readwrite');
      tx.objectStore('eggs').put({
        id: cart.id,
        egg: cart,
        title: cart.title || 'organism',
        born: (cart.born && cart.born.from) || '',
        addedAt: Date.now()
      });
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    };
    req.onerror = () => reject(req.error);
  });
}
