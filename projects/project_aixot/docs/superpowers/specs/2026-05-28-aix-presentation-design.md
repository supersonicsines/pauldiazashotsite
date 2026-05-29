# Project AIX_OT — Interactive Relocation Presentation
**PRD for prototype build**
Date: 2026-05-28

---

## Background & Vision

This is an interactive client presentation, built as a standalone web application, arguing the case for relocating four elderly family members from two separate cities into a single shared residence in Aix-en-Provence, France.

### The Client Situation

The client has four elderly relatives:
- Two living in Brussels (in separate apartments)
- Two living in Barcelona (in separate apartments)

The proposal is to consolidate everyone into a single home in **Aix-en-Provence**, in the south of France. Aix sits roughly equidistant between Brussels and Barcelona — central, well-connected, and with a quality of life that makes it an ideal candidate.

### Purpose of the Presentation

This is not a web app with users and accounts. It is a **client-facing presentation deck** — a rich, interactive website that functions like a high-end slide deck. The presenter (the person who commissioned this) walks the client family through it, or hands them a URL to explore themselves.

The presentation must feel authoritative and considered — not a scrappy prototype, not a generic slide template. It should feel like something a boutique consulting firm or private bank would produce for a high-net-worth family. Every detail should reinforce credibility and care.

**All content is dummy data for the prototype.** Real copy, real property listings, and real financial figures will be swapped in during iteration. Opus should use realistic-feeling placeholder content — not "Lorem ipsum" in headline positions, but plausible dummy copy that communicates the intended tone and structure.

---

## Aesthetic System

### Tone
Editorial Precision. Think: a premium architecture report, a private bank proposal document, or a high-end real estate brochure. Clean, authoritative, unhurried. Nothing decorative that doesn't serve a purpose.

### Typography
- **Primary font**: Georgia (serif, system font — no external dependency needed for prototype). Fall back to `'Times New Roman', serif`.
- **Label / UI text**: system sans-serif (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) for small navigational elements only. All heading and body text is serif.
- **Scale**: Large and confident. Slide titles should feel like they own the page.
  - Cover title: ~52–64px
  - Section headings: ~36–44px
  - Body text: ~17–18px, generous line-height (1.65–1.75)
  - Labels: 10–11px, uppercase, letter-spacing 3–4px

### Colour Palette
```
Background:       #ffffff
Primary text:     #111111
Secondary text:   #666666
Tertiary / label: #aaaaaa
Rule / border:    #e0e0e0  (light rules throughout)
Rule / accent:    #111111  (structural rules: header bottom, footer top)
Active / current: #111111  (underline on active section name)
Hover state:      #f7f7f7  (subtle background shift on interactive elements)
```

No colour accents. Black, white, and greys only. The map and property photos will be the only colour in the presentation — they should feel like windows of life inside the minimal frame.

### Spacing
Generous. Sections should breathe. Default padding on slide content: 64px horizontal, 48px vertical (adjust per slide as needed). Never feel cramped.

### Rules
Thin 1px lines (`#e0e0e0` for interior structure, `#111111` for the header and footer rules of the chrome). Used as structural dividers, not decoration. No box shadows. No rounded corners except on the property cards (4px max, subtle).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro (static site generator) |
| Interactivity | React component islands (`@astrojs/react`) |
| Styling | Tailwind CSS (`@astrojs/tailwind`) |
| Map | Leaflet.js (`leaflet` + `react-leaflet`) |
| Charts | Chart.js (`chart.js` + `react-chartjs-2`) |
| Sliders | Native HTML `<input type="range">`, styled with CSS |
| Build output | Static (`output: 'static'` in Astro config) |
| Base path | `/project-aix-ot/` (set `base` in Astro config for deployment) |

**Why Astro:** Static output, component islands (React only where interaction is needed), ideal for content-heavy presentation-style pages. Fits the existing amas_apps platform — deploys as flat files, no port required.

**Why Leaflet over Mapbox:** No API key required. CartoDB light tiles are free and beautiful. Keeps the prototype self-contained.

---

## Application Shell & Navigation Chrome

### Layout Structure
The application is a single HTML page. All six slides exist in the DOM simultaneously, stacked vertically, but only one is visible at a time. Navigation advances/retreats through them.

