/* Mock data for ShelfIQ — c-store planogram software */

// --- Static color palette for product tiles in the editor canvas ---
const BRAND_COLORS = {
  redbull: { fill: "#1d3673", stroke: "#0f1f4a", text: "#ffd200", label: "Red Bull" },
  monster: { fill: "#0a0a0a", stroke: "#1a1a1a", text: "#00e676", label: "Monster" },
  celsius: { fill: "#f1f5f9", stroke: "#cbd5e1", text: "#0f172a", label: "Celsius" },
  bang:    { fill: "#111827", stroke: "#1f2937", text: "#fde047", label: "Bang" },
  rockstar:{ fill: "#1e293b", stroke: "#0f172a", text: "#f59e0b", label: "Rockstar" },
  fivehour:{ fill: "#fbbf24", stroke: "#b45309", text: "#7c2d12", label: "5-Hour" },
  coke:    { fill: "#b91c1c", stroke: "#7f1d1d", text: "#fef2f2", label: "Coca-Cola" },
  cokezero:{ fill: "#171717", stroke: "#404040", text: "#fee2e2", label: "Coke Zero" },
  mtndew:  { fill: "#15803d", stroke: "#14532d", text: "#fef08a", label: "Mtn Dew" },
  drpepper:{ fill: "#7c1d6f", stroke: "#581053", text: "#fee2e2", label: "Dr Pepper" },
  pepsi:   { fill: "#1d4ed8", stroke: "#1e3a8a", text: "#f8fafc", label: "Pepsi" },
  gatorade:{ fill: "#ea580c", stroke: "#9a3412", text: "#fff7ed", label: "Gatorade" },
  powerade:{ fill: "#1e40af", stroke: "#1e3a8a", text: "#dbeafe", label: "Powerade" },
  bodyarmor:{fill: "#0c4a6e", stroke: "#082f49", text: "#e0f2fe", label: "BodyArmor" },
  vw:      { fill: "#fef3c7", stroke: "#d97706", text: "#78350f", label: "Vit Water" },
  snickers:{ fill: "#78350f", stroke: "#451a03", text: "#fde047", label: "Snickers" },
  mms:     { fill: "#a16207", stroke: "#713f12", text: "#fde047", label: "M&M's" },
  reeses:  { fill: "#ea580c", stroke: "#7c2d12", text: "#fef3c7", label: "Reese's" },
  lays:    { fill: "#fbbf24", stroke: "#a16207", text: "#7f1d1d", label: "Lay's" },
  doritos: { fill: "#c2410c", stroke: "#7c2d12", text: "#fef3c7", label: "Doritos" },
};

