/* ============================================================
   Solar System — shared helpers
   ------------------------------------------------------------
   esc() was duplicated verbatim in js/solar-system.js and
   js/sections.js, so it lives here once instead. Load this
   BEFORE any script that uses it — every page does, and site
   search, the map, Explorer and the tab bar all rely on it.
   Add shared helpers HERE rather than copying them per file.

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

  /* True while the visitor is typing. Every keyboard shortcut on the site must
     stand aside then — ←/→ moved the map behind the search box while it held
     the cursor. */
  function isTyping(e) {
    var t = e && e.target;
    if (!t) return false;
    return /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || "") || !!t.isContentEditable;
  }

  /* A modal <dialog> owns the keyboard while it is open. Escape in the search
     box reached Explorer's document-level handler too, and closed both. */
  function dialogOpen() {
    return !!document.querySelector("dialog[open]");
  }

  /* This page's file name. The site is served from /Solar-System-Exploration/,
     so the landing's canonical URL ends in "/" and its empty last segment IS
     index.html. The old inline version stripped trailing slashes first and so
     answered "Solar-System-Exploration" on the live homepage. */
  function pageName() {
    return location.pathname.split("/").pop() || "index.html";
  }

  /* localStorage that never throws. Private windows, blocked site data and some
     file:// setups make every access throw; a remembered preference is a
     convenience, so failing to remember one must never break the page. */
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, String(v)); } catch (e) { /* not stored */ } },
    remove: function (k) { try { window.localStorage.removeItem(k); } catch (e) { /* nothing to do */ } },
  };

  window.SolarUtil = {
    esc: esc, attr: attr,
    isTyping: isTyping, dialogOpen: dialogOpen, pageName: pageName,
    store: store,
  };
})();
