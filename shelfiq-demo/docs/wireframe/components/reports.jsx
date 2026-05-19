/* Reports: grid of cards + modal with chart */

function Reports() {
  const [active, setActive] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>Reports</h1>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            Standard category-management reports · click any to open
          </div>
        </div>
        <button className="siq-btn"><Icon name="plus" size={14} /> Custom report</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {REPORTS.map((r, i) => (
          <button key={r.id} onClick={() => setActive(r)} className="siq-card" style={{
            padding: 16, textAlign: "left",
            display: "flex", flexDirection: "column", gap: 8,
            cursor: "pointer", background: "var(--bg-elev)",
            transition: "all 0.12s", border: "1px solid var(--border)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ height: 80, borderRadius: 6, background: "var(--bg-sunk)", overflow: "hidden", position: "relative" }}>
              <ReportThumb idx={i} />
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.4 }}>{r.desc}</div>
            <div style={{ marginTop: 4, paddingTop: 8, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--text-faint)" }}>
              <span>Updated {r.updated}</span>
              <Icon name="arrowUpRight" size={12} />
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.name} subtitle={active?.desc} width={840}
        footer={(
          <>
            <button className="siq-btn"><Icon name="download" size={14} /> Export PDF</button>
            <button className="siq-btn"><Icon name="download" size={14} /> Export CSV</button>
            <button className="siq-btn primary" onClick={() => setActive(null)}>Done</button>
          </>
        )}
      >
        {active && <ReportContent report={active} />}
      </Modal>
    </div>
  );
}

function ReportThumb({ idx }) {
  // small abstract thumbnail per index
  const kinds = ["bars", "line", "donut", "stacked", "scatter", "bars2", "line", "heat"];
  const k = kinds[idx % kinds.length];
  if (k === "bars") return <ThumbBars />;
  if (k === "line") return <ThumbLine />;
  if (k === "donut") return <ThumbDonut />;
  if (k === "stacked") return <ThumbStacked />;
  if (k === "scatter") return <ThumbScatter />;
  if (k === "bars2") return <ThumbBars2 />;
  if (k === "heat") return <ThumbHeat />;
  return null;
}

function ThumbBars() {
  const vs = [0.42, 0.78, 0.62, 0.88, 0.54, 0.71, 0.49, 0.66];
  return <svg width="100%" height="100%" viewBox="0 0 280 80" preserveAspectRatio="none">
    {vs.map((v, i) => (
      <rect key={i} x={20 + i * 30} y={70 - v * 60} width={20} height={v * 60} rx={2}
        fill={i % 2 ? "color-mix(in srgb, var(--primary) 50%, var(--bg-sunk))" : "var(--primary)"}
      />
    ))}
  </svg>;
}
function ThumbLine() {
  return <svg width="100%" height="100%" viewBox="0 0 280 80" preserveAspectRatio="none">
    <path d="M0 60 Q 40 55 70 45 T 140 30 T 210 20 T 280 12" fill="none" stroke="var(--primary)" strokeWidth="2" />
    <path d="M0 60 Q 40 55 70 45 T 140 30 T 210 20 T 280 12 L 280 80 L 0 80 Z" fill="color-mix(in srgb, var(--primary) 18%, transparent)" />
  </svg>;
}
function ThumbDonut() {
  return <svg width="100%" height="100%" viewBox="0 0 280 80">
    <g transform="translate(140 40)">
      <circle r="28" fill="none" stroke="var(--bg-sunk)" strokeWidth="8" />
      <circle r="28" fill="none" stroke="var(--primary)" strokeWidth="8" strokeDasharray="120 200" transform="rotate(-90)" />
      <circle r="28" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeDasharray="55 200" strokeDashoffset="-120" transform="rotate(-90)" />
    </g>
  </svg>;
}
function ThumbStacked() {
  const vs = [[20, 28, 12], [16, 30, 14], [22, 22, 16], [24, 26, 10], [18, 24, 18], [20, 28, 14]];
  return <svg width="100%" height="100%" viewBox="0 0 280 80" preserveAspectRatio="none">
    {vs.map((row, i) => {
      const x = 20 + i * 42;
      let y = 70;
      const colors = ["var(--primary)", "#0ea5e9", "#a78bfa"];
      return row.map((v, j) => {
        y -= v;
        return <rect key={j} x={x} y={y} width={28} height={v - 1} fill={colors[j]} rx="1" />;
      });
    })}
  </svg>;
}
function ThumbScatter() {
  const pts = [[40, 50], [70, 35], [110, 42], [150, 25], [190, 48], [220, 30], [60, 18], [200, 60], [130, 55], [180, 38]];
  return <svg width="100%" height="100%" viewBox="0 0 280 80">
    {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--primary)" />)}
  </svg>;
}
function ThumbBars2() {
  const vs = [0.7, -0.3, 0.45, -0.6, 0.55, -0.25, 0.7];
  return <svg width="100%" height="100%" viewBox="0 0 280 80" preserveAspectRatio="none">
    <line x1="0" x2="280" y1="40" y2="40" stroke="var(--border)" strokeWidth="0.6"/>
    {vs.map((v, i) => (
      <rect key={i} x={20 + i * 36} y={v > 0 ? 40 - v * 35 : 40} width={24} height={Math.abs(v) * 35} rx={2}
        fill={v > 0 ? "var(--success)" : "var(--danger)"}
      />
    ))}
  </svg>;
}
function ThumbHeat() {
  return <svg width="100%" height="100%" viewBox="0 0 280 80">
    {Array.from({ length: 5 }).map((_, r) =>
      Array.from({ length: 12 }).map((_, c) => {
        const v = (Math.sin(r * 1.3 + c * 0.6) + 1) / 2;
        return <rect key={`${r}-${c}`} x={10 + c * 22} y={6 + r * 14} width={20} height={12}
          fill={`color-mix(in srgb, var(--primary) ${Math.round(v * 80)}%, var(--bg-sunk))`} rx="1.5"/>;
      })
    )}
  </svg>;
}

function ReportContent({ report }) {
  // Build content depending on report.id
  const cats = TOP_CATS.slice(0, 7);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <Stat2 label="Total" value="$42.18" delta="+3.2% vs LQ" positive />
        <Stat2 label="Best category" value="Tobacco" delta="$89.40/lf" />
        <Stat2 label="Worst category" value="Bakery" delta="$22.10/lf" />
        <Stat2 label="Coverage" value="89%" delta="1,109 / 1,247 stores" />
      </div>

      <div className="siq-card" style={{ padding: 16, border: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>By category — last 90 days</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="siq-btn sm" style={{ background: "var(--primary-soft-2)", borderColor: "var(--primary)", color: "var(--primary-text)", fontWeight: 600 }}>90d</button>
            <button className="siq-btn sm">12mo</button>
            <button className="siq-btn sm">YTD</button>
          </div>
        </div>
        <ReportChart data={cats} />
      </div>

      <div className="siq-card" style={{ padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Summary</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}>
          Sales per linear foot is up <strong style={{ color: "var(--success)" }}>+3.2%</strong> quarter-over-quarter,
          driven by stronger Tobacco and Energy Drink performance in Premium Urban clusters.
          Bakery continues to underperform — consider <strong style={{ color: "var(--text)" }}>reallocating 2ft</strong> from
          Bakery into Roller Grill where space-to-sales ratio is below 0.7.
        </div>
      </div>
    </div>
  );
}

function ReportChart({ data }) {
  const max = Math.max(...data.map(d => d.spl));
  const W = 740, H = 220, padL = 60, padR = 16, padT = 16, padB = 36;
  const barW = (W - padL - padR) / data.length * 0.6;
  const step = (W - padL - padR) / data.length;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = padT + (H - padT - padB) * (1 - t);
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="var(--border)" strokeWidth="0.5" />
            <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="var(--text-faint)" fontFamily="var(--font-mono)">${(max * t).toFixed(0)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = padL + i * step + step / 2 - barW / 2;
        const h = (H - padT - padB) * (d.spl / max);
        const y = H - padB - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx={3}
              fill={i < 3 ? "var(--primary)" : "color-mix(in srgb, var(--primary) 35%, var(--bg-sunk))"}
            />
            <text x={padL + i * step + step / 2} y={y - 6} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--text)" fontFamily="var(--font-mono)">${d.spl.toFixed(2)}</text>
            <text x={padL + i * step + step / 2} y={H - padB + 14} textAnchor="middle" fontSize="10" fill="var(--text-muted)">{d.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Stat2({ label, value, delta, positive }) {
  return (
    <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 6 }}>
      <div style={{ fontSize: 10.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: positive ? "var(--success)" : "var(--text-muted)", marginTop: 2 }}>{delta}</div>
    </div>
  );
}

Object.assign(window, { Reports });
