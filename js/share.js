/* ============================================================
   Solar System — copy a section link, share a page
   ------------------------------------------------------------
   Two small ways to send someone to the exact thing you are reading:

   - a link button on each section heading (articles and planet pages),
     which copies the address of that section and puts it in the address
     bar too, so the fallback message "use the address bar" is true;
   - a Share button on planet pages and articles: the system share sheet
     where there is one, otherwise the link is copied.

   The button sits INSIDE its heading, after the text, which is where people
   look for it. The heading gets its own text as aria-label, so heading
   navigation still reads "Key facts", not "Key facts Copy link...".
   Uses SolarUtil.copyText / toast / share / pageUrl (js/util.js).
   ============================================================ */
(function () {
  "use strict";
  var U = window.SolarUtil;
  if (!U || !U.copyText) return;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var text = function (el) { return el.textContent.replace(/\s+/g, " ").trim(); };

  var LINK_ICON =
    '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2.2-2.2a2.6 2.6 0 0 0-3.7-3.7l-.9.9"/>' +
    '<path d="M9.2 6.8a2.6 2.6 0 0 0-3.7 0L3.3 9a2.6 2.6 0 0 0 3.7 3.7l.9-.9"/></svg>';
  var SHARE_ICON =
    '<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M8 10V2.5M5 5.2 8 2.3l3 2.9"/><path d="M5.5 7.5H4.2a1 1 0 0 0-1 1v4.3a1 1 0 0 0 1 1h7.6a1 1 0 0 0 1-1V8.5a1 1 0 0 0-1-1h-1.3"/></svg>';

  /* ── section links ── an article section links to its own h2 id; a planet
     dashboard section to the SECTION's id (#key, #moons ...), which is what
     search results already use. */
  var targets = [];
  each(document.querySelectorAll("#article .article__section > h2[id]"), function (h) {
    targets.push({ head: h, id: h.id });
  });
  each(document.querySelectorAll("#dashboard .dash-section[id] > .section-head > h2"), function (h) {
    targets.push({ head: h, id: h.parentNode.parentNode.id });
  });

  targets.forEach(function (t) {
    var name = text(t.head);
    t.head.setAttribute("aria-label", name);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "heading-link";
    btn.setAttribute("aria-label", "Copy link to this section");
    btn.innerHTML = LINK_ICON;
    btn.addEventListener("click", function () {
      try { history.replaceState(history.state, "", "#" + t.id); } catch (e) { /* file:// quirks */ }
      U.copyText(U.pageUrl(t.id)).then(function (ok) {
        U.toast(ok ? "Link to “" + name + "” copied"
                   : "Couldn't copy. The link to this section is in the address bar.");
      });
    });
    t.head.appendChild(btn);
  });

  /* ── share this page ── planet pages: at the end of the neighbour row;
     articles: under the opening paragraph. */
  var spot = document.querySelector(".planet-topbar") || document.querySelector(".content-hero");
  if (spot) {
    var share = document.createElement("button");
    share.type = "button";
    share.className = "btn btn--ghost btn--sm share-btn";
    share.innerHTML = SHARE_ICON + "Share";
    share.addEventListener("click", function () {
      U.share({ title: document.title, url: U.pageUrl() });
    });
    spot.appendChild(share);
  }
})();
