# PRD — pauldiazashot.com

**Owner:** Paul Diaz Ashot
**Builder:** Claude Code
**Target ship date:** within 1 week
**Goal:** A personal site that functions as Paul's CV but rewards close reading. The hiring manager at Anthropic should be able to scan it in 60 seconds; a curious technical reader should be able to spend 20 minutes in it.

---

## 1. North star

The site is a **single long-form serif essay-CV** with **Tufte-style sidenotes** and **hover-to-expand annotations** on key terms. The aesthetic reference is gwern.net (substance + sidenotes), Andy Matuschak's notes (hover previews), and the original LessWrong sequences (hypertextuality as substrate).

It is not a portfolio. It is not a terminal. It is not a chatbot. It is a piece of writing with depth-on-demand.

The implicit signal to the right reader (Anthropic hiring manager, anyone LW-adjacent): *I think in connections; I trust you to chase the threads that interest you; I have substance under every link.*

---

## 2. Out of scope (v1)

- No Claude-powered chat agent. Tempting but adds complexity, dilutes the signal, and every other AI applicant in 2026 will have one.
- No terminal route. Possibly v2; not v1.
- No blog index, no separate "writing" page. The site itself is the writing.
- No analytics dashboards or visualisations beyond the prediction-market chart embedded under Pawlymarket (optional, see §6).
- No login, no comments, no newsletter signup.
- No dark-mode toggle. Pick one mode (off-white background, near-black text, see §4) and ship.

---

## 3. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** | Content-first, zero-JS-by-default, MDX support, easy static export |
| Styling | **Tailwind CSS** | Fast iteration; pairs well with Claude Code |
| Content | **MDX** | Markdown for prose + JSX components for sidenotes inline |
| Typography | **Times New Roman** (system font), used **exclusively** for body, headings, sidenotes, metadata, and code | One typeface throughout. Times is universal, classical, and signals restraint; no web-font load required, no UI/serif split. |
| Hosting | **Vercel** (Hobby tier, free) | Edge-served, GitHub integration, custom domain |
| Repo | **GitHub** | Standard |
| Domain | **pauldiazashot.com** (already owned) | CNAME to Vercel |
| Build target | Static export (`output: 'static'` in `astro.config.mjs`) | No server needed; max speed, max simplicity |

---

## 4. Visual design

### Colour palette (locked)

- Background: `#FBFAF7` (off-white, paper-tone)
- Body text: `#1A1A1A` (near-black, not pure black)
- Muted text (dates, metadata, captions): `#666666`
- Hyperlinks: `#1A1A1A`, underlined with 1px `#999` underline that thickens on hover
- **External and internal links use the same visual treatment.** No distinguishing icon, no different colour. The page should read as one continuous network — making external links visually distinct breaks the gwern aesthetic.
- Sidenote background: `#F2EFE8` (slightly warmer than body bg)
- Accent rule lines: `#999999` at 0.5pt
- No other colours. No blues, no greens, no shadows. Restraint is the design.

### Typography

**Times New Roman is the only typeface on the site.** No Inter, no JetBrains Mono, no system-sans fallbacks for metadata or code. Differentiation between body, metadata, captions, and code comes from size, weight, italics, small caps, and colour — never from a different font.

- Body: **Times New Roman**, 18px on desktop, 16px on mobile, line-height 1.6
- H1 (page title — the name): **Times New Roman**, 36px, regular weight (not bold), letter-spacing 1px
- H2 (section): **Times New Roman**, 22px, **small caps**, letter-spacing 2.5px, regular weight
- Sidenote text: **Times New Roman**, 14px, line-height 1.5
- Metadata (dates, contact, etc.): **Times New Roman**, 13px, italic, `#666666`
- Inline `<code>` (rare — only for things like API names): **Times New Roman**, 0.95em, optionally with a thin background tint to set it off
- Font stack (single source of truth): `font-family: "Times New Roman", Times, serif;` — applied site-wide. No web font load needed; Times is universal.

