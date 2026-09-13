/* ============================================================
   Solar System — scroll reveals + nav active state
   Adds .is-visible to .reveal elements as they enter the viewport
   (staggered by data-reveal-delay). Fully disabled under
   prefers-reduced-motion — everything shows immediately.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var targets = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    each(targets, function (t) { t.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var d = e.target.getAttribute("data-reveal-delay");
      if (d) e.target.style.transitionDelay = (parseInt(d, 10) * 80) + "ms";
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    });
  /* threshold 0, NOT a ratio. intersectionRatio is visibleHeight/elementHeight, so
     a .reveal wrapper taller than roughly 7.7x the viewport can never reach 0.12 and
     would stay at opacity:0 permanently — which is exactly what happened to the whole
     formation.html timeline at high zoom. rootMargin alone already delays the trigger.
     Same failure mode as the nav observer below; both are now height-independent. */
  }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
  each(targets, function (t) { io.observe(t); });

  /* nav active state — highlight the topbar link for the section in view */
  var links = {};
  each(document.querySelectorAll(".topbar .nav__links a[href^='#']"), function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var sections = document.querySelectorAll("main.scroll .section[id]");
  if (sections.length) {
    /* A centre-line test, not a ratio: sections are min-height:100vh, so any section
       taller than twice the viewport can never reach a 0.5 intersection ratio and would
       never highlight its nav link. This band is immune to section height. */
    var navIo = new IntersectionObserver(function (entries) {
      /* Two adjacent sections can sit in the band at once while their shared edge
         crosses it. IntersectionObserver does not guarantee entry order, so pick the
         section whose centre is nearest the viewport centre — otherwise which link
         highlights would depend on array order, and flicker at every boundary. */
      var best = null, bestDist = Infinity, mid = window.innerHeight / 2;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var r = e.boundingClientRect;
        var d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) { bestDist = d; best = e.target; }
      });
      if (!best) return;
      Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
      if (links[best.id]) links[best.id].setAttribute("aria-current", "true");
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    each(sections, function (s) { navIo.observe(s); });
  }
})();
