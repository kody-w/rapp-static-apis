import {
  SIGNAL_FAMILIES, forgeCartridge, projectArtifact, reduceAudioMetadata,
  reduceAudioSamples, reduceIdentity, reduceImagePixels, reducePlace, reduceWeather
} from './lib/forge.js';
import { b64enc } from './lib/genome.js';
import { keepToBasket } from './lib/basket.js';
import { renderLoop, speciesOf } from './lib/fauna.js';
import { fetchSky } from './lib/weather.js';
import { mountNav } from './lib/nav.js';
import { shareCaught } from './onboard.js';
import { interrogate } from '../companion/twin.mjs';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const DEMO = params.get('demo') === '1';
const PREVIEW_AT = Date.now();
const signals = {};
const defaultStatuses = {
  image: 'waiting for light', voice: 'waiting for an echo', code: 'waiting for a code',
  object: 'waiting for an object', place: 'waiting for somewhere', weather: 'waiting for a sky'
};

let exactFix = null;
let currentCart = null;
let previewLoop = null;
let previewGeneration = 0;
let inputRevision = 0;
let workflowGeneration = 0;
let recording = null;
let barcode = null;
let nfcController = null;

mountNav({ active: 'forge', root: '..' });

function saveTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('rapp.theme', JSON.stringify(theme)); } catch {}
}

$('theme-button').addEventListener('click', () => {
  saveTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

function setFamilyStatus(family, text, state = '') {
  const status = $(family + '-status');
  status.textContent = text;
  status.className = 'signal-status' + (state ? ' ' + state : '');
}

function invalidateResult() {
  inputRevision++;
  currentCart = null;
  $('result').hidden = true;
  $('result').className = 'result';
}

$('memory-input').addEventListener('input', () => {
  if (!currentCart) return;
  invalidateResult();
  $('forge-status').className = '';
  $('forge-status').textContent = 'private memory changed · seal the egg again to update its local sidecar.';
});

function setSignal(family, feature, message) {
  signals[family] = feature;
  $('signal-' + family).classList.add('ready');
  setFamilyStatus(family, message, 'good');
  invalidateResult();
  updateCount();
  schedulePreview();
}

function updateCount() {
  const count = SIGNAL_FAMILIES.filter(family => signals[family]).length;
  $('signal-count').textContent = count + ' of 6 families sealed';
  $('forge-button').disabled = count === 0;
  $('forge-status').className = '';
  $('forge-status').textContent = count
    ? count + (count === 1 ? ' anchor is' : ' anchors are') + ' ready. Seal now or layer another.'
    : 'capture at least one signal to begin.';
}

function stopPreview() {
  if (previewLoop) {
    try { previewLoop.stop(); } catch {}
    previewLoop = null;
  }
}

async function schedulePreview() {
  const generation = ++previewGeneration;
  const count = Object.keys(signals).length;
  if (!count) {
    stopPreview();
    const canvas = $('artifact-canvas');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    $('stage-empty').hidden = false;
    $('stage-id').textContent = '';
    return;
  }
  $('stage-id').textContent = 'reducing traits…';
  try {
    const cart = await forgeCartridge(signals, {
      nowMs: PREVIEW_AT,
      ...(exactFix ? { lat: exactFix.lat, lng: exactFix.lng } : {})
    });
    if (generation !== previewGeneration) return;
    const verdict = await interrogate(cart, 'cart');
    if (generation !== previewGeneration) return;
    if (!verdict.ok) throw new Error(verdict.reasons[0]?.detail || 'preview did not clear');
    stopPreview();
    $('stage-empty').hidden = true;
    previewLoop = renderLoop(cart, $('artifact-canvas'), { size: 330, background: false });
    const species = speciesOf(cart);
    $('stage-id').textContent = cart.id + ' ✓ · ' + species.family;
  } catch (error) {
    if (generation !== previewGeneration) return;
    stopPreview();
    $('stage-id').textContent = 'preview error · ' + (error.message || error);
  }
}

async function imageFeature(file) {
  const url = URL.createObjectURL(file);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  try {
    const image = await new Promise((resolve, reject) => {
      const value = new Image();
      value.onload = () => resolve(value);
      value.onerror = () => reject(new Error('that image could not be read'));
      value.src = url;
    });
    const width = image.naturalWidth || image.width, height = image.naturalHeight || image.height;
    if (!width || !height) throw new Error('that image has no visible pixels');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.fillStyle = '#fff';
    context.fillRect(0, 0, 64, 64);
    const scale = Math.max(64 / width, 64 / height);
    const drawWidth = width * scale, drawHeight = height * scale;
    context.drawImage(image, (64 - drawWidth) / 2, (64 - drawHeight) / 2, drawWidth, drawHeight);
    return reduceImagePixels(context.getImageData(0, 0, 64, 64).data, 64, 64);
  } finally {
    URL.revokeObjectURL(url);
    canvas.width = canvas.height = 1;
  }
}

$('image-input').addEventListener('change', async event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const generation = workflowGeneration;
  setFamilyStatus('image', 'reducing pixels locally…');
  try {
    const feature = await imageFeature(file);
    if (generation !== workflowGeneration) return;
    const swatches = feature.palette.map(color => {
      const span = document.createElement('span');
      span.style.backgroundColor = color;
      return span;
    });
    $('image-palette').replaceChildren(...swatches);
    setSignal('image', feature, 'pixels released · palette, light, contrast, and edges sealed');
  } catch (error) {
    if (generation !== workflowGeneration) return;
    setFamilyStatus('image', error.message || 'image reduction failed', 'bad');
  } finally {
    event.target.value = '';
  }
});

async function decodeAudio(blob) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error('this browser cannot decode audio');
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData((await blob.arrayBuffer()).slice(0));
    const length = Math.min(decoded.length, Math.floor(decoded.sampleRate * 30));
    if (!length) throw new Error('that audio is empty');
    const samples = new Float32Array(length);
    for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
      const source = decoded.getChannelData(channel);
      for (let index = 0; index < length; index++) samples[index] += source[index] / decoded.numberOfChannels;
    }
    return reduceAudioSamples(samples, decoded.sampleRate, Math.min(decoded.duration, 30));
  } finally {
    try { await context.close(); } catch {}
  }
}

