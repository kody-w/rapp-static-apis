// nav.js — the rapp·go room-switcher (golive-brief §H.3). One app, many rooms:
// map · twin · basket · lantern · journal. Import, don't fork (cohesion-brief §5).
// Contract: mountNav({ active, root }) — see rapp-go/design/nav-contract.md.
// Quiet, bottom, thumb-reachable, standalone-aware. Zero deps; relative links only
// (the site is a project page — root-absolute paths would 404).

const ROOMS = [
  { key: 'map',     glyph: '◈', label: 'map',     href: r => `${r}/rapp-go/index.html` },
  { key: 'twin',    glyph: '◍', label: 'twin',    href: r => `${r}/companion/index.html` },
  { key: 'basket',  glyph: '●', label: 'basket',  href: r => `${r}/hologram/index.html` },
  { key: 'lantern', glyph: '○', label: 'lantern', href: r => `${r}/lantern/index.html` },
  { key: 'journal', glyph: '□', label: 'journal', href: () => null },  // room not landed yet
];

const CSS = `
.rappgo-nav{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);
  transform:translateX(-50%);z-index:20;display:flex;gap:2px;padding:5px;border-radius:999px;
  background:var(--go-panel,rgba(249,250,247,.92));border:1px solid var(--go-line,rgba(60,66,74,.16));
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  box-shadow:0 6px 24px rgba(0,0,0,.16);font-family:-apple-system,system-ui,"Segoe UI",Roboto,sans-serif}
.rappgo-nav a{display:flex;flex-direction:column;align-items:center;gap:1px;min-width:52px;
  padding:6px 8px;border-radius:999px;text-decoration:none;color:var(--go-dim,#6b7280);
  font-size:10px;letter-spacing:.08em;text-transform:lowercase;user-select:none}
.rappgo-nav a .g{font-size:15px;line-height:1}
.rappgo-nav a.on{color:var(--go-fg,#3a4048);
  background:color-mix(in srgb, var(--go-accent,#5a96ff) 16%, transparent)}
.rappgo-nav a.off{opacity:.35;pointer-events:none}
html[data-theme="dark"] .rappgo-nav{box-shadow:0 6px 24px rgba(0,0,0,.45)}
`;

export function mountNav({ active, root = '..' } = {}) {
  if (typeof document === 'undefined') return null;
  if (!document.querySelector('style[data-rappgo-nav]')) {
    const st = document.createElement('style');
    st.setAttribute('data-rappgo-nav', '');
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  let nav = document.querySelector('nav.rappgo-nav');
  if (!nav) { nav = document.createElement('nav'); nav.className = 'rappgo-nav'; document.body.appendChild(nav); }
  nav.innerHTML = '';
  nav.setAttribute('aria-label', 'rooms');
  const demoSuffix = new URLSearchParams(location.search).get('demo') === '1' ? '?demo=1' : '';
  for (const room of ROOMS) {
    const a = document.createElement('a');
    const href = room.href(root);
    if (href) a.href = href + demoSuffix; else a.className = 'off';
    if (room.key === active) a.className = (a.className ? a.className + ' ' : '') + 'on';
    a.innerHTML = `<span class="g">${room.glyph}</span>${room.label}`;
    nav.appendChild(a);
  }
  return nav;
}

export default { mountNav };