const SKU_LIBRARY = [
  { id: "sku-rb-84",   brand: "redbull",  name: "Red Bull Energy",      size: "8.4 oz", upc: "9002490100078", h: 6.2, w: 2.1, d: 2.1, cost: 1.85, retail: 3.49, recF: 4, cat: "Energy Drinks" },
  { id: "sku-mn-16",   brand: "monster",  name: "Monster Energy",       size: "16 oz",  upc: "0070847811169", h: 6.5, w: 2.5, d: 2.5, cost: 1.65, retail: 2.99, recF: 5, cat: "Energy Drinks" },
  { id: "sku-cl-12",   brand: "celsius",  name: "Celsius Sparkling",    size: "12 oz",  upc: "8896290181024", h: 5.5, w: 2.6, d: 2.6, cost: 1.45, retail: 2.79, recF: 3, cat: "Energy Drinks" },
  { id: "sku-bg-16",   brand: "bang",     name: "Bang Energy",          size: "16 oz",  upc: "0610764867247", h: 6.5, w: 2.6, d: 2.6, cost: 1.79, retail: 2.99, recF: 3, cat: "Energy Drinks" },
  { id: "sku-rs-16",   brand: "rockstar", name: "Rockstar Original",    size: "16 oz",  upc: "0815154021018", h: 6.5, w: 2.6, d: 2.6, cost: 1.55, retail: 2.79, recF: 3, cat: "Energy Drinks" },
  { id: "sku-5h-193",  brand: "fivehour", name: "5-Hour Energy",        size: "1.93 oz",upc: "0719410010102", h: 4.0, w: 1.4, d: 1.4, cost: 1.95, retail: 3.49, recF: 6, cat: "Energy Drinks" },
  { id: "sku-ck-20",   brand: "coke",     name: "Coca-Cola Classic",    size: "20 oz",  upc: "0049000028928", h: 8.4, w: 2.6, d: 2.6, cost: 1.10, retail: 2.49, recF: 6, cat: "Cold Beverages" },
  { id: "sku-cz-20",   brand: "cokezero", name: "Coca-Cola Zero",       size: "20 oz",  upc: "0049000050103", h: 8.4, w: 2.6, d: 2.6, cost: 1.10, retail: 2.49, recF: 4, cat: "Cold Beverages" },
  { id: "sku-md-20",   brand: "mtndew",   name: "Mountain Dew",         size: "20 oz",  upc: "0012000001321", h: 8.4, w: 2.6, d: 2.6, cost: 1.05, retail: 2.49, recF: 4, cat: "Cold Beverages" },
  { id: "sku-dp-20",   brand: "drpepper", name: "Dr Pepper",            size: "20 oz",  upc: "0078000113402", h: 8.4, w: 2.6, d: 2.6, cost: 1.10, retail: 2.49, recF: 4, cat: "Cold Beverages" },
  { id: "sku-pp-20",   brand: "pepsi",    name: "Pepsi",                size: "20 oz",  upc: "0012000001017", h: 8.4, w: 2.6, d: 2.6, cost: 1.05, retail: 2.49, recF: 4, cat: "Cold Beverages" },
  { id: "sku-gt-28",   brand: "gatorade", name: "Gatorade Frost",       size: "28 oz",  upc: "0052000338119", h: 9.5, w: 3.1, d: 3.1, cost: 1.55, retail: 2.99, recF: 3, cat: "Sports Drinks" },
  { id: "sku-pw-28",   brand: "powerade", name: "Powerade Mountain",    size: "28 oz",  upc: "0049000027174", h: 9.5, w: 3.1, d: 3.1, cost: 1.49, retail: 2.79, recF: 3, cat: "Sports Drinks" },
  { id: "sku-ba-16",   brand: "bodyarmor",name: "BODYARMOR LYTE",       size: "16 oz",  upc: "0858176002317", h: 8.0, w: 2.7, d: 2.7, cost: 1.69, retail: 2.99, recF: 3, cat: "Sports Drinks" },
  { id: "sku-vw-20",   brand: "vw",       name: "Vitamin Water XXX",    size: "20 oz",  upc: "0786162001535", h: 9.5, w: 2.8, d: 2.8, cost: 1.59, retail: 2.79, recF: 3, cat: "Enhanced Water" },
  { id: "sku-sn-198",  brand: "snickers", name: "Snickers",             size: "1.86 oz",upc: "0040000001218", h: 1.5, w: 4.0, d: 0.8, cost: 0.85, retail: 1.99, recF: 8, cat: "Candy" },
  { id: "sku-mm-176",  brand: "mms",      name: "M&M's Peanut",         size: "1.74 oz",upc: "0040000004875", h: 2.0, w: 4.5, d: 0.7, cost: 0.85, retail: 1.99, recF: 8, cat: "Candy" },
  { id: "sku-re-15",   brand: "reeses",   name: "Reese's Cups (2pk)",   size: "1.5 oz", upc: "0034000002405", h: 1.0, w: 4.5, d: 1.0, cost: 0.79, retail: 1.79, recF: 10,cat: "Candy" },
  { id: "sku-ly-275",  brand: "lays",     name: "Lay's Classic",        size: "2.75 oz",upc: "0028400090728", h: 9.0, w: 7.0, d: 2.0, cost: 1.35, retail: 2.49, recF: 4, cat: "Salty Snacks" },
  { id: "sku-do-275",  brand: "doritos",  name: "Doritos Nacho Cheese", size: "2.75 oz",upc: "0028400090476", h: 9.0, w: 7.0, d: 2.0, cost: 1.35, retail: 2.49, recF: 4, cat: "Salty Snacks" },
];

