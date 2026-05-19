/* Planogram editor — the hero screen.
   Three-pane: product library | canvas | properties/rules/analytics
   2D + 3D (isometric) views
*/

function Editor({ onBack, onCompare, planogramName }) {
  const toast = useToast();
  const [mode, setMode] = useState("2D");        // "2D" | "3D"
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [snap, setSnap] = useState(true);
  const [showRuler, setShowRuler] = useState(true);
  const [selected, setSelected] = useState({ door: 2, shelf: 0, slot: 0 }); // pick Red Bull
  const [librarySelected, setLibrarySelected] = useState(null);
  const [tab, setTab] = useState("properties");
  const [librarySearch, setLibrarySearch] = useState("");
  const [layout] = useState(COOLER_LAYOUT);

  // Computed selected SKU
  const selectedCell = useMemo(() => {
    if (!selected) return null;
    const door = layout[selected.door];
    if (!door) return null;
    const shelf = door[selected.shelf];
    if (!shelf) return null;
    return shelf[selected.slot] || null;
  }, [selected, layout]);
  const selectedSKU = useMemo(() => selectedCell ? SKU_LIBRARY.find(s => s.id === selectedCell.sku) : null, [selectedCell]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", margin: -24 - -24, marginLeft: -32, marginRight: -32, marginTop: -24, marginBottom: -24 }}>
      {/* Editor header */}
      <EditorHeader onBack={onBack} onCompare={onCompare} planogramName={planogramName} />

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "280px minmax(0, 1fr) 320px", minHeight: 0, borderTop: "1px solid var(--border)" }}>
        {/* LEFT: product library */}
        <LeftLibrary search={librarySearch} onSearch={setLibrarySearch} librarySelected={librarySelected} setLibrarySelected={setLibrarySelected} />

        {/* CENTER: canvas */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0, background: "var(--bg-sunk)" }}>
          <CanvasToolbar
            mode={mode} setMode={setMode}
            zoom={zoom} setZoom={setZoom}
            showGrid={showGrid} setShowGrid={setShowGrid}
            snap={snap} setSnap={setSnap}
            showRuler={showRuler} setShowRuler={setShowRuler}
          />
          <div style={{ flex: 1, position: "relative", overflow: "auto", padding: 24 }}>
            {mode === "2D"
              ? <Canvas2D layout={layout} zoom={zoom} showGrid={showGrid} showRuler={showRuler}
                  selected={selected} setSelected={setSelected}
                  librarySelected={librarySelected} setLibrarySelected={setLibrarySelected}
                  onPlace={() => toast("Placed " + (SKU_LIBRARY.find(s => s.id === librarySelected)?.name || "product") + " on shelf", { title: "Product placed" })}
                />
              : <Canvas3D layout={layout} />
            }
          </div>
          <SelectionBar sku={selectedSKU} cell={selectedCell} selected={selected} />
        </div>

        {/* RIGHT: properties / rules / analytics */}
        <RightPanel tab={tab} setTab={setTab} />
      </div>

      {/* Bottom action bar */}
      <div style={{
        height: 56, borderTop: "1px solid var(--border)", background: "var(--bg-elev)",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12.5, color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="successCheck" size={13} style={{ color: "var(--success)" }} />
            Auto-saved 12s ago
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>5 rules passing · 2 warnings</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Projected lift <strong style={{ color: "var(--success)" }}>+2.8% sales</strong> vs v4.1</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="siq-btn" onClick={onCompare}><Icon name="compare" size={14} /> Compare versions</button>
          <button className="siq-btn" onClick={() => toast("Saved as draft", { title: "Draft saved" })}>Save draft</button>
          <button className="siq-btn primary" onClick={() => toast("Submitted to Maria Chen for review", { title: "Sent for review" })}><Icon name="send" size={14} /> Submit for review</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Editor header ----------
function EditorHeader({ onBack, onCompare, planogramName }) {
  return (
    <div style={{
      height: 52, display: "flex", alignItems: "center", padding: "0 20px", gap: 14,
      background: "var(--bg-elev)",
    }}>
      <button className="siq-btn ghost icon sm" onClick={onBack} title="Back to planograms">
        <Icon name="chevronLeft" size={14} />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="planograms" size={16} style={{ color: "var(--text-muted)" }} />
        <div style={{ fontSize: 14, fontWeight: 600 }}>{planogramName || "Beer Cooler – 5 Door – Premium Cluster"}</div>
        <span className="siq-mono" style={{ fontSize: 11.5, color: "var(--text-faint)" }}>v4.2</span>
        <StatusPill status="review" />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "var(--text-muted)" }}>
        <Avatar name="Maria Chen" size={22} />
        <span>Maria Chen</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <Icon name="lock" size={12} />
        <span>Locked for review</span>
      </div>
      <button className="siq-btn ghost icon sm" title="Version history" onClick={onCompare}><Icon name="history" size={14} /></button>
      <button className="siq-btn ghost icon sm" title="Share"><Icon name="send" size={14} /></button>
      <button className="siq-btn ghost icon sm" title="Fullscreen"><Icon name="fullscreen" size={14} /></button>
    </div>
  );
}

