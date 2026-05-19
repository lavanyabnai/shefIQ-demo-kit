/* Version Compare: split-view of v4.1 vs v4.2 with diff overlay */

// Simulate v4.1 by mutating COOLER_LAYOUT slightly
const V41_LAYOUT = (() => {
  const clone = COOLER_LAYOUT.map(d => d ? d.map(s => s ? s.map(c => ({ ...c })) : null) : null);
  // D3 shelf 0 in v4.1 had only Red Bull (no 5-Hour); v4.2 added 5-Hour Energy
  clone[2][0] = [{ sku: "sku-rb-84", f: 6 }];
  // D3 shelf 1 facings differ: v4.1 had Red Bull ×4 + Celsius ×4; v4.2 has Red Bull ×5 + Celsius ×3
  clone[2][1] = [{ sku: "sku-rb-84", f: 4 }, { sku: "sku-cl-12", f: 4 }];
  // D4 shelf 0 in v4.1 had Powerade-heavy; v4.2 has Gatorade-heavy
  clone[3][0] = [{ sku: "sku-pw-28", f: 4 }, { sku: "sku-gt-28", f: 2 }];
  // D5 shelf 4 in v4.1 was BodyArmor row; v4.2 swapped to Vitamin Water
  clone[4][4] = [{ sku: "sku-ba-16", f: 6 }];
  // D1 shelf 3 in v4.1 was Coke Zero only; v4.2 added Dr Pepper block
  clone[0][3] = [{ sku: "sku-cz-20", f: 6 }];
  return clone;
})();

const DIFF_SUMMARY = {
  added:   [{ name: "5-Hour Energy 1.93oz", door: 3, shelf: 5, f: 4 }, { name: "Dr Pepper 20oz", door: 1, shelf: 2, f: 4 }, { name: "Vitamin Water XXX 20oz", door: 5, shelf: 1, f: 6 }],
  removed: [{ name: "BODYARMOR LYTE 16oz", door: 5, shelf: 1, f: 6 }, { name: "Powerade Mountain 28oz", door: 4, shelf: 5, f: 4 }],
  moved:   [{ name: "Red Bull Energy 8.4oz", from: "D3 S5 ×4", to: "D3 S5 ×5" }, { name: "Celsius Sparkling 12oz", from: "D3 S4 ×4", to: "D3 S4 ×3" }],
};

function Compare({ onBack }) {
  const toast = useToast();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="siq-btn ghost icon sm" onClick={onBack} title="Back">
              <Icon name="chevronLeft" size={14} />
            </button>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>Compare versions</h1>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2, marginLeft: 32 }}>
            Beer Cooler – 5 Door – Premium Cluster · proposed change
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="siq-btn"><Icon name="download" size={14} /> Export diff</button>
          <button className="siq-btn" onClick={() => toast("Requested changes from David Park", { kind: "warn", title: "Sent" })}>Request changes</button>
          <button className="siq-btn" style={{ color: "var(--danger)" }} onClick={() => toast("v4.2 rejected", { kind: "error" })}>Reject</button>
          <button className="siq-btn primary" onClick={() => toast("v4.2 approved and queued for 42 stores", { title: "Approved" })}><Icon name="check" size={14} /> Approve v4.2</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 320px", gap: 16, alignItems: "start" }}>
        <PogPane version="v4.1" subtitle="Live · effective May 1, 2026" layout={V41_LAYOUT} side="left" />
        <PogPane version="v4.2" subtitle="Proposed · effective Jun 1, 2026" layout={COOLER_LAYOUT} side="right" />
        <ChangeRail />
      </div>
    </div>
  );
}

function PogPane({ version, subtitle, layout, side }) {
  return (
    <div className="siq-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="siq-mono" style={{ fontSize: 13, fontWeight: 700, color: side === "left" ? "var(--text)" : "var(--primary-text)" }}>{version}</span>
            {side === "left"
              ? <StatusPill status="live" />
              : <StatusPill status="review" />}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button className="siq-btn ghost icon sm"><Icon name="zoomIn" size={13} /></button>
          <button className="siq-btn ghost icon sm"><Icon name="externalLink" size={13} /></button>
        </div>
      </div>
      <div style={{ background: "var(--bg-sunk)", padding: 20 }}>
        <DiffCooler layout={layout} version={version} />
      </div>
    </div>
  );
}

