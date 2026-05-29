import { useState, useRef, useMemo, useLayoutEffect, useEffect } from 'react';
import { roadmap, sections, auxTimeline, type RoadmapEvent } from '../../data/dummy';

/* ============================================================
   GEOMETRY — squiggle generation + arc-length placement
   ============================================================ */
const STAGE_W = 1600;
const STAGE_H = 1000; // drawing region for the squiggle, nodes, months & legend
// The auxiliary chevron strip lives in fresh space BELOW the squiggle region.
// TOTAL_H is what we actually fit-to-screen; the squiggle keeps its 0–1000 box.
const AUX_BAND_H = 152;
const TOTAL_H = STAGE_H + AUX_BAND_H;
const AUX_RULE_Y = 1000; // hairline that separates the band from the main timeline
const AUX_X0 = 130;
const AUX_X1 = 1470;
const AUX_GAP = 10; // breathing gap between chevrons
const AUX_N = auxTimeline.steps.length; // chevron count follows the data
const AUX_SEG = (AUX_X1 - AUX_X0 - AUX_GAP * (AUX_N - 1)) / AUX_N; // chevron width
const AUX_H = 84; // chevron height
const AUX_CHEV_TOP = 1044;
const AUX_NOTCH = 26; // depth of the arrow tip / receiving notch
const AUX_GLOW = 'rgba(85,107,47,'; // olive accent (#556b2f) as an rgba prefix
const X0 = 150;
const X1 = 1450;
const CENTER_Y = 568;
const MONTHS = 12; // Jun 2026 (0) -> Jun 2027 (12)
const SPLIT_MONTH = 9.85; // solid spine ends just past the last event; faint trail beyond
const DRAW_MS = 2600;
const LINE_WEIGHT = 3.4;

const TIMELINE_INDEX = sections.findIndex((s) => s.id === 'timeline');

// A gently flowing wave profile (+ is down on screen). Normalised offsets.
const PROFILE = { amp: 168, offs: [0.14, -0.86, 0.74, -0.62, 0.56, -0.5, 0.46, 0.22] };

type Sample = { x: number; y: number; len: number; tx?: number; ty?: number; nx?: number; ny?: number };

// Uniform Catmull-Rom through anchors -> dense samples with cumulative length.
function buildSamples(): { samples: Sample[]; total: number } {
  const { amp, offs } = PROFILE;
  const n = offs.length;
  const anchors = offs.map((o, i) => ({ x: X0 + (i / (n - 1)) * (X1 - X0), y: CENTER_Y + amp * o }));
  const SEG = 48;
  const pts: Sample[] = [];
  for (let i = 0; i < anchors.length - 1; i++) {
    const p0 = anchors[i - 1] || anchors[i];
    const p1 = anchors[i];
    const p2 = anchors[i + 1];
    const p3 = anchors[i + 2] || anchors[i + 1];
    for (let j = 0; j <= SEG; j++) {
      if (i > 0 && j === 0) continue; // dedupe shared endpoints
      const t = j / SEG;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      pts.push({ x, y, len: 0 });
    }
  }
  let len = 0;
  pts[0].len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    pts[i].len = len;
  }
  return { samples: pts, total: len };
}

function withTangent(samples: Sample[], idx: number, p: Sample): Sample {
  const a = samples[Math.max(0, idx - 1)];
  const b = samples[Math.min(samples.length - 1, idx + 1)];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const L = Math.hypot(dx, dy) || 1;
  p.tx = dx / L;
  p.ty = dy / L;
  p.nx = -p.ty;
  p.ny = p.tx;
  return p;
}

// Even spacing ALONG the curve: locate the point at a given arc length.
function sampleAtLen(samples: Sample[], targetLen: number): Sample {
  const total = samples[samples.length - 1].len;
  const L = Math.max(0, Math.min(total, targetLen));
  let lo = 0;
  let hi = samples.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (samples[mid].len < L) lo = mid;
    else hi = mid;
  }
  const a = samples[lo];
  const b = samples[hi];
  const f = (L - a.len) / (b.len - a.len || 1);
  return withTangent(samples, lo, { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, len: L });
}

