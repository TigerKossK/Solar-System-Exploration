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

  var found = /[?&]from=([A-Za-z0-9-]{1,40})(?:&|$)/.exec(location.search);
  if (!found) return;
  var id = found[1].toLowerCase();

  var hero = document.querySelector(".planet-hero");
  if (!hero || !hero.parentNode) return;

  /* "voyager-2" -> "Voyager 2". Derived from the validated id rather than passed
     through the URL, so there is no attacker-controlled string to escape. */
  var label = id.split("-").map(function (w) {
    return w ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  }).join(" ");

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
