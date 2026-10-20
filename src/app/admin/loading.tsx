export default function PortalLoading() {
  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="kpi-grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="kpi" style={{ minHeight: 116 }} aria-hidden="true">
            <span style={{ display: "block", height: 10, width: "42%", borderRadius: 6, background: "var(--line)", opacity: 0.7 }} />
            <div style={{ height: 30, width: "58%", borderRadius: 8, background: "var(--line)", marginTop: 16, opacity: 0.6 }} />
            <div style={{ height: 8, width: "70%", borderRadius: 6, background: "var(--line)", marginTop: 12, opacity: 0.45 }} />
          </div>
        ))}
      </div>
      <div className="app-card" style={{ minHeight: 220 }} />
      <div className="app-card" style={{ minHeight: 160 }} />
    </div>
  );
}
