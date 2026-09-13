/* ============================================================
   Solar System — static planet-page generator
   ------------------------------------------------------------
   Regenerates planet/<id>.html for all eight planets from the
   single source of truth in js/data.js. Run after editing data:

     node scripts/build-planets.js

   Pages are fully baked static HTML (work with JavaScript off);
   re-run whenever js/data.js changes so the pages never drift.
   No dependencies — plain Node + fs.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const { SOLAR_SYSTEM, getNeighbours } = require("../js/data.js");

const OUT_DIR = path.join(__dirname, "..", "planet");
/* Absolute origin for canonical + social-card URLs. Open Graph and Twitter
   require absolute URLs — a relative path silently yields no card at all. */
const SITE = "https://tigerkossk.github.io/Solar-System-Exploration";
const FONTS =
  'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Hanken+Grotesk:wght@400;500;600;700&family=Spectral:ital,wght@0,400;0,500;1,400&display=swap';
const FAVICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='6.5' fill='%23f5b942'/><ellipse cx='16' cy='16' rx='13' ry='6' fill='none' stroke='%232a7d8c' stroke-width='2' transform='rotate(-24 16 16)'/></svg>";

/* ---- small helpers ---------------------------------------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function attr(s) {
  return esc(s).replace(/"/g, "&quot;");
}
const CHEV =
  '<svg class="btn__chev" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BRAND = `
        <a class="brand" href="../index.html" aria-label="Solar System — home">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <circle cx="16" cy="16" r="4" fill="currentColor"/>
              <ellipse cx="16" cy="16" rx="13" ry="6.2" stroke="currentColor" stroke-width="1.3" opacity=".65" transform="rotate(-24 16 16)"/>
              <circle cx="27" cy="10.2" r="1.9" fill="currentColor"/>
            </svg>
          </span>
          <span class="brand__word">Solar&nbsp;System</span>
        </a>`;

function statWidget(label, value, unit, context, span2) {
  const unitHtml = unit ? `<span class="unit">${esc(unit)}</span>` : "";
  const ctxHtml = context ? `<span class="stat__context">${esc(context)}</span>` : "";
  return `
        <div class="widget${span2 ? " widget--span2" : ""}">
          <span class="kicker-label">${esc(label)}</span>
          <span class="stat__value tnum">${esc(value)}${unitHtml}</span>
          ${ctxHtml}
        </div>`;
}
function callout(title, text, isFact) {
  return `
            <div class="callout${isFact ? " callout--fact" : ""}">
              <h3>${esc(title)}</h3>
              <p>${esc(text)}</p>
            </div>`;
}
function section(id, title, gridInner, wide) {
  return `
        <section class="dash-section" aria-labelledby="h-${id}">
          <div class="section-head"><h2 id="h-${id}">${esc(title)}</h2></div>
          <div class="dash-grid${wide ? " dash-grid--wide" : ""}">${gridInner}
          </div>
        </section>`;
}

/* gravity comparison bar (0 → 2.5× Earth scale; Earth marker at 1 g) */
function gravityBar(p) {
  const g = parseFloat(p.facts.gravity.value) / 9.8;
  const fill = Math.min(100, (g / 2.5) * 100).toFixed(1);
  const earth = (1 / 2.5 * 100).toFixed(1);
  return `
            <div class="widget widget--span2">
              <span class="kicker-label">Surface gravity vs Earth</span>
              <div class="cmp__head">
                <span class="cmp__val tnum">${esc(p.facts.gravity.value)} ${esc(p.facts.gravity.unit)}</span>
                <span class="text-lo">${esc(p.facts.gravity.vsEarth)}</span>
              </div>
              <div class="cmp__track">
                <span class="cmp__fill" style="width:${fill}%"></span>
                <span class="cmp__earth" style="left:${earth}%" title="Earth = 1 g"></span>
              </div>
              <div class="cmp__scale"><span>0</span><span>Earth = 1 g</span><span>2.5×</span></div>
            </div>`;
}

