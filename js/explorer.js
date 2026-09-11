/* ============================================================
   Solar System — in-page Explorer mode
   "Explore the planets" opens a focused, full-screen version of the SAME
   map without a reload: body.is-exploring lets CSS grow the orrery and
   recede the surrounding page, and reveals the shared preview panel's
   Return control + fun-facts. Planet interaction is unchanged from the
   menu (hover / focus / tap previews, via js/solar-system.js) — Explorer
   only changes the layout, so the map behaves identically in both places.
   Browser Back / Esc / the Return button all leave. Reflected in the URL
   (#explore) so history works. Without JS the CTA scrolls to the planet
   list, which still navigates.
   ============================================================ */
(function () {
  "use strict";
  var body = document.body;
  var cta = document.getElementById("primaryCta");
  var panel = document.getElementById("readout");
  var exitBtn = document.getElementById("exitExplore");
  var funFacts = document.getElementById("readoutFunFacts");
  var explore = document.getElementById("readoutExplore");
  if (!cta || !panel) return;

  var isOn = function () { return body.classList.contains("is-exploring"); };

  /* the shared panel adapts to the mode: Return + fun-facts appear, and the
     open action steps up from a ghost to the primary pill. */
  function setExpanded(on) {
    if (exitBtn) exitBtn.hidden = !on;
    if (funFacts) funFacts.hidden = !on;
    if (explore) {
      explore.classList.toggle("btn--primary", on);
      explore.classList.toggle("btn--ghost", !on);
    }
  }

  function enter(push) {
    if (isOn()) return;
    body.classList.add("is-exploring");
    setExpanded(true);
    if (push !== false && location.hash !== "#explore") {
      history.pushState({ explore: true }, "", "#explore");
    }
    if (exitBtn) exitBtn.focus();
  }
  function exit() {
    if (!isOn()) return;
    body.classList.remove("is-exploring");
    setExpanded(false);
    if (cta) cta.focus();
  }

  cta.addEventListener("click", function (e) {
    e.preventDefault();
    enter();
  });
  if (exitBtn) {
    exitBtn.addEventListener("click", function () {
      if (location.hash === "#explore" && history.length > 1) history.back();
      else { exit(); history.replaceState({}, "", location.pathname + location.search); }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOn()) {
      if (location.hash === "#explore" && history.length > 1) history.back(); else exit();
    }
  });
  window.addEventListener("popstate", function () {
    if (location.hash === "#explore") enter(false); else exit();
  });

  /* deep link: open straight into the explorer */
  if (location.hash === "#explore") enter(false);
})();
