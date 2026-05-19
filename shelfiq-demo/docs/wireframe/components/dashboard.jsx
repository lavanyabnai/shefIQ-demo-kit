/* Dashboard screen: KPIs, reset calendar, activity, top-cats chart, heatmap. */

function Dashboard({ onNav }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <DashHeader onNav={onNav} />
      <KpiRow />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 20 }}>
        <ResetCalendar />
        <ActivityFeed />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 20 }}>
        <TopCategoriesChart />
        <ComplianceHeatmap />
      </div>
    </div>
  );
}

function DashHeader({ onNav }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
      <div>
        <div style={{ fontSize: 11.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600 }}>Friday, May 15 · Q2 2026</div>
        <h1 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 600, letterSpacing: -0.4 }}>Good afternoon, Shrikanth</h1>
        <div style={{ color: "var(--text-muted)", fontSize: 13.5, marginTop: 4 }}>
          12 planograms are in review, 7 categories are due for reset in the next 8 weeks.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="siq-btn"><Icon name="upload" size={14} /> Import PSA</button>
        <button className="siq-btn primary" onClick={() => onNav("editor")}><Icon name="plus" size={14} /> New planogram</button>
      </div>
    </div>
  );
}

function KpiRow() {
  const kpis = [
    { label: "Active planograms",         value: "247",     delta: "+12 this month",         positive: true,  icon: "planograms" },
    { label: "Stores on latest version",  value: "89%",     delta: "Target 95%",             neutral: true,   icon: "stores",  sub: 1109, subOf: 1247 },
    { label: "Avg. sales / linear ft",    value: "$42.18",  delta: "+3.2% vs last quarter",  positive: true,  icon: "trendingUp" },
    { label: "Categories due for reset",  value: "7",       delta: "2 overdue",              negative: true,  icon: "alert" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
      {kpis.map((k, i) => (
        <div key={i} className="siq-card" style={{ padding: 18, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{k.label}</div>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-sunk)", color: "var(--text-muted)", display: "grid", placeItems: "center" }}>
              <Icon name={k.icon} size={14} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.6, marginTop: 6 }}>{k.value}</div>
          {k.sub && (
            <div style={{ marginTop: 6, height: 4, borderRadius: 99, background: "var(--bg-sunk)", overflow: "hidden" }}>
              <div style={{ width: `${k.sub / k.subOf * 100}%`, height: "100%", background: "var(--primary)", borderRadius: 99 }} />
            </div>
          )}
          <div style={{
            marginTop: 8, fontSize: 12, fontWeight: 500,
            color: k.positive ? "var(--success)" : k.negative ? "var(--danger)" : "var(--text-muted)",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {k.positive && <Icon name="trendingUp" size={12} />}
            {k.negative && <Icon name="alert" size={12} />}
            {k.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResetCalendar() {
  const weeks = 8;
  const weekStarts = ["May 19", "May 26", "Jun 2", "Jun 9", "Jun 16", "Jun 23", "Jun 30", "Jul 7"];
  const lanes = 3;
  // build a 2D layout
  const grid = Array.from({ length: lanes }, () => Array.from({ length: weeks }, () => null));
  for (const r of RESETS) grid[r.lane][r.week] = r;

  return (
    <div className="siq-card" style={{ padding: 0, display: "flex", flexDirection: "column", minHeight: 280 }}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Reset calendar</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Scheduled resets · next 8 weeks</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="siq-btn sm"><Icon name="calendar" size={12} /> Week view</button>
          <button className="siq-btn ghost icon sm"><Icon name="chevronLeft" size={14} /></button>
          <button className="siq-btn ghost icon sm"><Icon name="chevronRight" size={14} /></button>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`, gap: 8, marginBottom: 8 }}>
          {weekStarts.map((w, i) => (
            <div key={i} style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 500, textAlign: "center" }}>{w}</div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
          {/* today line */}
          <div style={{ position: "absolute", left: `calc((100% - 7*8px) / 8 * 0 - 4px + 14px)`, top: 0, bottom: 0, width: 2, background: "color-mix(in srgb, var(--primary) 60%, transparent)", zIndex: 1, borderRadius: 2 }} />
          {grid.map((lane, li) => (
            <div key={li} style={{ display: "grid", gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`, gap: 8, height: 50 }}>
              {lane.map((c, ci) => {
                if (!c) return <div key={ci} className="siq-grid-bg" style={{ background: "var(--bg-sunk)", borderRadius: 6, opacity: 0.3 }} />;
                const color = RESET_CATEGORIES[c.cat] || "#475569";
                return (
                  <div key={ci} style={{
                    background: `color-mix(in srgb, ${color} 14%, var(--bg-elev))`,
                    border: `1px solid color-mix(in srgb, ${color} 36%, transparent)`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 6,
                    padding: "6px 8px",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    minWidth: 0, cursor: "pointer",
                  }}
                  title={`${c.name} — ${c.days} days`}
                  >
                    <div className="siq-truncate" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                    <div className="siq-truncate" style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{c.cat} · {c.days}d</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          {Object.entries(RESET_CATEGORIES).slice(0, 6).map(([k, c]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--text-muted)" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{k}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const kindStyle = {
    approve:  { bg: "var(--success-soft)", color: "var(--success)", icon: "successCheck" },
    vendor:   { bg: "var(--info-soft)",    color: "var(--info)",    icon: "package" },
    alert:    { bg: "var(--danger-soft)",  color: "var(--danger)",  icon: "alert" },
    create:   { bg: "var(--bg-sunk)",      color: "var(--text-muted)", icon: "plus" },
    review:   { bg: "var(--warning-soft)", color: "var(--warning)", icon: "edit" },
    publish:  { bg: "var(--primary-soft)", color: "var(--primary-text)", icon: "send" },
  };
  return (
    <div className="siq-card" style={{ padding: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Recent activity</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Across all banners</div>
        </div>
        <button className="siq-btn ghost sm">View all</button>
      </div>
      <div style={{ padding: "4px 0" }}>
        {ACTIVITY.map((a, i) => {
          const s = kindStyle[a.kind] || kindStyle.create;
          return (
            <div key={i} style={{ padding: "10px 18px", display: "flex", gap: 12, borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: s.bg, color: s.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon name={s.icon} size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 600 }}>{a.who}</span>
                  <span style={{ color: "var(--text-muted)" }}> {a.what} </span>
                  <span>{a.obj}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{a.ago}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopCategoriesChart() {
  const max = Math.max(...TOP_CATS.map(c => c.spl));
  return (
    <div className="siq-card" style={{ padding: 0 }}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Top performing categories</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Sales per linear foot · last 30 days</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="siq-btn sm">All banners</button>
          <button className="siq-btn ghost icon sm"><Icon name="more" size={14} /></button>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        {TOP_CATS.map((c, i) => {
          const w = c.spl / max * 100;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr 60px", gap: 12, alignItems: "center", padding: "5px 0" }}>
              <div className="siq-truncate" style={{ fontSize: 13, color: "var(--text)" }}>{c.name}</div>
              <div style={{ background: "var(--bg-sunk)", height: 18, borderRadius: 4, position: "relative", overflow: "hidden" }}>
                <div style={{
                  width: `${w}%`, height: "100%",
                  background: i < 3
                    ? "linear-gradient(90deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 75%, white) 100%)"
                    : "color-mix(in srgb, var(--primary) 35%, var(--bg-sunk))",
                  borderRadius: 4,
                }} />
              </div>
              <div className="siq-mono" style={{ fontSize: 12, color: "var(--text)", textAlign: "right", fontWeight: 500 }}>${c.spl.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComplianceHeatmap() {
  const colorFor = (v) => {
    if (v >= 0.95) return { bg: "color-mix(in srgb, var(--success) 22%, var(--bg-elev))", color: "var(--success)" };
    if (v >= 0.90) return { bg: "color-mix(in srgb, var(--success) 12%, var(--bg-elev))", color: "var(--success)" };
    if (v >= 0.85) return { bg: "color-mix(in srgb, var(--warning) 18%, var(--bg-elev))", color: "var(--warning)" };
    return { bg: "color-mix(in srgb, var(--danger) 18%, var(--bg-elev))", color: "var(--danger)" };
  };
  return (
    <div className="siq-card" style={{ padding: 0 }}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Compliance heatmap</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Region × category — % stores on latest POG</div>
        </div>
        <button className="siq-btn ghost icon sm"><Icon name="more" size={14} /></button>
      </div>
      <div style={{ padding: 18, overflowX: "auto" }}>
        <table style={{ borderCollapse: "separate", borderSpacing: 4, width: "100%" }}>
          <thead>
            <tr>
              <th></th>
              {HEATMAP.cols.map(c => (
                <th key={c} style={{ fontSize: 10.5, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, padding: "2px 6px", textAlign: "center" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEATMAP.rows.map((r, ri) => (
              <tr key={r}>
                <td style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", padding: "0 8px 0 0", textAlign: "right", whiteSpace: "nowrap" }}>{r}</td>
                {HEATMAP.values[ri].map((v, ci) => {
                  const c = colorFor(v);
                  return (
                    <td key={ci} style={{
                      background: c.bg, color: c.color, fontWeight: 600,
                      width: 56, height: 36, textAlign: "center",
                      borderRadius: 4, fontSize: 12,
                      border: `1px solid color-mix(in srgb, ${c.color} 26%, transparent)`,
                      fontVariantNumeric: "tabular-nums",
                    }}>
                      {Math.round(v * 100)}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
