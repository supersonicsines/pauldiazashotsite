import { Fragment, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapPins, mapCenter, mapZoom, sections, railOrigin, railLines } from '../../data/dummy';

const ACCENT = '#556b2f';
const LOCATION_INDEX = sections.findIndex((s) => s.id === 'location');
const BOUNDS = L.latLngBounds([
  ...mapPins.map((p) => p.coords),
  railOrigin,
  ...railLines.map((r) => r.coords),
]);

/** A gently bowed arc between two points, for a "rail line" feel. */
function arc(from: [number, number], to: [number, number], bend = 0.18): [number, number][] {
  const [lat1, lng1] = from;
  const [lat2, lng2] = to;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  // Control point: midpoint pushed perpendicular to the chord.
  const cLat = (lat1 + lat2) / 2 - dLng * bend;
  const cLng = (lng1 + lng2) / 2 + dLat * bend;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const u = 1 - t;
    pts.push([
      u * u * lat1 + 2 * u * t * cLat + t * t * lat2,
      u * u * lng1 + 2 * u * t * cLng + t * t * lng2,
    ]);
  }
  return pts;
}

function pinIcon(primary: boolean): L.DivIcon {
  const size = primary ? 18 : 12;
  const color = primary ? '#111111' : '#aaaaaa';
  return L.divIcon({
    className: 'aix-pin',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 0 0 1px ${color};"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Small open ring marking the far end of a direct rail line. */
function railIcon(): L.DivIcon {
  const size = 11;
  return L.divIcon({
    className: 'aix-rail-end',
    html:
      `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;` +
      `background:#ffffff;border:2px solid ${ACCENT};box-shadow:0 0 0 1px #ffffff;"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Train glyph sitting on a rail line, marking it as a train route. */
function trainIcon(): L.DivIcon {
  const size = 26;
  return L.divIcon({
    className: 'aix-rail-train',
    html:
      `<span style="display:flex;align-items:center;justify-content:center;` +
      `width:${size}px;height:${size}px;border-radius:50%;background:#ffffff;` +
      `border:1.5px solid ${ACCENT};box-shadow:0 1px 3px rgba(0,0,0,0.18);` +
      `font-size:14px;line-height:1;">🚆</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Keeps the map correctly sized + framed, including when its slide is shown. */
function MapBehaviour() {
  const map = useMap();

  useEffect(() => {
    const frame = () => {
      map.invalidateSize();
      map.fitBounds(BOUNDS, { padding: [70, 70] });
    };

    const onSlide = (e: Event) => {
      if ((e as CustomEvent).detail?.index === LOCATION_INDEX) frame();
    };

    window.addEventListener('aix:slide', onSlide);
    const t = window.setTimeout(frame, 120);

    return () => {
      window.removeEventListener('aix:slide', onSlide);
      window.clearTimeout(t);
    };
  }, [map]);

  return null;
}

export default function MapIsland() {
  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={false}
      zoomControl={true}
      attributionControl={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
      />
      {railLines.map((line) => {
        const path = arc(railOrigin, line.coords);
        const mid = path[Math.floor(path.length / 2)];
        return (
          <Fragment key={`rail-${line.name}`}>
            <Polyline
              positions={path}
              pathOptions={{ color: ACCENT, weight: 2, opacity: 0.85, dashArray: '6 7', lineCap: 'round' }}
            />
            <Marker position={line.coords} icon={railIcon()} />
            <Marker position={mid} icon={trainIcon()} zIndexOffset={500} />
          </Fragment>
        );
      })}
      {mapPins.map((pin) => (
        <Marker key={pin.name} position={pin.coords} icon={pinIcon(pin.primary)}>
          <Tooltip direction="top" offset={[0, pin.primary ? -13 : -9]} opacity={1} className="aix-tooltip">
            <div className="tt-name">{pin.label}</div>
            <div className="tt-note">{pin.note}</div>
          </Tooltip>
        </Marker>
      ))}
      <MapBehaviour />
    </MapContainer>
  );
}