function dFromSamples(samples: Sample[], fromLen: number, toLen: number): string {
  let d = '';
  let started = false;
  for (const s of samples) {
    if (s.len < fromLen - 0.01 || s.len > toLen + 0.01) continue;
    d += (started ? 'L' : 'M') + s.x.toFixed(2) + ' ' + s.y.toFixed(2) + ' ';
    started = true;
  }
  return d.trim();
}

/* ============================================================
   COST PILL — revealed on card hover
   ============================================================ */
function CostPill({ dir, amount }: { dir: string; amount?: number }) {
  if (dir === 'neutral' || amount == null) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          font: '600 10px var(--sans)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          background: 'var(--hover)',
          padding: '6px 12px',
          borderRadius: 999,
        }}
      >
        Business event
      </span>
    );
  }
  const up = dir === 'up';
  // On-palette: reductions read in the olive accent; the one increase in ink.
  const col = up ? 'var(--ink)' : 'var(--accent)';
  const bg = up ? 'var(--hover)' : 'rgba(85,107,47,0.10)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 6,
        whiteSpace: 'nowrap',
        color: col,
        background: bg,
        padding: '6px 13px',
        borderRadius: 999,
        font: '600 14.5px var(--serif)',
        letterSpacing: '0.01em',
      }}
    >
      <span style={{ fontSize: 11, transform: 'translateY(-1px)' }}>{up ? '▲' : '▼'}</span>
      <span>{(up ? '+' : '−') + '€' + amount.toLocaleString('en-US')}</span>
      <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 500, letterSpacing: '0.04em' }}>/mo</span>
    </span>
  );
}

/* ============================================================
   CAPTION CARD
   ============================================================ */
function Card({
  ev,
  x,
  y,
  above,
  isHover,
  onEnter,
  onLeave,
}: {
  ev: RoadmapEvent & { x: number; y: number };
  x: number;
  y: number;
  above: boolean;
  isHover: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Cards sit well clear of the line so it has room to breathe.
  const gap = ev.big ? 40 : 34;
  const ay = y + (above ? -gap : gap);
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'absolute',
        left: x,
        top: ay,
        // No scale — the card stays put and only expands to reveal the pill,
        // anchored at the edge nearest the line so it never lurches.
        transform: `translate(-50%, ${above ? '-100%' : '0%'})`,
        zIndex: isHover ? 60 : 12,
        pointerEvents: 'auto',
        cursor: 'default',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: 'var(--bg)',
          border: '1px solid var(--rule)',
          borderRadius: 6,
          padding: '11px 18px 12px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          boxShadow: isHover
            ? '0 22px 50px -24px rgba(17,17,17,0.40), 0 3px 10px -4px rgba(17,17,17,0.15)'
            : '0 9px 24px -17px rgba(17,17,17,0.32)',
          transition: 'box-shadow .36s ease',
        }}
      >
        <div
          style={{
            font: '600 10px var(--sans)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 7,
          }}
        >
          {ev.date}
        </div>
        {ev.line1 && (
          <div
            style={{
              fontFamily: 'var(--serif)',
              fontStyle: 'italic',
              fontSize: 15.5,
              lineHeight: 1.05,
              color: 'var(--ink-2)',
            }}
          >
            {ev.line1}
          </div>
        )}
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 600,
            fontSize: 22,
            lineHeight: 1.12,
            color: 'var(--ink)',
            marginTop: ev.line1 ? 2 : 0,
          }}
        >
          {ev.line2}
        </div>
        <div
          style={{
            overflow: 'hidden',
            maxHeight: isHover ? 46 : 0,
            opacity: isHover ? 1 : 0,
            marginTop: isHover ? 12 : 0,
            transition: 'max-height .36s cubic-bezier(.2,.85,.25,1), opacity .3s ease, margin .36s ease',
          }}
        >
          <CostPill dir={ev.dir} amount={ev.amount} />
        </div>
      </div>
      {/* pointer toward the node */}
      <div
        style={{
          position: 'absolute',
          width: 12,
          height: 12,
          background: 'var(--bg)',
          left: 'calc(50% - 6px)',
          [above ? 'bottom' : 'top']: -6,
          borderLeft: '1px solid var(--rule)',
          borderTop: '1px solid var(--rule)',
          transform: above ? 'rotate(225deg)' : 'rotate(45deg)',
        }}
      />
    </div>
  );
}

