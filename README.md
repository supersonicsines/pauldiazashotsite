# pauldiazashotsite

Personal CV site for Paul Diaz Ashot. The current product is a compact,
text-first Astro site: traditional CV structure with hypertextual depth added
through collapsible sections, dotted sidenotes, hover cards, URL preview
windows, and draggable retro desktop windows.

The live site experience is the homepage at `/`. Russian and Spanish versions
of the same experience live at `/ru/` and `/es/`, switched through a retro OS
taskbar at the bottom of the page; open windows, sections, sidenotes, and
scroll survive the switch via sessionStorage, and the tray shows a GMT clock
(no user-location lookups). The `/cv` route is a plainer CV version, and
`/artifacts` is a small React artifact scaffold.

## Current Stack

- Astro 6 with static output
- React 19 for artifact islands
- Tailwind CSS 4 through the Vite plugin
- Vercel Analytics in `BaseLayout.astro`
- Node >= 22.12.0

## Commands

Run commands from the project root.

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start the local Astro dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Preview the built site locally |
| `npm run previews` | Regenerate URL preview screenshots |

`npm run build` was passing as of 2026-07-01.

## Important Files

| File | Purpose |
|---|---|
| `src/pages/index.astro` | Main interactive CV page (English) |
| `src/pages/ru/index.astro` | Russian mirror of the homepage — keep structurally in sync with `index.astro` |
| `src/pages/es/index.astro` | Spanish (Argentinian) mirror of the homepage — keep structurally in sync with `index.astro` |
| `src/pages/cv.astro` | Plain CV route |
| `src/components/Taskbar.astro` | Bottom retro taskbar: language "applications" + tray |
| `src/scripts/pdosState.ts` | Shared sessionStorage store for cross-language state persistence |
| `src/pages/artifacts/index.astro` | Lists React artifacts |
| `src/pages/artifacts/[slug].astro` | Renders a named artifact |
| `src/layouts/BaseLayout.astro` | Shared head, Vercel Analytics, loading overlay, watermark, list marker animation |
| `src/components/Collapsible.astro` | Expand/collapse CV sections |
| `src/components/Sidenote.astro` | Dotted inline sidenote anchors with click-to-expand notes |
| `src/components/HoverCard.astro` | Solid-underlined hover/focus preview cards |
| `src/components/Window.astro` | Retro Linux-style windows |
| `src/components/WindowManager.astro` | Window drag, resize, minimize, close, dock, mobile inline behavior |
| `src/styles/global.css` | Site theme: Times New Roman and paper/ink palette |
| `public/Paul_Diaz_Ashot_CV.pdf` | Downloadable CV (English) |
| `public/Paul_Diaz_Ashot_CV_RU.pdf` | Downloadable CV (Russian; byte-copy of `CV_RU.pdf`, never edited here) |
| `public/Paul_Diaz_Ashot_CV_ES.pdf` | Downloadable CV (Spanish; printed from `c_vitae/Paul_Diaz_Ashot_CV_ES.html` via headless Chrome) |
| `CV_RU.pdf` / `CV_RU.pages` | Canonical professionally reviewed Russian CV — source of truth for RU terminology |
| `c_vitae/Paul_Diaz_Ashot_CV_ES.html` | Spanish CV source (mirrors `Paul_Diaz_Ashot_CV_May13.html`) |
| `public/previews/` | URL preview screenshots used by external preview windows |
| `public/images/cv/` | Media used inside CV windows |
| `cv_content_workbench/` | Draft workspace for future annotation/window copy |
| `pauldiazashot_PRD.md` | Current-state PRD and product decisions |
| `REVIEW.md` | Manual QA checklist and backlog |

## Design Rules

- Times New Roman is the only typeface.
- Preserve the paper/ink palette: `#FBFAF7`, `#1A1A1A`, `#666666`,
  `#999999`, `#F2EFE8`, `#3D2B1F`.
- Keep the page restrained, CV-focused, and text-first.
- Do not turn the site into a generic landing page or portfolio grid.
- Keep links, annotations, and windows readable without overwhelming the main
  CV scan.
- `/`, `/ru/`, and `/es/` are structural mirrors: identical component tree,
  window and sidenote and collapsible ids, and style blocks. Editing one page
  means editing all three. Russian copy follows `CV_RU.pdf` terminology;
  Spanish is Argentinian in register; a new language is one more
  `src/pages/<code>/index.astro` mirror plus an entry in `Taskbar.astro`.

## Current Routes

- `/` - primary interactive CV (English).
- `/ru/` - Russian version of the primary CV; same structure and ids as `/`.
- `/es/` - Spanish (Argentinian) version; same structure and ids as `/`.
- `/cv` - simpler CV route with the same overall content, fewer interactions.
- `/artifacts` - index of React artifacts in `src/artifacts`.
- `/artifacts/Example` - current example artifact route.

There is not currently a custom `404.astro` route.

## Content Workflow

Most production copy now lives directly in `src/pages/index.astro`.
`cv_content_workbench/` remains tracked as a drafting area for future agent or
manual edits. If using that workbench, copy approved prose back into
`src/pages/index.astro`, move any media to `public/images/cv/`, then run
`npm run build`.

## Handoff Notes

Before this documentation pass, the repo was on `main` with no unrelated local
changes. For future changes, prefer small scoped edits that preserve the
current interaction model. Always run `npm run build` before reporting work
complete.
