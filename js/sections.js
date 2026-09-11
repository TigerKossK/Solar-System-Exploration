/* ============================================================
   Solar System — landing section content
   Renders the Sun, System-statistics and Missions sections from
   SOLAR_SYSTEM (js/data.js) so the landing shares the single
   source of truth. The primary map + planet list stay in the
   HTML, so core navigation still works without this script.
   ============================================================ */
(function () {
  "use strict";
  if (!window.SOLAR_SYSTEM) return;
  var S = window.SOLAR_SYSTEM;

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
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
    tile("Farthest craft", "Voyager 1", "", esc(st.voyager1))
  );

  /* ── Missions ── */
  set("missionsList",
    S.system.landmarkMissions.map(function (m) {
      return (
        '<div class="mission-item">' +
        '<span class="mission-item__name">' + esc(m.name) + "</span>" +
        '<span class="mission-item__years tnum">' + esc(m.year) + "</span>" +
        '<span class="mission-item__note">' + esc(m.agency) + " — " + esc(m.note) + "</span>" +
        "</div>"
      );
    }).join("")
  );

  /* ── credit line ── */
  var credit = document.getElementById("creditTag");
  if (credit && S.system.textures && S.system.textures.credit) {
    credit.insertAdjacentHTML("beforeend", ' · <span class="text-lo">' + esc(S.system.textures.credit) + "</span>");
  }
})();
