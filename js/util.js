/* ============================================================
   Solar System — shared helpers
   ------------------------------------------------------------
   esc() was duplicated verbatim in js/solar-system.js and
   js/sections.js; the content pages need a third copy, so it
   lives here once. Load this BEFORE any script that uses it.

   Deliberately a plain global (no modules) to match the rest of
   the site: every script is a classic <script>, so the pages keep
   working from file:// and need no build step.
   ============================================================ */
(function () {
  "use strict";

  /* Escape text destined for innerHTML. Covers the three characters that can
     break out of element content; attribute values are never built from
     untrusted input here, so quotes are intentionally not escaped. */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  window.SolarUtil = { esc: esc };
})();