// --- Planogram on the editor canvas: 5 doors × 5 shelves with assignments ---
// Each cell: { sku: id, facings: n }  or null for empty
const COOLER_LAYOUT = [
  // Door 1 — Coke products (brand block)
  [
    [{ sku: "sku-ck-20", f: 6 }],
    [{ sku: "sku-ck-20", f: 6 }],
    [{ sku: "sku-cz-20", f: 6 }],
    [{ sku: "sku-dp-20", f: 4 }, { sku: "sku-cz-20", f: 2 }],
    [{ sku: "sku-vw-20", f: 3 }, { sku: "sku-ba-16", f: 3 }],
  ],
  // Door 2 — Pepsi side
  [
    [{ sku: "sku-pp-20", f: 6 }],
    [{ sku: "sku-pp-20", f: 6 }],
    [{ sku: "sku-md-20", f: 6 }],
    [{ sku: "sku-md-20", f: 3 }, { sku: "sku-pp-20", f: 3 }],
    [{ sku: "sku-gt-28", f: 3 }, { sku: "sku-pw-28", f: 3 }],
  ],
  // Door 3 — Energy (premium eye level)
  [
    [{ sku: "sku-rb-84", f: 5 }, { sku: "sku-5h-193", f: 4 }],
    [{ sku: "sku-rb-84", f: 5 }, { sku: "sku-cl-12", f: 3 }],
    [{ sku: "sku-mn-16", f: 5 }],
    [{ sku: "sku-bg-16", f: 3 }, { sku: "sku-rs-16", f: 3 }],
    [{ sku: "sku-gt-28", f: 3 }, { sku: "sku-pw-28", f: 3 }],
  ],
  // Door 4 — Sports/hydration
  [
    [{ sku: "sku-gt-28", f: 3 }, { sku: "sku-pw-28", f: 3 }],
    [{ sku: "sku-gt-28", f: 3 }, { sku: "sku-pw-28", f: 3 }],
    [{ sku: "sku-ba-16", f: 4 }, { sku: "sku-vw-20", f: 3 }],
    [{ sku: "sku-vw-20", f: 6 }],
    null,
  ],
  // Door 5 — Mix / dump
  [
    [{ sku: "sku-cl-12", f: 3 }, { sku: "sku-rs-16", f: 3 }],
    [{ sku: "sku-md-20", f: 3 }, { sku: "sku-dp-20", f: 3 }],
    [{ sku: "sku-pp-20", f: 3 }, { sku: "sku-ck-20", f: 3 }],
    [{ sku: "sku-bg-16", f: 3 }, { sku: "sku-mn-16", f: 3 }],
    [{ sku: "sku-vw-20", f: 6 }],
  ],
];

// --- Planograms list rows ---
const OWNERS = [
  { name: "Maria Chen", initials: "MC", color: "#0f766e" },
  { name: "David Park", initials: "DP", color: "#7c3aed" },
  { name: "Sarah Kim", initials: "SK", color: "#b45309" },
  { name: "Marcus Johnson", initials: "MJ", color: "#1d4ed8" },
  { name: "Priya Patel", initials: "PP", color: "#be185d" },
  { name: "Carlos Rivera", initials: "CR", color: "#15803d" },
  { name: "Shrikanth K.", initials: "SH", color: "#0f766e" },
  { name: "Lena Brooks", initials: "LB", color: "#9d174d" },
];

