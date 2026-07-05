---
name: verify
description: Build, launch, and drive pauldiazashot.com locally to verify changes end-to-end in a real browser
---

# Verifying pauldiazashotsite

Static Astro site, no test infra. Verification = build, serve, drive in
headless Chrome, screenshot.

## Build & serve

```bash
npm run build                      # static build into dist/
npm run preview -- --port 4399 &   # serves dist/ (astro preview)
```

Routes: `/` (EN), `/ru/` (RU mirror), `/cv`, `/artifacts`. Language switch =
taskbar at the bottom; state persists via sessionStorage `pdos-state-v1`
(windows/sections/sidenotes/scroll) + `pdos-warm` loader-skip flag.

## Drive

No playwright in the repo. Install `playwright-core` in the session
scratchpad and use the system Chrome — no browser download needed:

```bash
cd <scratchpad> && npm i playwright-core
```

```js
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
```

Gotchas learned 2026-07-05:

- The boot loader covers everything for ~3s; `page.mouse.click(400,400)` then
  `waitForTimeout(1400)` to reach the interactive page. Warm boots (taskbar
  navigation) skip it — assert `#overlay.watermarked` right after load.
- Mobile inline mode = `(max-width: 700px) or (hover:none) and (pointer:coarse)`;
  emulate with `viewport 390x844, isMobile, hasTouch`. Desktop windows become
  inline panels (`.mobile-window-inline`).
- Buttons are atomic inline boxes in Blink: a line can break between an inline
  trigger `<button>` and trailing punctuation. Word-joiner does NOT fix it;
  the `.glue { white-space: nowrap }` wrapper does. Check for orphaned
  punctuation when copy changes.
- A full 36-check drive script covering both languages, persistence
  round-trips, cold/warm boot, mobile, and breakpoint crossing exists in this
  session's scratchpad as `drive.mjs` / `breakpoint.mjs` — copy the pattern.
- EN/RU pages must stay structural mirrors (same ids); a quick parity check is
  grepping both for `data-window-trigger`, `id=` on Collapsible/Sidenote.