async function useAudio(blob, recordedDuration = null, generation = workflowGeneration) {
  setFamilyStatus('voice', 'reducing sound locally…');
  try {
    const feature = await decodeAudio(blob);
    if (generation !== workflowGeneration) return;
    setSignal('voice', feature, 'recording released · duration, energy, pulse, and tone sealed');
  } catch (error) {
    if (generation !== workflowGeneration) return;
    if (recordedDuration != null) {
      const feature = reduceAudioMetadata({ duration: recordedDuration, energy: 0.5, brightness: 0.5, pulse: 0.5 });
      setSignal('voice', feature, 'decoder unavailable · duration metadata sealed; raw recording released');
    } else {
      setFamilyStatus('voice', (error.message || 'audio reduction failed') + ' — use the typed traits below', 'bad');
    }
  }
}

function releaseTracks(stream) {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    try { track.stop(); } catch {}
  }
}

function resetRecordButton() {
  $('record-button').textContent = 'record voice';
  $('record-button').disabled = false;
  $('record-button').setAttribute('aria-pressed', 'false');
}

function stopRecording({ discard = false } = {}) {
  const active = recording;
  if (!active) return;
  active.discard = active.discard || discard;
  if (active.timer) clearTimeout(active.timer);
  $('record-button').disabled = true;
  $('record-button').textContent = 'reducing…';
  try {
    if (active.recorder.state !== 'inactive') active.recorder.stop();
    else releaseTracks(active.stream);
  } catch {
    releaseTracks(active.stream);
    recording = null;
    resetRecordButton();
  }
}

