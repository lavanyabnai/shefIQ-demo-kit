/* Planograms list screen */

function Planograms({ onOpenEditor, onNewPlanogram }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [bannerFilter, setBannerFilter] = useState("All banners");
  const [sort, setSort] = useState({ key: "modified", dir: "desc" });

  const cats = useMemo(() => ["All categories", ...new Set(PLANOGRAMS.map(p => p.category))], []);
  const banners = useMemo(() => ["All banners", ...new Set(PLANOGRAMS.map(p => p.banner))], []);

  const filtered = useMemo(() => {
    let rows = PLANOGRAMS.slice();
    if (query) {
      const Q = query.toLowerCase();
      rows = rows.filter(p => p.name.toLowerCase().includes(Q) || p.owner.toLowerCase().includes(Q) || p.cluster.toLowerCase().includes(Q));
    }
    if (statusFilter !== "All") rows = rows.filter(p => p.status === statusFilter.toLowerCase());
    if (categoryFilter !== "All categories") rows = rows.filter(p => p.category === categoryFilter);
    if (bannerFilter !== "All banners") rows = rows.filter(p => p.banner === bannerFilter);
    return rows;
  }, [query, statusFilter, categoryFilter, bannerFilter]);

  const statusCounts = useMemo(() => {
    const c = { Live: 0, "In Review": 0, Draft: 0, Approved: 0, Archived: 0 };
    for (const p of PLANOGRAMS) {
      if (p.status === "live") c.Live++;
      else if (p.status === "review") c["In Review"]++;
      else if (p.status === "draft") c.Draft++;
      else if (p.status === "approved") c.Approved++;
      else if (p.status === "archived") c.Archived++;
    }
    return c;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>Planograms</h1>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            {PLANOGRAMS.length} planograms across 4 banners and 6 clusters
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="siq-btn"><Icon name="download" size={14} /> Export</button>
          <button className="siq-btn"><Icon name="upload" size={14} /> Import .psa</button>
          <button className="siq-btn primary" onClick={onNewPlanogram}><Icon name="plus" size={14} /> New planogram</button>
        </div>
      </div>

      {/* Status quick filters */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["All", "Live", "In Review", "Draft", "Approved", "Archived"].map(s => {
          const active = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} className="siq-btn sm" style={{
              background: active ? "var(--primary-soft-2)" : "var(--bg-elev)",
              borderColor: active ? "var(--primary)" : "var(--border)",
              color: active ? "var(--primary-text)" : "var(--text)",
              fontWeight: active ? 600 : 500,
            }}>
              {s}
              {s !== "All" && <span style={{ marginLeft: 4, color: active ? "var(--primary)" : "var(--text-faint)" }}>· {statusCounts[s] || 0}</span>}
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="siq-card" style={{ padding: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Icon name="search" size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input className="siq-input" placeholder="Search by name, owner, cluster…" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 30, width: "100%" }} />
        </div>
        <Select value={bannerFilter} onChange={setBannerFilter} options={banners} />
        <Select value={categoryFilter} onChange={setCategoryFilter} options={cats} />
        <button className="siq-btn" style={{ color: "var(--text-muted)" }}><Icon name="calendar" size={14} /> Date range</button>
        <button className="siq-btn ghost"><Icon name="filter" size={14} /> More filters</button>
      </div>

      {/* Table */}
      <div className="siq-card" style={{ overflow: "hidden" }}>
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <table className="siq-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}><input type="checkbox" /></th>
                <SortableTh col="name" sort={sort} setSort={setSort}>Name</SortableTh>
                <SortableTh col="category" sort={sort} setSort={setSort}>Category</SortableTh>
                <SortableTh col="banner" sort={sort} setSort={setSort}>Banner</SortableTh>
                <SortableTh col="cluster" sort={sort} setSort={setSort}>Cluster</SortableTh>
                <SortableTh col="status" sort={sort} setSort={setSort}>Status</SortableTh>
                <SortableTh col="effective" sort={sort} setSort={setSort}>Effective</SortableTh>
                <SortableTh col="modified" sort={sort} setSort={setSort}>Modified</SortableTh>
                <th>Owner</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => onOpenEditor(p.id)}>
                  <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  <td>
                    <div style={{ fontWeight: 500, color: "var(--text)" }}>{p.baseName}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-faint)", marginTop: 1 }} className="siq-mono">{p.version}</div>
                  </td>
                  <td><span style={{ color: "var(--text-muted)" }}>{p.category}</span></td>
                  <td><span style={{ color: "var(--text-muted)" }}>{p.banner}</span></td>
                  <td><span style={{ color: "var(--text-muted)" }}>{p.cluster}</span></td>
                  <td><StatusPill status={p.status} /></td>
                  <td className="siq-mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.effective}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: 12.5 }}>{p.modified}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={p.owner} size={24} />
                      <span style={{ fontSize: 12.5 }}>{p.owner}</span>
                    </div>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button className="siq-btn ghost icon sm"><Icon name="more" size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text-muted)", background: "var(--bg-sunk)" }}>
          <div>Showing {filtered.length} of {PLANOGRAMS.length}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="siq-btn ghost icon sm"><Icon name="chevronLeft" size={14} /></button>
            <span>Page 1 of 1</span>
            <button className="siq-btn ghost icon sm"><Icon name="chevronRight" size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Select({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="siq-btn" onClick={() => setOpen(v => !v)} style={{ minWidth: 160, justifyContent: "space-between", color: "var(--text-muted)" }}>
        <span>{value}</span>
        <Icon name="chevronDown" size={12} style={{ color: "var(--text-faint)" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: "100%", background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 6, boxShadow: "var(--shadow-md)", padding: 4, zIndex: 30, maxHeight: 280, overflowY: "auto" }}>
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} className="siq-btn ghost" style={{ width: "100%", justifyContent: "space-between", height: 28, fontSize: 12.5 }}>
              <span>{o}</span>
              {o === value && <Icon name="check" size={12} style={{ color: "var(--primary)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SortableTh({ col, sort, setSort, children }) {
  const active = sort.key === col;
  return (
    <th className="sortable" onClick={() => setSort({ key: col, dir: active && sort.dir === "asc" ? "desc" : "asc" })}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        {children}
        {active && <Icon name={sort.dir === "asc" ? "chevronUp" : "chevronDown"} size={10} />}
      </span>
    </th>
  );
}

function StatusPill({ status }) {
  const map = {
    live:     { cls: "live",     label: "Live" },
    review:   { cls: "review",   label: "In Review" },
    draft:    { cls: "draft",    label: "Draft" },
    approved: { cls: "approved", label: "Approved" },
    archived: { cls: "archived", label: "Archived" },
  };
  const m = map[status] || map.draft;
  return <span className={`siq-pill ${m.cls}`}><span className="dot" /> {m.label}</span>;
}

Object.assign(window, { Planograms, StatusPill, Select, SortableTh });
