/* ============================================================
   Solar System — return link on a planet page
   ------------------------------------------------------------
   A planet page reached from a mission dialog has no idea what sent it there:
   "Back to the Solar System" returns to the index, not to the mission you were
   reading. So the dialog appends ?from=<mission id> and this renders a matching
   return link that reopens that mission.

   The id is validated against a strict pattern and then used only to build a
   hash and a display label — no untrusted text is ever inserted as HTML.
   Does nothing without the parameter, so a directly-visited planet page is
   completely unaffected.
   ============================================================ */
(function () {
  "use strict";

  /* Planet pages do not load js/data.js, so the mission list is mirrored here.
     Pattern-matching alone was not enough: ?from=nope passed the character class
     and rendered "Back to Nope" pointing at #mission=nope, which opens nothing —
     a dead link the visitor was invited to click. Anything not on this list now
     renders no bar at all.

     Keys are system.landmarkMissions[].id in js/data.js; values are the display
     names, which must match m.name there or the return trip is labelled with a
     different string than the dialog it reopens (Cassini–Huygens takes an EN
     DASH, which the old title-casing turned into "Cassini Huygens"). */
  var MISSIONS = {
    "voyager-1": "Voyager 1",
    "voyager-2": "Voyager 2",
    "galileo": "Galileo",
    "cassini-huygens": "Cassini–Huygens",
    "new-horizons": "New Horizons",
    "juno": "Juno",
    "parker-solar-probe": "Parker Solar Probe",
    "perseverance": "Perseverance",
  };

  var found = /[?&]from=([A-Za-z0-9-]{1,40})(?:&|$)/.exec(location.search);
  if (!found) return;
  var id = found[1].toLowerCase();
  var label = Object.prototype.hasOwnProperty.call(MISSIONS, id) ? MISSIONS[id] : null;
  if (!label) return;      // unknown id: no bar, rather than a link that goes nowhere

  var hero = document.querySelector(".planet-hero");
  if (!hero || !hero.parentNode) return;

  var link = document.createElement("a");
  link.className = "back";
  link.href = "../index.html#mission=" + encodeURIComponent(id);
  link.innerHTML =
    '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">' +
    '<path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" stroke-width="1.7" ' +
    'fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  link.appendChild(document.createTextNode("Back to " + label));

  var bar = document.createElement("div");
  bar.className = "backlink-bar";
  bar.appendChild(link);
  hero.parentNode.insertBefore(bar, hero);
})();
