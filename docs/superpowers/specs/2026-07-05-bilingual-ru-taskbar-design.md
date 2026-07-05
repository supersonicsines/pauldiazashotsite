# Bilingual Site (EN/RU) + Retro Taskbar — Design

**Date:** 2026-07-05
**Scope:** Russian version of the homepage CV experience, retro OS taskbar
language switcher, cross-language session persistence, Russian downloadable CV.
Spanish is a planned follow-up that this design must not block.

---

## 1. Refined brief (recursively improved prompt)

The original request, resolved into concrete decisions:

1. **Two language "applications" in a retro taskbar.** A fixed bottom taskbar
   in the site's existing window chrome (paper/bistre, Times New Roman, zero
   border-radius). Two app buttons: `ENGLISH` and `РУССКИЙ` — each labelled in
   its own language. The current language's button is *depressed* (inset
   bevel), the other is raised. Buttons are "slightly more 3D" than the flat
   window chrome: two-tone bevel borders (already precedented by the dock
   items) plus a hard 1px drop, one step more dimensional, no further.
2. **Canonical translation source.** `CV_RU.pdf` / `CV_RU.pages` (equivalent;
   the PDF is used since it reads without friction). The PDF's terminology,
   register, and typographic conventions (quoted brand names, `и. и.` for AI,
   `$N+ миллионов долларов США` money style, section names Резюме /
   Достижения / Независимые выпуски и. и. / Высшее образование /
   Специализация) govern all Russian copy. Web-only content (window bodies,
   hover cards, sidenotes, the hypertext note) is translated fresh in that
   register. The PDF files themselves are never edited.
3. **Sourcing rule for conflicts.** Where the site's English copy and the PDF
   diverge in *content* (the site is richer/newer), the site's content wins and
   the PDF's *language* wins — i.e. translate the site's meaning using the
   PDF's vocabulary. Obvious PDF misspellings are corrected when transplanted
   to the web (each one flagged in the final report); the PDF itself stays
   untouched.
4. **Downloadable CV per language.** EN keeps `/Paul_Diaz_Ashot_CV.pdf`; RU
   links to `/Paul_Diaz_Ashot_CV_RU.pdf` (a byte-identical copy of
   `CV_RU.pdf`).
5. **OS persistence across language switch.** Switching apps must feel like
   switching windows inside one workstation, not navigating between web pages:
   open/minimized windows, their positions/sizes/z-order, collapsed sections,
   expanded sidenotes, and scroll position all survive the switch; the boot
   loader does not replay.
6. **Same aesthetic.** Identical palette, typography (Times New Roman renders
   Cyrillic natively — no font change), layout, and interaction model.

Out of scope now, kept cheap later: Spanish (`/es/` = third taskbar button +
translated page), `/cv` and `/artifacts` localisation (orphan/secondary
routes).

---

## 2. Architecture

### Routing
- `/` — English page (unchanged content, gains taskbar + persistence ids).
- `/ru/` — Russian page: `src/pages/ru/index.astro`, a 1:1 structural mirror of
  `index.astro` (same component tree, same `Window`/`Sidenote`/`Collapsible`
  ids) with translated copy. Copy duplication over an i18n string layer is a
  deliberate choice: the repo's convention is copy-in-page, the markup is
  richly nested (sidenotes inside sentences), and a dictionary would force
  HTML-in-strings. A sync comment header marks the mirror contract.

### New component: `src/components/Taskbar.astro`
- Props: `lang: 'en' | 'ru'`.
- Fixed bottom bar, `z-index: 2000` (above windows ~300+, dock 400; boot
  overlay raised to 3000 so the "boot screen" covers the bar).
- Left: app buttons from a const array (`en → /`, `ru → /ru/`) — a third
  language is one array entry.
- Right: system tray (inset bevel): keyboard-layout style indicator `EN`/`RU`
  — the element every Russian user knows from the OS tray — plus an `HH:MM`
  clock ticking on the half-minute.