function DiffCooler({ layout, version }) {
  const doors = 5;
  const shelves = 5;
  const DOOR_W = 100;
  const DOOR_H = 200;
  const SHELF_H = DOOR_H / shelves;
  const SIDE_PAD = 8;
  const TOP_PAD = 18;
  const totalW = SIDE_PAD * 2 + DOOR_W * doors + 6 * (doors - 1);
  const totalH = TOP_PAD + DOOR_H + 24;

  // Diff classification per cell
  const classify = (di, si, cell) => {
    if (version === "v4.2") {
      const sameCell = V41_LAYOUT[di] && V41_LAYOUT[di][si];
      const inV41 = sameCell && sameCell.some(c => c.sku === cell.sku);
      if (!inV41) return "added";
      const v41Cell = sameCell.find(c => c.sku === cell.sku);
      if (v41Cell && v41Cell.f !== cell.f) return "moved";
      return "same";
    } else {
      // v4.1: check if removed in v4.2
      const sameCell = COOLER_LAYOUT[di] && COOLER_LAYOUT[di][si];
      const inV42 = sameCell && sameCell.some(c => c.sku === cell.sku);
      if (!inV42) return "removed";
      const v42Cell = sameCell.find(c => c.sku === cell.sku);
      if (v42Cell && v42Cell.f !== cell.f) return "moved";
      return "same";
    }
  };

  return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${totalH}`} style={{ display: "block" }}>
      {Array.from({ length: doors }).map((_, di) => {
        const x = SIDE_PAD + di * (DOOR_W + 6);
        return (
          <g key={di}>
            <rect x={x} y={TOP_PAD} width={DOOR_W} height={DOOR_H} rx={2}
              fill="rgba(186,230,253,0.10)" stroke="var(--border-strong)" strokeWidth="1" />
            <text x={x + DOOR_W / 2} y={TOP_PAD - 4} textAnchor="middle" fontSize="8" fill="var(--text-faint)" fontFamily="var(--font-mono)">D{di + 1}</text>
            {Array.from({ length: shelves }).map((_, si) => {
              const y = TOP_PAD + si * SHELF_H;
              const cells = layout[di] && layout[di][si];
              if (!cells) return <rect key={si} x={x + 3} y={y + 2} width={DOOR_W - 6} height={SHELF_H - 4} fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 2"/>;
              const totalF = cells.reduce((s, c) => s + c.f, 0);
              let cur = x + 3;
              return (
                <g key={si}>
                  {cells.map((cell, ci) => {
                    const sku = SKU_LIBRARY.find(s => s.id === cell.sku);
                    if (!sku) return null;
                    const c = BRAND_COLORS[sku.brand];
                    const cw = ((DOOR_W - 6) * cell.f) / totalF - 0.5;
                    const cls = classify(di, si, cell);
                    const outline = cls === "added" ? "#16a34a" : cls === "removed" ? "#dc2626" : cls === "moved" ? "#d97706" : null;
                    const rect = (
                      <g key={ci}>
                        <rect x={cur + 0.5} y={y + 1.5} width={cw} height={SHELF_H - 3} rx={1.5}
                          fill={c.fill} stroke={c.stroke} strokeWidth="0.4" />
                        {outline && (
                          <rect x={cur - 0.5} y={y + 0.5} width={cw + 2} height={SHELF_H - 1} rx={2}
                            fill={cls === "added" ? "rgba(22,163,74,0.15)" : cls === "removed" ? "rgba(220,38,38,0.15)" : "rgba(217,119,6,0.15)"}
                            stroke={outline} strokeWidth="1.5" strokeDasharray={cls === "removed" ? "3 2" : "0"} />
                        )}
                      </g>
                    );
                    cur += cw + 0.5;
                    return rect;
                  })}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function ChangeRail() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="siq-card" style={{ padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 }}>Change summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <DiffMetric label="SKUs added"     value="3" color="var(--success)" />
          <DiffMetric label="SKUs removed"   value="2" color="var(--danger)" />
          <DiffMetric label="Facings moved" value="4" color="var(--warning)" />
          <DiffMetric label="Net facing Δ"  value="+1" color="var(--text)" />
        </div>
        <div style={{ padding: 12, borderRadius: 6, background: "var(--success-soft)", display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="trendingUp" size={16} style={{ color: "var(--success)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Projected lift</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "var(--success)" }}>+2.8% sales</div>
          </div>
        </div>
      </div>

      <div className="siq-card" style={{ padding: 0, overflow: "hidden" }}>
        <Section2 title="Added" color="var(--success)" iconName="plus" items={DIFF_SUMMARY.added.map(a => ({ name: a.name, sub: `Door ${a.door} · Shelf ${a.shelf}`, badge: `×${a.f}` }))} />
        <Section2 title="Removed" color="var(--danger)" iconName="minus" items={DIFF_SUMMARY.removed.map(a => ({ name: a.name, sub: `Door ${a.door} · Shelf ${a.shelf}`, badge: `×${a.f}` }))} />
        <Section2 title="Facings moved" color="var(--warning)" iconName="arrowUpRight" items={DIFF_SUMMARY.moved.map(a => ({ name: a.name, sub: `${a.from} → ${a.to}` }))} last />
      </div>

      <div className="siq-card" style={{ padding: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>Reviewer notes</div>
        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 8 }}>
          <strong style={{ color: "var(--text)" }}>David Park</strong> · 2h ago
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.55, padding: 10, background: "var(--bg-sunk)", borderRadius: 6 }}>
          Replaced BodyArmor Lyte with Vitamin Water XXX based on Q1 velocity — Lyte was bottom-quartile in cluster B.
          Added Dr Pepper block to D1 to balance the Coke-side shelf 3 facing count.
        </div>
      </div>
    </div>
  );
}

function DiffMetric({ label, value, color }) {
  return (
    <div style={{ padding: 10, border: "1px solid var(--border)", borderRadius: 6 }}>
      <div style={{ fontSize: 10.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, marginTop: 2, color }}>{value}</div>
    </div>
  );
}

function Section2({ title, color, iconName, items, last }) {
  return (
    <div style={{ padding: "10px 14px", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color, marginBottom: 6 }}>
        <Icon name={iconName} size={12} /> {title} <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>· {items.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <span style={{ width: 4, height: 4, borderRadius: 99, background: color, marginLeft: 2 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="siq-truncate" style={{ fontWeight: 500 }}>{it.name}</div>
              <div className="siq-truncate" style={{ fontSize: 11, color: "var(--text-muted)" }}>{it.sub}</div>
            </div>
            {it.badge && <span className="siq-mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>{it.badge}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Compare });