async function startRecording() {
  if (recording) {
    stopRecording();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    setFamilyStatus('voice', 'microphone recording is unavailable — choose audio or use typed traits', 'bad');
    return;
  }
  const generation = workflowGeneration;
  $('record-button').disabled = true;
  $('record-button').textContent = 'requesting…';
  setFamilyStatus('voice', 'requesting microphone…');
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (generation !== workflowGeneration) { releaseTracks(stream); return; }
    const recorder = new MediaRecorder(stream);
    const state = { recorder, stream, chunks: [], started: performance.now(), timer: null, discard: false, generation: workflowGeneration };
    recording = state;
    recorder.ondataavailable = event => { if (event.data && event.data.size) state.chunks.push(event.data); };
    recorder.onerror = () => {
      state.discard = true;
      releaseTracks(state.stream);
      if (recording === state) recording = null;
      resetRecordButton();
      setFamilyStatus('voice', 'recording failed — choose audio or use typed traits', 'bad');
    };
    recorder.onstop = async () => {
      releaseTracks(state.stream);
      if (recording === state) recording = null;
      const duration = clampDuration((performance.now() - state.started) / 1000);
      const blob = new Blob(state.chunks, { type: recorder.mimeType || 'audio/webm' });
      state.chunks.length = 0;
      resetRecordButton();
      if (!state.discard && blob.size) await useAudio(blob, duration, state.generation);
    };
    recorder.start();
    $('record-button').disabled = false;
    $('record-button').textContent = 'stop & reduce';
    $('record-button').setAttribute('aria-pressed', 'true');
    setFamilyStatus('voice', 'recording locally · stops after eight seconds');
    state.timer = setTimeout(() => stopRecording(), 8000);
  } catch {
    releaseTracks(stream);
    recording = null;
    resetRecordButton();
    if (generation !== workflowGeneration) return;
    setFamilyStatus('voice', 'microphone blocked — choose audio or use typed traits', 'bad');
  }
}

function clampDuration(value) {
  return Math.max(0.25, Math.min(30, Number(value) || 3));
}

$('record-button').addEventListener('click', startRecording);
$('audio-input').addEventListener('change', async event => {
  const file = event.target.files && event.target.files[0];
  const generation = workflowGeneration;
  if (file) await useAudio(file, null, generation);
  event.target.value = '';
});
$('voice-fallback').addEventListener('click', () => {
  const feature = reduceAudioMetadata({
    duration: $('voice-duration').value,
    energy: $('voice-energy').value,
    brightness: $('voice-brightness').value,
    pulse: $('voice-pulse').value
  });
  setSignal('voice', feature, 'typed audio metadata sealed · no recording needed');
});

async function sealCode(raw, format = 'typed', generation = workflowGeneration) {
  setFamilyStatus('code', 'reducing code locally…');
  try {
    const feature = await reduceIdentity('code', raw, { format });
    if (generation !== workflowGeneration) return;
    $('code-input').value = '';
    setSignal('code', feature, (feature.format === 'typed' ? 'pasted' : feature.format.replace(/_/g, ' ')) + ' identity committed · text released');
  } catch (error) {
    if (generation !== workflowGeneration) return;
    setFamilyStatus('code', error.message || 'code could not be reduced', 'bad');
  }
}

$('code-seal').addEventListener('click', () => sealCode($('code-input').value));
$('code-input').addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); sealCode(event.currentTarget.value); }
});

function stopBarcode() {
  const active = barcode;
  barcode = null;
  if (active?.timer) clearTimeout(active.timer);
  releaseTracks(active?.stream);
  $('code-video').srcObject = null;
  $('code-scanner').hidden = true;
}

async function startBarcode() {
  if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) {
    setFamilyStatus('code', 'camera scanning is unavailable — paste the code above', 'bad');
    return;
  }
  const generation = workflowGeneration;
  stopBarcode();
  const state = { detector: null, stream: null, timer: null, busy: false, generation };
  barcode = state;
  setFamilyStatus('code', 'requesting camera…');
  let stream = null;
  try {
    const wanted = ['qr_code', 'data_matrix', 'aztec', 'code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'pdf417'];
    const supported = typeof window.BarcodeDetector.getSupportedFormats === 'function'
      ? await window.BarcodeDetector.getSupportedFormats() : wanted;
    if (generation !== workflowGeneration || barcode !== state) return;
    const formats = wanted.filter(format => supported.includes(format));
    const detector = formats.length ? new window.BarcodeDetector({ formats }) : new window.BarcodeDetector();
    state.detector = detector;
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
    if (generation !== workflowGeneration || barcode !== state) { releaseTracks(stream); return; }
    state.stream = stream;
    const video = $('code-video');
    video.srcObject = stream;
    $('code-scanner').hidden = false;
    await video.play();
    setFamilyStatus('code', 'point the camera at a QR code or barcode');
    const look = async () => {
      if (barcode !== state) return;
      if (!state.busy && video.readyState >= 2) {
        state.busy = true;
        try {
          const found = await detector.detect(video);
          if (barcode !== state) return;
          if (found.length && found[0].rawValue) {
            const value = found[0].rawValue, format = found[0].format || 'unknown';
            stopBarcode();
            await sealCode(value, format, state.generation);
            return;
          }
        } catch {}
        finally { state.busy = false; }
      }
      if (barcode === state) state.timer = setTimeout(look, 220);
    };
    look();
  } catch {
    releaseTracks(stream);
    const stillActive = barcode === state;
    if (stillActive) stopBarcode();
    if (generation !== workflowGeneration || !stillActive) return;
    setFamilyStatus('code', 'camera blocked or scanner unavailable — paste the code above', 'bad');
  }
}

