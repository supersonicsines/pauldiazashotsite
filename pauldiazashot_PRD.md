# Current-State PRD - pauldiazashot.com

**Owner:** Paul Diaz Ashot  
**Current implementation status:** built Astro site, build passing  
**Last aligned:** 2026-07-01  
**Primary route:** `/`

---

## 1. North Star

The site is Paul's CV, but with depth-on-demand for curious readers.

The current direction is a **hybrid interactive CV**:

- Traditional CV sections so a hiring manager can scan it quickly.
- LessWrong/Gwern-inspired annotations so a technical reader can inspect the
  deeper context.
- Retro desktop windows for role details, external previews, and richer project
  material.

It is no longer the original pure long-form essay-CV. The built product keeps
the old text-first, hypertextual taste, but the information architecture is now
closer to a polished CV with optional interactive layers.

The desired signal: Paul can sell technical products, operate near founders,
and deploy AI tools into real workflows, while thinking in connections rather
than flat bullet points.

---

## 2. Product Shape

### Primary Experience

`/` is the main site. It contains:

1. Header: name, locations, contact, site, handle.
2. Introduction: founder-operator positioning, GMX context, current AI work,
   language/work-auth note, PDF link.
3. Experience: Portico Ventures, GMX, Effie Perine.
4. Current AI Deployments: Slashwork, Pawlymarket, Vinted-to-Depop agent,
   intelligent booking system.
5. Education.
6. Skills.
7. Footer with contact and PDF download.

Sections are collapsible. Education and Skills currently default closed.

### Language Versions

- `/` is English; `/ru/` is the Russian version of the same experience.
- A fixed retro taskbar at the bottom of both pages holds one "application"
  per language (`ENGLISH`, `РУССКИЙ`), each labelled in its own language. The
  current language's button is depressed; the tray shows an OS-style layout
  indicator (`EN`/`RU`) and a clock.
- The two pages are structural mirrors: identical component tree, window /
  sidenote / collapsible ids, and style blocks. Only human-visible text
  differs.
- Russian copy follows the professionally reviewed `CV_RU.pdf` (terminology,
  register, quoted brand names, `и. и.` for AI). Web-only prose is translated
  to that standard. The PDF itself is never edited; `/ru/` serves a byte-copy
  at `/Paul_Diaz_Ashot_CV_RU.pdf` for download.
- Switching languages preserves the "desktop": open/minimized windows with
  their geometry and z-order, collapsed sections, expanded sidenotes, and
  scroll position carry across via sessionStorage (`pdos-state-v1`), and the
  boot loader is skipped on taskbar navigation (`pdos-warm`), so the switch
  feels like one workstation.
- Spanish later = one more mirror page under `src/pages/es/` plus an entry in
  `Taskbar.astro`'s `APPS` array.

### Secondary Routes

- `/cv` is a plain CV route with simpler markup and fewer interactions
  (English only for now).
- `/artifacts` lists React artifacts in `src/artifacts`.
- `/artifacts/[slug]` renders a named React artifact through
  `ArtifactWrapper.jsx`.

The artifact routes are scaffolding and are not the main site experience.

---

## 3. Stack

| Layer | Current Choice |
|---|---|
| Framework | Astro 6 |
| Rendering | Static build into `dist/` |
| Styling | Tailwind CSS 4 plus component-scoped Astro styles |
| React | React 19 for artifact islands |
| Analytics | `@vercel/analytics` in `BaseLayout.astro` |
| Typography | Times New Roman only |
| Hosting target | Vercel-compatible static deployment |
| Runtime | Node >= 22.12.0 |

Commands:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run previews`

`npm run build` was passing as of 2026-07-01.

---

## 4. Visual Design

### Locked Palette

- Background: `#FBFAF7`
- Body text: `#1A1A1A`
- Muted text: `#666666`
- Rule lines: `#999999`
- Sidenote background: `#F2EFE8`
- Bistre accent/window chrome: `#3D2B1F`

No broad multicolor palette, no generic gradient hero, no dark-mode toggle in
v1.

### Typography

Times New Roman is the only typeface. The theme intentionally maps serif, sans,
and mono tokens to the same stack:

```css
font-family: "Times New Roman", Times, serif;
```

Differences between body, metadata, headings, code, and window chrome should be
handled with size, weight, italics, small caps, and color.

### Layout

- Main content width: roughly 680px.
- Page background: paper tone.
- Header/footer centered.
- CV body compact enough to scan.
- Rich context appears only through interaction.

---

## 5. Interaction Model

### Collapsible Sections

Implemented by `src/components/Collapsible.astro`.

- Section headers toggle open/closed.
- Arrow rotates on collapse.
- Content uses a grid-row transition.
- `open={false}` is supported for default-collapsed sections.

### Sidenotes

Implemented by `src/components/Sidenote.astro`.

- Dotted underline marks sidenote terms.
- Dagger marker toggles the note inline through a checkbox.
- Notes use the paper/warm background and left rule.
- Current implementation does not use a right-gutter layout.

### Hover Cards

Implemented by `src/components/HoverCard.astro`.

- Solid underline marks hover-card terms.
- Opens on hover/focus where hover is supported.
- Uses a fixed/portal-ready path for viewport positioning support.
- Supports richer internal markup such as paragraphs, media, quotes, and
  further-reading blocks.

### Retro Windows

Implemented by `src/components/Window.astro` and
`src/components/WindowManager.astro`.

Windows support:

- Open from triggers with `data-window-trigger`.
- Drag by title bar.
- Resize when `resizable` is enabled.
- Minimize into a left dock.
- Restore from dock.
- Close with window controls.
- Bring-to-front z-index behavior.
- Escape closes open non-minimized windows.
- Mobile/coarse-pointer mode converts windows into inline expanded content and
  hides desktop windows/dock.