```
┌──────────────────────────────────────────────────────┐
│  HEADER (fixed, full-width, ruled bottom)            │
│  AIX-EN-PROVENCE           COVER  WHY AIX  LOCATION… │
├──────────────────────────────────────────────────────┤
│                                                      │
│                  SLIDE CONTENT                       │
│              (100vh, centered)                       │
│                                                      │
├──────────────────────────────────────────────────────┤
│  FOOTER (fixed, full-width, ruled top)               │
│                                        ← →           │
└──────────────────────────────────────────────────────┘
```

### Header
- Fixed to top, full viewport width
- Height: ~52px
- Left: Project name — `AIX-EN-PROVENCE` — 10px, all-caps, letter-spacing 4px, `#111`
- Right: Section names — `COVER · WHY AIX · LOCATION · PROPERTIES · COSTS · TIMELINE`
  - 9px, all-caps, letter-spacing 2px, `#aaaaaa` default
  - Active section: `#111111`, with a 1px underline below the text
  - Clicking a section name jumps to that slide
  - Padding between names: 20px
- Border-bottom: `1px solid #111111`
- Background: `#ffffff` (opaque)

### Footer
- Fixed to bottom, full viewport width
- Height: ~40px
- Right-aligned: `← →` — 11px, `#aaaaaa`, letter-spacing 1px
  - This is purely a visual affordance (keyboard hint), not clickable buttons
- Border-top: `1px solid #e0e0e0`

### Slide Container
- Each slide: `width: 100vw`, `height: calc(100vh - 52px - 40px)` (subtract header + footer)
- Only the active slide is visible (`opacity: 1`, others `opacity: 0`, or `display: none`)
- Transition on slide change: crossfade, 300ms ease

### Keyboard Navigation
- `ArrowRight` or `ArrowDown`: advance to next slide
- `ArrowLeft` or `ArrowUp`: go to previous slide
- No wrap-around (cannot go before slide 1 or after slide 6)

---

## Slide Specifications

### Slide 1 — Cover

**Layout:** Full-bleed white, content vertically and horizontally centered.

**Content:**
```
[small all-caps label, #aaa]
A PROPOSAL FOR THE FAMILY

[large serif title, #111, ~56px]
A New Life in
Aix-en-Provence

[thin 1px rule, 60px wide, #111, centered, margin 24px top/bottom]

[subtitle, serif, 18px, #666]
Prepared for the [Family Name] Family

[date label, 11px, all-caps, #aaa, margin-top 12px]
MAY 2026
```

**Interaction:** None. Pure typography.

---

### Slide 2 — Why Aix-en-Provence

**Layout:** Two-column, 50/50 split, vertically centered, 64px horizontal padding.

**Left column — editorial text:**
- Small all-caps label: `WHY AIX-EN-PROVENCE`
- Heading: ~38px serif, e.g. "A city built for living well"
- Body paragraph: 17px serif, ~120 words of dummy editorial copy explaining the virtues of Aix. Should feel like considered prose, not a listicle. Write something like: "Aix-en-Provence sits at the heart of Provence, a city of fountains, markets, and measured light…" — readable, calm, confident.
- Thin rule below the paragraph

**Right column — hover bullet list:**
- 5–6 bullet points, each covering a reason to choose Aix
- Example dummy bullets:
  - Climate & quality of life
  - Central location between Brussels and Barcelona
  - World-class healthcare infrastructure
  - Rich cultural and civic life
  - Excellent transport links (TGV, airport)
  - Lower combined cost of living
- Each bullet: on hover, the bullet expands downward revealing 1–2 lines of supporting detail. Smooth max-height transition (300ms ease).
- Bullet marker: a simple thin dash `—` in `#aaa`, not a filled dot
- Non-hovered bullets: 16px serif, `#111`
- Hovered state: reveal text is 14px, `#666`, indented 16px

---

### Slide 3 — The Location

**Layout:** Near-full-bleed map with a small text overlay/caption.

**Map:**
- Leaflet map, initialized to center: `[43.5297, 5.4474]` (Aix-en-Provence), zoom level 5
- Tile layer: CartoDB Positron (light, minimal, no labels distracting from the three pins)
  - URL: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
  - Attribution: `© OpenStreetMap contributors © CARTO`
- Map fills the slide content area entirely (no padding on the map itself)
- Map is a React island (`client:only="react"`)

**Pins — three locations:**
| City | Coordinates | Label |
|---|---|---|
| Brussels | `[50.8503, 4.3517]` | `BRUSSELS` |
| Barcelona | `[41.3851, 2.1734]` | `BARCELONA` |
| Aix-en-Provence | `[43.5297, 5.4474]` | `AIX-EN-PROVENCE` |