### Layout

- Single column, max-width 680px on desktop, centered
- Sidenotes appear in a **right gutter** on screens ≥ 1200px (gutter width ~280px)
- On screens <1200px, sidenotes collapse to inline expandable footnote-style markers (numbered, click to expand)
- On mobile, sidenotes become tap-to-reveal popovers
- Vertical rhythm: 1.5× line-height between paragraphs, 3× between sections

### The "annotation" pattern

Two distinct interaction types — pick the right one for each anchor:

1. **Sidenote (passive, always visible on desktop)**: short paragraph in the right gutter, anchored to a specific phrase in the body. Used for: dates, definitions, quick context. Example: "the Gambit → GMX rebrand" gets a 2-sentence sidenote about what the rebrand involved.

2. **Hover-card (active, requires interaction)**: a richer panel that appears on hover (desktop) or tap (mobile) when the reader engages with a deep anchor. Used for: longer essays, embedded media, links to external resources. Example: hovering on **GMX** opens a card with a 3-paragraph essay, a TVL chart, and a link to the protocol's still-live site.

Visual treatment: anchors for sidenotes get a thin dotted underline; anchors for hover-cards get a solid underline. The reader learns the convention within 5 seconds.

---

## 5. Information architecture

The site is a **single page** at `/`. Everything lives on one URL. No navigation menu. No header. The page is the experience.

### Page structure (top to bottom)

1. **Header block** — name, location, contact, right-to-work line. Centered. ~60px tall.
2. **Lede paragraph** — 2–3 sentences setting the frame. Not a "summary." A piece of prose that introduces who Paul is and what the page is about. Sets tone.
3. **Section: Now** — what Paul is doing currently. Anchor terms: Pawlymarket, Vinted-Depop agent, current Claude work.
4. **Section: GMX** — the founding-team story. Anchor terms: GMX (full essay), Chainlink, Avalanche, Frax, the Gambit rebrand, the seven-figure exit.
5. **Section: Before GMX** — the long arc. Manchester, the trading-bot operation, the Wittgenstein-to-Yudkowsky reading lineage. Brief. The point is the *trajectory*, not the line items.
6. **Section: Why I want to work at Anthropic** — a shorter version of the Why Anthropic essay. 2–3 paragraphs. This is the only place the site is explicitly about the job hunt; the rest is just *who Paul is*.
7. **Footer** — single line. Email, Telegram, "Download CV (PDF)" link, GitHub if applicable, last-updated date.

No section ID anchors in the URL. No deep links. The whole thing is one piece of writing.

---

## 6. The annotated terms (content spec)

Below is the full list of anchor terms, with type (sidenote vs hover-card), word target, and the external links / embeds that should live inside each annotation. **Paul will write the prose for each** — Claude Code's job is to scaffold the components and slot the content in.

### Annotations are nodes, not cards

Every annotation should feel like it could keep going. External links, pull-quotes, embedded screenshots, and "further reading" footers are all welcome and on-brand. The aesthetic rule:

- **External links enrich, never replace.** The annotation is substantively complete on its own; the link is the door for readers who want more.
- **Three types of content welcome inside any annotation:**
  1. *Inline external links* in the prose itself, styled identically to internal anchors
  2. *Embedded snippets*: pull-quotes, code blocks, small charts, screenshots, tweet embeds
  3. *"Further reading" footer* on the heavier hover-cards (GMX, Wittgenstein, Pawlymarket): a 2–3 line list of external sources

If an annotation is just "see [link] for more" without a real paragraph above it, the pattern is broken. Write the substance first; link out second.

### Annotation table

