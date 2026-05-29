// =============================================================================
// All placeholder content for the AIX_OT presentation prototype lives here.
// Swap real copy, listings, and figures in during iteration — nothing else
// in the app should hold hard-coded content.
// =============================================================================

export interface Section {
  id: string;
  label: string;
}

/** Order here drives both the header nav and the slide order. */
export const sections: Section[] = [
  { id: 'cover', label: 'Cover' },
  { id: 'why', label: 'Why Aix' },
  { id: 'location', label: 'Location' },
  { id: 'properties', label: 'Properties' },
  { id: 'costs', label: 'Costs' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'pitch', label: 'The Pitch' },
  { id: 'epilogue', label: 'Epilogue' },
];

// ---------- Cover ------------------------------------------------------------

export const cover = {
  eyebrow: 'A Relocation Proposal',
  titleLines: ['A New Life in', 'Aix-en-Provence'],
  subtitle: 'Prepared for Effie Perine',
  date: 'May 2026',
};

// ---------- Why Aix ----------------------------------------------------------

export const whyAix = {
  eyebrow: 'Why Aix-en-Provence',
  heading: 'A city built for living well',
  body:
    "In the south of France near the Côte d'Azur, Aix-en-Provence offers the best " +
    'of France and the Mediterranean. It is a calm, quiet and safe town, well suited ' +
    'to families, with ample options for a world-class childhood education.',
};

export interface WhyPoint {
  title: string;
  detail: string;
}

export const whyPoints: WhyPoint[] = [
  {
    title: 'Location',
    detail:
      'Trains run to Barcelona and Paris, so family from either city can visit by rail, keeping the disruption of the move to a minimum.',
  },
  {
    title: 'Cost of living',
    detail:
      'Day-to-day costs run roughly 20% lower than Brussels and Barcelona, and bringing four households into one stretches the budget further.',
  },
  {
    title: 'Healthcare',
    detail:
      'The Aix and Marseille area has a high concentration of public and private hospitals, and French healthcare ranks among the best in the world.',
  },
  {
    title: 'Schools & nurseries',
    detail:
      'Plenty of nurseries and schools sit in and around the city, state and private, with several international options among them.',
  },
  {
    title: 'Learning French',
    detail:
      'Growing up in Aix, Angélique will pick up French naturally, at nursery and later at school.',
  },
];

// ---------- Location (map) ---------------------------------------------------

export interface MapPin {
  name: string;
  label: string;
  coords: [number, number];
  note: string;
  primary: boolean;
}

export const mapCenter: [number, number] = [46.5, 4.0];
export const mapZoom = 5;

export const mapPins: MapPin[] = [
  { name: 'Brussels', label: 'BRUSSELS', coords: [50.8503, 4.3517], note: 'Current residence — 2 family members', primary: false },
  { name: 'Barcelona', label: 'BARCELONA', coords: [41.3851, 2.1734], note: 'Current residence — 2 family members', primary: false },
  { name: 'Aix-en-Provence', label: 'AIX-EN-PROVENCE', coords: [43.5297, 5.4474], note: 'Proposed shared residence', primary: true },
];

// Direct rail connections radiating out from Aix-en-Provence.
export interface RailLine {
  name: string;
  label: string;
  coords: [number, number];
}

/** All direct lines originate here (Aix-en-Provence TGV). */
export const railOrigin: [number, number] = [43.5297, 5.4474];

export const railLines: RailLine[] = [
  { name: 'Paris', label: 'PARIS', coords: [48.8566, 2.3522] },
  { name: 'Barcelona', label: 'BARCELONA', coords: [41.3851, 2.1734] },
  { name: 'Geneva', label: 'SWITZERLAND', coords: [46.2044, 6.1432] },
];

// Direct flights from Marseille Provence Airport (MRS), ~25 min from Aix.
export const flights = {
  subtitle: 'Direct Flights from MRS Airport',
  destinations: [
    'London',
    'Barcelona',
    'Istanbul',
    'Heraklion',
    'Vienna',
    'Amsterdam',
    'Brussels',
    'Munich',
    'Madrid',
    'Rome',
    'Lisbon',
    'Geneva',
  ],
  distanceNote: 'Marseille Provence Airport is 25 km — about 25 minutes by car — from Aix-en-Provence.',
};