const PLANOGRAMS = [
  ["Beer Cooler – 5 Door – Premium Cluster",            "v4.2",  "Beer & Wine",     "Quikstop Core",    "Premium Urban",  "live",    "2026-05-01", "3d ago",   "Maria Chen"],
  ["Energy Drinks – End Cap – Summer 2026",             "v2.0",  "Energy Drinks",   "All Banners",      "Cluster B",      "review",  "2026-06-01", "1d ago",   "David Park"],
  ["Tobacco Gantry – California Stores",                "v2.1",  "Tobacco",         "Quikstop Core",    "CA Regulated",   "live",    "2026-04-15", "2w ago",   "Sarah Kim"],
  ["Roller Grill Q3 Menu – Standard",                   "v1.0",  "Foodservice",     "All Banners",      "Standard",       "draft",   "2026-07-01", "1h ago",   "Shrikanth K."],
  ["Slushie Tower – 6 Flavor Summer Lineup",            "v3.1",  "Frozen Bev",      "Quikstop Core",    "Standard",       "live",    "2026-05-15", "5d ago",   "Priya Patel"],
  ["Candy 4ft – Front Checkout Impulse",                "v5.0",  "Candy",           "All Banners",      "Standard",       "live",    "2026-03-20", "1mo ago",  "Marcus Johnson"],
  ["Salty Snacks 16ft Gondola",                         "v3.2",  "Salty Snacks",    "Quikstop Core",    "Premium Urban",  "review",  "2026-06-10", "4h ago",   "Carlos Rivera"],
  ["Coffee Bar Station – Morning Daypart",              "v1.4",  "Coffee",          "Quikstop Express", "Express",        "live",    "2026-04-01", "3w ago",   "Lena Brooks"],
  ["Beer Cooler – 3 Door – Value Cluster",              "v2.3",  "Beer & Wine",     "Quikstop Core",    "Value Suburban", "live",    "2026-04-22", "2w ago",   "Maria Chen"],
  ["Tobacco Gantry – 6 Tier Standard",                  "v3.0",  "Tobacco",         "All Banners",      "Standard",       "review",  "2026-06-15", "6h ago",   "Sarah Kim"],
  ["Bakery Case – 3 Tier",                              "v1.1",  "Bakery",          "Quikstop Express", "Express",        "live",    "2026-03-15", "2mo ago",  "Lena Brooks"],
  ["Walk-In Cooler – 8 Door – Beer Premium",            "v4.0",  "Beer & Wine",     "Quikstop Core",    "Premium Urban",  "live",    "2026-04-29", "1w ago",   "Maria Chen"],
  ["Energy Drinks – Cooler Door – Cluster B v4.2",      "v4.2",  "Energy Drinks",   "Quikstop Core",    "Cluster B",      "approved","2026-06-01", "12m ago",  "Maria Chen"],
  ["Ice Merchandiser – Single Serve",                   "v1.0",  "Frozen",          "All Banners",      "Standard",       "draft",   "2026-07-15", "3h ago",   "Carlos Rivera"],
  ["Dump Bin – Promo Q2",                               "v2.0",  "Promo",           "All Banners",      "Standard",       "archived","2026-04-01", "1mo ago",  "Priya Patel"],
  ["Hot Food Case – 4 Shelf Lunch",                     "v1.3",  "Foodservice",     "Quikstop Core",    "Premium Urban",  "live",    "2026-05-08", "1w ago",   "Shrikanth K."],
  ["Dairy & Milk – 3 Door",                             "v2.1",  "Dairy",           "All Banners",      "Standard",       "live",    "2026-04-10", "3w ago",   "Carlos Rivera"],
  ["Frozen Food – 4 Door End",                          "v1.8",  "Frozen",          "Quikstop Core",    "Standard",       "review",  "2026-06-20", "2d ago",   "Marcus Johnson"],
  ["End Cap – Bang Energy Launch",                      "v1.0",  "Energy Drinks",   "All Banners",      "Standard",       "draft",   "2026-07-08", "30m ago",  "David Park"],
  ["Gondola Run – Cold & Allergy",                      "v3.4",  "OTC",             "Quikstop Core",    "Premium Urban",  "live",    "2026-03-30", "1mo ago",  "Lena Brooks"],
  ["Counter Impulse – Lighters & Mints",                "v2.2",  "Counter",         "All Banners",      "Standard",       "live",    "2026-04-18", "2w ago",   "Priya Patel"],
  ["Beer Cooler – 5 Door – Urban Premium v4.1",         "v4.1",  "Beer & Wine",     "Quikstop Core",    "Premium Urban",  "archived","2026-04-01", "5w ago",   "Maria Chen"],
  ["Coffee Bar – Premium Cluster",                      "v2.0",  "Coffee",          "Quikstop Core",    "Premium Urban",  "review",  "2026-06-05", "8h ago",   "Lena Brooks"],
  ["Slushie Tower – Express Format",                    "v2.0",  "Frozen Bev",      "Quikstop Express", "Express",        "live",    "2026-05-12", "4d ago",   "Priya Patel"],
  ["Tobacco Gantry – Texas Stores",                     "v1.5",  "Tobacco",         "Quikstop Core",    "TX Standard",    "live",    "2026-04-25", "3w ago",   "Sarah Kim"],
].map((r, i) => ({
  id: `pog-${1000+i}`,
  name: r[0] + (r[1] ? ` ${r[1]}` : ""),
  baseName: r[0],
  version: r[1],
  category: r[2],
  banner: r[3],
  cluster: r[4],
  status: r[5],
  effective: r[6],
  modified: r[7],
  owner: r[8],
}));

