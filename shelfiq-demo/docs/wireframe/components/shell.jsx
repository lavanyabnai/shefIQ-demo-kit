/* App shell: sidebar, topbar, command palette, toasts, theme. */

const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

// ---------- Toast system ----------
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

function ToastHost({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, kind: opts.kind || "success", title: opts.title }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.duration || 3000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="siq-toasts">
        {toasts.map(t => (
          <div key={t.id} className={`siq-toast ${t.kind}`}>
            <div style={{ marginTop: 2, color: t.kind === "error" ? "var(--danger)" : t.kind === "warn" ? "var(--warning)" : "var(--primary)" }}>
              <Icon name={t.kind === "error" ? "alert" : t.kind === "warn" ? "alert" : "successCheck"} size={16} />
            </div>
            <div style={{ flex: 1 }}>
              {t.title && <div style={{ fontWeight: 600, fontSize: 13 }}>{t.title}</div>}
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.msg}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ---------- Theme ----------
function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("siq-theme") || "light"; } catch { return "light"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("siq-theme", theme); } catch {}
  }, [theme]);
  return [theme, () => setTheme(t => t === "light" ? "dark" : "light")];
}

// ---------- Logo ----------
function ShelfIQLogo({ collapsed }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 7,
        background: "linear-gradient(135deg, var(--primary) 0%, #0c5e58 100%)",
        position: "relative", display: "grid", placeItems: "center",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 1px 0 rgba(15,23,42,0.04)",
        flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4"  width="18" height="3.5" rx="0.5" fill="white" opacity="0.95"/>
          <rect x="3" y="10" width="13" height="3.5" rx="0.5" fill="white" opacity="0.7"/>
          <rect x="3" y="16" width="18" height="3.5" rx="0.5" fill="white" opacity="0.95"/>
          <rect x="17.5" y="10" width="3.5" height="3.5" rx="0.5" fill="#2dd4bf"/>
        </svg>
      </div>
      {!collapsed && (
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.2 }}>ShelfIQ</div>
          <div style={{ fontSize: 10.5, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.6 }}>by BlueNorth</div>
        </div>
      )}
    </div>
  );
}

// ---------- Sidebar ----------
const NAV = [
  { id: "dashboard",  icon: "dashboard",  label: "Dashboard" },
  { id: "planograms", icon: "planograms", label: "Planograms", badge: 12 },
  { id: "stores",     icon: "stores",     label: "Stores" },
  { id: "products",   icon: "products",   label: "Products" },
  { id: "fixtures",   icon: "fixtures",   label: "Fixtures" },
  { id: "clusters",   icon: "clusters",   label: "Clusters" },
  { id: "reports",    icon: "reports",    label: "Reports" },
  { id: "settings",   icon: "settings",   label: "Settings" },
];

