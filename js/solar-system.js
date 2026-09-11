/* ============================================================
   Solar System — landing behaviour
   Builds the orrery from SOLAR_SYSTEM (js/data.js); hover / focus /
   selector all drive one frosted readout. Planets are real links,
   so navigation works with or without this script.
   ============================================================ */
(function () {
  "use strict";
  if (!window.SOLAR_SYSTEM) return;

  var PLANETS = SOLAR_SYSTEM.planets;
  var SUN = SOLAR_SYSTEM.sun;
  var stage = document.getElementById("orreryStage");
  var nodes = {};      // id -> { link, orbit }
  var selectorLinks = {};
  var currentId = null;   // planet id last previewed — the arrow stepper's anchor

  /* ---- build orbits + planet links --------------------- */
  PLANETS.forEach(function (p, i) {
    var orbit = document.createElement("div");
    orbit.className = "orbit";
    orbit.style.setProperty("--d", (p.viz.orbit * 100) + "%");
    orbit.style.setProperty("--period", p.viz.period + "s");

    var spin = document.createElement("div");
    spin.className = "orbit__spin";

    var arm = document.createElement("div");
    arm.className = "orbit__arm";
    arm.style.setProperty("--start", ((i * 137.5) % 360) + "deg"); // spread, and stable when motion is off

    var link = document.createElement("a");
    link.className = "planet" + (p.ringed ? " planet--ringed" : "");
    link.href = "planet/" + p.id + ".html";
    link.style.setProperty("--pd", p.viz.size + "px");
    link.style.setProperty("--c", p.color);
    link.dataset.planet = p.id;
    link.setAttribute(
      "aria-label",
      p.name + ", " + p.type + ", planet " + p.order + " from the Sun."
    );
    /* persistent, always-upright name tag: .planet__tagspin cancels the
       orbital spin, .planet__tagstart cancels the arm's start angle, so the
       label sits screen-below the node and travels with the planet without
       swinging. Frozen with the orrery under reduced motion / pause. */
    link.innerHTML =
      '<span class="planet__body"></span>' +
      '<span class="planet__tagspin"><span class="planet__tagstart">' +
      '<span class="planet__label">' + p.name + "</span></span></span>";

    arm.appendChild(link);
    spin.appendChild(arm);
    orbit.appendChild(spin);
    stage.appendChild(orbit);
    nodes[p.id] = { link: link, orbit: orbit };

    var preview = function () { showPlanet(p.id); };
    link.addEventListener("mouseenter", preview);
    link.addEventListener("focus", preview);
    /* Map interaction is identical in the menu and in Explorer mode:
       hover / focus / first touch-tap previews; click, Enter, or a second
       tap on the already-previewed planet opens its page. Mouse and keyboard
       keep their natural open-on-activate; only touch previews first (it has
       no hover). Modifier / middle clicks open in a new tab; with no JS the
       link just navigates. */
    /* Capture pointer type + "was this already previewed?" at pointerdown —
       before the emulated mouseenter a tap fires. Reading pointerType from
       pointerdown (a real PointerEvent everywhere, incl. iOS Safari, where
       the click is a plain MouseEvent with no pointerType) makes touch
       detection reliable. e.detail > 0 excludes keyboard-activated clicks,
       which must still open on Enter. First tap previews; a second tap on
       the same planet opens. */
    var tapWasActive = false, tapPointer = "";
    link.addEventListener("pointerdown", function (e) {
      tapPointer = e.pointerType || "";
      tapWasActive = link.classList.contains("is-active");
    });
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button > 0)) return;
      if (tapPointer === "touch" && e.detail > 0 && !tapWasActive) {
        e.preventDefault();
        showPlanet(p.id);
      }
    });
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- readout (one shared preview panel; Explorer mode reuses it) ---- */
  var el = {
    hint: document.getElementById("readoutHint"),
    body: document.getElementById("readoutBody"),
    dot: document.getElementById("readoutDot"),
    name: document.getElementById("readoutName"),
    type: document.getElementById("readoutType"),
    fact: document.getElementById("readoutFact"),
    funFacts: document.getElementById("readoutFunFacts"),
    explore: document.getElementById("readoutExplore"),
    exploreName: document.getElementById("readoutExploreName"),
  };
  function fillFunFacts(list) {
    if (!el.funFacts) return;
    el.funFacts.innerHTML = (list || []).slice(0, 3).map(function (f) {
      return '<li class="fact-item">' + esc(f) + "</li>";
    }).join("");
  }

  function clearActive() {
    Object.keys(nodes).forEach(function (id) {
      nodes[id].link.classList.remove("is-active");
      nodes[id].orbit.classList.remove("orbit--hot");
    });
    Object.keys(selectorLinks).forEach(function (id) {
      selectorLinks[id].classList.remove("is-active");
    });
  }

  function showPlanet(id) {
    var p = getPlanet(id);
    if (!p) return;
    currentId = id;
    clearActive();
    nodes[id].link.classList.add("is-active");
    nodes[id].orbit.classList.add("orbit--hot");
    if (selectorLinks[id]) selectorLinks[id].classList.add("is-active");

    var moons = p.facts.moons.count;
    el.hint.hidden = true;
    el.body.hidden = false;
    el.dot.style.setProperty("--c", p.color);
    el.name.textContent = p.name;
    el.type.textContent = p.type;
    el.fact.innerHTML =
      "<b>" + p.facts.distance.km + "</b> from the Sun · <b>" + moons + "</b> " +
      (moons === 1 ? "moon" : "moons");
    fillFunFacts(p.funFacts);
    el.explore.href = "planet/" + p.id + ".html";
    el.exploreName.textContent = p.name;
  }

  function showSun() {
    currentId = "sun";   // not a planet — arrows step to the first/last from here
    clearActive();
    el.hint.hidden = true;
    el.body.hidden = false;
    el.dot.style.setProperty("--c", SUN.color);
    el.name.textContent = SUN.name;
    el.type.textContent = SUN.type;
    el.fact.innerHTML =
      "<b>" + SUN.facts.massShare.value + "</b> · surface " + SUN.facts.surface.value;
    fillFunFacts(SUN.funFacts);
    el.explore.href = "#sun-section";
    el.exploreName.textContent = "the Sun";
  }

  var sunBtn = document.getElementById("sun");
  if (sunBtn) {
    sunBtn.addEventListener("mouseenter", showSun);
    sunBtn.addEventListener("focus", showSun);
  }

  /* ---- prev / next planet stepper (arrow navigation) ----------
     Injected into the shared readout. With the selector list hidden under JS
     (css/sections.css), the orbit plus these arrows ARE the planet navigation.
     Stepping cycles the previewed planet in orbit order, drives the same
     readout, and moves focus to that planet so keyboard users keep context
     (focusing a node also pauses the orbit, so the target holds still). */
  var readoutEl = document.getElementById("readout");
  var PLANET_IDS = PLANETS.map(function (p) { return p.id; });

  function step(dir) {
    var i = PLANET_IDS.indexOf(currentId);
    var n = PLANET_IDS.length;
    var next = i < 0 ? (dir > 0 ? 0 : n - 1) : (((i + dir) % n) + n) % n;
    var id = PLANET_IDS[next];
    showPlanet(id);
    if (nodes[id]) nodes[id].link.focus({ preventScroll: true });
  }

  if (readoutEl) {
    var chev = function (d) {
      return '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="' +
        (d < 0 ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5") +
        '" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    };
    var nav = document.createElement("div");
    nav.className = "readout__nav";
    nav.innerHTML =
      '<button class="readout__arrow" type="button" data-dir="-1" aria-label="Preview the previous planet">' + chev(-1) + "</button>" +
      '<button class="readout__arrow" type="button" data-dir="1" aria-label="Preview the next planet">' + chev(1) + "</button>";
    readoutEl.appendChild(nav);
    nav.addEventListener("click", function (e) {
      var btn = e.target.closest(".readout__arrow");
      if (!btn) return;
      step(btn.getAttribute("data-dir") === "-1" ? -1 : 1);
    });
    // arrows are a JS-only enhancement, so the hint can name them now
    if (el.hint) el.hint.textContent = "Hover, tap, or use the arrows to preview a planet.";
    // and the stage label no longer points at the (JS-hidden) list below
    if (stage) stage.setAttribute(
      "aria-label",
      "Interactive map of the Solar System. Focus a planet or use the arrow buttons to preview it, then open it for its page."
    );
  }

  /* ArrowLeft / ArrowRight step planets — but only while Explorer mode is open
     or focus is already inside the map, so plain arrow-key page scrolling is
     never hijacked elsewhere on the page. */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var ae = document.activeElement;
    var inMap = document.body.classList.contains("is-exploring") ||
      (ae && ae.closest && ae.closest(".orrery, .readout__nav"));
    if (!inMap) return;
    e.preventDefault();
    step(e.key === "ArrowRight" ? 1 : -1);
  });

  /* ---- pause orbital motion when the map is off-screen ---
     16 infinite orbit/planet transforms are wasteful once the page
     scrolls the orrery out of view; toggle the CSS pause hook. */
  if (stage && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      stage.classList.toggle("is-paused", !entries[0].isIntersecting);
    }, { threshold: 0 });
    io.observe(stage);
  }

  /* ---- selector strip ---------------------------------- */
  var selList = document.getElementById("selectorList");
  if (selList) {
    Array.prototype.forEach.call(selList.querySelectorAll("a[data-planet]"), function (a) {
      var id = a.dataset.planet;
      var p = getPlanet(id);
      if (p) a.style.setProperty("--c", p.color);
      selectorLinks[id] = a;
      var preview = function () { showPlanet(id); };
      a.addEventListener("mouseenter", preview);
      a.addEventListener("focus", preview);
    });
  }

  /* ---- cross-document view transition -------------------
     Name the matching map planet so it morphs into (leaving) and back out
     of (returning) the planet-page orb, which css/planet.css names to match.
     Keyed off the planet URL rather than the click, so opening via the map,
     the selector, or the readout "Open" button all morph the same node.
     The name is cleared after the snapshot to avoid BFCache name clashes,
     and everything below no-ops where the API is unavailable. */
  function planetIdFromUrl(url) {
    try {
      var m = /\/planet\/([a-z]+)\.html$/.exec(new URL(url, location.href).pathname);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }
  function nameForTransition(vt, id) {
    if (!vt || !id) return;
    var body = document.querySelector('.planet[data-planet="' + id + '"] .planet__body');
    if (!body) return;
    body.style.viewTransitionName = "planet-morph";
    var clear = function () { body.style.viewTransitionName = ""; };
    vt.finished.then(clear, clear);
  }
  window.addEventListener("pageswap", function (e) {          // leaving to a planet page
    if (!e.viewTransition) return;
    var act = e.activation || (window.navigation && window.navigation.activation);
    nameForTransition(e.viewTransition, planetIdFromUrl(act && act.entry && act.entry.url));
  });
  window.addEventListener("pagereveal", function (e) {        // returning from a planet page
    if (!e.viewTransition) return;
    var act = e.activation || (window.navigation && window.navigation.activation);
    nameForTransition(e.viewTransition, planetIdFromUrl(act && act.from && act.from.url));
  });
})();
