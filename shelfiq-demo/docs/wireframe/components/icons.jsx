/* Minimal lucide-style line icons. Stroke 1.75, currentColor. */
const Icon = ({ name, size = 16, strokeWidth = 1.75, className = "", style = {}, ...rest }) => {
  const P = ICONS[name];
  if (!P) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      {P}
    </svg>
  );
};

const ICONS = {
  // chrome
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 6 3 6 3 8H3c0-2 3-2 3-8Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  chevronRight: <path d="m9 6 6 6-6 6"/>,
  chevronLeft: <path d="m15 6-6 6 6 6"/>,
  chevronUp: <path d="m6 15 6-6 6 6"/>,
  chevronsLeft: <><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  x: <path d="M18 6 6 18M6 6l12 12"/>,
  check: <path d="M5 12.5 10 17 19 7"/>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  minus: <path d="M5 12h14"/>,
  filter: <path d="M3 5h18l-7 9v6l-4-2v-4Z"/>,
  download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
  upload: <><path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/></>,

  // sidebar nav
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
  planograms: <><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 10h18M3 16h18M9 4v16M15 4v16"/></>,
  stores: <><path d="M3 9 5 4h14l2 5"/><path d="M3 9v11h18V9"/><path d="M3 9h18"/><path d="M7 9v3a2 2 0 0 1-4 0V9M11 9v3a2 2 0 0 1-4 0V9M15 9v3a2 2 0 0 1-4 0V9M19 9v3a2 2 0 0 1-4 0V9M21 9v3a2 2 0 0 1-2 0"/></>,
  products: <><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="m3 8 0 8 9 5 9-5V8"/><path d="M12 13v8"/></>,
  fixtures: <><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></>,
  clusters: <><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 6h8M8 18h8M6 8v8M18 8v8"/></>,
  reports: <><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M8 16V10M12 16v-4M16 16v-8"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.8a7 7 0 0 0-2.1-1.2l-.4-2.5h-4l-.4 2.5a7 7 0 0 0-2.1 1.2l-2.3-.8-2 3.4 2 1.5A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.5 2 3.4 2.3-.8a7 7 0 0 0 2.1 1.2l.4 2.5h4l.4-2.5a7 7 0 0 0 2.1-1.2l2.3.8 2-3.4-2-1.5A7 7 0 0 0 19 12Z"/></>,
  compare: <><path d="M12 3v18"/><path d="M5 7h4M5 11h4M5 15h4M15 9h4M15 13h4M15 17h4"/></>,

  // editor toolbar
  cursor: <><path d="m4 4 6 14 2-6 6-2Z"/></>,
  grid: <><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></>,
  magnet: <><path d="M4 13V6a4 4 0 0 1 8 0v7"/><path d="M12 13v-2"/><path d="M4 13v-2"/><path d="M4 13a4 4 0 0 0 8 0"/></>,
  ruler: <><path d="M2 14 14 2l8 8L10 22Z"/><path d="m6 10 1 1M9 7l2 2M12 4l1 1M9 13l1 1M12 10l2 2M15 7l1 1"/></>,
  zoomIn: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6M11 8v6"/></>,
  zoomOut: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8 11h6"/></>,
  undo: <><path d="M3 7h11a6 6 0 0 1 0 12H8"/><path d="m7 3-4 4 4 4"/></>,
  redo: <><path d="M21 7H10a6 6 0 0 0 0 12h6"/><path d="m17 3 4 4-4 4"/></>,
  fullscreen: <><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></>,
  cube: <><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="m3 8 0 8 9 5 9-5V8"/><path d="M12 13v8"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/></>,

  // misc
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="1.5"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
  arrowUp: <><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></>,
  arrowDown: <><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></>,
  arrowUpRight: <><path d="M7 17 17 7"/><path d="M8 7h9v9"/></>,
  externalLink: <><path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></>,
  alert: <><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.41 0Z"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></>,
  successCheck: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>,
  mapPin: <><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Z"/><circle cx="12" cy="9" r="3"/></>,
  pin: <><path d="m12 17 0 5"/><path d="M9 10V3h6v7l3 4H6Z"/></>,
  command: <path d="M9 6a3 3 0 1 0-3 3h3Zm0 0v12m0 0a3 3 0 1 1-3-3h3Zm0 0h6m0 0a3 3 0 1 1 3-3h-3Zm0 0V6m0 0a3 3 0 1 0 3 3h-3Z"/>,
  sparkles: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></>,
  flag: <><path d="M4 22V4"/><path d="M4 4h13l-2 4 2 4H4"/></>,
  trendingUp: <><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
  trendingDown: <><path d="m3 7 6 6 4-4 8 8"/><path d="M14 17h7v-7"/></>,
  store: <><path d="M3 9 5 4h14l2 5"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/><path d="M9 20v-5h6v5"/></>,
  package: <><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="m3 8 0 8 9 5 9-5V8"/><path d="M12 13v8"/><path d="M7.5 5.5l9 5"/></>,
  thermometer: <><path d="M14 14V5a2 2 0 0 0-4 0v9a4 4 0 1 0 4 0Z"/><circle cx="12" cy="17" r="1.5" fill="currentColor"/></>,
  shield: <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z"/>,
  refresh: <><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></>,
  sliders: <><path d="M3 6h12M19 6h2M3 12h6M13 12h8M3 18h16M21 18v0"/><circle cx="17" cy="6" r="1.5"/><circle cx="11" cy="12" r="1.5"/><circle cx="20" cy="18" r="1.5" fill="none"/></>,
  edit: <><path d="M4 20h4l11-11-4-4L4 16Z"/><path d="m13 6 4 4"/></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  star: <path d="m12 3 2.7 6 6.3.5-4.9 4.2 1.5 6.3L12 17l-5.6 3 1.5-6.3L3 9.5 9.3 9Z"/>,
  bookmark: <path d="M5 4v17l7-4 7 4V4Z"/>,
  send: <><path d="m22 2-11 11"/><path d="m22 2-7 20-4-9-9-4Z"/></>,
};

Object.assign(window, { Icon });