function Sidebar({ active, onNav, collapsed, onToggleCollapse }) {
  return (
    <aside className={`siq-side ${collapsed ? "collapsed" : ""}`}>
      <div style={{ padding: "16px 14px 8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, boxSizing: "border-box" }}>
        <ShelfIQLogo collapsed={collapsed} />
        {!collapsed && (
          <button className="siq-btn ghost icon sm" onClick={onToggleCollapse} title="Collapse sidebar" aria-label="Collapse">
            <Icon name="chevronsLeft" size={14} />
          </button>
        )}
      </div>

      <div style={{ padding: "6px 8px", flex: 1, overflowY: "auto" }}>
        {NAV.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", gap: 11,
                padding: collapsed ? "9px 0" : "8px 10px",
                justifyContent: collapsed ? "center" : "flex-start",
                marginBottom: 2,
                border: "none",
                background: isActive ? "var(--primary-soft-2)" : "transparent",
                color: isActive ? "var(--primary-text)" : "var(--text-muted)",
                borderRadius: 6,
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-sunk)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              {isActive && !collapsed && (
                <span style={{ position: "absolute", left: 0, top: 6, bottom: 6, width: 2, background: "var(--primary)", borderRadius: 2 }} />
              )}
              <Icon name={item.icon} size={17} style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }} />
              {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span style={{ fontSize: 10.5, fontWeight: 600, padding: "1px 6px", borderRadius: 999, background: "var(--bg-sunk)", color: "var(--text-muted)" }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid var(--border)", padding: collapsed ? "10px 0" : "10px 12px", display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
        <Avatar name="Shrikanth K." size={collapsed ? 28 : 32} />
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0, lineHeight: 1.15 }}>
            <div className="siq-truncate" style={{ fontSize: 13, fontWeight: 600 }}>Shrikanth K.</div>
            <div className="siq-truncate" style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Quikstop Inc. · Admin</div>
          </div>
        )}
        {!collapsed && (
          <button className="siq-btn ghost icon sm" title="Account menu"><Icon name="more" size={14} /></button>
        )}
      </div>

      {collapsed && (
        <button
          className="siq-btn ghost icon"
          style={{ position: "absolute", bottom: 70, left: "50%", transform: "translateX(-50%)" }}
          onClick={onToggleCollapse}
          title="Expand"
        >
          <Icon name="chevronRight" size={14} />
        </button>
      )}
    </aside>
  );
}

function Avatar({ name, size = 28, color }) {
  const initials = name.split(" ").map(p => p[0]).slice(0, 2).join("");
  const hue = name.charCodeAt(0) * 7 % 360;
  const bg = color || `oklch(0.62 0.08 ${hue})`;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: "white",
      display: "grid", placeItems: "center",
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
      letterSpacing: 0.2,
    }}>
      {initials}
    </div>
  );
}

// ---------- Topbar ----------
function Topbar({ breadcrumb, theme, onToggleTheme, onOpenPalette, banner, onBanner, notifOpen, setNotifOpen }) {
  return (
    <div className="siq-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
        {breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            <span style={{ fontSize: 13.5, fontWeight: i === breadcrumb.length - 1 ? 600 : 500, color: i === breadcrumb.length - 1 ? "var(--text)" : "var(--text-muted)" }}>{b}</span>
            {i < breadcrumb.length - 1 && <Icon name="chevronRight" size={14} style={{ color: "var(--text-faint)" }} />}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={onOpenPalette}
        className="siq-btn"
        style={{ width: 280, justifyContent: "flex-start", gap: 8, color: "var(--text-faint)", fontSize: 12.5 }}
      >
        <Icon name="search" size={14} />
        <span style={{ flex: 1, textAlign: "left" }}>Search planograms, SKUs, stores…</span>
        <span style={{ display: "flex", gap: 2 }}>
          <span className="siq-kbd">⌘</span><span className="siq-kbd">K</span>
        </span>
      </button>

      <BannerSelector banner={banner} onBanner={onBanner} />

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button className="siq-btn ghost icon" onClick={onToggleTheme} title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
          <Icon name={theme === "light" ? "moon" : "sun"} size={16} />
        </button>
        <div style={{ position: "relative" }}>
          <button className="siq-btn ghost icon" onClick={() => setNotifOpen(v => !v)} title="Notifications">
            <Icon name="bell" size={16} />
            <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: 999, background: "var(--danger)", color: "white", fontSize: 9.5, fontWeight: 700, display: "grid", placeItems: "center", border: "2px solid var(--bg-elev)" }}>3</span>
          </button>
          {notifOpen && <NotifPopover onClose={() => setNotifOpen(false)} />}
        </div>
        <button className="siq-btn ghost" style={{ padding: "0 4px 0 4px", gap: 6 }}>
          <Avatar name="Shrikanth K." size={26} />
          <Icon name="chevronDown" size={12} style={{ color: "var(--text-faint)" }} />
        </button>
      </div>
    </div>
  );
}

