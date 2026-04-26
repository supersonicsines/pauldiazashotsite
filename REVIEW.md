# REVIEW.md — what to check before shipping `/`

Status as of **I.1032**. Hybrid CV: traditional layout + collapsible sections + LessWrong hover-cards/sidenotes + retro Linux windows for each role.

## Structure

1. **Header** — name, locations, contact, work-auth
2. **Introduction** (was "Summary") — short intro blurb + download CV link, contains GMX hover-card
3. **Experience** — three roles. Each role title is a clickable trigger that opens a **retro window modal** with role detail. Sidenotes/hover-cards on Chainlink, Avalanche, Frax, Gambit→GMX rebrand.
4. **Current AI Deployments** (was "Independent AI Deployments") — Pawlymarket hover-card, Vinted-Depop and booking-system sidenotes
5. **Education** — Manchester sidenote
6. **Skills** — MCP sidenote
7. **Footer**

## Window behavior to test

- [ ] Click any role title (Portico, GMX, Effie Perine) → window opens
- [ ] Drag the title bar to reposition the window anywhere
- [ ] Click `─` (minimize) → window goes to a dock at the bottom of the page
- [ ] Dock only appears when at least one window is minimized
- [ ] Click dock entry → window restores to its previous position
- [ ] Click `×` (close) → window closes; dock entry removed
- [ ] Drag the bottom-right corner → resize the window
- [ ] Click on a window → brings it to the front (z-index)
- [ ] Press Esc → closes all open (non-minimized) windows
- [ ] Multiple windows can be open simultaneously
- [ ] Mobile (<600px) — windows take near-full width, fixed position; resize handle hidden

---

## Things to test on the page

- [ ] **Collapsible headings** — every section has a ▾ arrow that rotates to ▸ when collapsed. Click the heading or arrow to toggle. Default: all expanded.
- [ ] **Hover cards** (4 anchors with solid underline): GMX, Pawlymarket, Gambit→GMX rebrand, Wittgenstein-area. Hover to preview.
- [ ] **Click-to-pin** — when a hover-card is open, click on it to convert to a draggable modal. Drag it anywhere. X or Esc to close.
- [ ] **Sidenotes** (anchors with dotted underline): on viewports ≥1280px they float into the right gutter. On <1280px, they're hidden until you click the marker, then expand inline.
- [ ] **Loading animation** — symbol cycles for 3s or until click; zooms; cuts to CV; persistent watermark per session.
- [ ] **Watermark** — different symbol every refresh (caught at trigger time), 5% opacity behind content.
- [ ] **All links open in new tab** (`target="_blank"`).

---

## Placeholder content (you write these)

### Hover-cards (rich, 150-300 words)

These are hidden until hovered. Body text reads cleanly without them.

- [ ] **GMX** (in Summary) — 200-300 words. Currently: 1-paragraph sketch + placeholder note + further-reading footer with gmx.io and DeFiLlama links. Add: TVL screenshot, contemporaneous Bankless/Decrypt links, your specific role narrative.
- [ ] **Gambit → GMX rebrand** (in Experience > GMX) — 150-200 words.
- [ ] **Pawlymarket** (in Independent AI Deployments) — 150 words. Add dashboard screenshot.

*The PRD also calls for a Wittgenstein hover-card, but that anchor isn't naturally in the traditional CV. Worth deciding: do you want to add a personal/intellectual section, or skip Wittgenstein from this version?*

### Sidenotes (short, 30-75 words)

Show in the right gutter on wide screens, expand inline on narrow.

- [ ] **Chainlink** — 50 words.
- [ ] **Avalanche** — 50 words.
- [ ] **Frax** — 50 words.
- [ ] **Vinted-to-Depop reselling agent** — 75 words.
- [ ] **Intelligent booking system** — 50 words.
- [ ] **University of Manchester** (in Education) — 75 words. Trading-bot operation, etc.
- [ ] **MCP** (in Skills) — 50 words.
- [ ] **Claude API** (in Skills) — already a placeholder. Decide if this stack-block is worth a real footnote.

---

## Out of the picture (was in essay-CV, removed for traditional CV)

These were in the previous essay-CV draft but don't fit the traditional CV format:
- "Why Anthropic" section (the dedicated section for the application narrative)
- Intellectual lineage section (Wittgenstein → Yudkowsky)
- "Now" / "Before GMX" / lede paragraph

If you want any of these, options:
- Add a new collapsible section "Personal / Reading" with the Wittgenstein hover-card and Yudkowsky/Manchester sidenotes
- Add a section "Why Anthropic" at the top or bottom
- Keep them out and let the depth come purely from the annotations

---

## Design / visual checks

- [ ] **Watermark opacity** — 5% currently. Adjust if too subtle/loud.
- [ ] **Layout breakpoint** — gutter activates at ≥1280px (not 1200px) to ensure sidenotes don't get clipped at the threshold.
- [ ] **Header alignment** — on wide screens, header is left-aligned at 680px width inside a 1000px container, so content leans left of viewport center. This is the gwern/Tufte aesthetic. Tell me if you want it centered instead.
- [ ] **Color palette** — paper `#FBFAF7`, ink `#1A1A1A`, muted `#666666`, rule `#999999`, sidenote bg `#F2EFE8`, bistre `#3D2B1F`.

---

## Still missing (will build next)

- [ ] **OG image** — 1200×630 PNG.
- [ ] **404 page** — same aesthetic.
- [ ] **`<MetaHead>` consolidation** — single source of truth for head tags.
- [ ] **Lighthouse audit** — should be 95+ across all four metrics.

---

## Out of scope per PRD §2

- ~~Claude-powered chat agent~~
- ~~Terminal route~~
- ~~Blog index~~
- ~~Analytics dashboards~~
- ~~Login / comments / newsletter~~
- ~~Dark-mode toggle~~