// ---------- Properties -------------------------------------------------------

export interface Property {
  price: string; // monthly rent — bold green title, rendered with a 'p/m' suffix
  size: string; // floor area, e.g. '278 m²'
  land?: string; // optional plot size, e.g. '1,400 m²'
  tags: string[]; // elegant pill tags / feature highlights
  photos: string[]; // public-relative paths; the first photo is the big/hero slot
  tgv: string; // italic distance line (placeholder — to be updated)
  url: string; // listing link (placeholder '#' until provided)
}

// Three example houses. Prices are MONTHLY RENTS. Images live in public/houses/.
export const properties: Property[] = [
  {
    price: '€ 9,500',
    size: '278 m²',
    land: '1,400 m²',
    tags: ['Luxury', 'Extension', 'Central'],
    photos: [
      'houses/house-1/main.jpg',
      'houses/house-1/aux-1.jpg',
      'houses/house-1/aux-2.jpg',
      'houses/house-1/aux-3.jpg',
    ],
    tgv: 'Approximately 10 minutes from the TGV station',
    url: 'https://www.seloger.com/annonces/locations/maison/aix-en-provence-13/269612331.htm?serp_view=map&search=distributionTypes%3DRent%26estateTypes%3DHouse%2CApartment%26locations%3DAD08FR4437%26numberOfBedroomsMin%3D4%26priceMin%3D3000%26spaceMin%3D200#ln=classified_search_results_map_list&m=classified_search_results_map_list_classified_classified_detail_M',
  },
  {
    price: '€ 5,900',
    size: '380 m²',
    tags: ['Villa', 'Cinema', 'Tennis court'],
    photos: [
      'houses/house-2/main.jpg',
      'houses/house-2/aux-1.jpg',
      'houses/house-2/aux-2.jpg',
      'houses/house-2/aux-3.jpg',
    ],
    tgv: 'Approximately 15 minutes from the TGV station',
    url: 'https://www.seloger.com/annonces/locations/maison/aix-en-provence-13/comtale-cente-cours-mirabeau/263817287.htm?serp_view=map&search=distributionTypes%3DRent%26estateTypes%3DHouse%2CApartment%26locations%3DAD08FR4437%26numberOfRoomsMin%3D5%26priceMin%3D3000%26spaceMin%3D200#ln=classified_search_results_map_list&m=classified_search_results_map_list_classified_classified_detail_M',
  },
  {
    price: '€ 6,000',
    size: '371 m²',
    tags: ['Stately'],
    photos: [
      'houses/house-3/main.jpg',
      'houses/house-3/aux-1.jpg',
      'houses/house-3/aux-2.jpg',
      'houses/house-3/aux-3.jpg',
    ],
    tgv: 'Approximately 8 minutes from the TGV station',
    url: 'https://www.immobiliare.it/es/annunci/128863106/?entryPoint=map',
  },
];

// ---------- Cost savings -----------------------------------------------------
// Property names are internal codenames; they do NOT correspond to the cities.

export interface CostProperty {
  name: string;
  monthly: number;
}

export const cost = {
  // Four properties being given up (current monthly rents)
  current: [
    { name: 'Moliere 1', monthly: 4000 },
    { name: 'Moliere 2', monthly: 4500 },
    { name: 'Mallorca', monthly: 5000 },
    { name: 'Nord', monthly: 5500 },
  ] as CostProperty[],
  // Current combined utilities (a single figure). Assumed to halve in Aix.
  utilities: { name: 'Current utilities', monthly: 6000 } as CostProperty,
  // Utilities in Aix are estimated 50% lower (cheaper cost of living).
  aixUtilityFactor: 0.5,
  // The single new shared residence in Aix
  aix: { name: 'Aix residence', monthly: 8000 } as CostProperty,
  // Slider bounds — capped so no property runs above €12,000
  slider: { min: 1000, max: 12000, step: 100 },
  aixSlider: { min: 2000, max: 12000, step: 100 },
  // Amortization: one-off cost of the move; default sits at the mid-point
  moving: { label: 'Total cost of moving', min: 15000, max: 60000, step: 500, default: 37500 },
  // Runway: a pot of liquid savings, and how much longer it lasts in Aix
  runway: { label: 'Liquid savings', min: 100000, max: 2000000, step: 10000, default: 650000 },
  note: 'All figures are illustrative estimates. Final projections will be prepared with your advisor.',
};

