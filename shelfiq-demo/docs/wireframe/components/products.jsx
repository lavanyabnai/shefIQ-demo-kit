/* Product catalog */

function Products() {
  const [tab, setTab] = useState("all");
  const tabs = [
    { id: "all",      label: "All Products",            count: 8203 },
    { id: "pending",  label: "Pending Vendor Updates",  count: 12, accent: "warning" },
    { id: "disc",     label: "Discontinued",            count: 184 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>Products</h1>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            8,203 SKUs across 42 categories · synced with vendor masters
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="siq-btn"><Icon name="download" size={14} /> Export</button>
          <button className="siq-btn"><Icon name="upload" size={14} /> Bulk import</button>
          <button className="siq-btn primary"><Icon name="plus" size={14} /> New SKU</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", gap: 4 }}>
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 14px", border: "none", background: "transparent",
              fontSize: 13, fontWeight: active ? 600 : 500,
              color: active ? "var(--text)" : "var(--text-muted)",
              borderBottom: `2px solid ${active ? "var(--primary)" : "transparent"}`,
              marginBottom: -1, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.label}
              <span style={{
                padding: "0 6px", fontSize: 11, fontWeight: 600, borderRadius: 99,
                background: t.accent === "warning" ? "var(--warning-soft)" : "var(--bg-sunk)",
                color: t.accent === "warning" ? "var(--warning)" : "var(--text-muted)",
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="siq-card" style={{ padding: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Icon name="search" size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input className="siq-input" placeholder="Search name, UPC, brand…" style={{ paddingLeft: 30, width: "100%" }} />
        </div>
        <Select value="All categories" onChange={() => {}} options={["All categories", "Energy Drinks", "Cold Beverages", "Candy", "Salty Snacks"]} />
        <Select value="All brands" onChange={() => {}} options={["All brands", "Red Bull", "Monster", "Coca-Cola", "PepsiCo"]} />
        <Select value="All vendors" onChange={() => {}} options={["All vendors", "Coca-Cola NA", "PepsiCo", "Frito-Lay", "Mars Wrigley"]} />
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-muted)", marginLeft: 4 }}>
          <input type="checkbox" defaultChecked /> In-stock only
        </label>
      </div>

      {/* Bulk action bar (visible when selection exists; we mock 3 selected) */}
      <div style={{
        background: "var(--primary-soft-2)", border: "1px solid var(--primary)",
        borderRadius: 6, padding: "8px 14px",
        display: "flex", alignItems: "center", gap: 10, fontSize: 13,
      }}>
        <Icon name="check" size={14} style={{ color: "var(--primary)" }} />
        <strong style={{ color: "var(--primary-text)" }}>3 SKUs selected</strong>
        <span style={{ color: "var(--text-muted)" }}>· Bulk actions:</span>
        <button className="siq-btn sm" style={{ background: "var(--bg-elev)" }}><Icon name="edit" size={12} /> Edit</button>
        <button className="siq-btn sm" style={{ background: "var(--bg-elev)" }}><Icon name="plus" size={12} /> Add to planogram</button>
        <button className="siq-btn sm" style={{ background: "var(--bg-elev)" }}>Archive</button>
        <button className="siq-btn sm" style={{ background: "var(--bg-elev)" }}><Icon name="download" size={12} /> Export</button>
        <div style={{ flex: 1 }} />
        <button className="siq-btn ghost icon sm"><Icon name="x" size={12} /></button>
      </div>

      <div className="siq-card" style={{ overflow: "hidden" }}>
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <table className="siq-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}><input type="checkbox" /></th>
                <th style={{ width: 48 }}>Image</th>
                <th>UPC</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Pack</th>
                <th>Dim (H×W×D)</th>
                <th>Cost</th>
                <th>Retail</th>
                <th>Margin</th>
                <th>Vendor</th>
              </tr>
            </thead>
            <tbody>
              {CATALOG.slice(0, 25).map((s, i) => {
                const c = BRAND_COLORS[s.brand] || { fill: "#64748b", stroke: "#334155", text: "white" };
                const margin = Math.round((1 - s.cost / s.retail) * 100);
                const selected = i < 3;
                return (
                  <tr key={s.id} className={selected ? "selected" : ""} style={{ cursor: "pointer" }}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" defaultChecked={selected} /></td>
                    <td>
                      <div style={{
                        width: 36, height: 36, borderRadius: 4, background: c.fill,
                        border: `1px solid ${c.stroke}`, display: "grid", placeItems: "center",
                        color: c.text, fontSize: 8, fontWeight: 700, textAlign: "center", padding: 2,
                      }}>{c.label.split(" ")[0]}</div>
                    </td>
                    <td className="siq-mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.upc}</td>
                    <td><div style={{ fontWeight: 500 }}>{s.name}</div><div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{s.size}</div></td>
                    <td><span style={{ color: "var(--text-muted)" }}>{c.label}</span></td>
                    <td><span style={{ color: "var(--text-muted)" }}>{s.cat}</span></td>
                    <td><span style={{ color: "var(--text-muted)" }} className="siq-mono">{s.pack}</span></td>
                    <td className="siq-mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.h}″ × {s.w}″ × {s.d}″</td>
                    <td className="siq-mono">${s.cost.toFixed(2)}</td>
                    <td className="siq-mono" style={{ fontWeight: 500 }}>${s.retail.toFixed(2)}</td>
                    <td>
                      <span className="siq-mono" style={{
                        color: margin >= 40 ? "var(--success)" : margin >= 25 ? "var(--text)" : "var(--warning)",
                        fontWeight: 600,
                      }}>{margin}%</span>
                    </td>
                    <td><span style={{ color: "var(--text-muted)" }}>{s.vendor}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)", background: "var(--bg-sunk)" }}>
          <div>Showing 1–25 of 8,203</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="siq-btn ghost icon sm"><Icon name="chevronLeft" size={14} /></button>
            <span>Page 1 of 329</span>
            <button className="siq-btn ghost icon sm"><Icon name="chevronRight" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Products });