### Taskbar and Cross-Language Persistence

Implemented by `src/components/Taskbar.astro` and `src/scripts/pdosState.ts`,
with hooks in `WindowManager.astro` and `BaseLayout.astro`.

- Fixed bottom bar, z-index 2000 (boot overlay 3000 covers it; windows and
  dock sit below).
- App buttons use the dock's two-tone bevel language, one step more 3D
  (inset highlights + hard drop shadow); the active app is inset/depressed
  with `aria-current="page"` and a lit LED.
- Window state (open/minimized/x/y/w/h/z-order), collapsible sections,
  sidenote checkboxes, and scroll position persist in sessionStorage and are
  restored on load on either language page.
- Window and dock control labels localize from `document.documentElement.lang`
  (Свернуть/Закрыть/Развернуть on `/ru/`).
- On mobile, persisted open windows restore as inline panels.

### Loader and Watermark

Implemented in `src/layouts/BaseLayout.astro`.

- Initial full-screen symbol loader.
- Symbol changes every 250ms.
- Auto transition after 3 seconds or on click.
- Zoom animation resolves into a faint watermark.
- List markers also cycle symbols on hover.

---

## 6. Content Inventory

### Interactive CV Anchors Currently Present

- GMX external preview window.
- Gammaswap external preview window.
- Codex.io external preview window.
- Slashwork external preview window.
- Portico Ventures role window.
- GMX role window.
- Pawlymarket rich window with dashboard media.
- Vinted-to-Depop rich window with media.
- Effie Perine hover card.
- Gambit -> GMX rebrand hover card.
- Arbitrum sidenote.
- Avalanche sidenote.
- Right-to-work sidenote.
- Intelligent booking system sidenote.

### Public Media Currently Present

- `public/Paul_Diaz_Ashot_CV.pdf`
- `public/favicon.svg`
- `public/previews/gmx-preview-1280.png`
- `public/previews/gammaswap-preview-1280.png`
- `public/previews/codex-preview-1280.png`
- `public/previews/slashwork-preview-1280.png`
- `public/images/cv/pawlymarket-dashboard-1280-rgb.png`
- `public/images/cv/vinted-depop-glitter-1100-rgb.png`

---

## 7. File Structure

```text
pauldiazashotsite/
├── astro.config.mjs
├── package.json
├── package-lock.json
├── README.md
├── REVIEW.md
├── pauldiazashot_PRD.md
├── public/
│   ├── favicon.svg
│   ├── Paul_Diaz_Ashot_CV.pdf
│   ├── previews/
│   └── images/cv/
├── src/
│   ├── artifacts/
│   │   └── Example.jsx
│   ├── components/
│   │   ├── ArtifactWrapper.jsx
│   │   ├── Collapsible.astro
│   │   ├── HoverCard.astro
│   │   ├── Section.astro
│   │   ├── Sidenote.astro
│   │   ├── Window.astro
│   │   └── WindowManager.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── cv.astro
│   │   └── artifacts/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── global.css
├── cv_content_workbench/
└── c_vitae/
```

---

## 8. Current Requirements

### Must Preserve

- Homepage remains a CV-first page, not a marketing landing page.
- `/` and `/ru/` stay structural mirrors; a content edit on one page is made
  on both.
- `CV_RU.pdf` / `CV_RU.pages` are canonical and are never edited by agents.
- Text remains readable and copyable.
- Times New Roman remains the sole typeface.
- The paper/ink palette remains restrained.
- PDF download remains available from the page and footer.
- Existing window and annotation triggers continue to work.
- Build remains static and deployable to Vercel.

### Must Verify Before Shipping Changes

- `npm run build` passes.
- Homepage renders at desktop and mobile widths.
- Collapsible sections toggle correctly.
- Window triggers open the expected windows.
- Window minimize/restore/close works on desktop.
- Mobile/coarse-pointer inline window fallback works.
- Sidenote daggers expand inline.
- Hover cards remain readable and do not clip off-screen in common viewports.
- PDF link points to `public/Paul_Diaz_Ashot_CV.pdf` on `/` and
  `public/Paul_Diaz_Ashot_CV_RU.pdf` on `/ru/`.
- Taskbar language switch preserves open windows, dock, sections, sidenotes,
  and scroll in both directions, and skips the boot loader.

---

## 9. Backlog

These are real open items, not built features:

- Add custom `src/pages/404.astro` in the same aesthetic.
- Add richer Open Graph and Twitter card metadata.
- Generate and serve an OG image.
- Consider consolidating metadata into a dedicated component if head logic
  grows beyond `BaseLayout.astro`.
- Run Lighthouse and address any score below 95.
- Decide whether to keep or remove the `/artifacts` scaffold for production.
- Decide whether the older Wittgenstein/Yudkowsky intellectual-lineage idea
  belongs in this current CV format.
- Review whether Chainlink and Frax should become sidenotes, since they are
  currently plain emphasized text in the GMX bullet.

---

## 10. Out of Scope For This Version

- Claude-powered chat agent.
- Terminal route.
- Blog index.
- Login, comments, newsletter, or account system.
- Dark-mode toggle.
- Heavy analytics dashboard.
- Generic portfolio redesign.

---

## 11. Done Criteria For Future Site Edits

A future change is done when:

- It matches the current product direction above.
- It keeps the homepage scannable as a CV.
- It preserves or intentionally updates the documented interaction model.
- It updates this PRD and `REVIEW.md` if behavior, routes, or backlog change.
- `npm run build` passes.