| Term | Where | Type | Words | External links / embeds |
|---|---|---|---|---|
| **GMX** | GMX section header | Hover-card | 200–300 | Link to GMX protocol frontend; DeFiLlama TVL chart link; one TVL screenshot embedded; "further reading" footer with 2–3 contemporaneous articles (Bankless, Decrypt, etc.) |
| **Chainlink** | GMX section | Sidenote | 50 | Link to the Chainlink BUILD / grant programme announcement |
| **Avalanche** | GMX section | Sidenote | 50 | Link to the relevant Avalanche ecosystem announcement if public |
| **Frax** | GMX section | Sidenote | 50 | Link to the Frax integration page or relevant tweet |
| **the Gambit → GMX rebrand** | GMX section | Hover-card | 150–200 | Link to the rebrand announcement; optional embedded before/after logo or screenshot |
| **seven-figure exit** | GMX section | Sidenote | 30 | No link. The dryness is the point. |
| **Pawlymarket** | Now section | Hover-card | 150 | Link to pawlymarket.com (live); embedded screenshot of dashboard; optional small chart of one good call vs market price |
| **Vinted-Depop agent** | Now section | Sidenote | 75 | Optional Telegram bot screenshot |
| **inventory automation** | Now section | Sidenote | 50 | None required |
| **email triage** | Now section | Sidenote | 50 | None required |
| **Wittgenstein** | Before GMX section | Hover-card | 200 | Link to *Philosophical Investigations* (Wikipedia or SEP); link to SEP entry on language games; one Wittgenstein pull-quote embedded (pick something specific, not the famous one); "further reading" footer with 1–2 sources |
| **Yudkowsky** | Before GMX section | Sidenote | 75 | Link to LessWrong; one specific essay link if there's one that mattered to you |
| **Manchester** | Before GMX section | Sidenote | 75 | None required |
| **Constitutional AI / interpretability / MCP** | Anthropic section | Sidenote | 50 each | Link each to the respective Anthropic paper or documentation page |

**Total writing burden on Paul: ~1,500–2,000 words across ~14 annotations.** Manageable in a weekend.

---

## 7. Functional requirements

### Must-have (v1 ship blockers)

1. Single-page site at `/` renders correctly on desktop (Chrome, Safari, Firefox) and mobile (iOS Safari, Android Chrome)
2. Right-gutter sidenotes on viewports ≥ 1200px; numbered inline footnotes on smaller viewports; tap-popovers on mobile (<768px)
3. Hover-cards open on `mouseenter` (desktop) with 200ms delay, close on `mouseleave` with 400ms delay (forgiving). On mobile, tap-to-toggle with explicit close button.
4. All text is selectable and copyable (no JS interception of selection events)
5. Page is fully readable with JS disabled (sidenotes degrade gracefully to inline footnotes)
6. Lighthouse scores: Performance 95+, Accessibility 95+, SEO 95+, Best Practices 95+
7. Total page weight < 200KB on initial load (excluding fonts; fonts loaded with `font-display: swap`)
8. Custom 404 page in the same aesthetic
9. `pauldiazashot.com` and `www.pauldiazashot.com` both resolve correctly with proper redirects
10. Open Graph metadata: title, description, og:image (a clean text-on-paper card), Twitter card metadata
11. Favicon: a single serif character (e.g. "P" in Times New Roman) on the paper-tone background
12. **Download CV** link points to a PDF version of the existing CV (place `Paul_Diaz_Ashot_CV.pdf` in `/public`)

### Nice-to-have (post-v1)

- Subtle scroll-progress indicator (1px line at top of viewport)
- "Back to top" link at the very bottom
- A cmd/ctrl-K command palette that lists every anchor term and lets you jump to it. (LessWrong-coded; cute but optional.)

### Explicitly excluded

- No comment system
- No analytics initially. Add Plausible (privacy-respecting) post-launch if Paul wants traffic data.
- No service worker or offline mode
- No internationalization
- No accessibility WCAG-AAA targets (AA is the bar)

---

## 8. Component spec

Claude Code should build the following Astro components in `src/components/`:

### `<Sidenote>`
Props: `id` (string), `children` (the note content)
Renders: a numbered marker inline at the anchor point + the actual note in the right gutter (desktop) or an expanding inline block (mobile)

