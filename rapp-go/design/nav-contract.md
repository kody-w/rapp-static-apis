# nav-contract — the room-switcher (golive-brief §H.3, landed)

The one nav for the one app. Every room imports it; nobody forks it.

```js
import { mountNav } from '<relative>/rapp-go/lib/nav.js';
mountNav({ active: 'map', root: '..' });
```

- `active` — which room this page is: `map | twin | basket | lantern | journal`.
- `root` — the RELATIVE prefix from the consuming page to the repo root
  (`'..'` from `/rapp-go/`, `/hologram/`, `/companion/`, `/lantern/`). Never absolute:
  the site is a GitHub Pages project page.

Rooms → targets: map → `rapp-go/index.html`, twin → `companion/index.html`,
basket → `hologram/index.html`, lantern → `lantern/index.html`, journal → disabled
placeholder until the JOURNAL brief lands.

Styling: self-injected `<style data-rappgo-nav>`; colors read the host page's
`--go-panel/--go-line/--go-fg/--go-dim/--go-accent` vars with fallbacks, and respect
`html[data-theme]`. Bottom-fixed, thumb-reachable, safe-area aware. Idempotent:
calling `mountNav` again re-renders the same element.