// --- Stores ---
const STORE_POS = [
  [490, 365], [495, 360], [115, 270], [155, 320], [495, 355], [550, 230], [575, 235],
  [80, 165], [780, 245], [115, 260], [770, 380], [690, 320], [840, 230], [220, 340],
  [610, 395], [840, 195], [115, 270], [495, 280], [560, 215], [490, 365],
];

const STORES = [
  ["#1247", "412 N Lamar Blvd, Austin, TX 78703",     "Quikstop Core",    "Premium Urban",  "Standard",  4200, "live",  "2026-04-22", 0.97],
  ["#1248", "I-35 Exit 235, Round Rock, TX 78664",    "Quikstop Fuel",    "Highway",        "Fuel+Conv", 5400, "live",  "2026-05-01", 0.93],
  ["#0312", "850 Market St, San Francisco, CA 94102", "Quikstop Core",    "Premium Urban",  "Compact",   2800, "live",  "2026-04-18", 0.99],
  ["#0418", "1255 Beverly Blvd, Los Angeles, CA",     "Quikstop Core",    "CA Regulated",   "Standard",  3600, "live",  "2026-04-10", 0.88],
  ["#2104", "Hwy 75 & Frontage, Plano, TX 75024",     "Quikstop Fuel",    "Highway",        "Fuel+Conv", 5200, "live",  "2026-05-12", 0.91],
  ["#0987", "210 W Adams St, Chicago, IL 60606",      "Quikstop Express", "Express",        "Compact",   1800, "live",  "2026-04-30", 0.96],
  ["#1502", "I-80 Exit 88, Iowa City, IA 52240",      "Quikstop Fuel",    "Highway",        "Fuel+Conv", 5800, "review","2026-03-15", 0.79],
  ["#0651", "4th & Pine, Seattle, WA 98101",          "Quikstop Core",    "Premium Urban",  "Standard",  3200, "live",  "2026-05-08", 0.95],
  ["#0823", "Broadway & 96th, New York, NY 10025",    "Quikstop Core",    "Premium Urban",  "Compact",   2400, "live",  "2026-04-25", 0.98],
  ["#1119", "Hwy 1 & 17, Santa Cruz, CA 95060",       "Quikstop Core",    "CA Regulated",   "Standard",  3400, "review","2026-03-22", 0.84],
  ["#2237", "I-95 Exit 142, Jacksonville, FL 32256",  "Quikstop Fuel",    "Highway",        "Fuel+Conv", 5600, "live",  "2026-04-29", 0.92],
  ["#0445", "Peachtree & 5th, Atlanta, GA 30308",     "Quikstop Core",    "Standard",       "Standard",  3800, "live",  "2026-05-05", 0.96],
  ["#1789", "Mass Ave & Vassar, Cambridge, MA 02139", "Quikstop Express", "Express",        "Compact",   1600, "live",  "2026-04-20", 0.94],
  ["#2402", "I-10 Exit 401, Phoenix, AZ 85008",       "Quikstop Fuel",    "Highway",        "Fuel+Conv", 5400, "live",  "2026-05-14", 0.89],
  ["#1356", "Magazine St, New Orleans, LA 70130",     "Quikstop Core",    "Standard",       "Standard",  3000, "live",  "2026-04-08", 0.97],
  ["#0772", "I-93 Exit 17, Manchester, NH 03101",     "Quikstop Fuel",    "Highway",        "Fuel+Conv", 5200, "live",  "2026-04-26", 0.93],
  ["#1845", "Mission & 24th, San Francisco, CA",      "Quikstop Core",    "CA Regulated",   "Compact",   2200, "live",  "2026-05-02", 0.91],
  ["#2018", "I-70 Exit 282, Topeka, KS 66603",        "Quikstop Fuel",    "Highway",        "Fuel+Conv", 5600, "draft", "—",          0.71],
  ["#1467", "Hennepin Ave, Minneapolis, MN 55403",    "Quikstop Express", "Express",        "Compact",   1800, "live",  "2026-04-17", 0.95],
  ["#0939", "South Congress, Austin, TX 78704",       "Quikstop Core",    "Premium Urban",  "Standard",  3600, "live",  "2026-05-11", 0.98],
].map((r, i) => ({
  id: `s-${i}`, num: r[0], addr: r[1], banner: r[2], cluster: r[3], format: r[4], sqft: r[5], status: r[6], lastReset: r[7], compliance: r[8],
  // approximate lat/lon mapped to a stylized US viewBox 0-1000 × 0-500
  pos: STORE_POS[i],
}));

