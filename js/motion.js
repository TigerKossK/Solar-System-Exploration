/* ============================================================
   Solar System — "Pause motion" (WCAG 2.2.2 Pause, Stop, Hide)
   ------------------------------------------------------------
   Everything on the site that moves by itself -- the orbits and both Suns
   (CSS, keyed off html[data-motion="paused"]) plus the WebGL
   background and button (js/background.js, js/liquid-chrome.js, which
   listen for the "solar:motion" event) -- stops with one switch, remembered
   across pages and visits. Until now the only ways to stop it were the OS
   reduced-motion setting or hovering the map, neither of which is a control.

   Load right after js/util.js and BEFORE js/background.js, so a remembered
   pause is applied before the first frame is drawn.

   Visitors with prefers-reduced-motion already get a still page from every
   one of those files, so no switch is offered to them: it would do nothing.
   ============================================================ */
(function () {
  "use strict";
  if (!window.SolarUtil) return;

  var ICON_PAUSE =
    '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
    '<path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICON_PLAY =
    '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
    '<path d="M5 3.3v9.4L12.6 8z" fill="currentColor"/></svg>';

  var root = document.documentElement;
  var store = window.SolarUtil.store;
  var KEY = "solar.motion";
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var paused = store.get(KEY) === "paused";
  var buttons = [];

  /* The button names the ACTION it will take ("Pause motion" / "Resume
     motion"), so it carries no aria-pressed as well -- doing both makes a
     screen reader announce a pressed "Resume" button, which reads backwards. */
  function apply() {
    if (paused) root.setAttribute("data-motion", "paused");
    else root.removeAttribute("data-motion");
    var label = paused ? "Resume motion" : "Pause motion";
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-label", label);
      buttons[i].title = label;
      buttons[i].innerHTML = paused ? ICON_PLAY : ICON_PAUSE;
    }
  }

  function set(on) {
    on = !!on;
    if (on === paused) return;
    paused = on;
    if (paused) store.set(KEY, "paused");
    else store.remove(KEY);
    apply();
    var ev;
    try {
      ev = new CustomEvent("solar:motion", { detail: { paused: paused } });
    } catch (e) {                           // very old engines: no CustomEvent constructor
      ev = document.createEvent("CustomEvent");
      ev.initCustomEvent("solar:motion", false, false, { paused: paused });
    }
    document.dispatchEvent(ev);
  }

  /* Another synced switch, e.g. beside the map's ◀ ▶ (js/solar-system.js). */
  function button(className) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = className;
    b.addEventListener("click", function () { set(!paused); });
    buttons.push(b);
    apply();
    return b;
  }

  window.SolarMotion = {
    /* true when nothing should animate: the visitor paused, or asked their OS
       for reduced motion */
    paused: function () { return paused || reduce; },
    set: set,
    button: button,
    offered: !reduce,
  };
  apply();

  if (reduce) return;
  /* One switch on every page, in the same bar as search. (Planet pages carry
     their own .planet-topbar.) */
  var bar = document.querySelector(".topbar__inner") || document.querySelector(".planet-topbar");
  if (bar) bar.appendChild(button("motion-toggle"));
})();
