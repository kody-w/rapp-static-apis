// Run: node rapp-go/accessibility.test.mjs
import { readFileSync } from 'node:fs';

let pass=0,fail=0;
function ok(name,condition){if(condition){console.log(`PASS ${name}`);pass++;}else{console.log(`FAIL ${name}`);fail++;}}

const map=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const standalone=readFileSync(new URL('./catch.html',import.meta.url),'utf8');

ok('access: map exposes a native nearby action list',/id="nearby-list"/.test(map)&&/createElement\('button'\)/.test(map));
ok('access: actionable status chips render as native buttons',/createElement\(it\.onTap \? 'button' : 'div'\)/.test(map));
ok('access: encounter, POI, and bag expose named dialogs',(
  map.match(/role="dialog"/g)||[]).length>=3&&/aria-labelledby="enc-title"/.test(map)&&/aria-labelledby="poi-name"/.test(map)&&/aria-labelledby="bag-title"/.test(map));
ok('access: asynchronous catch and POI output uses live status regions',(
  map.match(/role="status"/g)||[]).length>=2&&/aria-atomic="true"/.test(map));
ok('access: both catch surfaces expose native throw buttons',/id="enc-throw"/.test(map)&&/id="throw-button"/.test(standalone));
ok('access: mobile zoom is not disabled',!map.includes('user-scalable=no')&&!standalone.includes('user-scalable=no'));

console.log(`\n${fail===0?'ALL PASS':'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail===0?0:1);
