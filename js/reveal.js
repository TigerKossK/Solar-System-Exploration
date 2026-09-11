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
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  each(targets, function (t) { io.observe(t); });

  /* nav active state — highlight the topbar link for the section in view */
  var links = {};
  each(document.querySelectorAll(".topbar .nav__links a[href^='#']"), function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  var sections = document.querySelectorAll("main.scroll .section[id]");
  if (sections.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        if (links[e.target.id]) links[e.target.id].setAttribute("aria-current", "true");
      });
    }, { threshold: 0.5 });
    each(sections, function (s) { navIo.observe(s); });
  }
})();
