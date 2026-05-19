// Smoke test: HTTP + content checks for every route. Used as a Session 1/2 acceptance gate.
const PORT = process.env.PORT || "3006";
const BASE = `http://localhost:${PORT}`;

const PROBES = [
  { session: 1, path: "/",                          expectStatus: 307, markers: [] },
  { session: 1, path: "/clusters",                  expectStatus: 200, markers: ["Clusters coming soon"] },
  { session: 1, path: "/settings",                  expectStatus: 200, markers: ["Settings coming soon"] },

  { session: 2, path: "/dashboard",                 expectStatus: 200, markers: [
    "Good afternoon, Maria",
    "Active planograms",
    "Stores on latest version",
    "Avg. sales / linear ft",
    "Categories due for reset",
    "Reset calendar",
    "Recent activity",
    "Top performing categories",
    "Compliance heatmap",
    "+12 this month",
    "1,109 of 1,247 · target 95%",
    "Energy Reset Q2",
    "Maria Chen",
    "Red Bull GmbH",
  ]},
  { session: 2, path: "/planograms",                expectStatus: 200, markers: [
    "Planograms",
    "Beer Cooler",
    "Energy Reset Q2",
    "Salty Snacks Endcap v3",
    "Roller Grill",
    "Maria Chen",
    "Quikstop Core",
    "In Review",
    "Approved",
    "Live",
    "New planogram",
  ]},
  // Modal opens after hydration; only check the table renders behind it.
  { session: 2, path: "/planograms?new=true",       expectStatus: 200, markers: ["Beer Cooler"] },
  { session: 2, path: "/planograms/new",            expectStatus: 307, markers: [] },
  { session: 2, path: "/planograms/beer-v41",       expectStatus: 200, markers: ["Editor will load here for beer-v41"] },
  { session: 2, path: "/stores",                    expectStatus: 200, markers: [
    "Stores",
    "Urban Premium",
    "Highway Travel",
    "Suburban Family",
    "Cluster mix",
    "Compliance",
  ]},
  { session: 2, path: "/products",                  expectStatus: 200, markers: [
    "Products",
    "Bud Light 12-Pack",
    "Stella Artois",
    "White Claw Variety",
    "Red Bull 8.4oz",
    "Doritos Nacho",
    "Used in",
  ]},
  { session: 2, path: "/fixtures",                  expectStatus: 200, markers: [
    "5-Door Beer Cooler",
    "3-Door Energy Cooler",
    "8-Door Walk-In",
    "Roller Grill",
    "Tobacco Gantry",
    "16ft Gondola",
    "Counter Impulse",
    "Endcap Standard",
  ]},
  { session: 2, path: "/reports",                   expectStatus: 200, markers: [
    "Space-to-Sales Index",
    "Compliance Trend",
    "Reset Velocity",
    "Category Performance",
    "Daypart Mix",
    "Vendor Scorecard",
    "Cluster Comparison",
    "OOS Risk",
  ]},
  { session: 2, path: "/samples/store-pack.pdf",    expectStatus: 200, markers: ["%PDF-1.4"] },
];

let allPass = true;
const rows = [];

function normalize(html) {
  // Drop tags, drop React text-split markers, collapse whitespace.
  return html
    .replace(/<!--.*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ");
}

for (const probe of PROBES) {
  const url = BASE + probe.path;
  const res = await fetch(url, { redirect: "manual" });
  const statusOk = res.status === probe.expectStatus;
  const raw = await res.text();
  const body = probe.path.endsWith(".pdf") ? raw : normalize(raw);
  const missing = probe.markers.filter((m) => !body.includes(m));
  const markersOk = missing.length === 0;
  const pass = statusOk && markersOk;
  if (!pass) allPass = false;
  rows.push({
    session: `S${probe.session}`,
    path: probe.path,
    status: `${res.status} ${statusOk ? "✓" : "✗ want " + probe.expectStatus}`,
    markers: markersOk ? `${probe.markers.length}/${probe.markers.length} ✓` : `MISSING: ${missing.join(", ")}`,
    result: pass ? "PASS" : "FAIL",
  });
}

console.table(rows);
console.log(`\nOVERALL: ${allPass ? "PASS" : "FAIL"} — ${PROBES.length} probes`);
process.exit(allPass ? 0 : 1);
