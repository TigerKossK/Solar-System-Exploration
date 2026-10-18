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

  /* Web storage that never throws. Private windows, blocked site data and some
     file:// setups make every access throw; a remembered preference is a
     convenience, so failing to remember one must never break the page.
     store = localStorage (preferences); session = sessionStorage, for things
     that should not outlive the tab -- like the weight and age typed into the
     calculator, which the next person at a shared computer has no business
     seeing. */
  function webStore(kind) {
    return {
      get: function (k) { try { return window[kind].getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { window[kind].setItem(k, String(v)); } catch (e) { /* not stored */ } },
      remove: function (k) { try { window[kind].removeItem(k); } catch (e) { /* nothing to do */ } },
    };
  }
  var store = webStore("localStorage");
  var session = webStore("sessionStorage");

  /* Planets this browser has opened: a quiet "where have I been?" mark on the
     map and in the Planets sheet. A convenience kept in localStorage only,
     never sent anywhere, and clearable. Consumers only ever COMPARE stored
     ids against the known planet ids; a stored string is never rendered. */
  var visited = {
    list: function () {
      var v = store.get("solar.visited");
      return v ? v.split(",").filter(function (id) { return /^[a-z]{1,20}$/.test(id); }) : [];
    },
    has: function (id) { return visited.list().indexOf(id) > -1; },
    add: function (id) {
      if (!/^[a-z]{1,20}$/.test(id || "") || visited.has(id)) return;
      store.set("solar.visited", visited.list().concat(id).join(","));
    },
    clear: function () { store.remove("solar.visited"); },
  };
  /* A planet page counts as opened as soon as it loads. */
  var here = document.body && document.body.getAttribute && document.body.getAttribute("data-planet");
  if (here) visited.add(here);

  /* Single-character shortcuts ("/" for search, "?" for the shortcut list)
     can be switched off -- WCAG 2.1.4: a speech-input user saying a word can
     fire them by accident. The switch lives in the shortcut list
     (js/keyboard.js); Ctrl/Cmd+K is not a single key and always works. */
  function singleKeys() {
    return store.get("solar.keys") !== "off";
  }

  /* Was this click on a modal <dialog>'s backdrop? A backdrop click reports the
     dialog itself as the target -- but so does a click on the dialog's own
     padding, so test the border box. e.detail is 0 for synthetic and keyboard
     clicks, whose clientX/Y of 0 would otherwise read as "outside". */
  function backdropHit(dlg, e) {
    if (e.target !== dlg || !e.detail) return false;
    var r = dlg.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  }

  /* This page's shareable address, optionally with a fragment. Query strings
     are dropped: ?from= is a private return trip (js/backlink.js), not part of
     what someone else should be sent. */
  function pageUrl(hash) {
    return location.href.replace(/[?#].*$/, "") + (hash ? "#" + hash : "");
  }

  /* Where anything temporary must be attached. A modal <dialog> makes the rest
     of the page inert, so a helper element appended to <body> while one is
     open can be neither selected (copy fails) nor seen (it renders under the
     dialog's backdrop). */
  function host() {
    return document.querySelector("dialog[open]") || document.body;
  }

  /* Copy text. The async Clipboard API exists only in a secure context, and
     this site also runs from file://, so the old select-and-copy route is the
     fallback. Resolves true or false; never rejects. */
  function copyText(text) {
    function legacy() {
      var before = document.activeElement;
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      host().appendChild(ta);
      ta.select();
      var done = false;
      try { done = document.execCommand("copy"); } catch (e) { done = false; }
      ta.parentNode.removeChild(ta);
      if (before && before.focus) { try { before.focus({ preventScroll: true }); } catch (e) { before.focus(); } }
      return done;
    }
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return legacy(); }
      );
    }
    return Promise.resolve(legacy());
  }

  /* One short confirmation at a time ("Link copied"), announced politely.
     The region is created on first use; its first message is set a beat later,
     because a live region that appears already holding text is not read. */
  var toastEl = null, toastTimer = 0, clearTimer = 0;
  function toast(msg) {
    var fresh = !toastEl;
    if (fresh) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
    }
    if (toastEl.parentNode !== host()) host().appendChild(toastEl);
    var show = function () {
      clearTimeout(toastTimer);
      clearTimeout(clearTimer);
      toastEl.textContent = msg;
      toastEl.classList.add("is-shown");
      toastTimer = setTimeout(function () {
        toastEl.classList.remove("is-shown");
        // empty it once faded, so a screen reader browsing later finds no stale message
        clearTimer = setTimeout(function () { toastEl.textContent = ""; }, 400);
      }, 2600);
    };
    if (fresh) setTimeout(show, 60); else show();
  }

  /* Share a page: the system share sheet where there is one (phones, some
     desktops), otherwise copy the link. Closing the sheet is not a failure. */
  function share(data) {
    var url = data.url || pageUrl();
    var copy = function () {
      return copyText(url).then(function (ok) {
        toast(ok ? "Link copied" : "Couldn't copy the link. Use the address bar instead.");
      });
    };
    if (navigator.share) {
      return navigator.share({ title: data.title || document.title, url: url }).catch(function (e) {
        if (e && e.name === "AbortError") return undefined;
        return copy();
      });
    }
    return copy();
  }

  window.SolarUtil = {
    esc: esc, attr: attr,
    isTyping: isTyping, dialogOpen: dialogOpen, pageName: pageName,
    store: store, session: session, visited: visited, singleKeys: singleKeys, backdropHit: backdropHit,
    pageUrl: pageUrl, copyText: copyText, toast: toast, share: share,
  };
})();
