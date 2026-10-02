// One installed app owns every room. The worker lives at the repository root so
// map, twin, basket, and lantern remain inside one offline-capable PWA scope.

const ROOT_SW = new URL('../../sw.js', import.meta.url);
const ROOT_SCOPE = new URL('../../', import.meta.url).href;
const LEGACY_SCOPES = new Set([
  new URL('../', import.meta.url).href,
  new URL('../../companion/', import.meta.url).href
]);

let registrationPromise = null;
let navigationBound = false;

export function isInstalledApp() {
  try {
    return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  } catch {
    return false;
  }
}

function bindInstalledNavigation() {
  if (navigationBound || typeof document === 'undefined') return;
  navigationBound = true;
  document.addEventListener('click', event => {
    if (!isInstalledApp()) return;
    const anchor = event.target && event.target.closest ? event.target.closest('a[target="_blank"]') : null;
    if (!anchor || anchor.hasAttribute('download')) return;
    let url;
    try { url = new URL(anchor.href, location.href); } catch { return; }
    const rootPath = new URL(ROOT_SCOPE).pathname;
    if (url.origin !== location.origin || !url.pathname.startsWith(rootPath)) return;
    event.preventDefault();
    location.href = url.href;
  }, true);
}

function waitForActive(registration) {
  if (registration.active) return Promise.resolve(true);
  const worker = registration.installing || registration.waiting;
  if (!worker) return Promise.resolve(false);
  return new Promise(resolve => {
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      worker.removeEventListener('statechange', changed);
      clearTimeout(timeout);
      resolve(value);
    };
    const changed = () => {
      if (worker.state === 'activated') finish(true);
      else if (worker.state === 'redundant') finish(false);
    };
    const timeout = setTimeout(() => finish(!!registration.active), 15000);
    worker.addEventListener('statechange', changed);
    changed();
  });
}

export function registerAppShell() {
  bindInstalledNavigation();
  if (registrationPromise) return registrationPromise;
  if (typeof navigator === 'undefined' || !navigator.serviceWorker) return Promise.resolve(null);
  registrationPromise = navigator.serviceWorker.register(ROOT_SW.href).then(async registration => {
    if (!(await waitForActive(registration))) return registration;
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations
        .filter(item => item.scope !== ROOT_SCOPE && LEGACY_SCOPES.has(item.scope))
        .map(item => item.unregister()));
    } catch {}
    return registration;
  }).catch(() => null);
  return registrationPromise;
}

export default { isInstalledApp, registerAppShell };