$('code-scan').addEventListener('click', startBarcode);
$('code-stop').addEventListener('click', () => {
  stopBarcode();
  setFamilyStatus('code', signals.code ? 'code identity already sealed' : defaultStatuses.code, signals.code ? 'good' : '');
});

async function sealObject(raw, source = 'typed', generation = workflowGeneration) {
  setFamilyStatus('object', 'reducing object identity locally…');
  try {
    const feature = await reduceIdentity('object', raw, { source });
    if (generation !== workflowGeneration) return;
    $('object-input').value = '';
    setSignal('object', feature, (source === 'nfc' ? 'NFC tag' : 'typed object') + ' committed · identity text released');
  } catch (error) {
    if (generation !== workflowGeneration) return;
    setFamilyStatus('object', error.message || 'object identity could not be reduced', 'bad');
  }
}

$('object-seal').addEventListener('click', () => sealObject($('object-input').value));
$('object-input').addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); sealObject(event.currentTarget.value); }
});

function stopNfc() {
  if (nfcController) {
    try { nfcController.abort(); } catch {}
    nfcController = null;
  }
  $('nfc-stop').hidden = true;
}

async function startNfc() {
  if (!('NDEFReader' in window)) {
    setFamilyStatus('object', 'Web NFC is unavailable here — type the object identity above', 'bad');
    return;
  }
  stopNfc();
  const controller = new AbortController();
  const generation = workflowGeneration;
  nfcController = controller;
  $('nfc-stop').hidden = false;
  setFamilyStatus('object', 'bring an NFC tag close…');
  try {
    const reader = new window.NDEFReader();
    reader.onreadingerror = () => {
      if (nfcController === controller) setFamilyStatus('object', 'that tag could not be read — type its identity instead', 'bad');
    };
    reader.onreading = async event => {
      if (nfcController !== controller) return;
      const parts = [];
      if (event.serialNumber) parts.push('serial:' + event.serialNumber);
      for (const record of event.message?.records || []) {
        let data = '';
        try { if (record.data) data = new TextDecoder(record.encoding || 'utf-8').decode(record.data); } catch {}
        parts.push([record.recordType || '', record.mediaType || '', record.id || '', data].join(':'));
      }
      stopNfc();
      await sealObject(parts.filter(Boolean).join('|'), 'nfc', generation);
    };
    await reader.scan({ signal: controller.signal });
  } catch (error) {
    if (error?.name !== 'AbortError') setFamilyStatus('object', 'NFC blocked or unavailable — type the object identity above', 'bad');
    stopNfc();
  }
}

$('nfc-scan').addEventListener('click', startNfc);
$('nfc-stop').addEventListener('click', () => {
  stopNfc();
  setFamilyStatus('object', signals.object ? 'object identity already sealed' : defaultStatuses.object, signals.object ? 'good' : '');
});

function locate() {
  if (DEMO) return Promise.resolve({ lat: 40.7128, lng: -74.0060 });
  if (!navigator.geolocation) return Promise.reject(new Error('location is unavailable'));
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => reject(new Error('location was not shared')),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 12000 }
    );
  });
}

async function ensureFix(generation = workflowGeneration) {
  if (exactFix) return exactFix;
  const fix = await locate();
  if (generation === workflowGeneration) exactFix = fix;
  return fix;
}