// --- Fixtures ---
const FIXTURES = [
  { id: "f-5d-cooler",  name: "5-Door Beer Cooler",       h: 78, w: 130, d: 30, kind: "cooler",   shelves: 25, doors: 5, usage: 312 },
  { id: "f-3d-cooler",  name: "3-Door Energy Cooler",     h: 78, w: 78,  d: 30, kind: "cooler",   shelves: 15, doors: 3, usage: 198 },
  { id: "f-8d-walk",    name: "8-Door Walk-In Cooler",    h: 84, w: 208, d: 36, kind: "cooler",   shelves: 40, doors: 8, usage: 87  },
  { id: "f-roller",     name: "Roller Grill 18-slot",     h: 22, w: 36,  d: 22, kind: "grill",    slots: 18,            usage: 412 },
  { id: "f-tob-6",      name: "Tobacco Gantry 6-Tier",    h: 60, w: 96,  d: 18, kind: "gantry",   tiers: 6,             usage: 487 },
  { id: "f-slush",      name: "Slushie Tower 6-Flavor",   h: 46, w: 36,  d: 30, kind: "slushie",  flavors: 6,           usage: 244 },
  { id: "f-coffee",     name: "Coffee Bar Station",       h: 60, w: 72,  d: 28, kind: "coffee",                        usage: 198 },
  { id: "f-endcap",     name: "End Cap Standard",         h: 84, w: 48,  d: 24, kind: "endcap",   shelves: 5,           usage: 376 },
  { id: "f-gond",       name: "Gondola Run 16ft",         h: 78, w: 192, d: 36, kind: "gondola",  shelves: 6,           usage: 521 },
  { id: "f-counter",    name: "Counter Impulse Display",  h: 24, w: 60,  d: 16, kind: "counter",                        usage: 298 },
  { id: "f-dump",       name: "Dump Bin",                 h: 36, w: 36,  d: 36, kind: "bin",                            usage: 178 },
  { id: "f-ice",        name: "Ice Merchandiser",         h: 50, w: 50,  d: 30, kind: "freezer",                        usage: 224 },
  { id: "f-hot",        name: "Hot Food Case 4-Shelf",    h: 60, w: 48,  d: 26, kind: "hot",      shelves: 4,           usage: 156 },
  { id: "f-bakery",     name: "Bakery Case 3-Tier",       h: 48, w: 60,  d: 26, kind: "bakery",   shelves: 3,           usage: 142 },
];

// --- Product Catalog (extended) ---
const CATALOG = [
  ...SKU_LIBRARY.map(s => ({ ...s, vendor: vendorFor(s.brand), pack: packFor(s) })),
  // a handful more to feel populated
  { id: "sku-haribo-5", brand: "snickers", name: "Haribo Goldbears",   size: "5 oz", upc: "0042238311054", h: 6.5, w: 4, d: 1, cost: 1.20, retail: 2.49, recF: 4, cat: "Candy",        vendor: "Haribo USA",    pack: "12 ct" },
  { id: "sku-trolli-5", brand: "mms",      name: "Trolli Sour Worms",  size: "5 oz", upc: "0042238311047", h: 6.5, w: 4, d: 1, cost: 1.15, retail: 2.29, recF: 4, cat: "Candy",        vendor: "Ferrara",       pack: "12 ct" },
  { id: "sku-cheetos",  brand: "doritos",  name: "Cheetos Crunchy",    size: "2.75 oz", upc: "0028400142540", h: 9, w: 7, d: 2, cost: 1.35, retail: 2.49, recF: 4, cat: "Salty Snacks", vendor: "Frito-Lay",     pack: "24 ct" },
  { id: "sku-funyuns",  brand: "lays",     name: "Funyuns Onion",      size: "2.125 oz",upc: "0028400090193", h: 9, w: 7, d: 2, cost: 1.30, retail: 2.29, recF: 3, cat: "Salty Snacks", vendor: "Frito-Lay",     pack: "24 ct" },
  { id: "sku-pringles", brand: "lays",     name: "Pringles Original",  size: "5.2 oz",  upc: "0038000845024", h: 10.5,w: 3, d: 3, cost: 1.55, retail: 2.79, recF: 3, cat: "Salty Snacks", vendor: "Kellanova",     pack: "14 ct" },
];

