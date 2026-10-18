/* ============================================================
   Solar System — "On this page" for the long articles
   ------------------------------------------------------------
   Builds a contents list from the article's own headings -- every h2 in
   #article has an id, and so do the timeline stages and instruments under
   them -- so it can never disagree with the page it lists.

   Wide screens (>= 1200px) show it as a sticky rail beside the text, with
   the section being read marked (aria-current="location") and that
   section's stages or instruments listed under it. Narrower screens get the
   same list as a closed disclosure above the article. A "Back to top"
   button appears once the reader is well into the page, clear of the
   phone tab bar.

   An enhancement only: without JS the article reads exactly as before.
   Load BEFORE js/reveal.js, which observes the elements this file moves.
   ============================================================ */
(function () {
  "use strict";

  var article = document.getElementById("article");
  if (!article || !article.parentNode || !window.SolarUtil) return;
  var esc = SolarUtil.esc, attr = SolarUtil.attr;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var text = function (el) { return el.textContent.replace(/\s+/g, " ").trim(); };

  /* A heading's part of the page is NOT just its own <section>: on
     formation.html the ten-stage timeline follows "The nebular hypothesis"
     as a sibling. So each h2 owns every child of #article from its section
     up to the next one -- for the stages listed under it, and for knowing
     which part is being read. */
  var parts = [];          // { head, members: [elements] }, in page order
  each(article.children, function (child) {
    var h = child.classList.contains("article__section") ? child.querySelector("h2[id]") : null;
    if (h && h.parentNode === child) parts.push({ head: h, members: [] });
    if (parts.length) parts[parts.length - 1].members.push(child);
  });
  if (parts.length < 2) return;

  /* ── the list ─────────────────────────────────────────────── */
  var items = "";
  parts.forEach(function (part) {
    var sub = "";
    part.members.forEach(function (m) {
      each(m.querySelectorAll("h3.timeline__title[id], h3.instrument__name[id]"), function (s) {
        sub += '<li><a href="#' + attr(s.id) + '">' + esc(text(s)) + "</a></li>";
      });
    });
    items += '<li class="toc__item"><a href="#' + attr(part.head.id) + '">' + esc(text(part.head)) + "</a>" +
      (sub ? '<ol class="toc__sub">' + sub + "</ol>" : "") + "</li>";
  });

  var toc = document.createElement("details");
  toc.className = "toc";
  toc.innerHTML =
    '<summary class="toc__summary">On this page' +
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 6 8 10.5 12.5 6" ' +
      'stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    "</summary>" +
    '<nav aria-label="On this page"><ol class="toc__list">' + items + "</ol></nav>";

  /* The rail and the article share one grid (css/content.css); the list
     comes first in the DOM so it is also first in reading order. */
  var layout = document.createElement("div");
  layout.className = "article-layout";
  article.parentNode.insertBefore(layout, article);
  layout.appendChild(toc);
  layout.appendChild(article);

  /* Open as a rail on wide screens, closed above the article otherwise. */
  var wide = window.matchMedia ? window.matchMedia("(min-width: 1200px)") : null;
  var syncOpen = function () { toc.open = !!(wide && wide.matches); };
  syncOpen();
  if (wide) {
    if (wide.addEventListener) wide.addEventListener("change", syncOpen);
    else if (wide.addListener) wide.addListener(syncOpen);
  }
  /* On a phone the list sits at the top of the article; once a link has
     been followed, fold it away so "Back to top" returns to a tidy page. */
  toc.addEventListener("click", function (e) {
    if (e.target.closest("a") && !(wide && wide.matches)) toc.open = false;
  });

  /* ── the section being read ──────────────────────────────────
     A thin band across the middle of the viewport, as js/reveal.js does
     for the landing's nav: immune to section height, and when two sections
     share the band the one whose centre is nearer wins. */
  var links = toc.querySelectorAll(".toc__item > a");
  function setCurrent(i) {
    each(links, function (a, j) {
      if (j === i) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
      a.parentNode.classList.toggle("is-current", j === i);
    });
  }
  if ("IntersectionObserver" in window) {
    var watched = [], owner = [];    // every member element, and the part it belongs to
    parts.forEach(function (part, i) {
      part.members.forEach(function (m) { watched.push(m); owner.push(i); });
    });
    var io = new IntersectionObserver(function (entries) {
      var best = -1, bestDist = Infinity, mid = window.innerHeight / 2;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var r = e.boundingClientRect;
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) { bestDist = d; best = owner[watched.indexOf(e.target)]; }
      });
      if (best > -1) setCurrent(best);
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    watched.forEach(function (m) { io.observe(m); });
  }

  /* ── back to top ─────────────────────────────────────────────
     Inside <main> so it belongs to a landmark, but never inside .panel:
     its backdrop-filter would become the containing block for position:fixed.
     Hidden with visibility, not just opacity, so it is never an invisible
     tab stop. */
  var main = document.querySelector("main");
  if (!main) return;
  var topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML =
    '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M3.5 10 8 5.5 12.5 10" ' +
    'stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  main.appendChild(topBtn);

  var shown = false, queued = false;
  function check() {
    queued = false;
    var on = window.scrollY > window.innerHeight * 1.5;
    if (on !== shown) { shown = on; topBtn.classList.toggle("is-shown", on); }
  }
  window.addEventListener("scroll", function () {
    if (!queued) { queued = true; window.requestAnimationFrame(check); }
  }, { passive: true });
  check();

  topBtn.addEventListener("click", function () {
    /* html { scroll-behavior: smooth } animates this, and is off under
       reduced motion (css/main.css). Focus follows to the page's heading so a
       keyboard user continues from the top rather than from a button that is
       about to disappear. */
    window.scrollTo(0, 0);
    var h1 = document.querySelector("main h1");
    if (h1) {
      h1.setAttribute("tabindex", "-1");
      try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); }
    }
  });
})();
