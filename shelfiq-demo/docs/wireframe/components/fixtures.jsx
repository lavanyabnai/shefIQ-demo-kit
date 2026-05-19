/* Fixture library: grid of isometric fixture cards */

function Fixtures() {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>Fixture library</h1>
          <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
            C-store native fixtures · {FIXTURES.length} types · click to use in a planogram
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="siq-btn"><Icon name="upload" size={14} /> Import .frx</button>
          <button className="siq-btn primary"><Icon name="plus" size={14} /> Custom fixture</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["All", "Coolers", "Gondolas", "Foodservice", "Counter", "Specialty"].map((t, i) => (
          <button key={t} className="siq-btn sm" style={{
            background: i === 0 ? "var(--primary-soft-2)" : "var(--bg-elev)",
            borderColor: i === 0 ? "var(--primary)" : "var(--border)",
            color: i === 0 ? "var(--primary-text)" : "var(--text)",
            fontWeight: i === 0 ? 600 : 500,
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {FIXTURES.map(f => (
          <div key={f.id} className="siq-card" style={{
            padding: 14, cursor: "pointer",
            transition: "all 0.12s",
            borderColor: hover === f.id ? "var(--primary)" : "var(--border)",
            transform: hover === f.id ? "translateY(-1px)" : "none",
            boxShadow: hover === f.id ? "var(--shadow-md)" : "none",
          }}
          onMouseEnter={() => setHover(f.id)}
          onMouseLeave={() => setHover(null)}
          >
            <div style={{ height: 100, background: "var(--bg-sunk)", borderRadius: 6, position: "relative", overflow: "hidden", marginBottom: 12 }}>
              <FixtureIso kind={f.kind} />
              <div style={{ position: "absolute", top: 6, right: 6 }}>
                <span className="siq-pill draft" style={{ background: "var(--bg-elev)", borderColor: "var(--border)", fontSize: 10.5 }}>
                  <span style={{ color: "var(--text-faint)" }}>used by</span> {f.usage}
                </span>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{f.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)" }} className="siq-mono">{f.h}"H × {f.w}"W × {f.d}"D</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {f.shelves ? `${f.shelves} shelves` :
                 f.slots ? `${f.slots} slots` :
                 f.tiers ? `${f.tiers} tiers` :
                 f.flavors ? `${f.flavors} flavors` :
                 "—"}
              </div>
              <button className="siq-btn ghost sm" style={{ fontSize: 11.5, height: 22, padding: "0 8px" }}>Use <Icon name="chevronRight" size={11} /></button>
            </div>
          </div>
        ))}
        {/* Custom fixture card */}
        <div className="siq-card" style={{
          padding: 14, cursor: "pointer", borderStyle: "dashed",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: 200, color: "var(--text-muted)",
        }}>
          <Icon name="plus" size={22} />
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: "var(--text)" }}>Build custom fixture</div>
          <div style={{ fontSize: 11.5, marginTop: 2 }}>Start from blank or template</div>
        </div>
      </div>
    </div>
  );
}

/* Stylized isometric SVG illustrations per fixture kind */
function FixtureIso({ kind }) {
  const center = { x: 120, y: 50 };
  if (kind === "cooler") return <IsoCooler doors={5} />;
  if (kind === "gantry") return <IsoGantry />;
  if (kind === "grill") return <IsoGrill />;
  if (kind === "slushie") return <IsoSlushie />;
  if (kind === "coffee") return <IsoCoffee />;
  if (kind === "endcap") return <IsoEndcap />;
  if (kind === "gondola") return <IsoGondola />;
  if (kind === "counter") return <IsoCounter />;
  if (kind === "bin") return <IsoBin />;
  if (kind === "freezer") return <IsoFreezer />;
  if (kind === "hot") return <IsoHotcase />;
  if (kind === "bakery") return <IsoBakery />;
  return null;
}

// Common iso helpers
const ANG = Math.PI / 6;
const cos30 = Math.cos(ANG), sin30 = Math.sin(ANG);
function iso(x, y, z) { return [x * cos30 + z * cos30 * 0.6, -y + x * sin30 - z * sin30 * 0.6]; }
function p(...pts) { return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "); }

function IsoFrame({ children, w = 240, h = 100, off = [120, 80] }) {
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${off[0]}, ${off[1]})`}>{children}</g>
    </svg>
  );
}

function IsoCooler({ doors = 5 }) {
  const doorW = 16, height = 60, depth = 18;
  return (
    <IsoFrame off={[40, 78]}>
      {/* base */}
      {Array.from({ length: doors }).map((_, i) => {
        const x = i * doorW;
        const a = iso(x, 0, 0), b = iso(x + doorW, 0, 0), c = iso(x + doorW, height, 0), d = iso(x, height, 0);
        const eA = iso(x, 0, depth), eB = iso(x + doorW, 0, depth), eC = iso(x + doorW, height, depth), eD = iso(x, height, depth);
        return (
          <g key={i}>
            {/* back wall */}
            <polygon points={p(eA, eB, eC, eD)} fill="#cbd5e1" opacity="0.3" />
            {/* glass door */}
            <polygon points={p(a, b, c, d)} fill="rgba(186,230,253,0.25)" stroke="#475569" strokeWidth="0.6" />
            {/* shelves */}
            {Array.from({ length: 4 }).map((_, si) => {
              const y = (si + 1) * height / 5;
              const sA = iso(x, y, 0), sB = iso(x + doorW, y, 0), sC = iso(x + doorW, y, depth), sD = iso(x, y, depth);
              return <polygon key={si} points={p(sA, sB, sC, sD)} fill="#94a3b8" opacity="0.5" />;
            })}
          </g>
        );
      })}
      {/* top */}
      {(() => {
        const tA = iso(0, height, 0), tB = iso(doorW * doors, height, 0), tC = iso(doorW * doors, height, depth), tD = iso(0, height, depth);
        return <polygon points={p(tA, tB, tC, tD)} fill="#475569"/>;
      })()}
    </IsoFrame>
  );
}

function IsoGantry() {
  const w = 100, h = 60, d = 14;
  return (
    <IsoFrame off={[40, 78]}>
      {(() => {
        const a = iso(0, 0, 0), b = iso(w, 0, 0), c = iso(w, h, 0), e = iso(0, h, 0);
        const eA = iso(0, 0, d), eB = iso(w, 0, d), eC = iso(w, h, d), eD = iso(0, h, d);
        return (
          <g>
            <polygon points={p(eA, eB, eC, eD)} fill="#78350f" opacity="0.55" />
            <polygon points={p(a, b, c, e)} fill="#92400e" opacity="0.9" />
            {/* tier dividers */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = (i + 0.5) * h / 6;
              const sA = iso(0, y, 0), sB = iso(w, y, 0);
              return <line key={i} x1={sA[0]} y1={sA[1]} x2={sB[0]} y2={sB[1]} stroke="#fbbf24" strokeWidth="1" opacity="0.7" />;
            })}
            <polygon points={p(iso(0, h, 0), iso(w, h, 0), iso(w, h, d), iso(0, h, d))} fill="#451a03"/>
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoGrill() {
  return (
    <IsoFrame off={[60, 60]}>
      {(() => {
        const w = 80, h = 14, d = 30;
        const a = iso(0, 0, 0), b = iso(w, 0, 0), c = iso(w, h, 0), e = iso(0, h, 0);
        const top = [iso(0, h, 0), iso(w, h, 0), iso(w, h, d), iso(0, h, d)];
        return (
          <g>
            <polygon points={p(a, b, c, e)} fill="#0c0a09"/>
            <polygon points={p(...top)} fill="#1c1917" stroke="#404040" strokeWidth="0.5"/>
            {/* rollers */}
            {Array.from({ length: 4 }).map((_, i) => {
              const dz = (i + 0.5) * d / 4;
              const ra = iso(2, h + 2, dz), rb = iso(w - 2, h + 2, dz);
              return <line key={i} x1={ra[0]} y1={ra[1]} x2={rb[0]} y2={rb[1]} stroke="#737373" strokeWidth="2.5" strokeLinecap="round" />;
            })}
            {/* sausages */}
            {[6, 8, 11, 14, 17].map((zoff, i) => {
              const xa = 4 + i * 4, dz = (zoff % 4 === 0 ? 7 : 12);
              const sa = iso(xa, h + 4, dz), sb = iso(xa + 12, h + 4, dz);
              return <line key={i} x1={sa[0]} y1={sa[1]} x2={sb[0]} y2={sb[1]} stroke="#b45309" strokeWidth="3" strokeLinecap="round" />;
            })}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoSlushie() {
  return (
    <IsoFrame off={[60, 70]}>
      {(() => {
        // base
        const base = [iso(0, 0, 0), iso(70, 0, 0), iso(70, 14, 0), iso(0, 14, 0)];
        const baseE = [iso(0, 0, 20), iso(70, 0, 20), iso(70, 14, 20), iso(0, 14, 20)];
        const baseTop = [iso(0, 14, 0), iso(70, 14, 0), iso(70, 14, 20), iso(0, 14, 20)];
        return (
          <g>
            <polygon points={p(...baseE)} fill="#94a3b8" opacity="0.5" />
            <polygon points={p(...base)} fill="#cbd5e1" />
            <polygon points={p(...baseTop)} fill="#64748b" />
            {/* slushie barrels */}
            {[0, 1, 2, 3, 4, 5].map(i => {
              const colors = ["#ef4444", "#06b6d4", "#22c55e", "#a855f7", "#f59e0b", "#3b82f6"];
              const cx = 4 + (i % 3) * 22, cz = 4 + Math.floor(i / 3) * 12;
              const [px1, py1] = iso(cx, 14, cz);
              const [px2, py2] = iso(cx + 14, 14, cz);
              const [px3, py3] = iso(cx + 14, 14 + 24, cz);
              const [px4, py4] = iso(cx, 14 + 24, cz);
              return (
                <g key={i}>
                  <polygon points={`${px1},${py1} ${px2},${py2} ${px3},${py3} ${px4},${py4}`} fill={colors[i]} opacity="0.85" rx="2" />
                  <ellipse cx={(px1 + px2) / 2} cy={py1} rx="7" ry="2" fill={colors[i]} opacity="0.6"/>
                </g>
              );
            })}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoCoffee() {
  return (
    <IsoFrame off={[60, 75]}>
      {(() => {
        const w = 80, h = 40, d = 16;
        const base = [iso(0, 0, 0), iso(w, 0, 0), iso(w, h, 0), iso(0, h, 0)];
        const top  = [iso(0, h, 0), iso(w, h, 0), iso(w, h, d), iso(0, h, d)];
        return (
          <g>
            <polygon points={p(...base)} fill="#451a03" />
            <polygon points={p(...top)} fill="#292524" />
            {/* dispensers */}
            {[10, 25, 40, 55].map((x, i) => {
              const ca = iso(x, h + 4, 6), cb = iso(x + 8, h + 4, 6), cc = iso(x + 8, h + 26, 6), cd = iso(x, h + 26, 6);
              return (
                <g key={i}>
                  <polygon points={p(ca, cb, cc, cd)} fill="#78350f" stroke="#1c1917" strokeWidth="0.4" />
                  <circle cx={(ca[0] + cb[0]) / 2} cy={(cc[1] + ca[1]) / 2} r="2" fill="#fbbf24" />
                </g>
              );
            })}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoEndcap() {
  return (
    <IsoFrame off={[80, 78]}>
      {(() => {
        const w = 50, h = 70, d = 18;
        const back = [iso(0, 0, d), iso(w, 0, d), iso(w, h, d), iso(0, h, d)];
        const front = [iso(0, 0, 0), iso(w, 0, 0), iso(w, h, 0), iso(0, h, 0)];
        const right = [iso(w, 0, 0), iso(w, 0, d), iso(w, h, d), iso(w, h, 0)];
        return (
          <g>
            <polygon points={p(...back)} fill="#94a3b8" opacity="0.45" />
            <polygon points={p(...right)} fill="#475569" opacity="0.8" />
            <polygon points={p(...front)} fill="#cbd5e1" />
            {[1, 2, 3, 4].map(si => {
              const y = si * h / 5;
              const sA = iso(0, y, 0), sB = iso(w, y, 0);
              return <line key={si} x1={sA[0]} y1={sA[1]} x2={sB[0]} y2={sB[1]} stroke="#475569" strokeWidth="0.6" />;
            })}
            {/* product rows */}
            {[1, 2, 3, 4].map(si => Array.from({ length: 4 }).map((_, pi) => {
              const x1 = pi * 12 + 1.5, x2 = pi * 12 + 11;
              const y1 = (si - 1) * h / 5 + 2, y2 = si * h / 5 - 1;
              const colors = ["#0f766e", "#7c3aed", "#dc2626", "#1d4ed8"];
              return <polygon key={`${si}-${pi}`} points={p(iso(x1, y1, 0), iso(x2, y1, 0), iso(x2, y2, 0), iso(x1, y2, 0))} fill={colors[pi]} opacity="0.85" />;
            }))}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoGondola() {
  return (
    <IsoFrame off={[20, 78]}>
      {(() => {
        const w = 180, h = 60, d = 22;
        const back = [iso(0, 0, d), iso(w, 0, d), iso(w, h, d), iso(0, h, d)];
        const front = [iso(0, 0, 0), iso(w, 0, 0), iso(w, h, 0), iso(0, h, 0)];
        return (
          <g>
            <polygon points={p(...back)} fill="#94a3b8" opacity="0.4" />
            <polygon points={p(...front)} fill="#e2e8f0" />
            {[1, 2, 3, 4, 5].map(si => {
              const y = si * h / 6;
              const sA = iso(0, y, 0), sB = iso(w, y, 0);
              return <line key={si} x1={sA[0]} y1={sA[1]} x2={sB[0]} y2={sB[1]} stroke="#64748b" strokeWidth="0.5" />;
            })}
            {[0, 1, 2, 3, 4].map(si => {
              return Array.from({ length: 14 }).map((_, pi) => {
                const colors = ["#0f766e", "#1d4ed8", "#dc2626", "#ea580c", "#a16207", "#7c3aed", "#15803d"];
                const cx = pi * 12 + 1;
                const y1 = si * h / 6 + 1.5, y2 = (si + 1) * h / 6 - 1;
                return <polygon key={`${si}-${pi}`} points={p(iso(cx, y1, 0), iso(cx + 10, y1, 0), iso(cx + 10, y2, 0), iso(cx, y2, 0))} fill={colors[(si + pi) % colors.length]} opacity="0.8" />;
              });
            })}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoCounter() {
  return (
    <IsoFrame off={[40, 76]}>
      {(() => {
        const w = 130, h = 22, d = 22;
        const front = [iso(0, 0, 0), iso(w, 0, 0), iso(w, h, 0), iso(0, h, 0)];
        const top = [iso(0, h, 0), iso(w, h, 0), iso(w, h, d), iso(0, h, d)];
        return (
          <g>
            <polygon points={p(...front)} fill="#1c1917" />
            <polygon points={p(...top)} fill="#292524" />
            {/* mini items */}
            {Array.from({ length: 8 }).map((_, i) => {
              const x = 6 + i * 14, dz = (i % 2) * 8 + 4;
              const ca = iso(x, h + 1, dz), cb = iso(x + 10, h + 1, dz), cc = iso(x + 10, h + 8, dz), cd = iso(x, h + 8, dz);
              const colors = ["#dc2626", "#fbbf24", "#0f766e", "#1d4ed8"];
              return <polygon key={i} points={p(ca, cb, cc, cd)} fill={colors[i % 4]} opacity="0.9" />;
            })}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoBin() {
  return (
    <IsoFrame off={[90, 70]}>
      {(() => {
        const w = 36, h = 36, d = 36;
        const front = [iso(0, 0, 0), iso(w, 0, 0), iso(w, h, 0), iso(0, h, 0)];
        const right = [iso(w, 0, 0), iso(w, 0, d), iso(w, h, d), iso(w, h, 0)];
        const top   = [iso(0, h, 0), iso(w, h, 0), iso(w, h, d), iso(0, h, d)];
        return (
          <g>
            <polygon points={p(...right)} fill="#0c4a6e" />
            <polygon points={p(...front)} fill="#0e7490" />
            <polygon points={p(...top)} fill="#06b6d4" opacity="0.55" />
            {/* contents */}
            {Array.from({ length: 8 }).map((_, i) => {
              const cx = 6 + (i % 4) * 7, cz = 8 + Math.floor(i / 4) * 10;
              const dot = iso(cx, h + 1, cz);
              return <circle key={i} cx={dot[0]} cy={dot[1]} r="3" fill="#fbbf24" />;
            })}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoFreezer() {
  return (
    <IsoFrame off={[80, 78]}>
      {(() => {
        const w = 70, h = 50, d = 22;
        const front = [iso(0, 0, 0), iso(w, 0, 0), iso(w, h, 0), iso(0, h, 0)];
        return (
          <g>
            <polygon points={p(iso(0, h, 0), iso(w, h, 0), iso(w, h, d), iso(0, h, d))} fill="#0c4a6e" />
            <polygon points={p(...front)} fill="rgba(186,230,253,0.35)" stroke="#475569" strokeWidth="0.7" />
            <line x1={iso(w / 2, 0, 0)[0]} y1={iso(w / 2, 0, 0)[1]} x2={iso(w / 2, h, 0)[0]} y2={iso(w / 2, h, 0)[1]} stroke="#475569"/>
            {/* ice text label */}
            <text x={iso(w / 2, h / 2, 0)[0] - 7} y={iso(w / 2, h / 2, 0)[1] + 3} fontSize="9" fontWeight="700" fill="#0c4a6e" opacity="0.7">ICE</text>
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoHotcase() {
  return (
    <IsoFrame off={[60, 76]}>
      {(() => {
        const w = 80, h = 46, d = 18;
        const front = [iso(0, 0, 0), iso(w, 0, 0), iso(w, h, 0), iso(0, h, 0)];
        return (
          <g>
            <polygon points={p(...front)} fill="rgba(254, 243, 199, 0.5)" stroke="#92400e" />
            {[1, 2, 3].map(si => {
              const y = si * h / 4;
              return <line key={si} x1={iso(0, y, 0)[0]} y1={iso(0, y, 0)[1]} x2={iso(w, y, 0)[0]} y2={iso(w, y, 0)[1]} stroke="#b45309" strokeWidth="0.6" />;
            })}
            {/* food blobs */}
            {Array.from({ length: 12 }).map((_, i) => {
              const si = Math.floor(i / 4), pi = i % 4;
              const cx = 8 + pi * 18, cy = si * h / 4 + 6;
              const blob = iso(cx, cy, 0);
              const colors = ["#ea580c", "#fbbf24", "#92400e"];
              return <ellipse key={i} cx={blob[0]} cy={blob[1]} rx="6" ry="3" fill={colors[i % 3]} opacity="0.85" />;
            })}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

function IsoBakery() {
  return (
    <IsoFrame off={[60, 78]}>
      {(() => {
        const w = 90, h = 36, d = 22;
        const front = [iso(0, 0, 0), iso(w, 0, 0), iso(w, h, 0), iso(0, h, 0)];
        return (
          <g>
            <polygon points={p(iso(0, h, 0), iso(w, h, 0), iso(w, h, d), iso(0, h, d))} fill="#fbbf24" opacity="0.7"/>
            <polygon points={p(...front)} fill="rgba(254, 243, 199, 0.4)" stroke="#92400e" />
            {[1, 2].map(si => {
              const y = si * h / 3;
              return <line key={si} x1={iso(0, y, 0)[0]} y1={iso(0, y, 0)[1]} x2={iso(w, y, 0)[0]} y2={iso(w, y, 0)[1]} stroke="#92400e" strokeWidth="0.6" />;
            })}
            {Array.from({ length: 9 }).map((_, i) => {
              const si = Math.floor(i / 3), pi = i % 3;
              const cx = 12 + pi * 26, cy = si * h / 3 + 4;
              return <circle key={i} cx={iso(cx, cy, 0)[0]} cy={iso(cx, cy, 0)[1]} r="5" fill="#d97706" opacity="0.85" />;
            })}
          </g>
        );
      })()}
    </IsoFrame>
  );
}

Object.assign(window, { Fixtures });
