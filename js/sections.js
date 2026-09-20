/* ============================================================
   Solar System — landing section content
   Renders the Sun, System-statistics and Missions sections from
   SOLAR_SYSTEM (js/data.js) so the landing shares the single
   source of truth. The primary map + planet list stay in the
   HTML, so core navigation still works without this script.
   ============================================================ */
(function () {
  "use strict";
  if (!window.SOLAR_SYSTEM || !window.SolarUtil) return;
  var S = window.SOLAR_SYSTEM;
  var esc = window.SolarUtil.esc;   // shared helpers — js/util.js
  var attr = window.SolarUtil.attr; // quote-safe: for attribute values only
  function tile(label, value, unit, context) {
    return (
      '<div class="widget">' +
      '<span class="kicker-label">' + esc(label) + "</span>" +
      '<span class="stat__value tnum">' + esc(value) + (unit ? '<span class="unit">' + esc(unit) + "</span>" : "") + "</span>" +
      (context ? '<span class="stat__context">' + esc(context) + "</span>" : "") +
      "</div>"
    );
  }
  function facts(list) {
    return (list || []).map(function (f) { return '<li class="fact-item">' + esc(f) + "</li>"; }).join("");
  }
  function set(id, html) { var n = document.getElementById(id); if (n) n.innerHTML = html; }
  function text(id, str) { var n = document.getElementById(id); if (n) n.textContent = str; }

  /* ── The Sun ── */
  var sun = S.sun, sf = sun.facts;
  text("sunDesc", sun.description);
  /* The same sentence is hard-coded as the aria-label in index.html AND authored
     as sun.imagery.alt here, so the two drift apart the moment either is edited.
     Every planet page already derives its orb label from the data
     (scripts/build-planets.js); make the landing agree. */
  var sunVisual = document.querySelector(".sun-visual");
  if (sunVisual && sun.imagery && sun.imagery.alt) {
    sunVisual.setAttribute("aria-label", sun.imagery.alt);
  }

  /* Pause decorative animation while it is off screen. These are PAINT
     animations -- a 152px-spread box-shadow that breathes, plus two
     background-position drifts under mix-blend-mode -- so each frame costs a
     real repaint and a compositor read-back, and they ran for the entire
     session no matter where the visitor had scrolled to. */
  function pauseOffscreen(el) {
    if (!el || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      el.classList.toggle("is-paused", !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(el);
  }
  pauseOffscreen(sunVisual);
  pauseOffscreen(document.querySelector(".scroll-cue"));
  set("sunStats",
    tile("Type", sf.type.value, "", "") +
    tile("Diameter", sf.diameter.value, "", sf.diameter.vsEarth || "") +
    tile("Surface", sf.surface.value, "", "Photosphere") +
    tile("Core", sf.core.value, "", "Where fusion happens") +
    tile("Composition", sf.composition.value, "", "By mass") +
    tile("Age", sf.age.value, "", "About halfway through its life")
  );
  set("sunFunFacts", facts(sun.funFacts));

  /* ── System statistics ── */
  var st = S.system.stats;
  var moonCount = typeof st.moons.count === "number" ? st.moons.count.toLocaleString() : st.moons.count;
  set("statsGrid",
    tile("Planets", String(st.planets), "", "Mercury to Neptune") +
    tile("Dwarf planets", String(st.dwarfPlanets), "", "Ceres, Pluto, Eris and more") +
    tile("Known moons", moonCount, "", st.moons.note + " (" + st.moons.asOf + ")") +
    tile("Age", String(st.ageBillionYears), "billion yrs", "Since the Solar System formed") +
    tile("Sun's share of mass", st.sunMassShare, "", "Everything else is the other 0.14%") +
    tile("Farthest craft", "Voyager 1", "", st.voyager1)
  );

  /* ── the map's scale disclaimer ──
     meta.scaleNote was authored and rendered on no page at all. It is the
     sentence that makes the map honest -- the orbit spacing and planet sizes
     ARE wrong, deliberately, and saying so belongs beside them rather than in
     a data file nobody reads. */
  var scaleTag = document.getElementById("scaleTag");
  if (scaleTag && S.meta && S.meta.scaleNote) {
    scaleTag.innerHTML =
      'Data: <a href="' + attr(S.meta.sourceUrl) + '" target="_blank" rel="noopener">' +
      esc(S.meta.source) + "</a> · " +
      '<span class="text-lo">' + esc(S.meta.scaleNote) + "</span>";
  }

  /* ── You, on another world ──
     Surface gravity and orbital period are the two figures on this site that a
     reader can feel directly, and both were already here doing nothing much.
     facts.orbital.days in particular was authored for all nine bodies and
     rendered on no page at all until now.

     The section is authored `hidden` in index.html and only revealed here, so
     a visitor without JS gets no half-built calculator. */
  var youGrid = document.getElementById("youGrid");
  var youMass = document.getElementById("youMass");
  var youAge = document.getElementById("youAge");
  var youUnit = document.getElementById("youUnit");
  var youStatus = document.getElementById("youStatus");

  if (youGrid && youMass && youAge && youUnit) {
    var EARTH_G = 9.80665;       // standard gravity, m/s^2
    var EARTH_YEAR = 365.25;     // days, matching facts.orbital.days

    function fmtMass(v) {
      if (!isFinite(v)) return "—";
      return v >= 100 ? v.toFixed(0) : v.toFixed(1);
    }
    function fmtYears(v) {
      if (!isFinite(v)) return "—";
      if (v >= 100) return v.toFixed(0);
      if (v >= 10) return v.toFixed(1);
      return v.toFixed(2);
    }

    function renderYou() {
      var mass = parseFloat(youMass.value);
      var age = parseFloat(youAge.value);
      var unit = youUnit.value === "lb" ? "lb" : "kg";
      var haveMass = isFinite(mass) && mass > 0;
      var haveAge = isFinite(age) && age >= 0;

      /* Collected during the same pass that builds the grid, rather than looked
         up again afterwards. The announcement needs the heaviest and lightest
         worlds, and re-deriving them with getPlanet("jupiter") meant a second
         traversal plus two results that then had to be null-checked — for ids
         that are right here in the array being walked. */
      var extremes = null;

      var html = S.planets.map(function (p) {
        var g = parseFloat(p.facts.gravity.value);
        var days = p.facts.orbital.days;
        var w = haveMass ? mass * (g / EARTH_G) : NaN;
        var yrs = haveAge && days ? age * (EARTH_YEAR / days) : NaN;
        var isEarth = p.id === "earth";
        if (haveMass && isFinite(w)) {
          if (!extremes) extremes = { hiName: p.name, hi: w, loName: p.name, lo: w };
          if (w > extremes.hi) { extremes.hi = w; extremes.hiName = p.name; }
          if (w < extremes.lo) { extremes.lo = w; extremes.loName = p.name; }
        }
        return (
          '<a class="you-card' + (isEarth ? " you-card--home" : "") +
            '" href="planet/' + attr(p.id) + '.html" style="--c: ' + attr(p.color) + '">' +
            '<span class="you-card__name">' + esc(p.name) + "</span>" +
            '<span class="you-card__stat"><b class="tnum">' + esc(fmtMass(w)) +
              '</b><span class="unit">' + esc(unit) + "</span></span>" +
            '<span class="you-card__stat you-card__stat--age"><b class="tnum">' +
              esc(fmtYears(yrs)) + '</b><span class="unit">yr' +
              (isEarth ? "" : "s here") + "</span></span>" +
          "</a>"
        );
      }).join("");
      youGrid.innerHTML = html;

      /* Screen readers get the two ends of the range rather than all eight
         cards read out in sequence, which is the point the grid is making. */
      if (youStatus && extremes) {
        youStatus.textContent =
          "Heaviest on " + extremes.hiName + " at " + fmtMass(extremes.hi) + " " + unit +
          "; lightest on " + extremes.loName + " at " + fmtMass(extremes.lo) + " " + unit + ".";
      } else if (youStatus) {
        youStatus.textContent = "";
      }
    }

    youMass.addEventListener("input", renderYou);
    youAge.addEventListener("input", renderYou);
    youUnit.addEventListener("change", renderYou);
    renderYou();
    var youSection = document.getElementById("you");
    if (youSection) youSection.hidden = false;
  }

  /* ── Missions: the list, plus a detail dialog ──
     Each row is a real <button>. Activating it opens a native <dialog>, which
     hands us focus trapping, Escape-to-close, a backdrop and focus restoration
     for free rather than reimplementing all four badly.

     The dialog is also the site's join: until now the landing named a spacecraft,
     instruments.html described the same hardware, and the planet pages listed the
     same missions — three descriptions with no route between them. The links at
     the bottom of the dialog connect all three. */
  var missions = S.system.landmarkMissions || [];

  set("missionsList", missions.map(function (m, i) {
    return (
      '<button class="mission-item" type="button" data-mission="' + i + '">' +
      '<span class="mission-item__name">' + esc(m.name) + "</span>" +
      '<span class="mission-item__years tnum">' + esc(m.year) + "</span>" +
      '<span class="mission-item__note">' + esc(m.agency) + " — " + esc(m.note) + "</span>" +
      '<span class="mission-item__more" aria-hidden="true">Details</span>' +
      "</button>"
    );
  }).join(""));

  var dlg = document.createElement("dialog");
  dlg.className = "mission-dialog";
  dlg.setAttribute("aria-labelledby", "missionDialogTitle");
  dlg.innerHTML =
    '<div id="missionDialogBody"></div>' +
    '<button class="mission-dialog__close btn btn--ghost btn--sm" type="button">Close</button>';
  document.body.appendChild(dlg);
  var dlgBody = dlg.querySelector("#missionDialogBody");

  /* The open dialog is reflected in the URL as #mission=<id>, the same pattern
     js/explorer.js uses for #explore. Without it the trail is one-way: open
     Voyager 2, follow its link to Saturn, press Back — and you return to a
     landing page with the dialog gone, unable to get back to where you were. */
  var suppressHistory = false;
  /* Did WE create the current #mission= history entry, or did we arrive at it?
     Closing must step back only in the first case — see the close handler. */
  var pushedByUs = false;

  function missionIndexById(id) {
    for (var k = 0; k < missions.length; k++) {
      if (missions[k].id === id) return k;
    }
    return -1;
  }
  function missionIdFromHash() {
    var h = /^#mission=([A-Za-z0-9%_-]+)$/.exec(location.hash || "");
    return h ? decodeURIComponent(h[1]) : null;
  }
  function closeDialog() {
    if (dlg.close) dlg.close();
    else dlg.removeAttribute("open");
  }
  /* One place to keep history in step. This fires for our Close button, for a
     backdrop click, AND for the browser's own Escape handling — which a click
     listener alone would miss. */
  dlg.addEventListener("close", function () {
    if (suppressHistory) { suppressHistory = false; return; }
    if (!missionIdFromHash()) return;
    /* Step back only if this entry is ours. If the dialog was opened by ARRIVING
       at #mission=... — a deep link, or the return trip from a planet page — the
       previous entry is that planet page, and going back would send the visitor
       forwards instead of closing. Strip the hash in place instead. */
    if (pushedByUs && history.length > 1) history.back();
    else history.replaceState({}, "", location.pathname + location.search);
  });

  function openMission(i, push) {
    var m = missions[i];
    if (!m) return;

    var meta = [esc(m.agency), "Launched " + esc(m.year)];
    if (m.status) meta.push(esc(m.status));

    var html =
      '<h3 class="mission-dialog__title" id="missionDialogTitle">' + esc(m.name) + "</h3>" +
      '<p class="mission-dialog__meta">' + meta.join(" · ") + "</p>" +
      '<p class="mission-dialog__note">' + esc(m.note) + "</p>";

    if (m.highlights && m.highlights.length) {
      html += '<ul class="fact-list mission-dialog__facts">' +
        m.highlights.map(function (h) {
          return '<li class="fact-item">' + esc(h) + "</li>";
        }).join("") + "</ul>";
    }

    var links = [];
    if (m.detail) {
      links.push('<a class="btn btn--ghost btn--sm" href="instruments.html#' +
        attr(m.detail) + '">The hardware →</a>');
    }
    (m.targets || []).forEach(function (id) {
      var p = window.getPlanet ? getPlanet(id) : null;
      if (!p) return;        // unknown id in the data: skip, never emit a dead link
      // ?from= lets the planet page offer a route back to this mission (js/backlink.js)
      links.push('<a class="btn btn--ghost btn--sm" href="planet/' + attr(p.id) + '.html?from=' +
        encodeURIComponent(m.id || "") + '">' + esc(p.name) + " →</a>");
    });
    if (links.length) {
      html += '<div class="mission-dialog__links">' +
        '<span class="kicker-label">Where this leads</span>' +
        '<div class="mission-dialog__linkrow">' + links.join("") + "</div>" +
        "</div>";
    }

    dlgBody.innerHTML = html;
    var wasOpen = dlg.open;
    if (push === false) {
      pushedByUs = false;          // we arrived at this URL; we did not create it
    } else if (m.id && missionIdFromHash() !== m.id) {
      /* Swapping missions while the dialog is ALREADY open must replace the entry,
         not stack a second one. Pushing on every row click meant Close stepped back
         to the previously viewed mission, which popstate then re-opened — so the
         dialog visibly closed and immediately reappeared, and Close had to be
         pressed twice. The entry being replaced is still the one we pushed (or
         arrived at), so pushedByUs stays as it is. */
      if (wasOpen) history.replaceState({ mission: m.id }, "", "#mission=" + encodeURIComponent(m.id));
      else {
        history.pushState({ mission: m.id }, "", "#mission=" + encodeURIComponent(m.id));
        pushedByUs = true;
      }
    }
    if (wasOpen) return;                 // already showing: content swapped in place
    if (dlg.showModal) dlg.showModal();
    else dlg.setAttribute("open", "");   // no <dialog> support: inline but readable
  }

  var mList = document.getElementById("missionsList");
  if (mList) {
    mList.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-mission]");
      if (btn) openMission(parseInt(btn.getAttribute("data-mission"), 10));
    });
  }
  dlg.addEventListener("click", function (e) {
    if (e.target.closest(".mission-dialog__close")) { closeDialog(); return; }
    /* A backdrop click reports the <dialog> itself as the target — but so does a
       click on the dialog's OWN padding (clamp(20px,3vw,32px)), because that is
       inside its box. Testing e.target === dlg alone therefore closed the dialog
       when you clicked the gutter beside the title or next to a link row.
       Hit-test the border box instead. e.detail guards against synthetic clicks,
       whose clientX/Y are 0 and would read as "outside". */
    if (e.target !== dlg || !e.detail) return;
    var r = dlg.getBoundingClientRect();
    var inside = e.clientX >= r.left && e.clientX <= r.right &&
                 e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) closeDialog();
  });

  function syncFromHash() {
    var id = missionIdFromHash();
    var idx = id ? missionIndexById(id) : -1;
    if (idx >= 0) { openMission(idx, false); return; }
    if (dlg.open) { suppressHistory = true; closeDialog(); }
  }
  window.addEventListener("popstate", syncFromHash);
  // Covers a deep link, and the Back trip from a planet page opened out of the
  // dialog — including when the browser restores the page from bfcache.
  window.addEventListener("pageshow", function (e) { if (e.persisted) syncFromHash(); });
  syncFromHash();

  /* ── credit line ──
     meta.sources was authored but rendered nowhere, so "every value comes from
     public NASA data" was a claim the page asked you to take on trust. The
     volatile figures — moon counts above all — are exactly the ones a reader
     should be able to check, so list the sources where that claim is made. */
  var credit = document.getElementById("creditTag");
  if (credit) {
    var srcs = (S.meta && S.meta.sources) || [];
    if (srcs.length) {
      credit.innerHTML = "Data: " + srcs.map(function (s) {
        return '<a href="' + attr(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + "</a>";
      }).join(" · ");
    }
    if (S.system.textures && S.system.textures.credit) {
      credit.insertAdjacentHTML("beforeend", ' · <span class="text-lo">' + esc(S.system.textures.credit) + "</span>");
    }
  }
})();
