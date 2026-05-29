import { useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { cost } from '../../data/dummy';

ChartJS.register(...registerables);

const euro = (n: number) => '€ ' + Math.round(n).toLocaleString('en-US');
const euroK = (n: number) => (n === 0 ? '€0' : '€' + Math.round(n / 1000) + 'k');
const fmtMonths = (n: number) => (Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '∞');

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div className="cost-slider">
      <div className="cost-slider-head">
        <span className="label">{label}</span>
        <span className="cost-value">{euro(value)}</span>
      </div>
      <input
        className="cost-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

const SEGMENT_GREYS = ['#d6d6d6', '#c8c8c8', '#bababa', '#acacac', '#9a9a9a'];
const OLIVE = '#556b2f';
const OLIVE_SOFT = '#8a9a6b';

export default function CostIsland() {
  const [rents, setRents] = useState<number[]>(cost.current.map((c) => c.monthly));
  const [utilities, setUtilities] = useState(cost.utilities.monthly);
  const [aix, setAix] = useState(cost.aix.monthly);
  const [moving, setMoving] = useState(cost.moving.default);
  const [savings, setSavings] = useState(cost.runway.default);
  const [showGraph, setShowGraph] = useState(false);

  // --- savings -------------------------------------------------------------
  const aixUtilities = utilities * cost.aixUtilityFactor; // 50% lower in Aix
  const todayTotal = rents.reduce((a, b) => a + b, 0) + utilities; // monthly burn, old regime
  const aixTotal = aix + aixUtilities; // monthly burn, new regime
  const monthly = todayTotal - aixTotal;
  const annual = monthly * 12;
  const positive = annual > 0;

  // --- amortization --------------------------------------------------------
  const dailySaving = annual / 365; // saving per day
  const amortDays = positive ? Math.round(moving / dailySaving) : null;

  // --- runway --------------------------------------------------------------
  // How long a pot of liquid savings lasts at each monthly burn rate.
  const oldRunway = todayTotal > 0 ? savings / todayTotal : Infinity; // months, old regime
  const newRunway = aixTotal > 0 ? savings / aixTotal : Infinity; // months, new regime
  const runwayGain = newRunway - oldRunway; // months added by the lower burn
  const gainRounded = Math.round(runwayGain);
  const gainLabel = Number.isFinite(runwayGain) ? (gainRounded >= 0 ? '+' : '−') + Math.abs(gainRounded) : '∞';

  const runwayData = useMemo(
    () => ({
      datasets: [
        {
          label: 'In Aix',
          data: [
            { x: 0, y: savings },
            { x: Number.isFinite(newRunway) ? newRunway : 0, y: 0 },
          ],
          borderColor: OLIVE,
          backgroundColor: 'rgba(85,107,47,0.10)',
          borderWidth: 2.5,
          pointRadius: 0,
          fill: true,
          tension: 0,
        },
        {
          label: 'Today',
          data: [
            { x: 0, y: savings },
            { x: Number.isFinite(oldRunway) ? oldRunway : 0, y: 0 },
          ],
          borderColor: '#bcbcbc',
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: 0,
          fill: false,
          tension: 0,
        },
      ],
    }),
    [savings, oldRunway, newRunway]
  );

  const runwayOptions = useMemo<any>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 750, easing: 'easeOutCubic' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111111',
          bodyFont: { family: 'Georgia, serif', size: 12 },
          titleFont: { family: 'Georgia, serif', size: 12 },
          padding: 10,
          displayColors: false,
          callbacks: {
            title: (items: any) => `Month ${Math.round(items[0].parsed.x)}`,
            label: (ctx: any) => `${ctx.dataset.label}: ${euro(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: Math.max(1, Math.ceil(Number.isFinite(newRunway) ? newRunway : oldRunway)),
          title: { display: true, text: 'Months', font: { family: 'Georgia, serif', size: 12 }, color: '#666666' },
          grid: { display: false },
          border: { display: false },
          ticks: { font: { family: 'Georgia, serif', size: 11 }, color: '#666666', maxTicksLimit: 7, callback: (v: any) => Math.round(v) },
        },
        y: {
          min: 0,
          max: savings,
          grid: { color: '#eeeeee' },
          border: { display: false },
          ticks: { font: { family: 'Georgia, serif', size: 11 }, color: '#999999', maxTicksLimit: 5, callback: (v: any) => euroK(v) },
        },
      },
    }),
    [savings, newRunway, oldRunway]
  );

  const setRent = (i: number, v: number) =>
    setRents((arr) => arr.map((x, j) => (j === i ? v : x)));

  const data = useMemo(() => {
    const today = [
      ...cost.current.map((c, i) => ({
        label: c.name,
        data: [rents[i], 0],
        backgroundColor: SEGMENT_GREYS[i % SEGMENT_GREYS.length],
        borderColor: '#ffffff',
        borderWidth: 1,
        stack: 'cost',
        maxBarThickness: 88,
      })),
      {
        label: cost.utilities.name,
        data: [utilities, 0],
        backgroundColor: SEGMENT_GREYS[4],
        borderColor: '#ffffff',
        borderWidth: 1,
        stack: 'cost',
        maxBarThickness: 88,
      },
    ];
    const inAix = [
      {
        label: cost.aix.name,
        data: [0, aix],
        backgroundColor: OLIVE,
        borderColor: '#ffffff',
        borderWidth: 1,
        stack: 'cost',
        maxBarThickness: 88,
      },
      {
        label: 'Aix utilities',
        data: [0, aixUtilities],
        backgroundColor: OLIVE_SOFT,
        borderColor: '#ffffff',
        borderWidth: 1,
        stack: 'cost',
        maxBarThickness: 88,
      },
    ];
    return { labels: ['Today', 'In Aix'], datasets: [...today, ...inAix] };
  }, [rents, utilities, aix, aixUtilities]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: '#111111',
        bodyFont: { family: 'Georgia, serif', size: 13 },
        padding: 10,
        displayColors: false,
        callbacks: { label: (ctx: any) => `${ctx.dataset.label}: ${euro(ctx.parsed.y)}` },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: 'Georgia, serif', size: 14 }, color: '#666666' },
      },
      y: { stacked: true, display: false, grid: { display: false }, beginAtZero: true },
    },
  };

  return (
    <div className="cost-grid">
      {/* Column 1 — inputs */}
      <div className="cost-controls">
        <p className="label cost-group-label">Monthly costs today</p>
        {cost.current.map((c, i) => (
          <Slider
            key={c.name}
            label={c.name}
            value={rents[i]}
            min={cost.slider.min}
            max={cost.slider.max}
            step={cost.slider.step}
            onChange={(v) => setRent(i, v)}
          />
        ))}
        <Slider
          label={cost.utilities.name}
          value={utilities}
          min={cost.slider.min}
          max={cost.slider.max}
          step={cost.slider.step}
          onChange={setUtilities}
        />
        <p className="cost-caption">
          For modelling, utilities are treated as a flat 50% reduction in Aix.
        </p>
        <div className="cost-subtotal">
          <span className="label">Combined today</span>
          <span className="cost-subtotal-value">{euro(todayTotal)} / mo</span>
        </div>

        <p className="label cost-group-label">New residence in Aix</p>
        <Slider
          label={cost.aix.name}
          value={aix}
          min={cost.aixSlider.min}
          max={cost.aixSlider.max}
          step={cost.aixSlider.step}
          onChange={setAix}
        />
        <div className="cost-derived">
          <span className="label">Utilities, 50% lower</span>
          <span className="cost-derived-value">{euro(aixUtilities)} / mo</span>
        </div>
      </div>

      {/* Column 2 — annual saving + chart */}
      <div className="cost-output">
        <div className="cost-summary">
          <div className="cost-summary-row">
            <span className="label">Old cost structure</span>
            <span className="cost-summary-old">{euro(todayTotal * 12)}</span>
          </div>
          <div className="cost-summary-row">
            <span className="label">New cost structure</span>
            <span className="cost-summary-new">{euro(aixTotal * 12)}</span>
          </div>
          <div className="cost-summary-total">
            <p className="label">Annual savings</p>
            <p className={positive ? 'cost-big cost-summary-amount' : 'cost-big cost-big--neg'}>
              {euro(Math.abs(annual))}
            </p>
          </div>
        </div>
        <div className="cost-chart">
          <Bar data={data} options={options} />
        </div>
        <p className="cost-note">{cost.note}</p>
      </div>

      {/* Column 3 — amortization */}
      <div className="cost-amort">
        <p className="label">Amortization calculator</p>
        {amortDays !== null ? (
          <p className="cost-big">
            {amortDays.toLocaleString('en-US')}
            <span className="cost-big-unit"> days</span>
          </p>
        ) : (
          <p className="cost-big cost-big--neg">—</p>
        )}
        <p className="cost-sub">
          {amortDays !== null
            ? `before the saving repays the cost of the move.`
            : 'There is no monthly saving at these figures, so the move does not amortise.'}
        </p>
        <Slider
          label={cost.moving.label}
          value={moving}
          min={cost.moving.min}
          max={cost.moving.max}
          step={cost.moving.step}
          onChange={setMoving}
        />

        {/* runway calculator — the inverse of amortization */}
        <div className="cost-runway">
          <p className="label">Runway calculator</p>
          <p className="cost-runway-figures">
            <span className="cost-runway-old">{fmtMonths(oldRunway)}</span>
            <span className="cost-runway-arrow" aria-hidden="true">→</span>
            <span className="cost-runway-new">{fmtMonths(newRunway)}</span>
            <span className="cost-runway-unit">months</span>
          </p>
          <Slider
            label={cost.runway.label}
            value={savings}
            min={cost.runway.min}
            max={cost.runway.max}
            step={cost.runway.step}
            onChange={setSavings}
          />

          <button
            type="button"
            className="cost-graph-toggle"
            aria-expanded={showGraph}
            onClick={() => setShowGraph((v) => !v)}
          >
            <span className="cost-graph-brace">{'{'}</span>
            <span className="cost-graph-word">graph</span>
            <span className="cost-graph-brace">{'}'}</span>
          </button>

          <div className={showGraph ? 'cost-runway-graph open' : 'cost-runway-graph'}>
            <div className="cost-runway-chart">
              <Line key={showGraph ? 'open' : 'closed'} data={runwayData} options={runwayOptions} />
            </div>
            <div className="cost-runway-legend">
              <span>
                <i className="dot dot--aix" /> In Aix
              </span>
              <span>
                <i className="dot dot--today" /> Today
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