### `<HoverCard>`
Props: `term` (string, the anchor text shown in body), `children` (the card content)
Renders: the term inline with a solid underline; on hover/tap, a card panel appears positioned below the term (desktop) or as a centered modal (mobile)

### `<Section>`
Props: `id` (string), `title` (string)
Renders: an `<h2>` with the small-caps + letter-spaced styling and the rule below

### `<Footer>`
No props. Renders the single-line footer with all the metadata.

### `<MetaHead>`
Renders all `<head>` content — favicon, fonts, OG tags, Twitter tags. One source of truth.

---

## 9. File structure

```
pauldiazashot/
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   ├── Paul_Diaz_Ashot_CV.pdf
│   └── images/
│       └── (anchor-card images: gmx-tvl-chart.png, etc.)
├── src/
│   ├── components/
│   │   ├── Sidenote.astro
│   │   ├── HoverCard.astro
│   │   ├── Section.astro
│   │   ├── Footer.astro
│   │   └── MetaHead.astro
│   ├── content/
│   │   ├── index.mdx                 (the page itself)
│   │   └── annotations/
│   │       ├── gmx.mdx
│   │       ├── chainlink.mdx
│   │       ├── pawlymarket.mdx
│   │       ├── wittgenstein.mdx
│   │       └── (one per annotation)
│   ├── layouts/
│   │   └── Base.astro
│   ├── pages/
│   │   ├── index.astro              (imports content/index.mdx)
│   │   └── 404.astro
│   └── styles/
│       └── global.css
└── README.md                         (deploy + edit instructions)
```

---

## 10. Deployment

1. Initialise repo on GitHub (`pauldiazashot/site` or similar; private repo OK)
2. Connect repo to Vercel via the Vercel dashboard
3. Set framework preset: Astro. Output directory: `dist`.
4. Set custom domain: `pauldiazashot.com` (and `www`)
5. DNS: add A record pointing to `76.76.21.21` (Vercel) on the root, and CNAME `www → cname.vercel-dns.com`
6. Auto-deploy on push to `main`

---

## 11. Build sequence (Claude Code task list)

In this order, with verification checkpoints:

1. **Scaffold**: `npm create astro@latest`, choose minimal template, add Tailwind via `npx astro add tailwind`, add MDX via `npx astro add mdx`. Verify dev server runs.
2. **Typography setup**: no font installs — Times New Roman is system-resident on every target platform. Configure Tailwind theme with the colour palette and a single `font-serif` family pointing at `"Times New Roman", Times, serif` per §4.
3. **Layout**: build `Base.astro` layout with the centred 680px column, paper background, and right gutter zone. Test with placeholder Lorem.
4. **Components**: build `Sidenote`, `HoverCard`, `Section` in that order. For each, verify desktop and mobile behaviour with placeholder content before moving on.
5. **Content scaffolding**: create `content/index.mdx` with all 6 sections from §5 using the MVP placeholder text. Wire up annotation slots.
6. **Annotation content**: Paul writes the 14 annotations (per §6 word targets) into separate MDX files in `content/annotations/`. Claude Code wires them into the main page.
7. **Footer + metadata**: build the Footer component and MetaHead. Generate OG image.
8. **Polish pass**: hover/tap timings, mobile breakpoints, font loading, 404 page.
9. **Lighthouse audit**: run, fix any score below 95.
10. **Deploy**: push to GitHub, connect Vercel, configure DNS, verify live.
11. **Post-deploy**: test on real iPhone, real Android, share preview link with one trusted person for a sanity check before submitting the application.

---

## 12. Done criteria

The site ships when:

- All 14 annotations are written and live
- Paul has read the whole page on desktop and mobile and is willing to put the URL on his CV
- Lighthouse scores are 95+ across all four metrics
- The PDF CV downloads correctly
- The OG card renders correctly when the URL is pasted into iMessage and Twitter

That is v1. Anything else is v2.