async function sensePlace() {
  const generation = workflowGeneration;
  setFamilyStatus('place', 'sensing locally…');
  try {
    const fix = await ensureFix(generation);
    const feature = await reducePlace(fix);
    if (generation !== workflowGeneration) return;
    setSignal('place', feature, 'coarse gene cell sealed · precise fix reserved for the local egg');
  } catch (error) {
    if (generation !== workflowGeneration) return;
    setFamilyStatus('place', (error.message || 'place unavailable') + ' — type a place identity instead', 'bad');
  }
}

$('place-sense').addEventListener('click', sensePlace);
$('place-seal').addEventListener('click', async () => {
  const generation = workflowGeneration;
  const label = $('place-input').value;
  setFamilyStatus('place', 'reducing place identity locally…');
  try {
    const feature = await reducePlace({ ...(exactFix || {}), label });
    if (generation !== workflowGeneration) return;
    $('place-input').value = '';
    setSignal('place', feature, 'place identity committed · typed text released');
  } catch (error) {
    if (generation !== workflowGeneration) return;
    setFamilyStatus('place', error.message || 'place could not be reduced', 'bad');
  }
});
$('place-input').addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); $('place-seal').click(); }
});

async function senseWeather() {
  const generation = workflowGeneration;
  setFamilyStatus('weather', 'feeling the nearby sky…');
  try {
    const fix = await ensureFix(generation);
    if (generation !== workflowGeneration) return;
    if (!signals.place) {
      const place = await reducePlace(fix);
      setSignal('place', place, 'coarse gene cell sealed · precise fix reserved for the local egg');
    }
    const sky = DEMO
      ? { temp: 18.5, weathercode: 2, wind: 11, isDay: 1 }
      : await fetchSky(fix.lat, fix.lng, Date.now());
    if (generation !== workflowGeneration) return;
    const feature = reduceWeather(sky);
    setSignal('weather', feature, feature.temp + '°C · WMO ' + feature.weathercode + ' · wind ' + feature.wind + ' km/h sealed');
  } catch (error) {
    if (generation !== workflowGeneration) return;
    setFamilyStatus('weather', (error.message || 'weather unavailable') + ' — enter observations below', 'bad');
  }
}

$('weather-sense').addEventListener('click', senseWeather);
$('weather-fallback').addEventListener('click', () => {
  try {
    const feature = reduceWeather({
      temp: $('weather-temp').value,
      weathercode: $('weather-code').value,
      wind: $('weather-wind').value,
      isDay: $('weather-day').value
    });
    setSignal('weather', feature, feature.temp + '°C · WMO ' + feature.weathercode + ' · wind ' + feature.wind + ' km/h sealed');
  } catch (error) {
    setFamilyStatus('weather', error.message || 'weather values are incomplete', 'bad');
  }
});

function safeRoomLinks(cart) {
  const projected = projectArtifact(cart);
  const fragment = b64enc(JSON.stringify(projected));
  $('hologram-link').href = '../hologram/player.html' + (DEMO ? '?demo=1' : '') + '#' + fragment;
  $('companion-link').href = '../companion/index.html' + (DEMO ? '?demo=1' : '') + '#' + fragment;
}

function showResult(cart, saved, error = null) {
  const result = $('result');
  result.hidden = false;
  result.className = 'result ' + (saved ? 'success' : 'error');
  $('result-title').textContent = cart.title;
  $('result-id').textContent = cart.id + ' ✓';
  $('result-copy').textContent = saved
    ? 'Verified by genome hash, cleared by Companion, and kept in your existing basket. Public doors below carry only coarse bones.'
    : 'The artifact is verified, but the local basket could not save it' + (error ? ': ' + error : '.') + ' Download it or retry the basket.';
  const species = speciesOf(cart);
  $('personality-copy').textContent = species.family + ' · deterministic fauna';
  $('identity-copy').textContent = cart.id + ' = genomeId(genome)';
  $('retry-save').hidden = saved;
  safeRoomLinks(cart);
  result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
}

