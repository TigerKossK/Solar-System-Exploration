/* ============================================================
   Solar System — journey.js
   The opening hero as ONE scroll-scrubbed beat: the visitor "flies in"
   toward Earth. A single scroll progress p (0→1) drives layered parallax —
   Earth scales up, rises and turns a touch, while the headline lifts away
   and the control bar sinks and fades. Every layer moves by opacity +
   transform only (custom properties on .journey, read in css/journey.css),
   so there is no per-frame layout. rAF-throttled, passive listener.

   Bails under prefers-reduced-motion (CSS shows the static hero). No-op if
   .journey is absent.
   ============================================================ */
(function () {
  "use strict";

  var root = document.querySelector(".journey");
  if (!root) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var stage = root.querySelector(".journey__stage");
  if (!stage) return;

  var ticking = false;
  function clamp01(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }
  function seg(p, a, b) { return clamp01((p - a) / (b - a)); }

  /* Geometry is measured ONCE (and again only on a real resize), not on every
     animation frame. update() used to open with getBoundingClientRect() +
     offsetHeight + innerHeight -- a forced synchronous layout at the top of
     every frame while scrolling, and it kept firing for the whole ~8,000px page
     because the cheap "are we past it" bail came AFTER the reflow. */
  var docTop = 0, runway = 0;
  function measure() {
    docTop = root.getBoundingClientRect().top + window.scrollY;
    /* Runway from the two ELEMENT heights rather than window.innerHeight. The
       runway is styled in svh and the stage pins at 100svh, but innerHeight
       swings by ~180px on a phone as the URL bar collapses and re-expands --
       so the divisor changed mid-scroll and Earth's scale, the headline
       opacity and the bar position all visibly snapped every time. These two
       are styled in the same unit, so their difference is stable. */
    runway = Math.max(0, root.offsetHeight - stage.offsetHeight);
  }

  /* Off-screen means no work at all -- not "read layout, then discover we are
     off screen". Re-entering resumes on the next frame. */
  var active = true;
  function setActive(on) {
    if (on === active) return;
    active = on;
    root.classList.toggle("is-scrubbing", on);   // gates will-change (css/journey.css)
    if (on) { measure(); onScroll(); }
  }

  function update() {
    ticking = false;
    if (!active || runway <= 0) return;
    var p = clamp01((window.scrollY - docTop) / runway);

    var s = root.style;

    // Earth — the fly-in: scale up, drift up a hair, turn a few degrees.
    s.setProperty("--earth-scale", (1 + seg(p, 0, 1) * 0.6).toFixed(3));      // 1 → 1.6
    s.setProperty("--earth-shift", (seg(p, 0, 1) * -4).toFixed(2));           // vh, gentle rise
    s.setProperty("--earth-rot", (seg(p, 0, 1) * 3).toFixed(2));             // deg, controlled

    // Headline — leads out early so the planet takes the frame.
    s.setProperty("--copy-op", (1 - seg(p, 0.05, 0.42)).toFixed(3));
    s.setProperty("--copy-shift", (seg(p, 0, 0.42) * -70).toFixed(1));       // px, lifts away

    // Control bar — sinks and fades with a touch of lag.
    s.setProperty("--bar-op", (1 - seg(p, 0.08, 0.40)).toFixed(3));
    s.setProperty("--bar-shift", (seg(p, 0, 0.40) * 34).toFixed(1));         // px, settles down

    // Ambient teal seat — brightens into the fly-in, then clears for hand-off.
    s.setProperty("--wedge-op", (0.7 + seg(p, 0, 0.5) * 0.3 - seg(p, 0.6, 1) * 0.75).toFixed(3));
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  measure();
  root.classList.add("is-scrubbing");
  update();                     // initial state (also correct on reload mid-page)
  window.addEventListener("scroll", onScroll, { passive: true });

  /* WIDTH-only resizes. A phone fires resize continuously while scrolling,
     because collapsing the URL bar changes the height -- re-measuring on those
     reintroduced exactly the thrash this rewrite removes, and re-ran the whole
     scrub dozens of times a second. Orientation changes and real window drags
     both change the width, which is what actually invalidates the geometry. */
  var lastWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    measure();
    onScroll();
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      setActive(entries[0].isIntersecting);
    }, { threshold: 0 }).observe(root);
  }
})();