function vendorFor(brand) {
  if (["coke","cokezero","drpepper","vw","ba","bodyarmor","powerade"].includes(brand)) return "Coca-Cola NA";
  if (["pepsi","mtndew","gatorade","rockstar"].includes(brand)) return "PepsiCo";
  if (brand === "redbull") return "Red Bull NA";
  if (brand === "monster") return "Monster Bev.";
  if (brand === "celsius") return "Celsius Hldg";
  if (brand === "bang") return "Bang/VPX";
  if (brand === "fivehour") return "Living Essentials";
  if (["snickers","mms"].includes(brand)) return "Mars Wrigley";
  if (brand === "reeses") return "Hershey";
  if (["lays","doritos"].includes(brand)) return "Frito-Lay";
  return "Misc Vendor";
}
function packFor(s) {
  if (s.cat === "Cold Beverages") return "24 ct";
  if (s.cat === "Energy Drinks") return "24 ct";
  if (s.cat === "Sports Drinks") return "15 ct";
  if (s.cat === "Candy") return "36 ct";
  if (s.cat === "Salty Snacks") return "24 ct";
  return "12 ct";
}

// --- Reset calendar (8 weeks) ---
const RESET_CATEGORIES = {
  "Beer & Wine":    "#0f766e",
  "Energy Drinks":  "#7c3aed",
  "Salty Snacks":   "#ea580c",
  "Tobacco":        "#b45309",
  "Foodservice":    "#be185d",
  "Coffee":         "#92400e",
  "Candy":          "#0284c7",
  "Frozen Bev":     "#06b6d4",
  "Bakery":         "#d97706",
  "Dairy":          "#16a34a",
};
const RESETS = [
  { week: 0, cat: "Beer & Wine",    name: "Beer Cooler – Premium",      days: 3, lane: 0 },
  { week: 0, cat: "Salty Snacks",   name: "Salty Snacks Gondola",       days: 2, lane: 1 },
  { week: 1, cat: "Energy Drinks",  name: "Energy End Cap – Summer",    days: 4, lane: 0 },
  { week: 1, cat: "Coffee",         name: "Coffee Bar – Daypart Refresh",days: 2,lane: 2 },
  { week: 2, cat: "Tobacco",        name: "Tobacco Gantry – TX",        days: 3, lane: 1 },
  { week: 3, cat: "Foodservice",    name: "Roller Grill Q3 Menu",       days: 5, lane: 0 },
  { week: 3, cat: "Candy",          name: "Candy 4ft – Q3",             days: 2, lane: 2 },
  { week: 4, cat: "Frozen Bev",     name: "Slushie Tower – 6 Flavor",   days: 3, lane: 0 },
  { week: 5, cat: "Beer & Wine",    name: "Beer Cooler – Value",        days: 3, lane: 1 },
  { week: 5, cat: "Bakery",         name: "Bakery Case Refresh",        days: 2, lane: 2 },
  { week: 6, cat: "Energy Drinks",  name: "Bang Energy Launch",         days: 2, lane: 0 },
  { week: 7, cat: "Dairy",          name: "Dairy 3-Door Refresh",       days: 2, lane: 1 },
];

// --- Activity feed ---
const ACTIVITY = [
  { who: "Maria Chen",       what: "approved",       obj: "Energy Drink Cooler v4.2 for Cluster B",        ago: "12m ago",  kind: "approve" },
  { who: "Coca-Cola",        what: "submitted",      obj: "vendor planogram pending review",               ago: "1h ago",   kind: "vendor"  },
  { who: "Store #1247",      what: "reported",       obj: "deviation on Tobacco Gantry – 3 SKUs missing",  ago: "3h ago",   kind: "alert"   },
  { who: "David Park",       what: "created",        obj: "End Cap – Bang Energy Launch draft",            ago: "5h ago",   kind: "create"  },
  { who: "Sarah Kim",        what: "requested changes on", obj: "Tobacco Gantry 6-Tier v3.0",              ago: "8h ago",   kind: "review"  },
  { who: "PepsiCo",          what: "submitted",      obj: "Mountain Dew Baja Blast SKU update",            ago: "1d ago",   kind: "vendor"  },
  { who: "Priya Patel",      what: "published",      obj: "Slushie Tower Summer Lineup to 412 stores",     ago: "1d ago",   kind: "publish" },
];

