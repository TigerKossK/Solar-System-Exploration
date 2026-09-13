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

  var ticking = false;
  function clamp01(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }
  function seg(p, a, b) { return clamp01((p - a) / (b - a)); }

  function update() {
    ticking = false;
    var rect = root.getBoundingClientRect();
    // Beat fully scrolled past: leave the layers at their final state rather
    // than recomputing nine custom properties on every frame for the rest of
    // the page. The next scroll back into view resumes it immediately.
    if (rect.bottom < 0) return;
    var top = rect.top + window.scrollY;                   // section's document offset
    var runway = root.offsetHeight - window.innerHeight;    // px of scroll the beat spans
    var p = runway > 0 ? clamp01((window.scrollY - top) / runway) : 0;

    var s = root.style;

    // Earth — the fly-in: scale up, drift up a hair, turn a few degrees.
    s.setProperty("--earth-scale", (1 + seg(p, 0, 1) * 0.6).toFixed(3));      // 1 → 1.6
    s.setProperty("--earth-shift", (seg(p, 0, 1) * -4).toFixed(2));           // vh, gentle rise
    s.setProperty("--earth-rot", (seg(p, 0, 1) * 3).toFixed(2));             // deg, controlled

    // Headline — leads out early so the planet takes the frame.
    s.setProperty("--copy-op", (1 - seg(p, 0.05, 0.42)).toFixed(3));
    s.setProperty("--copy-shift", (seg(p, 0, 0.42) * -70).toFixed(1));       // px, lifts away
    s.setProperty("--copy-blur", (seg(p, 0.05, 0.42) * 5).toFixed(2));       // px, motion depth

    // Control bar — sinks and fades with a touch of lag.
    s.setProperty("--bar-op", (1 - seg(p, 0.08, 0.40)).toFixed(3));
    s.setProperty("--bar-shift", (seg(p, 0, 0.40) * 34).toFixed(1));         // px, settles down

    // Ambient teal seat — brightens into the fly-in, then clears for hand-off.
    s.setProperty("--wedge-op", (0.7 + seg(p, 0, 0.5) * 0.3 - seg(p, 0.6, 1) * 0.75).toFixed(3));
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  update(); // initial state (also correct on reload mid-page)
  window.addEventListener("scroll", onScroll, { passive: true });
  // through the same rAF gate as scroll: update() opens with a forced reflow
  // (getBoundingClientRect) then writes nine properties, and dragging a window
  // edge fires resize dozens of times a second.
  window.addEventListener("resize", onScroll, { passive: true });
})();
