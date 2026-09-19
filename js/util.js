/* ============================================================
   Solar System — shared helpers
   ------------------------------------------------------------
   esc() was duplicated verbatim in js/solar-system.js and
   js/sections.js, so it lives here once instead. Load this
   BEFORE any script that uses it.

   formation/exploration/instruments.html also load this file
   although nothing on them consumes it yet — kept in place
   deliberately, since the site search planned for those pages
   needs both helpers below.

   Deliberately a plain global (no modules) to match the rest of
   the site: every script is a classic <script>, so the pages keep
   working from file:// and need no build step.
   ============================================================ */
(function () {
  "use strict";

  /* Escape text destined for innerHTML. Covers the three characters that can
     break out of element CONTENT. Not sufficient for an attribute value — use
     attr() there, since a bare esc() leaves quotes intact and a value
     containing one would close the attribute early. */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* Escape for a double-quoted attribute value. Mirrors the attr() helper in
     scripts/build-planets.js so the runtime and the generator escape alike. */
  function attr(s) {
    return esc(s).replace(/"/g, "&quot;");
  }

  window.SolarUtil = { esc: esc, attr: attr };
})();