// --- Top-performing categories (sales per linear foot) ---
const TOP_CATS = [
  { name: "Tobacco",        spl: 89.40 },
  { name: "Beer & Wine",    spl: 68.20 },
  { name: "Energy Drinks",  spl: 61.80 },
  { name: "Cold Beverages", spl: 52.10 },
  { name: "Salty Snacks",   spl: 44.60 },
  { name: "Candy",          spl: 38.90 },
  { name: "Coffee",         spl: 36.40 },
  { name: "Roller Grill",   spl: 28.20 },
  { name: "Bakery",         spl: 22.10 },
];

// --- Compliance heatmap ---
const HEATMAP = {
  rows: ["Northeast", "Midwest", "South", "West"],
  cols: ["Beer", "Tobacco", "Energy", "Snacks", "Coffee", "Roller Grill"],
  values: [
    [0.96, 0.98, 0.93, 0.91, 0.89, 0.86],
    [0.94, 0.97, 0.95, 0.93, 0.91, 0.79],
    [0.92, 0.96, 0.94, 0.90, 0.85, 0.82],
    [0.89, 0.91, 0.97, 0.88, 0.93, 0.84],
  ],
};

// --- Reports ---
const REPORTS = [
  { id: "r1", name: "Sales per Linear Foot",          desc: "By category, banner, cluster",          updated: "2h ago" },
  { id: "r2", name: "Compliance Trend",               desc: "12-week rolling compliance %",          updated: "1d ago" },
  { id: "r3", name: "Out-of-Stock Impact",            desc: "Revenue at risk from voids",            updated: "4h ago" },
  { id: "r4", name: "Vendor Planogram Performance",   desc: "Vendor-supplied vs internal lift",      updated: "3d ago" },
  { id: "r5", name: "Reset ROI",                      desc: "Pre/post reset performance",            updated: "1w ago" },
  { id: "r6", name: "Deadstock by Category",          desc: "Slow movers occupying premium space",   updated: "6h ago" },
  { id: "r7", name: "Category Mix Analysis",          desc: "Space-to-sales ratio by category",      updated: "2d ago" },
  { id: "r8", name: "Cluster Performance",            desc: "Comparative cluster-level sales",       updated: "12h ago" },
];

// --- Editor: merchandising rules ---
const EDITOR_RULES = [
  { id: "r-brand",    name: "Brand blocking",      desc: "Coca-Cola products must be contiguous within door", on: true,  status: "passing" },
  { id: "r-minfac",   name: "Minimum facings",     desc: "Top-20% SKUs require ≥ 2 facings",                  on: true,  status: "passing" },
  { id: "r-eye",      name: "Eye-level reserved",  desc: "Shelves 2–3 reserved for high-margin SKUs",         on: true,  status: "warning", note: "1 SKU below margin threshold on shelf 3" },
  { id: "r-sep",      name: "Pepsi/Coke separation", desc: "Pepsi and Coca-Cola brand-blocks on separate doors", on: true, status: "passing" },
  { id: "r-cap",      name: "Capping",             desc: "Max 1 capping row, top shelf only",                 on: false, status: "off" },
  { id: "r-cold",     name: "Cold zone",           desc: "Shelves 1–2 reserved for high-velocity",            on: true,  status: "passing" },
  { id: "r-dos",      name: "Days of supply",      desc: "Min 2.0 days-of-supply for A-velocity SKUs",        on: true,  status: "warning", note: "5-Hour Energy at 1.8 days" },
];

Object.assign(window, {
  BRAND_COLORS, SKU_LIBRARY, COOLER_LAYOUT,
  OWNERS, PLANOGRAMS,
  STORES, FIXTURES, CATALOG,
  RESET_CATEGORIES, RESETS, ACTIVITY, TOP_CATS, HEATMAP, REPORTS,
  EDITOR_RULES,
});