// ---------- Timeline ---------------------------------------------------------

export interface Milestone {
  step: number;
  title: string;
  date: string;
  detail: string;
}

export const milestones: Milestone[] = [
  {
    step: 1,
    title: 'Property Shortlist',
    date: 'June 2026',
    detail:
      'We assemble a curated shortlist of homes matching the family’s brief — space, accessibility, and proximity to the centre. Each is pre-vetted before a single visit is booked.',
  },
  {
    step: 2,
    title: 'Site Visits',
    date: 'August 2026',
    detail:
      'A concentrated week of viewings in Aix, arranged back-to-back. We accompany the family throughout and document each property for those who cannot travel.',
  },
  {
    step: 3,
    title: 'Selection & Offer',
    date: 'September 2026',
    detail:
      'With the family aligned on a preferred home, we structure and submit an offer, negotiating terms and price on your behalf.',
  },
  {
    step: 4,
    title: 'Legal & Notaire',
    date: 'October–November 2026',
    detail:
      'The French notaire process is managed end-to-end — compromis de vente, due diligence, and the final acte authentique — with counsel coordinating every step.',
  },
  {
    step: 5,
    title: 'Transition Planning',
    date: 'December 2026',
    detail:
      'We coordinate the practical move: care continuity, healthcare registration, removals from both cities, and the gentle logistics of bringing four lives together.',
  },
  {
    step: 6,
    title: 'Move-in',
    date: 'Q1 2027',
    detail:
      'The family settles into the new home in Aix. We remain on hand through the first weeks to ensure everything — and everyone — is comfortably in place.',
  },
];

// ---------- Relocation Roadmap (Timeline slide) ------------------------------
// A 13-month consolidation story, Jun 2026 → Jun 2027: four household rents
// wound down, one new home in Aix taken on. `m` is the position along the
// 12-month spine (0 = Jun 2026 … 12 = Jun 2027). Amounts are €/month and tie
// back to the four rents + new Aix rent on the Costs slide.

export type RoadmapType = 'out' | 'in' | 'business';
export type RoadmapDir = 'down' | 'up' | 'neutral';

export interface RoadmapEvent {
  id: string;
  m: number; // months along the spine
  type: RoadmapType;
  line1: string; // small italic lead, e.g. "Give notice"
  line2: string; // bold place / action
  date: string; // human label on the card
  dir: RoadmapDir;
  amount?: number; // €/month delta (omitted for business events)
  big?: boolean; // larger node for the pivotal move-in
}

export const roadmap = {
  eyebrow: 'Relocation Roadmap',
  heading: 'From Four Homes to One',
  intro:
    'June 2026 — June 2027. Four family households wind down into a single home in Provence — four rents into one.',
  months: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  trail: { title: 'one home', sub: 'one rent' },
  // `m` positions sit mid-month (never on an integer boundary) so event dots
  // never collide with the ✦ month-start markers.
  events: [
    { id: 'moliere1', m: 0.5, type: 'out', line1: 'Give notice', line2: 'Molière 1', date: 'June 2026', dir: 'down', amount: 4000 },
    { id: 'mallorca', m: 1.5, type: 'out', line1: 'Give notice', line2: 'Mallorca', date: 'July 2026', dir: 'down', amount: 5000 },
    { id: 'moliere2', m: 4.5, type: 'out', line1: 'Give notice', line2: 'Molière 2', date: 'October 2026', dir: 'down', amount: 4500 },
    { id: 'premiere', m: 5.5, type: 'business', line1: '', line2: 'Premiere', date: 'November 2026', dir: 'neutral' },
    { id: 'movein', m: 7.5, type: 'in', line1: 'Move into', line2: 'Aix-en-Provence', date: 'January 2027', dir: 'up', amount: 8000, big: true },
    { id: 'nord', m: 8.5, type: 'out', line1: 'Give notice', line2: 'Nord', date: 'February 2027', dir: 'down', amount: 5500 },
  ] as RoadmapEvent[],
};

