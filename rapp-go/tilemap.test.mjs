// Run: node rapp-go/tilemap.test.mjs
import { TileMap, projectWorld } from './tilemap.js';

let pass = 0, fail = 0;
function ok(name, condition, detail = '') {
  if (condition) { console.log(`PASS ${name}`); pass++; }
  else { console.log(`FAIL ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

const map = Object.create(TileMap.prototype);
Object.assign(map, {
  cache: new Map(),
  wantSet: new Set(),
  _retryAt: new Map(),
  _retryCount: new Map(),
  _retryTimers: new Map()
});

let closed = 0;
for (let i = 0; i < 25; i++) {
  map._setCache('tile-' + i, { width: 1024, height: 1024, close() { closed++; } });
}
const bytes = [...map.cache.values()].reduce((sum, entry) => sum + entry.bytes, 0);
ok('tiles: decoded cache stays within the 80 MiB budget', bytes <= 80 * 1024 * 1024, `${bytes} bytes`);
ok('tiles: LRU eviction closes decoded image resources', closed >= 5, `closed=${closed}`);

map._clearDecodedTiles();
ok('tiles: clearing a provider disposes every remaining image exactly once', closed === 25, `closed=${closed}`);
ok('tiles: provider clear leaves no decoded entries', map.cache.size === 0);

const visible = Object.create(TileMap.prototype);
Object.assign(visible, {
  cache: new Map(),
  wantSet: new Set(Array.from({ length: 21 }, (_, i) => 'visible-' + i)),
  _retryAt: new Map(),
  _retryCount: new Map(),
  _retryTimers: new Map(),
  _markDirty() {}
});
let visibleClosed = 0;
for (let i = 0; i < 21; i++) visible._setCache('visible-' + i, { width:1024, height:1024, close(){ visibleClosed++; } });
const visibleBytes = [...visible.cache.values()].reduce((sum, entry) => sum + entry.bytes, 0);
ok('tiles: the byte budget remains hard even when every decoded tile is visible', visibleBytes <= 80 * 1024 * 1024, `${visibleBytes} bytes`);
ok('tiles: over-budget visible admission disposes a decoded tile', visibleClosed >= 1);
for (const timer of visible._retryTimers.values()) clearTimeout(timer);
visible._clearDecodedTiles();

const zoomed = Object.create(TileMap.prototype);
Object.assign(zoomed, {
  z:16, scale:1, cw:390, ch:844, center:projectWorld(40.7128,-74.0060,16),
  providerName:'positron', player:{lat:40.7128,lng:-74.0060}, _playerDisp:{}, _playerTarget:{}, _markDirty(){}
});
zoomed._setZoom(17);
ok('tiles: zoom immediately reprojects the player marker',
  zoomed._playerDisp && zoomed._playerTarget && Number.isFinite(zoomed._playerDisp.x) && zoomed._playerDisp.x === zoomed._playerTarget.x);

const themed=Object.create(TileMap.prototype);
Object.assign(themed,{providerName:'positron',dark:false,_providerGeneration:0,_controllers:new Map(),_netFails:0,_netOk:0,state:new Map(),queue:[],_retryAt:new Map(),_retryCount:new Map(),_retryTimers:new Map(),_clearDecodedTiles(){},_markDirty(){}});
themed.setProvider('dark_matter');
const becameDark=themed.dark===true;
themed.setProvider('positron');
ok('tiles: map palette follows the selected provider',becameDark&&themed.dark===false);

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