- Custom SVG pin markers: clean, minimal — a small filled circle with a thin border. Aix pin slightly larger and in `#111`. Brussels and Barcelona pins in `#aaaaaa`.
- Each pin has a simple tooltip on hover showing the city name and a one-line dummy description (e.g. "Current residence — 2 family members")

**Overlay caption (top-left of map, inside the slide):**
```
[small all-caps label, white on semi-transparent white bg, subtle]
THE LOCATION
[16px serif]
Three cities. One destination.
```

---

### Slide 4 — Properties

**Layout:** Full-width card carousel, vertically centered.

**Header section (above carousel):**
- All-caps label: `SELECTED PROPERTIES`
- Heading: ~36px serif, e.g. "Homes in Aix-en-Provence"
- Subline: 15px, `#666`, e.g. "A selection of properties currently available in and around the city centre."

**Carousel:**
- 4–5 dummy property cards visible in a horizontal scrollable row (show 3 at a time on desktop)
- Left/right arrow buttons to scroll the carousel (styled as thin `‹` `›` glyphs, 28px, bordered square, `#111`)
- Each card:
  - **Image area**: 200px height, grey placeholder background (`#f0f0f0`) with a small `PHOTO` label centered — in the real version this will be an actual image
  - **Card body**: white, 1px border `#e0e0e0`, 4px border-radius
    - Property name / street: 15px serif, `#111`, bold-weight (400 is fine for serif)
    - Neighbourhood: 11px, all-caps, `#aaa`
    - Size: e.g. `280 m²`
    - Bedrooms: e.g. `4 bedrooms`
    - Dummy price: e.g. `€ 1,250,000`
    - Short description: 13px, `#666`, one sentence

**Dummy property data (5 cards):**
1. 14 Rue Émile Zola · Mazarin Quarter · 210 m² · 3 bed · €980,000 · "Elegant first-floor apartment in a 19th-century hôtel particulier."
2. 8 Avenue Victor Hugo · Centre-ville · 320 m² · 5 bed · €1,750,000 · "Spacious villa with a private garden, minutes from the Cours Mirabeau."
3. 22 Chemin des Oliviers · Puyricard · 450 m² · 6 bed · €2,100,000 · "Provençal mas on a half-hectare plot, twenty minutes from the city centre."
4. 3 Place des Cardeurs · Old Town · 175 m² · 3 bed · €850,000 · "Bright duplex apartment overlooking a historic square."
5. 47 Route de Galice · Jas de Bouffan · 280 m² · 4 bed · €1,200,000 · "Contemporary house with pool, in the area once home to Cézanne's family estate."

---

### Slide 5 — Cost Savings

**Layout:** Left column controls (sliders), right column output (chart + headline number).

**Header (above columns):**
- All-caps label: `FINANCIAL OVERVIEW`
- Heading: ~36px serif, e.g. "The case for consolidation"
- Subline: 15px, `#666`, e.g. "Adjust the assumptions below to see how projected savings change."

**Left column — sliders (React island):**
Three sliders:
1. **Monthly costs in Brussels** — range €2,000–€8,000, default €4,500, step €100
2. **Monthly costs in Barcelona** — range €2,000–€8,000, default €3,800, step €100
3. **Projected monthly costs in Aix** — range €3,000–€12,000, default €6,500, step €100

Each slider:
- Label above: 11px all-caps, `#aaa`
- Current value displayed right-aligned next to label: 15px serif, `#111`
- Native `<input type="range">` styled: track is a thin 2px line, thumb is a small circle, all `#111`

**Right column — output:**
- Headline: "Annual saving" — 11px all-caps, `#aaa`
- Big number: computed `((Brussels + Barcelona) - Aix) * 12`, displayed as `€ XX,XXX` — 52px serif, `#111`
  - If negative (Aix costs more), display in `#aaaaaa` with a note
- Below the number: a Chart.js bar chart with 3 bars
  - Bar 1: Brussels monthly (blue-grey, dummy: `#c8c8c8`)
  - Bar 2: Barcelona monthly (same)
  - Bar 3: Aix monthly (darker: `#888888`)
  - Chart updates in real time as sliders change
  - Chart style: no grid lines, minimal axes, clean labels below bars
  - Chart title hidden (the label above is sufficient)

