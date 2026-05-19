/* Stores: map + table */

function Stores() {
  const [view, setView] = useState("map");
  const [hover, setHover] = useState(null);
  const [bannerFilter, setBannerFilter] = useState("All banners");
  const [regionFilter, setRegionFilter] = useState("All regions");
  const banners = ["All banners", ...new Set(STORES.map(s => s.banner))];

  const filtered = useMemo(() => {
    let r = STORES.slice();
    if (bannerFilter !== "All banners") r = r.filter(s => s.banner === bannerFilter);
    return r;
  }, [bannerFilter, regionFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>Stores</h1>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            1,247 stores across 4 banners — 1,109 on latest planogram versions
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ToggleGroupLocal
            value={view}
            onChange={setView}
            options={[{ value: "map", label: "Map", icon: "mapPin" }, { value: "table", label: "Table", icon: "grid" }]}
          />
          <button className="siq-btn"><Icon name="download" size={14} /> Export CSV</button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="siq-card" style={{ padding: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Icon name="search" size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input className="siq-input" placeholder="Search store #, address, city…" style={{ paddingLeft: 30, width: "100%" }} />
        </div>
        <Select value={bannerFilter} onChange={setBannerFilter} options={banners} />
        <Select value={regionFilter} onChange={setRegionFilter} options={["All regions", "Northeast", "Midwest", "South", "West"]} />
        <Select value="All clusters" onChange={() => {}} options={["All clusters"]} />
        <Select value="All formats" onChange={() => {}} options={["All formats"]} />
      </div>

      {view === "map"
        ? <MapView stores={filtered} hover={hover} setHover={setHover} />
        : <TableView stores={filtered} />
      }
    </div>
  );
}

function ToggleGroupLocal({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", background: "var(--bg-sunk)", padding: 2, borderRadius: 6, border: "1px solid var(--border)", height: 32 }}>
      {options.map(o => {
        const active = value === o.value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} className="siq-btn" style={{
            height: 26, padding: "0 12px", fontSize: 12.5, gap: 5,
            background: active ? "var(--bg-elev)" : "transparent",
            border: "none",
            color: active ? "var(--text)" : "var(--text-muted)",
            fontWeight: active ? 600 : 500,
            boxShadow: active ? "var(--shadow-sm)" : "none",
          }}>
            <Icon name={o.icon} size={12} /> {o.label}
          </button>
        );
      })}
    </div>
  );
}

function MapView({ stores, hover, setHover }) {
  return (
    <div className="siq-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", minHeight: 540 }}>
        <div style={{ position: "relative", background: "var(--bg-sunk)" }}>
          <svg viewBox="0 0 1000 500" width="100%" height="100%" style={{ display: "block", maxHeight: 600 }}>
            {/* Stylized US shape — simplified silhouette */}
            <defs>
              <pattern id="grid-map" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40 L 40 40 L 40 0" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="1000" height="500" fill="url(#grid-map)" />

            {/* Generalized US silhouette (very loose) */}
            <path d="M70 150 L 100 130 L 130 130 L 150 110 L 200 100 L 260 110 L 300 130 L 320 120 L 360 130 L 400 145 L 450 150 L 520 130 L 580 125 L 640 130 L 700 140 L 760 160 L 820 170 L 870 185 L 900 220 L 905 270 L 870 320 L 820 360 L 760 390 L 700 410 L 640 410 L 570 405 L 500 410 L 430 420 L 360 410 L 290 395 L 230 375 L 180 350 L 130 320 L 90 280 L 75 220 Z"
              fill="var(--bg-elev)" stroke="var(--border-strong)" strokeWidth="1.5" opacity="0.9" />
            {/* Florida hook */}
            <path d="M780 380 Q 830 410 850 440 L 830 440 Q 800 420 770 400 Z" fill="var(--bg-elev)" stroke="var(--border-strong)" strokeWidth="1.5"/>
            {/* Texas-ish protrusion */}
            <path d="M450 380 L 510 430 L 480 440 L 430 420 Z" fill="var(--bg-elev)" stroke="var(--border-strong)" strokeWidth="1.5"/>

            {/* Cluster halos */}
            {stores.map(s => (
              <circle key={s.id + "-halo"} cx={s.pos[0]} cy={s.pos[1]} r={8}
                fill={
                  s.compliance >= 0.95 ? "var(--success)" :
                  s.compliance >= 0.85 ? "var(--warning)" :
                  "var(--danger)"
                }
                opacity="0.18" />
            ))}
            {/* Store dots */}
            {stores.map(s => {
              const color =
                s.compliance >= 0.95 ? "var(--success)" :
                s.compliance >= 0.85 ? "var(--warning)" :
                "var(--danger)";
              const isHover = hover?.id === s.id;
              return (
                <g key={s.id}>
                  <circle
                    cx={s.pos[0]} cy={s.pos[1]} r={isHover ? 6 : 4.5}
                    fill={color} stroke="var(--bg-elev)" strokeWidth="2"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: "pointer", transition: "r 0.12s" }}
                  />
                </g>
              );
            })}

            {/* Hover tooltip */}
            {hover && (
              <g>
                <rect x={hover.pos[0] + 10} y={hover.pos[1] - 30} width={200} height={60} rx={6}
                  fill="var(--bg-elev)" stroke="var(--border)" filter="url(#shadow)" />
                <text x={hover.pos[0] + 20} y={hover.pos[1] - 12} fontSize="12" fontWeight="600" fill="var(--text)">{hover.num}</text>
                <text x={hover.pos[0] + 20} y={hover.pos[1] + 4} fontSize="10.5" fill="var(--text-muted)">{hover.addr.split(",").slice(0, 2).join(", ")}</text>
                <text x={hover.pos[0] + 20} y={hover.pos[1] + 20} fontSize="10.5" fill="var(--text-muted)">{Math.round(hover.compliance * 100)}% compliant · {hover.cluster}</text>
              </g>
            )}
          </svg>

          {/* Legend */}
          <div style={{ position: "absolute", left: 16, bottom: 16, background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px", fontSize: 11.5, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Compliance</div>
            <Lg dot="var(--success)" label="≥ 95%" />
            <Lg dot="var(--warning)" label="85–94%" />
            <Lg dot="var(--danger)" label="< 85%" />
          </div>

          {/* Zoom controls */}
          <div style={{ position: "absolute", right: 16, top: 16, display: "flex", flexDirection: "column", gap: 4 }}>
            <button className="siq-btn icon sm"><Icon name="plus" size={14} /></button>
            <button className="siq-btn icon sm"><Icon name="minus" size={14} /></button>
          </div>
        </div>

        {/* Side panel */}
        <div style={{ borderLeft: "1px solid var(--border)", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Banner mix</div>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { name: "Quikstop Core",    pct: 58, count: 723 },
                { name: "Quikstop Fuel",    pct: 26, count: 324 },
                { name: "Quikstop Express", pct: 16, count: 200 },
              ].map(b => (
                <div key={b.name} style={{ display: "grid", gridTemplateColumns: "1fr 50px 50px", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                  <span>{b.name}</span>
                  <div style={{ background: "var(--bg-sunk)", height: 6, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${b.pct}%`, height: "100%", background: "var(--primary)" }} />
                  </div>
                  <span className="siq-mono" style={{ textAlign: "right", color: "var(--text-muted)" }}>{b.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Compliance issues</div>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {STORES.filter(s => s.compliance < 0.85).slice(0, 5).map(s => (
                <div key={s.id} style={{ padding: "8px 10px", border: "1px solid var(--border)", borderLeft: "3px solid var(--danger)", borderRadius: 4 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{s.num} · {Math.round(s.compliance * 100)}%</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.addr.split(",").slice(0, 2).join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lg({ dot, label }) {
  return <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span style={{ width: 8, height: 8, borderRadius: 99, background: dot }} /> {label}
  </span>;
}

function TableView({ stores }) {
  return (
    <div className="siq-card" style={{ overflow: "hidden" }}>
      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <table className="siq-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}><input type="checkbox" /></th>
              <th>Store #</th>
              <th>Address</th>
              <th>Banner</th>
              <th>Cluster</th>
              <th>Format</th>
              <th>Sq Ft</th>
              <th>Status</th>
              <th>Last Reset</th>
              <th style={{ width: 200 }}>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id} style={{ cursor: "pointer" }}>
                <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                <td><span style={{ fontWeight: 600 }} className="siq-mono">{s.num}</span></td>
                <td><span className="siq-truncate" style={{ display: "block", maxWidth: 280 }}>{s.addr}</span></td>
                <td><span style={{ color: "var(--text-muted)" }}>{s.banner}</span></td>
                <td><span style={{ color: "var(--text-muted)" }}>{s.cluster}</span></td>
                <td><span style={{ color: "var(--text-muted)" }}>{s.format}</span></td>
                <td className="siq-mono" style={{ color: "var(--text-muted)" }}>{s.sqft.toLocaleString()}</td>
                <td><StatusPill status={s.status} /></td>
                <td className="siq-mono" style={{ color: "var(--text-muted)", fontSize: 12 }}>{s.lastReset}</td>
                <td>
                  <CompliancePct value={s.compliance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompliancePct({ value }) {
  const color =
    value >= 0.95 ? "var(--success)" :
    value >= 0.85 ? "var(--warning)" :
    "var(--danger)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "var(--bg-sunk)", borderRadius: 99, overflow: "hidden", minWidth: 80 }}>
        <div style={{ width: `${value * 100}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
      <span className="siq-mono" style={{ fontSize: 12, color, fontWeight: 600, width: 36, textAlign: "right" }}>{Math.round(value * 100)}%</span>
    </div>
  );
}

Object.assign(window, { Stores });
