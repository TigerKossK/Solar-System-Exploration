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
  var esc = window.SolarUtil.esc;   // shared helper — js/util.js
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
        esc(m.detail) + '">The hardware →</a>');
    }
    (m.targets || []).forEach(function (id) {
      var p = window.getPlanet ? getPlanet(id) : null;
      if (!p) return;        // unknown id in the data: skip, never emit a dead link
      // ?from= lets the planet page offer a route back to this mission (js/backlink.js)
      links.push('<a class="btn btn--ghost btn--sm" href="planet/' + p.id + '.html?from=' +
        encodeURIComponent(m.id || "") + '">' + esc(p.name) + " →</a>");
    });
    if (links.length) {
      html += '<div class="mission-dialog__links">' +
        '<span class="kicker-label">Where this leads</span>' +
        '<div class="mission-dialog__linkrow">' + links.join("") + "</div>" +
        "</div>";
    }

    dlgBody.innerHTML = html;
    if (push === false) {
      pushedByUs = false;          // we arrived at this URL; we did not create it
    } else if (m.id && missionIdFromHash() !== m.id) {
      history.pushState({ mission: m.id }, "", "#mission=" + encodeURIComponent(m.id));
      pushedByUs = true;
    }
    if (dlg.open) return;                // already showing: content swapped in place
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
    // e.target === dlg means the click landed on the backdrop, not the content
    if (e.target === dlg || e.target.closest(".mission-dialog__close")) closeDialog();
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

  /* ── credit line ── */
  var credit = document.getElementById("creditTag");
  if (credit && S.system.textures && S.system.textures.credit) {
    credit.insertAdjacentHTML("beforeend", ' · <span class="text-lo">' + esc(S.system.textures.credit) + "</span>");
  }
})();
