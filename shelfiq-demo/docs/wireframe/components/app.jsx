/* Main App — wires shell + screens together. */

function App() {
  const [route, setRoute] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [banner, setBanner] = useState("All banners");
  const [notifOpen, setNotifOpen] = useState(false);
  const [editorPogId, setEditorPogId] = useState(null);

  // Cmd+K
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(v => !v); }
      if (e.key === "Escape") { setPaletteOpen(false); setNotifOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const breadcrumb = useMemo(() => {
    if (route === "dashboard")   return ["ShelfIQ", "Dashboard"];
    if (route === "planograms")  return ["ShelfIQ", "Planograms"];
    if (route === "editor")      return ["ShelfIQ", "Planograms", "Beer Cooler – 5 Door – Premium Cluster"];
    if (route === "compare")     return ["ShelfIQ", "Planograms", "Compare versions"];
    if (route === "stores")      return ["ShelfIQ", "Stores"];
    if (route === "products")    return ["ShelfIQ", "Products"];
    if (route === "fixtures")    return ["ShelfIQ", "Fixture library"];
    if (route === "clusters")    return ["ShelfIQ", "Clusters"];
    if (route === "reports")     return ["ShelfIQ", "Reports"];
    if (route === "settings")    return ["ShelfIQ", "Settings"];
    return ["ShelfIQ"];
  }, [route]);

  const sidebarActive = useMemo(() => {
    if (route === "editor" || route === "compare") return "planograms";
    return route;
  }, [route]);

  return (
    <ToastHost>
      <div className="siq-shell">
        <Sidebar
          active={sidebarActive}
          onNav={(id) => { setRoute(id); }}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(v => !v)}
        />
        <div className="siq-main">
          <Topbar
            breadcrumb={breadcrumb}
            theme={theme}
            onToggleTheme={toggleTheme}
            onOpenPalette={() => setPaletteOpen(true)}
            banner={banner}
            onBanner={setBanner}
            notifOpen={notifOpen}
            setNotifOpen={setNotifOpen}
          />
          <div className="siq-content" style={{ flex: 1, minWidth: 0 }}>
            <RouteContent
              route={route}
              onNav={setRoute}
              onOpenEditor={(id) => { setEditorPogId(id); setRoute("editor"); }}
              onCompare={() => setRoute("compare")}
              onBackFromEditor={() => setRoute("planograms")}
              onBackFromCompare={() => setRoute("editor")}
              editorPogId={editorPogId}
            />
          </div>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNav={(id) => setRoute(id)}
        onToast={() => {}}
      />
    </ToastHost>
  );
}

function RouteContent({ route, onNav, onOpenEditor, onCompare, onBackFromEditor, onBackFromCompare, editorPogId }) {
  const pog = useMemo(() => PLANOGRAMS.find(p => p.id === editorPogId), [editorPogId]);
  if (route === "dashboard")   return <Dashboard onNav={onNav} />;
  if (route === "planograms")  return <Planograms onOpenEditor={onOpenEditor} onNewPlanogram={() => onNav("editor")} />;
  if (route === "editor")      return <Editor onBack={onBackFromEditor} onCompare={onCompare} planogramName={pog?.baseName} />;
  if (route === "compare")     return <Compare onBack={onBackFromCompare} />;
  if (route === "stores")      return <Stores />;
  if (route === "products")    return <Products />;
  if (route === "fixtures")    return <Fixtures />;
  if (route === "reports")     return <Reports />;
  if (route === "clusters")    return <Placeholder title="Clusters" desc="Define and manage store clusters" icon="clusters" />;
  if (route === "settings")    return <Placeholder title="Settings" desc="Tenant, integrations, user management" icon="settings" />;
  return null;
}

function Placeholder({ title, desc, icon }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>{title}</h1>
        <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>{desc}</div>
      </div>
      <div className="siq-card" style={{ padding: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, color: "var(--text-muted)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, background: "var(--bg-sunk)", display: "grid", placeItems: "center" }}>
          <Icon name={icon} size={28} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{title} coming soon</div>
        <div style={{ fontSize: 13, maxWidth: 380, textAlign: "center" }}>
          This section is part of ShelfIQ's roadmap. The clickable demo focuses on the planogram editor, list, stores, products, fixtures, version compare, and reports.
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