- Active app: `aria-current="page"`, inset bevel, 1px content nudge, lit LED.
- Click on the inactive app: persist `scrollY`, set `pdos-warm` flag, navigate.
- Visible on mobile (it is the language switcher); safe-area padding; hidden
  in print.

### Persistence (`sessionStorage`, key `pdos-state-v1`)
```json
{
  "windows":     { "<id>": { "open": true, "min": false, "x": 1, "y": 1, "w": 1, "h": 1 } },
  "zOrder":      ["portico", "gmx"],
  "collapsibles": { "intro": true },
  "sidenotes":   { "right-to-work": true },
  "scrollY":     420
}
```
- **WindowManager** owns the `windows`/`zOrder` slice: saves on open / close /
  minimize / restore / drag-end / resize-end / Escape; restores on init
  (positions clamped to viewport; z-order replayed; on mobile, persisted open
  windows restore as inline panels). Also localises window/dock control
  labels from `document.documentElement.lang`.
- **BaseLayout** owns `collapsibles`/`sidenotes`/`scrollY`: restores before
  the overlay lifts; saves via event delegation (`.toggle-btn` clicks,
  `.sidenote-checkbox` changes). Scroll restores only on warm boots.
- Same ids on both pages ⇒ state is language-agnostic by construction.
- All storage access wrapped in try/catch (private-mode Safari).

### Warm boot
`pdos-warm` flag (set only by taskbar clicks) ⇒ BaseLayout skips the symbol
loader: overlay + loader get `watermarked` + an `instant` class that pins the
glyph at watermark size with `animation: none`. Flag is consumed on read.

### BaseLayout additions
`lang` prop → `<html lang>`; optional `alternates` prop → `hreflang`
`en`/`ru`/`x-default` links against `https://pauldiazashot.com`.

---

## 3. Taskbar visual spec

Tokens: existing palette only. Bevel tones reuse the dock's `#5a4a3a`
(light bistre) / `#1a1410` (dark bistre) / `rgba(255,255,255,.65)` highlight.

```
┌────────────────────────────────────────────────────────────────────┐
│ ▛ENGLISH▟  ▗РУССКИЙ▖                                 ┊ RU  14:32 ┊ │  36px
└────────────────────────────────────────────────────────────────────┘
   raised      depressed(current)                        inset tray
```
- Bar: paper background, 1px bistre top border, inner white top highlight,
  faint upward shadow.
- Buttons: sidenote-bg face, LED square + uppercase 11px letterspaced label
  (existing titlebar typography). Raised = light top/left, dark bottom/right,
  1px hard shadow. Depressed = inverted bevel, paper face, translate(1px,1px),
  no shadow.
- Tray: inset bevel, muted 11px text; indicator in ink, clock in muted.
- Focus-visible: 1px bistre outline, offset 2px (site convention).
- `.cv` gets bottom padding (~64px) so the footer clears the bar.

---

## 4. Verification plan

1. `npm run build` passes.
2. Behavioral pass on the built site (both routes): triggers, windows,
   collapse/sidenote toggles, taskbar switch preserving state both directions,
   warm boot, RU PDF link.
3. Multi-agent QA workflow: Russian linguistic review, PDF-fidelity review,
   EN↔RU structural parity diff, code review of the diff; adversarial
   verification of findings; fixes applied.
4. README / PRD / REVIEW updated; commit per I.#### protocol; deploy remains
   `vercel --prod` (not run without ask).

## 5. Known content discrepancies (flagged, not silently fixed)

- RU PDF still carries the Pawlymarket `$50K ARR` line removed from EN in
  I.1117 — PDF is served as-is per instruction; the RU *web* copy follows the
  current EN site (no ARR line).
- RU PDF header email is `paulashot@icloud.com`; the site uses
  `paul.ashot@icloud.com`. The RU page keeps the site's working address.
- PDF misspellings corrected on the web only: `долгоиргающих`,
  `специализирущейся`, `ежегодних`, `Баккалавр`, `достоинстами`,
  `выдаюющихся`, `интрфейс`. PDF's idiosyncratic-but-deliberate choices
  (`венчюрный`, `аггрегатор`, `и. и.`, quoted brand names) are kept as
  canonical style.
