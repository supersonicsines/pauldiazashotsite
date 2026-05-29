import { useEffect, useRef, useState } from 'react';
import VanillaTilt from 'vanilla-tilt';
import { properties } from '../../data/dummy';

// Public assets are served under the configured base path.
const BASE = import.meta.env.BASE_URL;
const src = (p: string) => BASE + p;

/** One house: big photo + three thumbnails; clicking a thumb swaps it into the big slot. */
function Gallery({ photos }: { photos: string[] }) {
  const [order, setOrder] = useState<number[]>(() => photos.map((_, i) => i));
  const bigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bigRef.current as (HTMLElement & { vanillaTilt?: { destroy(): void } }) | null;
    if (!el) return;
    VanillaTilt.init(el, {
      max: 5,
      speed: 500,
      scale: 1.015,
      glare: true,
      'max-glare': 0.12,
    } as any);
    return () => el.vanillaTilt?.destroy();
  }, []);

  const big = order[0];
  const thumbs = order.slice(1);

  // swap the clicked thumbnail (slot 0..2) with the current big photo
  const promote = (slot: number) =>
    setOrder((o) => {
      const next = [...o];
      const i = slot + 1;
      [next[0], next[i]] = [next[i], next[0]];
      return next;
    });

  return (
    <div className="ph-gallery">
      <div className="ph-big" ref={bigRef}>
        {/* key remounts on swap so the slide-in animation replays */}
        <img className="ph-img ph-img--big" key={big} src={src(photos[big])} alt="" draggable={false} />
      </div>
      <div className="ph-thumbs">
        {thumbs.map((p, slot) => (
          <button
            type="button"
            className="ph-thumb"
            key={p}
            onClick={() => promote(slot)}
            aria-label="Show this photo"
          >
            <img className="ph-img" src={src(photos[p])} alt="" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesIsland() {
  return (
    <div className="ph-grid">
      {properties.map((prop, i) => (
        <article className="ph-card" key={i}>
          <header className="ph-card-head">
            <h3 className="ph-price">
              {prop.price}
              <span className="ph-pm"> p/m</span>
            </h3>
            <p className="ph-meta">
              {prop.size}
              {prop.land ? ` · ${prop.land} land` : ''}
            </p>
          </header>

          <Gallery photos={prop.photos} />

          <div className="ph-tags">
            {prop.tags.map((t) => (
              <span className="ph-tag" key={t}>
                {t}
              </span>
            ))}
          </div>

          <div className="ph-divider">
            <span className="ph-fleur" aria-hidden="true">⚜︎</span>
          </div>

          <a
            className="ph-link"
            href={prop.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the listing"
            onClick={prop.url === '#' ? (e) => e.preventDefault() : undefined}
          >
            🔗
          </a>
        </article>
      ))}
    </div>
  );
}
