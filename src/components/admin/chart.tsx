import { moneyShort } from "@/lib/format";

/** Dependency-free SVG charts — crisp at any size, no client JS needed. */
export function RevenueChart({ series }: { series: { label: string; bookings: number; revenue: number }[] }) {
  const w = 720;
  const h = 220;
  const pad = { t: 16, r: 8, b: 26, l: 8 };
  const max = Math.max(1, ...series.map((d) => d.revenue));
  const barW = (w - pad.l - pad.r) / series.length;
  const y = (value: number) => h - pad.b - (value / max) * (h - pad.t - pad.b);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img" aria-label="Revenue over the last 14 days">
      <defs>
        <linearGradient id="barFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d6b76" />
          <stop offset="100%" stopColor="#0e3a44" />
        </linearGradient>
        <linearGradient id="areaFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(14,58,68,.18)" />
          <stop offset="100%" stopColor="rgba(14,58,68,0)" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad.l} x2={w - pad.r} y1={y(max * f)} y2={y(max * f)} className="chart-grid-line" strokeDasharray={f === 0 ? "0" : "3 5"} />
      ))}
      {series.map((d, i) => {
        const height = Math.max(2, h - pad.b - y(d.revenue));
        return (
          <g key={d.label}>
            <rect x={pad.l + i * barW + barW * 0.22} y={y(d.revenue)} width={barW * 0.56} height={height} rx={4} className="chart-bar" />
            {d.revenue > 0 ? <text x={pad.l + i * barW + barW / 2} y={y(d.revenue) - 6} textAnchor="middle" className="chart-value">{moneyShort(d.revenue)}</text> : null}
            <text x={pad.l + i * barW + barW / 2} y={h - 8} textAnchor="middle" className="chart-label">{d.label.split(" ")[0]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function BookingLine({ series }: { series: { label: string; bookings: number }[] }) {
  const w = 320;
  const h = 90;
  const max = Math.max(1, ...series.map((d) => d.bookings));
  const step = w / Math.max(1, series.length - 1);
  const points = series.map((d, i) => `${i * step},${h - 8 - (d.bookings / max) * (h - 20)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img" aria-label="Bookings trend">
      <polyline points={`0,${h} ${points} ${w},${h}`} className="chart-area" fill="url(#areaFade)" stroke="none" />
      <polyline points={points} className="chart-line" />
      {series.map((d, i) => (d.bookings === max ? <circle key={d.label} cx={i * step} cy={h - 8 - (d.bookings / max) * (h - 20)} r={3.2} fill="var(--brass-2)" /> : null))}
    </svg>
  );
}

export function Donut({ slices }: { slices: { label: string; value: number }[] }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const colors = ["#0e3a44", "#1d6b76", "#a97a30", "#c69a4f", "#7f9a92", "#b9c8cc"];
  const r = 52;
  const circumference = 2 * Math.PI * r;

  // Precompute each arc so the component stays a pure function of its props.
  const segments = slices.reduce<{ label: string; value: number; length: number; offset: number; colour: string }[]>((acc, slice, index) => {
    const previous = acc[acc.length - 1];
    const offset = previous ? previous.offset + previous.length : 0;
    acc.push({
      label: slice.label,
      value: slice.value,
      length: (slice.value / total) * circumference,
      offset,
      colour: colors[index % colors.length],
    });
    return acc;
  }, []);

  return (
    <div className="row" style={{ gap: 20, alignItems: "center", flexWrap: "wrap" }}>
      <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label="Service mix">
        <circle cx="66" cy="66" r={r} fill="none" stroke="#efeade" strokeWidth="16" />
        {segments.map((segment) => (
          <circle
            key={segment.label}
            cx="66" cy="66" r={r} fill="none" stroke={segment.colour} strokeWidth="16"
            strokeDasharray={`${segment.length} ${circumference - segment.length}`}
            strokeDashoffset={-segment.offset}
            transform="rotate(-90 66 66)"
            strokeLinecap="butt"
          />
        ))}
        <text x="66" y="62" textAnchor="middle" style={{ fontFamily: "var(--serif)", fontSize: 22, fill: "var(--noir)" }}>{total}</text>
        <text x="66" y="78" textAnchor="middle" style={{ fontSize: 8, letterSpacing: "0.14em", fill: "var(--muted)", fontWeight: 700 }}>VISITS</text>
      </svg>
      <div className="donut-legend" style={{ flex: 1, minWidth: 150 }}>
        {segments.map((segment) => (
          <div key={segment.label}>
            <span className="swatch" style={{ background: segment.colour }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{segment.label}</span>
            <b>{Math.round((segment.value / total) * 100)}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}