**Note below chart:** 13px, `#aaa` — "All figures are illustrative estimates. Final projections will be prepared with your advisor."

---

### Slide 6 — The Timeline

**Layout:** Horizontally centered timeline, vertically centered on the slide.

**Header (above timeline):**
- All-caps label: `THE ROADMAP`
- Heading: ~36px serif, e.g. "From here to Aix"

**Timeline:**
- Horizontal layout: 6 steps connected by thin ruled lines
- Each step: numbered circle (28px, 1px border `#111`, `#fff` fill, serif number inside) + label below + date below label
- Connecting line: 1px `#e0e0e0` horizontal rule between circles
- Active/hovered step: circle fills to `#111`, text to `#111`
- Default state: all circles unfilled, text `#aaa`, current step (1) active

**Dummy milestones:**
1. **Property Shortlist** — June 2026
2. **Site Visits** — August 2026
3. **Selection & Offer** — September 2026
4. **Legal & Notaire** — October–November 2026
5. **Transition Planning** — December 2026
6. **Move-in** — Q1 2027

**Interaction:** Clicking a step expands a detail panel below the timeline (smooth max-height reveal). Panel contains: step title (serif, 18px) + 2–3 sentences of dummy description of what happens at that stage.

---

## File & Directory Structure

```
project_aix_ot/
├── src/
│   ├── components/
│   │   ├── Shell.astro            # Header + footer chrome
│   │   ├── SlideContainer.astro   # Wraps all slides, handles visibility
│   │   ├── slides/
│   │   │   ├── Cover.astro
│   │   │   ├── WhyAix.astro
│   │   │   ├── Location.astro     # Imports MapIsland.tsx
│   │   │   ├── Properties.astro   # Imports CarouselIsland.tsx
│   │   │   ├── CostSavings.astro  # Imports CostIsland.tsx
│   │   │   └── Timeline.astro
│   │   └── islands/
│   │       ├── MapIsland.tsx      # React + Leaflet
│   │       ├── CarouselIsland.tsx # React carousel
│   │       └── CostIsland.tsx     # React sliders + Chart.js
│   ├── data/
│   │   └── dummy.ts               # All dummy data in one place
│   ├── styles/
│   │   └── global.css             # Base resets, font stack, rule utilities
│   └── pages/
│       └── index.astro            # Assembles the presentation
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Navigation Logic

Implement in a single `<script>` tag in `SlideContainer.astro` (vanilla JS, no framework needed for this):

```js
// Pseudocode — implement as clean vanilla JS
let current = 0;
const slides = document.querySelectorAll('.slide');
const navLinks = document.querySelectorAll('.nav-link');

function goTo(index) {
  slides[current].classList.remove('active');
  navLinks[current].classList.remove('active');
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides[current].classList.add('active');
  navLinks[current].classList.add('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1);
});

navLinks.forEach((link, i) => link.addEventListener('click', () => goTo(i)));
```

---

## Deployment Context

This project lives at `/Users/ama/Documents/amas_apps/project_aix_ot/` on the developer's machine, alongside sibling apps (AZETAI VCT, jobsearch, mint).

- **Server:** agora, 162.243.228.131, Debian 12
- **Domain:** amadeo.run
- **Target URL:** `amadeo.run/project-aix-ot/`
- **Deploy method:** Static build (`astro build`), rsync output to server, served via nginx as static files (no port needed — same pattern as the home dashboard)
- Set `base: '/project-aix-ot/'` in `astro.config.mjs`

A `deploy.sh` script should be created following the pattern of the sibling apps. For a static-only deploy it will be simpler: just `astro build` and `rsync dist/` to the appropriate nginx-served directory.

---

## Prototype Scope & Iteration Notes

- All content is dummy. Use plausible, well-written placeholder copy — not lorem ipsum in visible headings.
- Do not implement authentication — this will be added later if needed.
- Do not implement any backend or CMS — all data is in `src/data/dummy.ts`.
- Focus on fidelity of the shell, typography, and slide mechanics first. Interactive islands (map, sliders, chart) should work but don't need pixel-perfect polish in the first pass.
- The property images are placeholders — styled grey boxes with `#f0f0f0` background are fine.
- Mobile responsiveness is not a priority for the prototype. Design for a 1280px+ desktop viewport (this will be presented on a laptop or external display).
- Transitions should be subtle. If in doubt, use a simple opacity crossfade (300ms) rather than anything kinetic.