// ---------- Left: Product Library ----------
function LeftLibrary({ search, onSearch, librarySelected, setLibrarySelected }) {
  const tree = useMemo(() => {
    const cats = {};
    for (const s of SKU_LIBRARY) {
      if (!cats[s.cat]) cats[s.cat] = [];
      cats[s.cat].push(s);
    }
    return cats;
  }, []);
  const filtered = useMemo(() => {
    if (!search) return tree;
    const Q = search.toLowerCase();
    const out = {};
    for (const [c, items] of Object.entries(tree)) {
      const f = items.filter(s => s.name.toLowerCase().includes(Q) || s.brand.includes(Q) || s.upc.includes(Q));
      if (f.length) out[c] = f;
    }
    return out;
  }, [search, tree]);

  const [openCats, setOpenCats] = useState({ "Energy Drinks": true, "Cold Beverages": true });

  return (
    <div style={{ background: "var(--bg-elev)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Product library</div>
        <div style={{ position: "relative" }}>
          <Icon name="search" size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input className="siq-input" placeholder="Search SKUs, UPC…" value={search} onChange={e => onSearch(e.target.value)} style={{ paddingLeft: 28, width: "100%", height: 30, fontSize: 12.5 }} />
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
          {["All", "On planogram", "New"].map((t, i) => (
            <button key={t} className="siq-btn ghost sm" style={{
              fontSize: 11, height: 22, padding: "0 8px",
              background: i === 0 ? "var(--primary-soft-2)" : "transparent",
              color: i === 0 ? "var(--primary-text)" : "var(--text-muted)",
              fontWeight: i === 0 ? 600 : 500,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px 16px" }}>
        {Object.entries(filtered).map(([cat, items]) => {
          const open = openCats[cat] ?? true;
          return (
            <div key={cat} style={{ marginBottom: 8 }}>
              <button onClick={() => setOpenCats(o => ({ ...o, [cat]: !open }))} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 6,
                padding: "6px 6px", background: "transparent", border: "none",
                fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer",
              }}>
                <Icon name={open ? "chevronDown" : "chevronRight"} size={11} />
                <span style={{ flex: 1, textAlign: "left" }}>{cat}</span>
                <span style={{ color: "var(--text-faint)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>{items.length}</span>
              </button>
              {open && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "4px 0" }}>
                  {items.map(s => (
                    <SkuTile key={s.id} sku={s} selected={librarySelected === s.id} onClick={() => setLibrarySelected(s.id === librarySelected ? null : s.id)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {Object.keys(filtered).length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "var(--text-faint)", fontSize: 12.5 }}>No SKUs match "{search}"</div>
        )}
      </div>

      {librarySelected && (
        <div style={{ padding: 12, borderTop: "1px solid var(--border)", background: "var(--primary-soft-2)", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="cursor" size={13} style={{ color: "var(--primary)" }} />
          <div style={{ fontSize: 12, color: "var(--primary-text)", flex: 1 }}>
            <div style={{ fontWeight: 600 }}>Ready to place</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Click an empty slot on the canvas</div>
          </div>
          <button className="siq-btn ghost icon sm" onClick={() => setLibrarySelected(null)}><Icon name="x" size={12} /></button>
        </div>
      )}
    </div>
  );
}

function SkuTile({ sku, selected, onClick }) {
  const c = BRAND_COLORS[sku.brand] || { fill: "#64748b", stroke: "#334155", text: "white" };
  return (
    <div
      onClick={onClick}
      style={{
        display: "grid", gridTemplateColumns: "36px 1fr", gap: 8, padding: 6,
        borderRadius: 6, cursor: "grab",
        background: selected ? "var(--primary-soft-2)" : "transparent",
        border: `1px solid ${selected ? "var(--primary)" : "transparent"}`,
        transition: "all 0.1s",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "var(--bg-sunk)"; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{
        height: 44, borderRadius: 4, background: c.fill,
        border: `1px solid ${c.stroke}`,
        display: "grid", placeItems: "center",
        color: c.text, fontSize: 8, fontWeight: 700, lineHeight: 1, textAlign: "center", padding: 2,
      }}>
        {c.label.split(" ")[0]}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="siq-truncate" style={{ fontSize: 12, fontWeight: 500 }}>{sku.name}</div>
        <div style={{ fontSize: 10.5, color: "var(--text-faint)" }} className="siq-mono">{sku.upc.slice(-8)}</div>
        <div style={{ display: "flex", gap: 4, marginTop: 2, fontSize: 10, color: "var(--text-muted)" }}>
          <span>{sku.size}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{sku.recF}f rec</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Canvas toolbar ----------
function CanvasToolbar({ mode, setMode, zoom, setZoom, showGrid, setShowGrid, snap, setSnap, showRuler, setShowRuler }) {
  return (
    <div style={{
      height: 44, background: "var(--bg-elev)", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", padding: "0 14px", gap: 10,
    }}>
      <ToggleGroup
        value={mode}
        onChange={setMode}
        options={[
          { value: "2D", label: "2D", icon: "grid" },
          { value: "3D", label: "3D", icon: "cube" },
        ]}
      />
      <Divider />
      <button className="siq-btn ghost icon sm" title="Undo"><Icon name="undo" size={14} /></button>
      <button className="siq-btn ghost icon sm" title="Redo"><Icon name="redo" size={14} /></button>
      <Divider />
      <button className="siq-btn ghost icon sm" title="Zoom out" onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))}><Icon name="zoomOut" size={14} /></button>
      <div className="siq-mono" style={{ fontSize: 11.5, color: "var(--text-muted)", minWidth: 42, textAlign: "center" }}>{Math.round(zoom * 100)}%</div>
      <button className="siq-btn ghost icon sm" title="Zoom in" onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)))}><Icon name="zoomIn" size={14} /></button>
      <Divider />
      <Toggle pressed={showGrid} onChange={setShowGrid} icon="grid" title="Grid" />
      <Toggle pressed={snap} onChange={setSnap} icon="magnet" title="Snap" />
      <Toggle pressed={showRuler} onChange={setShowRuler} icon="ruler" title="Ruler" />
      <div style={{ flex: 1 }} />
      <button className="siq-btn sm"><Icon name="sparkles" size={12} /> Auto-optimize</button>
      <button className="siq-btn ghost icon sm" title="Fullscreen"><Icon name="fullscreen" size={14} /></button>
    </div>
  );
}

function ToggleGroup({ value, onChange, options }) {
  return (
    <div style={{ display: "flex", background: "var(--bg-sunk)", padding: 2, borderRadius: 6, border: "1px solid var(--border)" }}>
      {options.map(o => {
        const active = value === o.value;
        return (
          <button key={o.value} onClick={() => onChange(o.value)} className="siq-btn" style={{
            height: 24, padding: "0 10px", fontSize: 12, gap: 5,
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

function Toggle({ pressed, onChange, icon, title }) {
  return (
    <button onClick={() => onChange(!pressed)} title={title} className="siq-btn ghost icon sm" style={{
      background: pressed ? "var(--primary-soft-2)" : "transparent",
      color: pressed ? "var(--primary)" : "var(--text-muted)",
    }}>
      <Icon name={icon} size={14} />
    </button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: "var(--border)" }} />;
}

// ---------- 2D Canvas (the big SVG) ----------
function Canvas2D({ layout, zoom, showGrid, showRuler, selected, setSelected, librarySelected, setLibrarySelected, onPlace }) {
  const doors = 5;
  const shelves = 5;
  // Layout dimensions (px in SVG coords)
  const DOOR_W = 220;
  const DOOR_H = 360;
  const SHELF_H = DOOR_H / shelves;
  const GAP = 0; // mullion thickness drawn separately
  const SIDE_PAD = showRuler ? 30 : 16;
  const TOP_PAD = 64; // for temperature label
  const BOTTOM_PAD = showRuler ? 30 : 16;
  const totalW = SIDE_PAD * 2 + DOOR_W * doors + 12 * (doors - 1);
  const totalH = TOP_PAD + DOOR_H + BOTTOM_PAD + 30; // extra for base

  return (
    <div style={{
      transformOrigin: "top left",
      transform: `scale(${zoom})`,
      display: "inline-block",
      minWidth: totalW,
    }}>
      <svg width={totalW} height={totalH} style={{
        background: "var(--bg-elev)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        boxShadow: "var(--shadow-sm)",
        display: "block",
      }}>
        <defs>
          <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stopColor="rgba(186, 230, 253, 0.18)" />
            <stop offset="50%" stopColor="rgba(186, 230, 253, 0.04)" />
            <stop offset="100%" stopColor="rgba(186, 230, 253, 0.10)" />
          </linearGradient>
          <pattern id="gridp" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M12 0H0V12" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.5"/>
          </pattern>
        </defs>

        {/* Background grid */}
        {showGrid && <rect x={SIDE_PAD} y={TOP_PAD} width={totalW - SIDE_PAD * 2} height={DOOR_H} fill="url(#gridp)" />}

        {/* Ruler — top inches */}
        {showRuler && (
          <g>
            {Array.from({ length: 14 }).map((_, i) => {
              const x = SIDE_PAD + (totalW - SIDE_PAD * 2) * (i / 13);
              return (
                <g key={i}>
                  <line x1={x} y1={TOP_PAD - 8} x2={x} y2={TOP_PAD - 2} stroke="var(--text-faint)" strokeWidth="0.6" />
                  <text x={x} y={TOP_PAD - 12} textAnchor="middle" fontSize="9" fill="var(--text-faint)" fontFamily="var(--font-mono)">{Math.round(130 * i / 13)}"</text>
                </g>
              );
            })}
          </g>
        )}

        {/* Doors */}
        {Array.from({ length: doors }).map((_, di) => {
          const x = SIDE_PAD + di * (DOOR_W + 12);
          return (
            <g key={di}>
              {/* Temperature label */}
              <g transform={`translate(${x + DOOR_W / 2}, ${TOP_PAD - 28})`}>
                <rect x={-32} y={-12} width={64} height={20} rx={4} fill="var(--bg-sunk)" stroke="var(--border)" />
                <text x={0} y={3} textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontFamily="var(--font-mono)" fontWeight="500">34°F · D{di + 1}</text>
              </g>

              {/* Door frame */}
              <rect x={x} y={TOP_PAD} width={DOOR_W} height={DOOR_H} rx={3}
                fill="url(#glass)"
                stroke="var(--border-strong)" strokeWidth="2"
              />

              {/* Door handle hint */}
              <rect x={x + (di === 4 ? DOOR_W - 8 : 4)} y={TOP_PAD + DOOR_H / 2 - 28} width={4} height={56} rx={2} fill="var(--border-strong)" opacity="0.6" />

              {/* Shelves */}
              {Array.from({ length: shelves }).map((_, si) => {
                const y = TOP_PAD + si * SHELF_H;
                const cells = (layout[di] && layout[di][si]) || null;

                return (
                  <g key={si}>
                    {/* Shelf line */}
                    <line x1={x + 4} x2={x + DOOR_W - 4} y1={y + SHELF_H} y2={y + SHELF_H} stroke="var(--text-faint)" strokeWidth="0.5" opacity="0.5"/>

                    {/* Empty slot indicator if no cells */}
                    {!cells && (
                      <SlotEmpty
                        x={x + 6} y={y + 4} w={DOOR_W - 12} h={SHELF_H - 8}
                        active={!!librarySelected}
                        onClick={() => {
                          if (librarySelected) {
                            onPlace();
                            setLibrarySelected(null);
                          }
                          setSelected({ door: di, shelf: si, slot: 0 });
                        }}
                      />
                    )}

                    {/* Products */}
                    {cells && <ShelfRow
                      cells={cells}
                      x={x + 6} y={y + 4} w={DOOR_W - 12} h={SHELF_H - 8}
                      doorIdx={di} shelfIdx={si}
                      selected={selected}
                      onSelect={(slot) => setSelected({ door: di, shelf: si, slot })}
                    />}
                  </g>
                );
              })}

              {/* Door label at bottom */}
              <text x={x + 8} y={TOP_PAD + DOOR_H + 18} fontSize="10" fill="var(--text-faint)" fontFamily="var(--font-mono)">Door {di + 1} · 26"W</text>
            </g>
          );
        })}

        {/* Side ruler — vertical */}
        {showRuler && (
          <g>
            {[5, 4, 3, 2, 1].map((s, i) => (
              <text key={i} x={SIDE_PAD - 8} y={TOP_PAD + (i + 0.5) * SHELF_H + 4} textAnchor="end" fontSize="9" fill="var(--text-faint)" fontFamily="var(--font-mono)">S{s}</text>
            ))}
          </g>
        )}

        {/* Base */}
        <rect x={SIDE_PAD - 2} y={TOP_PAD + DOOR_H + 24} width={totalW - SIDE_PAD * 2 + 4} height={6} rx={2} fill="var(--border-strong)" opacity="0.7" />
      </svg>

      {/* Bottom info bar */}
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, color: "var(--text-muted)" }}>
        <span>5-Door Beer Cooler · <span className="siq-mono">78"H × 130"W × 30"D</span> · 25 shelves</span>
        <span>Capacity used: <strong style={{ color: "var(--text)" }}>87%</strong> · 116 facings placed</span>
      </div>
    </div>
  );
}

function SlotEmpty({ x, y, w, h, active, onClick }) {
  return (
    <rect
      x={x} y={y} width={w} height={h} rx={3}
      fill={active ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "transparent"}
      stroke={active ? "var(--primary)" : "var(--border)"}
      strokeWidth={active ? "1.5" : "1"}
      strokeDasharray="4 3"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    />
  );
}

function ShelfRow({ cells, x, y, w, h, doorIdx, shelfIdx, selected, onSelect }) {
  const totalFacings = cells.reduce((s, c) => s + c.f, 0);
  let cursorX = x;
  return (
    <g>
      {cells.map((cell, ci) => {
        const sku = SKU_LIBRARY.find(s => s.id === cell.sku);
        if (!sku) return null;
        const cw = (w * cell.f) / totalFacings - 1;
        const isSel = selected && selected.door === doorIdx && selected.shelf === shelfIdx && selected.slot === ci;
        const node = <Product
          key={ci}
          x={cursorX} y={y} w={cw} h={h}
          sku={sku} facings={cell.f}
          selected={isSel}
          onClick={() => onSelect(ci)}
        />;
        cursorX += cw + 1;
        return node;
      })}
    </g>
  );
}

function Product({ x, y, w, h, sku, facings, selected, onClick }) {
  const c = BRAND_COLORS[sku.brand] || { fill: "#64748b", stroke: "#334155", text: "white" };
  const facingW = w / facings;
  return (
    <g style={{ cursor: "pointer" }} onClick={onClick}>
      {/* facing slats */}
      {Array.from({ length: facings }).map((_, fi) => (
        <rect key={fi}
          x={x + fi * facingW + 0.5} y={y} width={facingW - 1} height={h}
          rx={2}
          fill={c.fill} stroke={c.stroke} strokeWidth="0.75"
        />
      ))}
      {/* shared label across facings */}
      <g clipPath={`url(#clip-${sku.id}-${x}-${y})`} />
      <foreignObject x={x + 2} y={y + 2} width={w - 4} height={h - 4} style={{ pointerEvents: "none" }}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", textAlign: "center",
          color: c.text, fontSize: Math.min(10, Math.max(7, w / 6)),
          fontWeight: 700, lineHeight: 1.1, letterSpacing: 0.2,
          fontFamily: "Inter, system-ui, sans-serif",
          overflow: "hidden",
        }}>
          <div style={{ textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>{c.label}</div>
          {h > 50 && <div style={{ fontSize: 7, fontWeight: 500, opacity: 0.75, marginTop: 2 }}>{sku.size}</div>}
        </div>
      </foreignObject>
      {/* facings badge */}
      <g>
        <rect x={x + w - 22} y={y + h - 14} width={20} height={12} rx={2} fill="rgba(0,0,0,0.55)" />
        <text x={x + w - 12} y={y + h - 5} fontSize="8.5" fill="white" textAnchor="middle" fontFamily="var(--font-mono)" fontWeight="600">×{facings}</text>
      </g>
      {/* Selection outline + handles */}
      {selected && (
        <>
          <rect x={x - 2} y={y - 2} width={w + 4} height={h + 4} rx={4} fill="none"
            stroke="var(--primary)" strokeWidth="2" />
          {[[x - 2, y - 2], [x + w + 2, y - 2], [x - 2, y + h + 2], [x + w + 2, y + h + 2]].map(([hx, hy], i) => (
            <rect key={i} x={hx - 3} y={hy - 3} width={6} height={6} fill="white" stroke="var(--primary)" strokeWidth="1.5" />
          ))}
        </>
      )}
    </g>
  );
}

// ---------- 3D Isometric view ----------
function Canvas3D({ layout }) {
  const doors = 5;
  const shelves = 5;
  // Isometric transform: project (x, y, z) into 2D
  const SX = 14;  // pixels per unit X
  const SY = 14;
  const SZ = 8;   // pixels per unit depth
  const project = (x, y, z) => ({
    px: x * SX + z * SZ * Math.cos(Math.PI / 6),
    py: -y * SY + z * SZ * Math.sin(Math.PI / 6),
  });

  // door = 20 units wide, shelf = 6 units tall, depth = 8
  const DOOR_W = 20;
  const SHELF_H = 6;
  const DEPTH = 8;

  // Determine SVG bounds
  const left = project(0, 0, 0);
  const right = project(doors * DOOR_W, 0, 0);
  const top = project(0, shelves * SHELF_H, DEPTH);
  const bottom = project(0, 0, 0);
  const padX = 40, padY = 60;
  const sceneW = (right.px - left.px) + DEPTH * SZ * Math.cos(Math.PI / 6) + padX * 2;
  const sceneH = (shelves * SHELF_H * SY) + DEPTH * SZ * Math.sin(Math.PI / 6) + padY * 2;
  const offX = padX;
  const offY = padY + shelves * SHELF_H * SY;

  const moveTo = (x, y, z) => {
    const p = project(x, y, z);
    return `${offX + p.px},${offY + p.py}`;
  };

  return (
    <div style={{ display: "inline-block" }}>
      <svg width={sceneW} height={sceneH} style={{
        background: "var(--bg-elev)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        boxShadow: "var(--shadow-sm)",
        display: "block",
      }}>
        <defs>
          <linearGradient id="floor3d" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--bg-sunk)" />
            <stop offset="100%" stopColor="var(--bg-elev)" />
          </linearGradient>
        </defs>
        {/* Floor */}
        <polygon
          points={`${moveTo(0, 0, 0)} ${moveTo(doors * DOOR_W, 0, 0)} ${moveTo(doors * DOOR_W, 0, DEPTH)} ${moveTo(0, 0, DEPTH)}`}
          fill="url(#floor3d)"
          stroke="var(--border)"
        />

        {/* Each door */}
        {Array.from({ length: doors }).map((_, di) => {
          const xL = di * DOOR_W;
          const xR = (di + 1) * DOOR_W;
          return (
            <g key={di}>
              {/* Back wall of door */}
              <polygon
                points={`${moveTo(xL, 0, DEPTH)} ${moveTo(xR, 0, DEPTH)} ${moveTo(xR, shelves * SHELF_H, DEPTH)} ${moveTo(xL, shelves * SHELF_H, DEPTH)}`}
                fill="color-mix(in srgb, var(--bg-sunk) 80%, var(--text-faint))"
                opacity="0.55"
                stroke="var(--border-strong)" strokeWidth="0.5"
              />

              {/* Shelves */}
              {Array.from({ length: shelves }).map((_, si) => {
                const yB = si * SHELF_H;
                const yT = (si + 1) * SHELF_H;
                const cells = (layout[di] && layout[di][shelves - 1 - si]) || null;
                if (!cells) return null;
                const totalF = cells.reduce((s, c) => s + c.f, 0);
                let cur = 0;
                return (
                  <g key={si}>
                    {/* shelf surface */}
                    <polygon
                      points={`${moveTo(xL, yB, 0)} ${moveTo(xR, yB, 0)} ${moveTo(xR, yB, DEPTH)} ${moveTo(xL, yB, DEPTH)}`}
                      fill="var(--bg-sunk)" stroke="var(--border)" strokeWidth="0.5" opacity="0.7"
                    />
                    {cells.map((cell, ci) => {
                      const sku = SKU_LIBRARY.find(s => s.id === cell.sku);
                      if (!sku) return null;
                      const c = BRAND_COLORS[sku.brand];
                      const wUnits = (DOOR_W / totalF) * cell.f;
                      const xStart = xL + cur;
                      const xEnd = xL + cur + wUnits;
                      cur += wUnits;
                      const productH = SHELF_H * 0.85;

                      return (
                        <g key={ci}>
                          {/* front face */}
                          <polygon
                            points={`${moveTo(xStart + 0.2, yB, 1)} ${moveTo(xEnd - 0.2, yB, 1)} ${moveTo(xEnd - 0.2, yB + productH, 1)} ${moveTo(xStart + 0.2, yB + productH, 1)}`}
                            fill={c.fill} stroke={c.stroke} strokeWidth="0.5"
                          />
                          {/* top face */}
                          <polygon
                            points={`${moveTo(xStart + 0.2, yB + productH, 1)} ${moveTo(xEnd - 0.2, yB + productH, 1)} ${moveTo(xEnd - 0.2, yB + productH, DEPTH - 1)} ${moveTo(xStart + 0.2, yB + productH, DEPTH - 1)}`}
                            fill={c.fill} stroke={c.stroke} strokeWidth="0.5" opacity="0.7"
                          />
                          {/* right side */}
                          <polygon
                            points={`${moveTo(xEnd - 0.2, yB, 1)} ${moveTo(xEnd - 0.2, yB, DEPTH - 1)} ${moveTo(xEnd - 0.2, yB + productH, DEPTH - 1)} ${moveTo(xEnd - 0.2, yB + productH, 1)}`}
                            fill={c.fill} stroke={c.stroke} strokeWidth="0.5" opacity="0.55"
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Front mullion / door edge */}
              <polygon
                points={`${moveTo(xL, 0, 0)} ${moveTo(xL + 0.4, 0, 0)} ${moveTo(xL + 0.4, shelves * SHELF_H, 0)} ${moveTo(xL, shelves * SHELF_H, 0)}`}
                fill="var(--border-strong)"
              />
            </g>
          );
        })}
        {/* far right mullion */}
        <polygon
          points={`${moveTo(doors * DOOR_W - 0.4, 0, 0)} ${moveTo(doors * DOOR_W, 0, 0)} ${moveTo(doors * DOOR_W, shelves * SHELF_H, 0)} ${moveTo(doors * DOOR_W - 0.4, shelves * SHELF_H, 0)}`}
          fill="var(--border-strong)"
        />
        {/* top frame */}
        <polygon
          points={`${moveTo(0, shelves * SHELF_H, 0)} ${moveTo(doors * DOOR_W, shelves * SHELF_H, 0)} ${moveTo(doors * DOOR_W, shelves * SHELF_H, DEPTH)} ${moveTo(0, shelves * SHELF_H, DEPTH)}`}
          fill="var(--border-strong)" opacity="0.6"
        />
      </svg>
      <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--text-muted)" }}>
        Isometric preview · drag to orbit (placeholder)
      </div>
    </div>
  );
}

// ---------- Selection / properties bar ----------
function SelectionBar({ sku, cell, selected }) {
  if (!sku || !cell) {
    return (
      <div style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", padding: "10px 18px", fontSize: 12, color: "var(--text-muted)" }}>
        No product selected. Click a product on the canvas.
      </div>
    );
  }
  const c = BRAND_COLORS[sku.brand];
  return (
    <div style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 36, height: 44, borderRadius: 4, background: c.fill, border: `1px solid ${c.stroke}`, display: "grid", placeItems: "center", color: c.text, fontWeight: 700, fontSize: 9, textAlign: "center", padding: 2 }}>
        {c.label.split(" ")[0]}
      </div>
      <div style={{ minWidth: 180 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{sku.name}</div>
        <div style={{ fontSize: 11.5, color: "var(--text-faint)" }} className="siq-mono">{sku.upc} · {sku.size}</div>
      </div>
      <Divider />
      <Kv k="Position" v={`D${selected.door + 1} · Shelf ${5 - selected.shelf}`} />
      <Kv k="Facings" v={`×${cell.f}`} mono />
      <Kv k="Orientation" v="Front" />
      <Kv k="Capping" v="None" />
      <Kv k="Days of supply" v="2.3" mono color={cell.f < 3 ? "var(--warning)" : "var(--success)"} />
      <Kv k="Retail" v={`$${sku.retail.toFixed(2)}`} mono />
      <Kv k="Margin" v={`${Math.round((1 - sku.cost / sku.retail) * 100)}%`} mono />
      <div style={{ flex: 1 }} />
      <button className="siq-btn ghost icon sm" title="Duplicate"><Icon name="copy" size={13} /></button>
      <button className="siq-btn ghost icon sm" title="Lock"><Icon name="lock" size={13} /></button>
      <button className="siq-btn ghost icon sm" title="Delete" style={{ color: "var(--danger)" }}><Icon name="trash" size={13} /></button>
    </div>
  );
}
function Kv({ k, v, mono, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 70 }}>
      <span style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>{k}</span>
      <span className={mono ? "siq-mono" : ""} style={{ fontSize: 13, fontWeight: 500, color: color || "var(--text)" }}>{v}</span>
    </div>
  );
}

// ---------- Right panel ----------
function RightPanel({ tab, setTab }) {
  return (
    <div style={{ background: "var(--bg-elev)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
        {[
          { id: "properties", label: "Properties" },
          { id: "rules",      label: "Rules", badge: 2 },
          { id: "analytics",  label: "Analytics" },
        ].map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "12px 8px", border: "none", background: "transparent",
              fontSize: 12.5, fontWeight: active ? 600 : 500,
              color: active ? "var(--text)" : "var(--text-muted)",
              borderBottom: `2px solid ${active ? "var(--primary)" : "transparent"}`,
              cursor: "pointer", position: "relative",
            }}>
              {t.label}
              {t.badge && <span style={{ marginLeft: 4, fontSize: 10, padding: "0 5px", background: "var(--warning-soft)", color: "var(--warning)", borderRadius: 99, fontWeight: 600 }}>{t.badge}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "properties" && <PropertiesTab />}
        {tab === "rules" && <RulesTab />}
        {tab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
}

function PropertiesTab() {
  return (
    <div style={{ padding: 16 }}>
      <Section title="Planogram">
        <Field label="Name">
          <input className="siq-input" defaultValue="Beer Cooler – 5 Door – Premium Cluster" style={{ width: "100%" }} />
        </Field>
        <Field label="Category">
          <input className="siq-input" defaultValue="Cold Beverages" style={{ width: "100%" }} />
        </Field>
        <Field label="Banner">
          <input className="siq-input" defaultValue="Quikstop Core" style={{ width: "100%" }} />
        </Field>
        <Field label="Cluster">
          <input className="siq-input" defaultValue="Premium Urban" style={{ width: "100%" }} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Effective from"><input className="siq-input" defaultValue="2026-05-01" style={{ width: "100%" }} /></Field>
          <Field label="Effective to"><input className="siq-input" defaultValue="2026-08-31" style={{ width: "100%" }} /></Field>
        </div>
      </Section>

      <Section title="Fixture">
        <KvRow k="Type"        v="5-Door Beer Cooler" />
        <KvRow k="Dimensions"  v={<span className="siq-mono">78"H × 130"W × 30"D</span>} />
        <KvRow k="Shelves"     v="25 total · 5 per door" />
        <KvRow k="Door type"   v="Glass swing · Anti-fog" />
        <KvRow k="Temperature" v="34°F constant" />
      </Section>

      <Section title="Assignment">
        <KvRow k="Cluster size" v="42 stores" />
        <KvRow k="Auto-publish" v={<Switch on />} />
        <KvRow k="Vendor share" v={<Switch />} />
      </Section>
    </div>
  );
}

function RulesTab() {
  return (
    <div style={{ padding: 14 }}>
      <div style={{ padding: "10px 12px", background: "var(--bg-sunk)", borderRadius: 6, fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 8 }}>
        <Icon name="info" size={14} style={{ color: "var(--info)", marginTop: 1 }} />
        <span>Rules are validated live as you edit. <strong style={{ color: "var(--text)" }}>5 passing</strong> · <strong style={{ color: "var(--warning)" }}>2 warnings</strong></span>
      </div>
      {EDITOR_RULES.map(r => (
        <div key={r.id} style={{
          padding: 12, marginBottom: 8,
          border: "1px solid var(--border)", borderRadius: 6,
          background: "var(--bg-elev)",
          borderLeft: `3px solid ${
            r.status === "passing" ? "var(--success)" :
            r.status === "warning" ? "var(--warning)" :
            "var(--border)"
          }`,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
            <Switch on={r.on} />
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{r.desc}</div>
          {r.status === "warning" && r.note && (
            <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--warning)", display: "flex", gap: 6, alignItems: "center", background: "var(--warning-soft)", padding: "5px 8px", borderRadius: 4 }}>
              <Icon name="alert" size={12} /> {r.note}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        <Stat label="Projected sales/wk" value="$18.2K" delta="+8.4%" positive />
        <Stat label="Space:Sales index" value="1.08" delta="+0.12" positive />
        <Stat label="Avg facings/SKU"   value="3.6"   delta="−0.2"  negative />
        <Stat label="Days of supply"    value="2.4d"  delta="OK"    positive />
      </div>

      <Section title="Sales per facing">
        <MiniBars data={[
          { label: "Red Bull",   v: 18.40 },
          { label: "Monster",    v: 12.10 },
          { label: "Mtn Dew",    v: 11.80 },
          { label: "Coke",       v: 10.60 },
          { label: "Pepsi",      v: 9.40 },
          { label: "5-Hour",     v: 7.20 },
          { label: "Celsius",    v: 6.10 },
          { label: "Gatorade",   v: 5.80 },
        ]} />
      </Section>

      <Section title="Lift vs v4.1">
        <div style={{
          padding: 14, borderRadius: 8, background: "var(--bg-sunk)",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 600, color: "var(--success)" }}>+2.8%</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>projected sales lift</span>
          </div>
          <div style={{ height: 60, position: "relative" }}>
            <svg width="100%" height="60" viewBox="0 0 280 60" preserveAspectRatio="none">
              <path d="M0 45 Q 30 40 50 36 T 100 28 T 160 22 T 220 14 T 280 8" fill="none" stroke="var(--success)" strokeWidth="2" />
              <path d="M0 45 Q 30 40 50 36 T 100 28 T 160 22 T 220 14 T 280 8 L 280 60 L 0 60 Z" fill="color-mix(in srgb, var(--success) 18%, transparent)" />
            </svg>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Based on cluster B 8-week comparison · 95% confidence</div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}
function KvRow({ k, v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid var(--border)", fontSize: 12.5 }}>
      <span style={{ color: "var(--text-muted)" }}>{k}</span>
      <span style={{ color: "var(--text)", fontWeight: 500 }}>{v}</span>
    </div>
  );
}
function Switch({ on: initial = false }) {
  const [on, setOn] = useState(initial);
  return (
    <button onClick={() => setOn(o => !o)} style={{
      width: 30, height: 18, padding: 0, borderRadius: 99,
      background: on ? "var(--primary)" : "var(--border-strong)",
      border: "none", position: "relative", cursor: "pointer",
      transition: "background 0.15s",
    }}>
      <span style={{
        position: "absolute", top: 2, left: on ? 14 : 2,
        width: 14, height: 14, borderRadius: 99,
        background: "white", transition: "left 0.15s",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}
function Stat({ label, value, delta, positive, negative }) {
  return (
    <div style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 6 }}>
      <div style={{ fontSize: 10.5, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: positive ? "var(--success)" : negative ? "var(--danger)" : "var(--text-muted)", marginTop: 2 }}>{delta}</div>
    </div>
  );
}
function MiniBars({ data }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "76px 1fr 48px", gap: 8, alignItems: "center", fontSize: 11.5 }}>
          <span style={{ color: "var(--text-muted)" }} className="siq-truncate">{d.label}</span>
          <div style={{ background: "var(--bg-sunk)", height: 12, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(d.v / max) * 100}%`, height: "100%", background: "var(--primary)", borderRadius: 3 }} />
          </div>
          <span className="siq-mono" style={{ textAlign: "right", color: "var(--text)" }}>${d.v.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Editor });