/* ============================================================
   AUX ARROW — one chevron in the bottom "choreography" strip
   ============================================================ */
// Build a chevron clip-path. The first arrow has a flat left edge; every other
// arrow has a left notch that receives the previous arrow's tip.
function chevClip(first: boolean): string {
  const kx = (AUX_NOTCH / AUX_SEG) * 100;
  const r = (100 - kx).toFixed(3);
  const k = kx.toFixed(3);
  return first
    ? `polygon(0 0, ${r}% 0, 100% 50%, ${r}% 100%, 0 100%)`
    : `polygon(0 0, ${r}% 0, 100% 50%, ${r}% 100%, 0 100%, ${k}% 50%)`;
}

function AuxArrow({
  title,
  x,
  first,
  glow,
}: {
  title: string;
  x: number;
  first: boolean;
  glow: boolean;
}) {
  const clip = chevClip(first);
  // Inner padding clears the right-hand tip and the left-hand notch so the
  // serif label always sits in the flat middle of the arrow.
  const padL = first ? 22 : 32;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: AUX_CHEV_TOP,
        width: AUX_SEG,
        height: AUX_H,
        transform: glow ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform .34s cubic-bezier(.2,.7,.3,1)',
      }}
    >
      {/* border layer — becomes the olive accent and casts the green glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: clip,
          background: glow ? 'var(--accent)' : 'var(--rule)',
          filter: glow
            ? `drop-shadow(0 0 13px ${AUX_GLOW}0.60)) drop-shadow(0 6px 24px ${AUX_GLOW}0.50))`
            : 'none',
          transition: 'filter .34s ease, background .34s ease',
        }}
      />
      {/* fill layer — white, with a faint olive wash when glowing */}
      <div
        style={{
          position: 'absolute',
          inset: 1.4,
          clipPath: clip,
          // Opaque so the olive border layer only reads as a thin rim; a barely
          // there olive wash ties the glow to the chevron without filling it.
          background: glow ? '#f4f6ee' : 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `0 32px 0 ${padL}px`,
          transition: 'background .34s ease',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 15.5,
            lineHeight: 1.22,
            fontWeight: 500,
            color: 'var(--ink)',
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TIMELINE ISLAND
   ============================================================ */
export default function TimelineIsland() {
  const [hover, setHover] = useState<string | null>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const spineRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { samples, total } = useMemo(() => buildSamples(), []);
  const splitLen = useMemo(() => total * (SPLIT_MONTH / MONTHS), [total]);

  const spineD = useMemo(() => dFromSamples(samples, 0, splitLen), [samples, splitLen]);
  const trailD = useMemo(() => dFromSamples(samples, splitLen - 12, total), [samples, splitLen, total]);

  const months = useMemo(
    () =>
      roadmap.months.map((label, i) => {
        const p = sampleAtLen(samples, total * (i / MONTHS));
        return { label, i, ...p, faint: i > SPLIT_MONTH, year: i === 0 ? '2026' : i === 7 ? '2027' : null };
      }),
    [samples, total]
  );

  const nodes = useMemo(
    () =>
      roadmap.events.map((ev) => {
        const p = sampleAtLen(samples, total * (ev.m / MONTHS));
        return { ...ev, x: p.x, y: p.y };
      }),
    [samples, total]
  );

  // --- fit the 1600x1000 stage into the slide area -------------------------
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w && h) setScale(Math.min(w / STAGE_W, h / TOTAL_H));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // --- draw-on reveal: measure path lengths, then animate when slide shows --
  const [lens, setLens] = useState({ spine: 0, trail: 0 });
  const [drawn, setDrawn] = useState(false);
  const playedRef = useRef(false);
  useLayoutEffect(() => {
    setLens({
      spine: spineRef.current ? spineRef.current.getTotalLength() : 0,
      trail: trailRef.current ? trailRef.current.getTotalLength() : 0,
    });
  }, [spineD, trailD]);

  useEffect(() => {
    const start = () => {
      if (playedRef.current) {
        setDrawn(true);
        return;
      }
      playedRef.current = true;
      requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    };
    const onSlide = (e: Event) => {
      if ((e as CustomEvent).detail?.index === TIMELINE_INDEX) start();
    };
    window.addEventListener('aix:slide', onSlide);
    const activeIdx = Array.from(document.querySelectorAll('.slide')).findIndex((s) => s.classList.contains('active'));
    if (activeIdx === TIMELINE_INDEX) start();
    return () => window.removeEventListener('aix:slide', onSlide);
  }, []);

  const enter = (id: string) => {
    window.clearTimeout(hideTimer.current);
    setHover(id);
  };
  const leave = () => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setHover(null), 140);
  };

  const pathDrawStyle = (len: number, delay: number) => ({
    strokeDasharray: len || undefined,
    strokeDashoffset: drawn ? 0 : len || 0,
    transition: `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(.45,0,.18,1) ${delay}ms`,
  });

  function renderNode(nd: (typeof nodes)[number], isHover: boolean) {
    const r = nd.big ? 5.5 : 3.4;
    const col = 'var(--accent)';
    const scaleN = isHover ? 1.5 : 1;
    return (
      <g
        style={{
          transform: `translate(${nd.x}px, ${nd.y}px) scale(${scaleN})`,
          transformBox: 'fill-box',
          transformOrigin: 'center',
          transition: 'transform .25s cubic-bezier(.2,.7,.3,1)',
        }}
      >
        {/* small solid dot; the pivotal move-in gets a ring + halo */}
        {nd.big ? (
          <>
            <circle r={r} fill="var(--bg)" stroke={col} strokeWidth="2" />
            <circle r={2.2} fill={col} />
            <circle r={r + 4.5} fill="none" stroke={col} strokeWidth="1" opacity="0.45" />
          </>
        ) : (
          <circle r={r} fill={col} />
        )}
      </g>
    );
  }

  const end = sampleAtLen(samples, total);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: STAGE_W,
          height: TOTAL_H,
          flex: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* ---- Header ---- */}
        <header style={{ position: 'absolute', top: 56, left: 76, right: 76, zIndex: 5 }}>
          <div
            style={{
              font: '600 12px var(--sans)',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 14,
            }}
          >
            {roadmap.eyebrow}
          </div>
          <h1 style={{ margin: 0, font: '400 56px/1.0 var(--serif)', letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            {roadmap.heading}
          </h1>
          <p style={{ margin: '14px 0 0', maxWidth: 640, font: '400 16px/1.5 var(--serif)', color: 'var(--ink-2)' }}>
            {roadmap.intro}
          </p>
        </header>

        {/* ---- The squiggle + nodes + months ---- */}
        <svg width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} style={{ position: 'absolute', inset: 0 }}>
          {/* faint future trail */}
          <path
            ref={trailRef}
            d={trailD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={LINE_WEIGHT * 0.82}
            strokeLinecap="round"
            opacity={0.32}
            style={pathDrawStyle(lens.trail, DRAW_MS * 0.55)}
          />
          {/* solid spine */}
          <path
            ref={spineRef}
            d={spineD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={LINE_WEIGHT}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={pathDrawStyle(lens.spine, 0)}
          />

          {/* nodes */}
          {nodes.map((nd) => {
            const isHover = hover === nd.id;
            return (
              <g key={nd.id} style={{ cursor: 'pointer' }} onMouseEnter={() => enter(nd.id)} onMouseLeave={leave}>
                <circle cx={nd.x} cy={nd.y} r="26" fill="transparent" />
                <g style={{ opacity: isHover ? 1 : 0.78, transition: 'opacity .22s ease' }}>{renderNode(nd, isHover)}</g>
              </g>
            );
          })}

          {/* month markers + labels (in front of the line, haloed) */}
          {months.map((mo) => {
            const mside = mo.y < CENTER_Y ? 1 : -1;
            const ly = mo.y + mside * 36;
            return (
              <g key={'m' + mo.i} opacity={mo.faint ? 0.5 : 1}>
                <text
                  x={mo.x}
                  y={mo.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    font: '400 16px var(--serif)',
                    fill: 'var(--accent)',
                    stroke: 'var(--bg)',
                    strokeWidth: 3.5,
                    paintOrder: 'stroke',
                    strokeLinejoin: 'round',
                  }}
                >
                  ✦
                </text>
                <text
                  x={mo.x}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    font: '600 14px var(--sans)',
                    letterSpacing: '0.16em',
                    fill: 'var(--ink-2)',
                    textTransform: 'uppercase',
                    stroke: 'var(--bg)',
                    strokeWidth: 3.2,
                    paintOrder: 'stroke',
                    strokeLinejoin: 'round',
                  }}
                >
                  {mo.label}
                </text>
                {mo.year && (
                  <text
                    x={mo.x}
                    y={ly + mside * 22}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      font: '600 13px var(--sans)',
                      letterSpacing: '0.18em',
                      fill: 'var(--accent)',
                      stroke: 'var(--bg)',
                      strokeWidth: 2.6,
                      paintOrder: 'stroke',
                      strokeLinejoin: 'round',
                    }}
                  >
                    {mo.year}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* ---- caption cards ---- */}
        {nodes.map((nd) => (
          <Card
            key={nd.id}
            ev={nd}
            x={nd.x}
            y={nd.y}
            above={nd.y < CENTER_Y}
            isHover={hover === nd.id}
            onEnter={() => enter(nd.id)}
            onLeave={leave}
          />
        ))}

        {/* ---- trail-end annotation ---- */}
        <div
          style={{
            position: 'absolute',
            left: end.x - 4,
            top: end.y + 30,
            transform: 'translateX(-50%)',
            textAlign: 'center',
            font: 'italic 400 22px/1.25 var(--serif)',
            color: 'var(--accent)',
            opacity: 0.78,
            width: 160,
            pointerEvents: 'none',
          }}
        >
          {roadmap.trail.title}
          <br />
          <span
            style={{
              font: '600 11px var(--sans)',
              fontStyle: 'normal',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}
          >
            {roadmap.trail.sub}
          </span>
        </div>

        {/* ---- legend (kept in the squiggle region, above the aux band) ---- */}
        <div style={{ position: 'absolute', left: 76, top: 924, zIndex: 5, display: 'flex', gap: 26, alignItems: 'center' }}>
          {[
            { color: 'var(--accent)', bg: 'rgba(85,107,47,0.12)', glyph: '▼', label: 'Fixed cost reduction' },
            { color: 'var(--ink)', bg: 'var(--hover)', glyph: '▲', label: 'Fixed cost increase' },
            { color: 'var(--ink-3)', bg: 'var(--hover)', glyph: '◆', label: 'Business event' },
          ].map((it) => (
            <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: it.bg,
                  color: it.color,
                  font: '500 10px var(--sans)',
                }}
              >
                {it.glyph}
              </span>
              <span style={{ font: '400 13.5px var(--sans)', color: 'var(--ink-2)' }}>{it.label}</span>
            </div>
          ))}
        </div>

        {/* ============ AUX: the straight "choreography" arrow timeline ============ */}
        {/* A secondary strip across the bottom. Each chevron lights with a soft
            olive glow when a related card in the main timeline above is hovered.
            Purely reactive — pointer-events off so it never steals hover. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: drawn ? 1 : 0,
            transform: drawn ? 'translateY(0)' : 'translateY(10px)',
            transition: `opacity .7s ease ${Math.round(DRAW_MS * 0.5)}ms, transform .7s cubic-bezier(.22,1,.36,1) ${Math.round(
              DRAW_MS * 0.5
            )}ms`,
          }}
        >
          {/* hairline separating the auxiliary band from the main timeline */}
          <div
            style={{ position: 'absolute', left: AUX_X0, width: AUX_X1 - AUX_X0, top: AUX_RULE_Y, height: 1, background: 'var(--rule)' }}
          />
          {/* the chevrons */}
          {auxTimeline.steps.map((s, i) => (
            <AuxArrow
              key={i}
              title={s.title}
              x={AUX_X0 + i * (AUX_SEG + AUX_GAP)}
              first={i === 0}
              glow={hover != null && s.triggers.includes(hover)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
