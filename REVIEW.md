# REVIEW.md — what to check before shipping `/`

Status as of **I.1029**. Everything below is filler / placeholder content I wrote to give you a sense of the visual shape. Replace each item with your own prose, then we delete it from this list.

---

## Prose blocks (you write)

These are full paragraphs of placeholder text. Each is marked `[... PLACEHOLDER]` in the body text so they're easy to find.

| ID | Section | Word target | Notes |
|---|---|---|---|
| `LEDE` | Top of page | 2-3 sentences | The frame-setter. Tone-defining. |
| `BEFORE GMX FILLER` | "Before GMX" intro | 1-2 paragraphs | The Manchester → trading bots → reading lineage arc |
| `WHY ANTHROPIC FILLER` | "Why Anthropic" body | 2-3 paragraphs | Shorter, sharper version of your Why Anthropic essay |

I also wrote rough filler paragraphs around the sidenotes/hover-cards in **Now** and **GMX** sections — read them top to bottom, replace anything that sounds wrong or off-voice.

---

## Annotations (you write — 14 total)

Each annotation has its placeholder text inline in `index.astro`. Find them by searching for `PLACEHOLDER`.

### Hover-cards (rich, 150-300 words)

- [ ] **Pawlymarket** — 150 words. Currently: live link, screenshot mention, P&L mention. Add: actual screenshot, link to live dashboard, one-line testimonial if you have one.
- [ ] **GMX** — 200-300 words. Currently: 2-paragraph sketch + further-reading footer. Add: link to gmx.io, DeFiLlama TVL chart link, one TVL screenshot, contemporaneous Bankless/Decrypt links.
- [ ] **Gambit → GMX rebrand** — 150-200 words. Currently: 2-paragraph sketch. Add: link to rebrand announcement, optional before/after logo image.
- [ ] **Wittgenstein** — 200 words. Currently: prose + one pull-quote + further reading. Add: better pull-quote choice (one that's specifically yours), link to <em>Philosophical Investigations</em>, SEP entry.

### Sidenotes (short, 30-75 words)

- [ ] **Vinted-Depop agent** — 75 words. Maybe attach a Telegram bot screenshot.
- [ ] **inventory automation** — 50 words.
- [ ] **email triage** — 50 words.
- [ ] **Chainlink** — 50 words. Add link to Chainlink BUILD announcement.
- [ ] **Avalanche** — 50 words. Add link to relevant ecosystem post if public.
- [ ] **Frax** — 50 words. Add link to integration page or relevant tweet.
- [ ] **seven-figure exit** — 30 words. *PRD says "the dryness is the point" — keep it short, no link.*
- [ ] **Manchester** — 75 words.
- [ ] **Yudkowsky** — 75 words. Add link to LessWrong, link to one specific essay that mattered.
- [ ] **Constitutional AI** — 50 words. Add link to CAI paper.
- [ ] **interpretability** — 50 words. Add link to relevant Anthropic paper / dashboard.
- [ ] **MCP** — 50 words. Add link to MCP docs.

---

## Visual / layout review

Things I built but you should sanity-check by looking at the page:

- [ ] **Loading animation timing** — 3 second cycle then click-skip; symbol zooms; cuts to content with watermark. Watch on desktop and mobile.
- [ ] **Watermark opacity** — currently `0.05`. Too subtle? Too loud? Different per refresh.
- [ ] **Sidenote behavior** — desktop ≥1200px: gutter on right. <1200px: numbered marker, click to expand inline. Mobile <768px: same.
- [ ] **Hover-card behavior** — desktop: hover with 200ms-in / 600ms-out delay. Mobile/touch: tap to open as modal with close button. Press Esc to close.
- [ ] **Anchor styles** — sidenote anchors get dotted underline + small superscript number. Hover-card anchors get solid underline (no number). Convention should be obvious within 5 seconds.
- [ ] **Typography** — H1 (your name) 36px, H2 (section) 22px small-caps with letter-spacing 2.5px. Body 18px desktop / 16px mobile. Times New Roman throughout.
- [ ] **Color palette** — paper `#FBFAF7`, ink `#1A1A1A`, muted `#666666`, rule `#999999`, sidenote bg `#F2EFE8`, bistre `#3D2B1F`.

---

## Still missing (will build next)

- [ ] **OG image** — 1200×630 PNG showing "Paul Diaz Ashot" on paper-tone background. Generated from the page or hand-designed.
- [ ] **Twitter card metadata** — needs the OG image first.
- [ ] **404 page** — same aesthetic. Currently using Astro's default.
- [ ] **`<MetaHead>` consolidation** — currently meta tags are inline; PRD calls for one source-of-truth component.
- [ ] **Lighthouse audit** — should be 95+ across Perf / A11y / SEO / Best Practices.
- [ ] **Real iPhone / Android device testing** — per PRD §11 step 11.

---

## Out of scope (per PRD §2)

For your reference — explicitly NOT to build:

- ~~Claude-powered chat agent~~
- ~~Terminal route~~
- ~~Blog index~~
- ~~Analytics dashboards beyond the optional Pawlymarket chart~~
- ~~Login / comments / newsletter~~
- ~~Dark-mode toggle~~

---

## Decisions made for you (flag if you want changed)

- I split the **Pawlymarket** mention in the lead paragraph as a hover-card (PRD says hover-card for Pawlymarket — confirmed).
- I made **Vinted-Depop** a sidenote (PRD says sidenote — confirmed).
- I treat **inventory automation** and **email triage** as your "current Claude work" sidenotes per PRD §6, but you may want them differently sliced or merged into one.
- The Wittgenstein hover-card has a placeholder pull-quote ("Philosophy is a battle…" — the famous Tractatus-adjacent line). PRD says "pick something specific, not the famous one" — I deliberately picked a famous one as a marker; replace with your actual choice.
- I positioned the "Why Anthropic" section last, before the footer. PRD §5 confirms this order.