function render(p) {
  const nb = getNeighbours(p.id);
  const f = p.facts;
  const ringedClass = p.ringed ? " planet-orb--ringed" : "";
  const hasTexture = p.texture && fs.existsSync(path.join(__dirname, "..", p.texture));
  const orbNote = hasTexture ? "Texture: Solar System Scope (CC BY 4.0)" : "Illustrative — not real imagery";

  // neighbour nav (prev: dot then name, next: name then dot)
  const prevLink = `<a href="${nb.prev.id}.html"><span class="dot" style="--nc:${attr(nb.prev.color)}"></span>${esc(nb.prev.name)}</a>`;
  const nextLink = `<a href="${nb.next.id}.html">${esc(nb.next.name)}<span class="dot" style="--nc:${attr(nb.next.color)}"></span></a>`;

  // Key facts
  const keyFacts =
    statWidget("Distance from Sun", f.distance.au, "AU", f.distance.km) +
    statWidget("Radius", f.radius.value, f.radius.unit, f.radius.vsEarth) +
    statWidget("Mean temperature", f.temperature.mean, f.temperature.unit, f.temperature.range);

  // Time & motion
  const timeMotion =
    statWidget("A day (one spin)", f.rotation.human, "", f.rotation.context) +
    statWidget("A year (one orbit)", f.orbital.human, "", f.orbital.context) +
    gravityBar(p);

  // Mass & physical
  const massPhysical =
    statWidget("Mass", f.mass.value, f.mass.unit, f.mass.vsEarth) +
    statWidget("Density", f.density.value, f.density.unit, "Water = 1.0 g/cm³") +
    statWidget("Escape velocity", f.escapeVelocity.value, f.escapeVelocity.unit, "Speed to break free") +
    statWidget("Orbital velocity", f.orbitalVelocity.value, f.orbitalVelocity.unit, "Speed around the Sun") +
    statWidget("Axial tilt", f.axialTilt.value, "", f.axialTilt.note);

  // Atmosphere & magnetosphere
  let atmosphere = callout("Atmosphere", p.atmosphere.composition + (p.atmosphere.note ? " " + p.atmosphere.note : ""));
  if (p.atmosphere.pressure) {
    atmosphere += statWidget("Surface pressure", p.atmosphere.pressure, "", "Relative to Earth's 1 bar");
  }
  atmosphere += callout("Magnetic field", p.magneticField);

  // Moons & rings
  let moonsRings = statWidget("Known moons", String(f.moons.count), "", f.moons.note);
  if (f.moons.notable && f.moons.notable.length) {
    moonsRings += `
        <div class="widget widget--span2">
          <span class="kicker-label">Notable moons</span>
          <div class="chips">${f.moons.notable.map((m) => `<span class="chip">${esc(m)}</span>`).join("")}</div>
        </div>`;
  }
  if (p.rings && p.rings.has) {
    moonsRings += callout("Rings", p.rings.description);
  }

  // Make-up + notable features
  let makeup = callout("Composition", p.composition);
  if (p.features && p.features.length) {
    makeup += `
            <div class="callout">
              <h3>Notable features</h3>
              <ul class="feature-list">${p.features.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            </div>`;
  }

  // Fun facts
  const funFacts = `
        <section class="dash-section" aria-labelledby="h-facts">
          <div class="section-head"><h2 id="h-facts">Fun facts</h2></div>
          <ul class="fact-list">${(p.funFacts || []).map((x) => `<li class="fact-item">${esc(x)}</li>`).join("")}</ul>
        </section>`;

  // Exploration / missions
  const missions = `
        <section class="dash-section" aria-labelledby="h-missions">
          <div class="section-head"><h2 id="h-missions">Exploration</h2></div>
          <div class="mission-list">${(p.missions || [])
            .map(
              (m) => `
            <div class="mission-item">
              <span class="mission-item__name">${esc(m.name)}</span>
              <span class="mission-item__years tnum">${esc(m.years)}</span>
              <span class="mission-item__note">${esc(m.note)}</span>
            </div>`
            )
            .join("")}
          </div>
        </section>`;

  const discovery = p.discovery ? ` · ${esc(p.discovery)}` : "";

  // one description string, reused by <meta name="description"> and both card sets
  const desc = attr(
    p.name + ": " + p.tagline +
    ". Real, sourced data — distance, size, gravity, day and year length, temperature, moons and more."
  );
  const pageUrl = `${SITE}/planet/${p.id}.html`;
  const cardTitle = attr(p.name + " — Solar System");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="${FAVICON}" />
  <title>${esc(p.name)} — Solar System</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${pageUrl}" />
  <meta name="theme-color" content="#08110f" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Solar System Exploration" />
  <meta property="og:title" content="${cardTitle}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:image" content="${SITE}/assets/og-cover.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Earth seen from space, the Sun cresting beyond its horizon." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${cardTitle}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${SITE}/assets/og-cover.jpg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${FONTS}" rel="stylesheet" />
  <link rel="stylesheet" href="../css/main.css" />
  <link rel="stylesheet" href="../css/components.css" />
  <link rel="stylesheet" href="../css/planet.css" />
  <link rel="stylesheet" href="../css/responsive.css" />
</head>
<body data-planet="${attr(p.id)}">
  <!-- Generated by scripts/build-planets.js from js/data.js — do not edit by hand. -->
  <div class="cosmos" aria-hidden="true">
    <div class="cosmos__fallback"></div>
    <canvas class="cosmos__canvas" id="bg"></canvas>
    <div class="cosmos__stars"></div>
  </div>

  <a class="skip-link" href="#dashboard">Skip to the data</a>

  <main class="stage">
    <div class="panel container planet-page" style="--pc: ${attr(p.color)}">
      <!-- top bar: home + neighbour navigation -->
      <div class="planet-topbar">${BRAND}
        <nav class="neighbors" aria-label="Nearby planets">
          ${prevLink}
          ${nextLink}
        </nav>
      </div>

      <!-- hero -->
      <header class="planet-hero">
        <div class="planet-hero__text">
          <h1 class="planet-hero__name">${esc(p.name)}</h1>
          <p class="planet-hero__type kicker-label">${esc(p.type)} · ${esc(p.tagline)}${discovery}</p>
          <p class="planet-hero__desc">${esc(p.description)}</p>
          <div class="planet-hero__cta">
            <a class="btn btn--primary btn--lg" id="primaryCta" href="../index.html">
              Back to the Solar System
              ${CHEV}
            </a>
            <a class="btn btn--ghost btn--lg" href="${nb.next.id}.html">Next: ${esc(nb.next.name)} →</a>
          </div>
        </div>
        <figure class="planet-figure">
          <div class="planet-orb${ringedClass}" role="img" aria-label="${attr(p.imagery.alt)}"></div>
          <figcaption class="planet-orb__note kicker-label">${orbNote}</figcaption>
        </figure>
      </header>

      <!-- dashboard -->
      <div id="dashboard">${section("key", "Key facts", keyFacts)}${section("time", "Time & motion", timeMotion, true)}${section("mass", "Mass & physical characteristics", massPhysical)}${section("atmos", "Atmosphere & magnetosphere", atmosphere, true)}${section("moons", "Moons & rings", moonsRings, true)}${section("about", "Make-up", makeup, true)}${funFacts}${missions}
      </div>

      <!-- foot -->
      <footer class="planet-foot">
        <a class="back" href="../index.html">
          <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true"><path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Back to the Solar System
        </a>
        <span class="source-tag">
          Data: <a href="${attr(SOLAR_SYSTEM.meta.sourceUrl)}" target="_blank" rel="noopener">NASA Planetary Fact Sheet</a>
          · Moon counts as of ${esc(SOLAR_SYSTEM.meta.moonsAsOf)} · Orbit spacing and planet sizes in the map are illustrative, not to true scale
        </span>
      </footer>
    </div>
  </main>

  <script src="../js/background.js"></script>
  <script src="../js/liquid-chrome.js"></script>
  <script src="../js/backlink.js"></script>
</body>
</html>
`;
}

/* ---- build ------------------------------------------------- */
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
let count = 0;
SOLAR_SYSTEM.planets.forEach((p) => {
  const html = render(p);
  fs.writeFileSync(path.join(OUT_DIR, p.id + ".html"), html, "utf8");
  count++;
  console.log("  wrote planet/" + p.id + ".html");
});
console.log("Generated " + count + " planet pages from js/data.js.");
