// Run: node rapp-go/basket.test.mjs
import { keepToBasket } from './lib/basket.js';

let pass=0,fail=0;
function ok(name,condition){if(condition){console.log(`PASS ${name}`);pass++;}else{console.log(`FAIL ${name}`);fail++;}}
const cart={id:'abc123def456',title:'test',born:{from:'test'},genome:{layers:[]}};

globalThis.indexedDB={open(){throw new Error('blocked');}};
let syncRejected=false;
try{await keepToBasket(cart);}catch(e){syncRejected=e.message==='blocked';}
ok('basket: synchronous open failures reject',syncRejected);

function requestWith(outcome){
  const req={};
  queueMicrotask(()=>{
    const tx={error:null,objectStore(){return{put(){}}}};
    const db={transaction(){return tx;},close(){}};
    req.onsuccess({target:{result:db}});
    queueMicrotask(()=>outcome==='complete'?tx.oncomplete():tx.onabort());
  });
  return req;
}

globalThis.indexedDB={open(){return requestWith('abort');}};
let abortRejected=false;
try{await keepToBasket(cart);}catch(e){abortRejected=/aborted/.test(e.message);}
ok('basket: transaction aborts reject instead of hanging',abortRejected);

let blockedWrites=0,blockedCloses=0;
globalThis.indexedDB={open(){
  const req={};
  queueMicrotask(()=>{
    req.onblocked();
    queueMicrotask(()=>req.onsuccess({target:{result:{close(){blockedCloses++;},transaction(){blockedWrites++;return{objectStore(){return{put(){}}}};}}}}));
  });
  return req;
}};
try{await keepToBasket(cart);}catch{}
await new Promise(resolve=>setTimeout(resolve,0));
ok('basket: blocked-then-success requests neither write nor leak the connection',blockedWrites===0&&blockedCloses===1);

globalThis.indexedDB={open(){return requestWith('complete');}};
await keepToBasket(cart);
ok('basket: successful transaction resolves',true);

console.log(`\n${fail===0?'ALL PASS':'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail===0?0:1);