function BannerSelector({ banner, onBanner }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const options = ["All banners", "Quikstop Core", "Quikstop Express", "Quikstop Fuel"];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button className="siq-btn" onClick={() => setOpen(v => !v)} style={{ minWidth: 170, justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--primary)" }} />
          <span>{banner}</span>
        </span>
        <Icon name="chevronDown" size={12} style={{ color: "var(--text-faint)" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, width: 200, background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 6, boxShadow: "var(--shadow-md)", padding: 4, zIndex: 30 }}>
          {options.map(o => (
            <button key={o} onClick={() => { onBanner(o); setOpen(false); }} className="siq-btn ghost" style={{ width: "100%", justifyContent: "space-between", height: 30 }}>
              <span>{o}</span>
              {o === banner && <Icon name="check" size={14} style={{ color: "var(--primary)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotifPopover({ onClose }) {
  const items = [
    { icon: "alert",  color: "var(--danger)",  title: "Store #1247 deviation detected",   sub: "Tobacco Gantry – 3 SKUs missing facings",     ago: "3h ago" },
    { icon: "info",   color: "var(--info)",    title: "Coca-Cola submitted a vendor POG", sub: "Awaiting your review — Cluster B",            ago: "1h ago" },
    { icon: "successCheck", color: "var(--success)", title: "Energy Cooler v4.2 approved", sub: "Approved by Maria Chen for Cluster B",       ago: "12m ago" },
  ];
  return (
    <div style={{ position: "absolute", top: "calc(100% + 6px)", right: -8, width: 360, background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "var(--shadow-lg)", zIndex: 40 }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>Notifications</div>
        <button className="siq-btn ghost sm" style={{ fontSize: 11.5 }}>Mark all read</button>
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: "10px 14px", display: "flex", gap: 10, borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-sunk)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-sunk)", color: it.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Icon name={it.icon} size={15} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{it.sub}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{it.ago}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: 10, borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <button className="siq-btn ghost sm" onClick={onClose}>View all activity</button>
      </div>
    </div>
  );
}

// ---------- Command Palette ----------
function CommandPalette({ open, onClose, onNav, onToast }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  const all = useMemo(() => ([
    { group: "Recent",  label: "Open Beer Cooler – 5 Door v4.2",    icon: "planograms", onPick: () => onNav("editor") },
    { group: "Recent",  label: "Compare v4.1 → v4.2 (Beer Cooler)", icon: "compare",    onPick: () => onNav("compare") },
    { group: "Recent",  label: "Review pending vendor planograms",  icon: "review",     onPick: () => { onNav("planograms"); onToast("Showing pending vendor reviews"); } },
    { group: "Go to",   label: "Dashboard",  icon: "dashboard",  onPick: () => onNav("dashboard") },
    { group: "Go to",   label: "Planograms", icon: "planograms", onPick: () => onNav("planograms") },
    { group: "Go to",   label: "Stores",     icon: "stores",     onPick: () => onNav("stores") },
    { group: "Go to",   label: "Products",   icon: "products",   onPick: () => onNav("products") },
    { group: "Go to",   label: "Fixtures",   icon: "fixtures",   onPick: () => onNav("fixtures") },
    { group: "Go to",   label: "Reports",    icon: "reports",    onPick: () => onNav("reports") },
    { group: "Actions", label: "New planogram",            icon: "plus",     onPick: () => { onNav("editor"); onToast("New draft created", { title: "Planogram"}); } },
    { group: "Actions", label: "Import .psa file",         icon: "upload",   onPick: () => onToast("PSA import queued") },
    { group: "Actions", label: "Export current view",      icon: "download", onPick: () => onToast("Export started") },
    { group: "Actions", label: "Submit for review",        icon: "send",     onPick: () => onToast("Submitted for review", { title: "Sent" }) },
    { group: "SKUs",    label: "Red Bull 8.4 oz",          icon: "package",  onPick: () => onNav("editor") },
    { group: "SKUs",    label: "Monster Energy 16 oz",     icon: "package",  onPick: () => onNav("editor") },
    { group: "Stores",  label: "Store #1247 — Austin, TX", icon: "store",    onPick: () => onNav("stores") },
    { group: "Stores",  label: "Store #0312 — San Francisco, CA", icon: "store", onPick: () => onNav("stores") },
  ]), [onNav, onToast]);

  const filtered = useMemo(() => {
    const Q = q.trim().toLowerCase();
    if (!Q) return all;
    return all.filter(it => it.label.toLowerCase().includes(Q) || it.group.toLowerCase().includes(Q));
  }, [q, all]);

  const grouped = useMemo(() => {
    const m = new Map();
    for (const it of filtered) {
      if (!m.has(it.group)) m.set(it.group, []);
      m.get(it.group).push(it);
    }
    return [...m.entries()];
  }, [filtered]);

  if (!open) return null;
  return (
    <div className="siq-overlay" onMouseDown={onClose} style={{ paddingTop: "12vh" }}>
      <div
        onMouseDown={e => e.stopPropagation()}
        style={{
          width: 560, background: "var(--bg-elev)", border: "1px solid var(--border)",
          borderRadius: 10, boxShadow: "var(--shadow-lg)", overflow: "hidden",
          animation: "siq-pop 0.16s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
          <Icon name="search" size={16} style={{ color: "var(--text-faint)" }} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search planograms, SKUs, stores, actions…"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "var(--text)", fontSize: 14 }}
          />
          <span className="siq-kbd">esc</span>
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto", padding: 6 }}>
          {grouped.length === 0 && (
            <div style={{ padding: 30, textAlign: "center", color: "var(--text-faint)", fontSize: 13 }}>No results for "{q}"</div>
          )}
          {grouped.map(([group, items]) => (
            <div key={group} style={{ marginBottom: 4 }}>
              <div style={{ padding: "8px 12px 4px", fontSize: 10.5, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.6 }}>{group}</div>
              {items.map((it, i) => (
                <button key={i} onClick={() => { it.onPick(); onClose(); }} className="siq-btn ghost" style={{ width: "100%", justifyContent: "flex-start", height: 34, padding: "0 10px", gap: 10 }}>
                  <Icon name={it.icon} size={15} style={{ color: "var(--text-muted)" }} />
                  <span style={{ flex: 1, textAlign: "left" }}>{it.label}</span>
                  <Icon name="arrowUpRight" size={12} style={{ color: "var(--text-faint)" }} />
                </button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border)", display: "flex", gap: 14, fontSize: 11, color: "var(--text-muted)", background: "var(--bg-sunk)" }}>
          <span><span className="siq-kbd">↑</span> <span className="siq-kbd">↓</span> Navigate</span>
          <span><span className="siq-kbd">↵</span> Open</span>
          <span style={{ marginLeft: "auto" }}>Powered by ShelfIQ Spotlight</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Modal (generic) ----------
function Modal({ open, onClose, title, subtitle, width = 560, children, footer }) {
  if (!open) return null;
  return (
    <div className="siq-overlay" onMouseDown={onClose}>
      <div
        onMouseDown={e => e.stopPropagation()}
        style={{
          width, maxWidth: "92vw",
          background: "var(--bg-elev)", border: "1px solid var(--border)",
          borderRadius: 10, boxShadow: "var(--shadow-lg)",
          animation: "siq-pop 0.18s ease-out",
          display: "flex", flexDirection: "column",
          maxHeight: "82vh",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button className="siq-btn ghost icon sm" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>
        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 8, background: "var(--bg-sunk)" }}>{footer}</div>}
      </div>
    </div>
  );
}

Object.assign(window, { ToastHost, useToast, useTheme, Sidebar, Topbar, CommandPalette, Modal, Avatar });
