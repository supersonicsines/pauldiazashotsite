# Review Checklist - pauldiazashotsite

**Last aligned:** 2026-07-01  
**Build status:** `npm run build` passes  
**Current direction:** compact interactive CV with collapsible sections,
sidenotes, hover cards, and retro desktop windows.

---

## Built Structure

1. **Header** - name, locations, contact, site, handle.
2. **Introduction** - founder-operator summary, GMX preview trigger,
   AI-deployment positioning, right-to-work sidenote, PDF link.
3. **Experience** - Portico, GMX, Effie Perine. Role/detail context appears in
   windows and hover cards.
4. **Current AI Deployments** - Slashwork, Pawlymarket, Vinted-to-Depop agent,
   intelligent booking system.
5. **Education** - default-collapsed.
6. **Skills** - default-collapsed.
7. **Footer** - email, handle, PDF download.

Routes currently built:

- `/`
- `/ru/` (Russian mirror of `/`)
- `/cv`
- `/artifacts`
- `/artifacts/Example`

There is no custom 404 route yet.

---

## Manual QA

### Build

- [x] `npm run build` passes.
- [ ] `npm run preview` checked locally after build.

### Collapsible Sections

- [ ] Introduction toggles open/closed.
- [ ] Experience toggles open/closed.
- [ ] Current AI Deployments toggles open/closed.
- [ ] Education starts collapsed and can open.
- [ ] Skills starts collapsed and can open.
- [ ] Arrow rotates correctly on collapse.

### Desktop Windows

- [ ] Clicking GMX in the Introduction opens the `https://gmx.io` preview.
- [ ] Clicking Gammaswap opens the Gammaswap preview.
- [ ] Clicking Codex.io opens the Codex.io preview.
- [ ] Clicking Slashwork opens the Slashwork preview.
- [ ] Clicking Portico Ventures opens the Portico role window.
- [ ] Clicking GMX role title opens the GMX role window.
- [ ] Clicking Pawlymarket opens the Pawlymarket window with dashboard media.
- [ ] Clicking Vinted-to-Depop opens the Vinted window with media.
- [ ] Dragging a window title bar repositions it.
- [ ] Resizing works for resizable windows.
- [ ] Minimize sends a window to the left dock.
- [ ] Dock appears only when at least one window is minimized.
- [ ] Dock restore reopens the minimized window.
- [ ] Dock close removes the minimized window.
- [ ] Close control closes an open window.
- [ ] Clicking a window brings it to the front.
- [ ] Escape closes all open, non-minimized windows.
- [ ] Multiple windows can be open at once.

### Mobile / Coarse Pointer

- [ ] Desktop windows and dock are hidden.
- [ ] Window content opens inline under the relevant trigger.
- [ ] Inline window content is readable and does not overflow the viewport.
- [ ] Preview media keeps a stable aspect ratio.

### Hover Cards

- [ ] Gambit -> GMX rebrand hover card opens on hover/focus.
- [ ] Effie Perine hover card opens on hover/focus.
- [ ] Hover cards are readable at common desktop widths.
- [ ] Hover cards do not cover critical adjacent text in a broken way.

### Sidenotes

- [ ] Right-to-work sidenote expands inline from the dagger marker.
- [ ] Arbitrum sidenote expands inline from the dagger marker.
- [ ] Avalanche sidenote expands inline from the dagger marker.
- [ ] Intelligent booking system sidenote expands inline from the dagger marker.
- [ ] Sidenote links open correctly.

### Taskbar / Bilingual

- [x] Taskbar renders on `/` and `/ru/` with the current app depressed.
- [x] Clicking РУССКИЙ on `/` lands on `/ru/` without replaying the loader.
- [x] Open windows keep position, size, and z-order across the switch.
- [x] Minimized windows stay in the dock across the switch (labels localize).
- [x] Collapsed/expanded sections and sidenotes persist across the switch.
- [x] Scroll position persists across the switch.
- [x] Mobile inline panels persist across the switch.
- [x] Direct `/ru/` visit cold-boots with the loader and default state.
- [x] `/ru/` PDF links (intro + footer) point to `/Paul_Diaz_Ashot_CV_RU.pdf`.
- [x] Tray shows `EN`/`RU` indicator and a live clock.
- [x] Escape-closed windows stay closed after a language switch.

(Automated pass 2026-07-05 via headless Chrome, 36 checks.)

### Loader / Watermark

- [ ] Initial symbol loader appears.
- [ ] Loader symbol cycles before transition.
- [ ] Click skips the wait and triggers transition.
- [ ] Auto transition happens after roughly 3 seconds.
- [ ] Watermark remains faint and does not interfere with readability.
- [ ] List marker symbols cycle on hover.

### Links and Media

- [ ] PDF download link resolves to `/Paul_Diaz_Ashot_CV.pdf`.
- [ ] External preview arrows open the external sites in new tabs.
- [ ] Preview screenshots render from `public/previews/`.
- [ ] CV window images render from `public/images/cv/`.
- [ ] Favicon renders.

---

## Current Backlog

- [ ] Add custom `src/pages/404.astro`.
- [ ] Add richer Open Graph and Twitter card metadata.
- [ ] Generate and wire an OG image.
- [ ] Run Lighthouse and fix any score below 95.
- [ ] Decide whether `/artifacts` should ship publicly or remain dev/demo
  scaffolding.
- [ ] Decide whether to add the older Wittgenstein/Yudkowsky intellectual
  lineage material to the current CV format.
- [ ] Decide whether Chainlink and Frax should become sidenotes. They are
  currently emphasized text only.
- [ ] Review whether `/cv` should share content with `/` or remain a separate
  hand-maintained plain route.

---

## Content Notes

The old PRD described a pure long-form essay-CV with 14 annotations. The built
site has evolved into a traditional CV with interactive context layers. Treat
the built structure as authoritative unless Paul explicitly asks to return to
the older essay-CV direction.

Most final copy now lives directly in `src/pages/index.astro`. Draft material
and replacement prose can still be staged in `cv_content_workbench/`.