async function saveCurrent(cart = currentCart, revision = inputRevision) {
  if (!cart) return false;
  try {
    await keepToBasket(cart, { demo: DEMO });
    if (revision !== inputRevision || currentCart !== cart) return true;
    showResult(cart, true);
    $('forge-status').className = 'good';
    $('forge-status').textContent = 'sealed, verified, and kept ✓';
    return true;
  } catch (error) {
    if (revision !== inputRevision || currentCart !== cart) return false;
    showResult(cart, false, error.message || 'storage unavailable');
    $('forge-status').className = 'bad';
    $('forge-status').textContent = 'identity verified; basket save needs attention.';
    return false;
  }
}

async function forge() {
  if (!Object.keys(signals).length) return;
  const revision = inputRevision;
  const button = $('forge-button');
  button.disabled = true;
  button.textContent = 'interrogating…';
  $('forge-status').className = '';
  $('forge-status').textContent = 'deriving genome, identity, and safe projection…';
  try {
    const cart = await forgeCartridge(signals, {
      nowMs: Date.now(),
      note: $('memory-input').value,
      ...(exactFix ? { lat: exactFix.lat, lng: exactFix.lng } : {})
    });
    if (revision !== inputRevision) return;
    const verdict = await interrogate(cart, 'cart');
    if (revision !== inputRevision) return;
    if (!verdict.ok) throw new Error('Companion quarantine: ' + (verdict.reasons[0]?.detail || 'artifact did not clear'));
    const publicCart = projectArtifact(cart);
    const publicVerdict = await interrogate(publicCart, 'cart');
    if (revision !== inputRevision) return;
    if (!publicVerdict.ok) throw new Error('public projection did not clear interrogation');
    currentCart = cart;
    await saveCurrent(cart, revision);
  } catch (error) {
    if (revision !== inputRevision) return;
    currentCart = null;
    $('forge-status').className = 'bad';
    $('forge-status').textContent = error.message || 'the artifact could not be sealed';
  } finally {
    button.disabled = Object.keys(signals).length === 0;
    button.textContent = 'forge & keep in basket';
  }
}

$('forge-button').addEventListener('click', forge);
$('retry-save').addEventListener('click', async () => {
  $('retry-save').disabled = true;
  await saveCurrent();
  $('retry-save').disabled = false;
});
$('share-button').addEventListener('click', async () => {
  if (!currentCart) return;
  try {
    await shareCaught(currentCart, '', { demo: DEMO });
    $('forge-status').className = 'good';
    $('forge-status').textContent = 'shared through the existing coarse bones-only projection ✓';
  } catch {
    $('forge-status').className = 'bad';
    $('forge-status').textContent = 'sharing was cancelled or unavailable; the private egg stayed local.';
  }
});
$('download-button').addEventListener('click', () => {
  if (!currentCart) return;
  const blob = new Blob([JSON.stringify(currentCart, null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = currentCart.title.replace(/[^a-z0-9_-]+/gi, '-') + '.egg';
  link.click();
  setTimeout(() => URL.revokeObjectURL(href), 0);
});

function resetForge() {
  workflowGeneration++;
  previewGeneration++;
  stopPreview();
  stopRecording({ discard: true });
  stopBarcode();
  stopNfc();
  for (const family of SIGNAL_FAMILIES) {
    delete signals[family];
    $('signal-' + family).classList.remove('ready');
    setFamilyStatus(family, defaultStatuses[family]);
  }
  exactFix = null;
  invalidateResult();
  $('memory-input').value = '';
  $('image-palette').replaceChildren();
  for (const id of ['image-input', 'audio-input', 'code-input', 'object-input', 'place-input']) $(id).value = '';
  updateCount();
  schedulePreview();
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

$('reset-button').addEventListener('click', resetForge);

function cleanup() {
  workflowGeneration++;
  previewGeneration++;
  stopPreview();
  stopRecording({ discard: true });
  stopBarcode();
  stopNfc();
}

addEventListener('pagehide', cleanup);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopRecording({ discard: true });
    stopBarcode();
    stopNfc();
  }
});

if (!('BarcodeDetector' in window)) $('code-scan').textContent = 'camera unavailable · paste';
if (!('NDEFReader' in window)) $('nfc-scan').textContent = 'NFC unavailable · type';
if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

updateCount();