// ---------- Auxiliary "choreography" timeline (Timeline slide) ---------------
// A secondary, straight arrow/chevron strip that runs across the bottom of the
// squiggle timeline. It does not track dates — it tells the human story of how
// the households consolidate, in five moves. Each step lights up with a soft
// olive glow when a related card in the MAIN timeline above is hovered.
//
// `triggers` lists the `id`s of roadmap.events (above) that should make a step
// glow. To wire another card to a step, just add its id to that step's array,
// e.g. triggers: ['nord']. Leave empty for no glow.

export interface AuxStep {
  title: string; // serif label shown inside the chevron
  triggers: string[]; // roadmap.events ids that light this step on hover
}

export const auxTimeline = {
  steps: [
    { title: 'Olga moves with Maria', triggers: ['moliere1'] },
    { title: 'Alex moves with Ashot', triggers: ['mallorca'] },
    { title: 'Maria & Olga move to Aix', triggers: ['movein'] },
    { title: 'Dad moves to Aix + Alex gets a flat', triggers: ['nord'] },
  ] as AuxStep[],
};

// ---------- The Pitch --------------------------------------------------------
// What the move means for each member of the family. Lead with Olga; Amadeo
// closes the set.

export interface PitchCard {
  name: string;
  copy: string;
}

export const pitch: PitchCard[] = [
  {
    name: 'Olga',
    copy:
      'A first chapter in France for Angélique — the language, the culture, the schooling, all in the right order. What the move saves is then put aside for the next step: Paris for the two of them, once Angélique reaches primary-school age.',
  },
  {
    name: 'Ashot',
    copy:
      'A gentle, seasonal semi-retirement: time in Aix at his own pace. Part of the savings keeps him in canvases and paint, with whatever help he needs to keep painting.',
  },
  {
    name: 'Maria',
    copy:
      'Aix sits just up the coast from Barcelona — close enough to keep her work there alive. A share of the savings is set aside as an investment in the plays and productions still to come.',
  },
  {
    name: 'Alexis',
    copy: 'A house with a swimming pool.',
  },
  {
    name: 'Amadeo',
    copy:
      'Ease of visiting — he loves Marseille, and the short drive up makes Aix an easy place for extended weekend holidays.',
  },
];

// ---------- Epilogue (the practicalities) ------------------------------------
// Three internal tabs — Education, Healthcare, Finance — set out person by
// person. Education & Healthcare hold section shells whose entries arrive once
// the schools/health facilities are researched (leave `entries: []` for an
// empty placeholder shell). Finance holds four budget cards (Pitch card style)
// plus an auto-summed total.

export interface IndexEntry {
  name: string;
  meta: string;
}

/** A person (or pairing) within an Education/Healthcare tab. */
export interface EpilogueSection {
  /** Heading shown on the section shell, e.g. a person's name. */
  title: string;
  /** Sourced entries. Leave empty for a placeholder shell awaiting research. */
  entries: IndexEntry[];
}

/** A budget card on the Finance tab — Pitch card style, a number per person. */
export interface FinanceCard {
  /** Family member the budget is allocated to. */
  name: string;
  /** Proposed budget, in euros. Placeholder until figures are confirmed. */
  budget: number;
}

export const epilogue = {
  eyebrow: 'Epilogue',
  heading: 'The Practicalities',
  subline: 'Schooling, healthcare, and budget — set out person by person.',
  disclaimer: 'This section to be completed upon the request of the interested party.',
  currency: '€',
  // The first two tabs are section-based; Finance (below) renders as cards.
  tabs: [
    {
      key: 'education',
      label: 'Education',
      sections: [
        { title: 'Olga', entries: [] },
        { title: 'Theo & Angélique', entries: [] },
      ] as EpilogueSection[],
    },
    {
      key: 'healthcare',
      label: 'Healthcare',
      sections: [
        { title: 'Theo', entries: [] },
        { title: 'Olga', entries: [] },
        { title: 'Ashot', entries: [] },
      ] as EpilogueSection[],
    },
  ],
  finance: {
    key: 'finance',
    label: 'Finance',
    // Four proposed budgets, one per family member. Numbers are placeholders.
    cards: [
      { name: 'Olga', budget: 0 },
      { name: 'Theo & Angélique', budget: 0 },
      { name: 'Ashot', budget: 0 },
      { name: 'Maria', budget: 0 },
    ] as FinanceCard[],
  },
};
