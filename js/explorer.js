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

  /* Did WE create the current #explore history entry, or did we arrive at it?
     Leaving may step back only in the first case. history.length is NOT a
     substitute: it counts the whole tab session across origins, so a visitor who
     followed a shared or bookmarked #explore link from any other site satisfied
     history.length > 1 and was ejected off-site instead of closing Explorer.
     Same flag pattern js/sections.js already uses for the mission dialog. */
  var pushedByUs = false;

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
    if (push === false) {
      pushedByUs = false;              // we arrived at this URL; we did not create it
    } else if (location.hash !== "#explore") {
      history.pushState({ explore: true }, "", "#explore");
      pushedByUs = true;
    }
    if (exitBtn) exitBtn.focus();
  }
  function exit(keepFocus) {
    if (!isOn()) return;
    body.classList.remove("is-exploring");
    setExpanded(false);
    if (cta && !keepFocus) cta.focus();
  }

  /* The single "leave Explorer" path, shared by the Return button and Escape, so
     the two can never disagree about how history is unwound. */
  function leave() {
    if (pushedByUs) { history.back(); return; }   // popstate then runs exit()
    /* Deep-linked straight into #explore: there is no entry of ours to go back
       to. Strip the hash in place — otherwise it lingers, enter() later sees it
       and skips its pushState, and the next Back press leaves the site. */
    exit();
    if (location.hash === "#explore") {
      history.replaceState({}, "", location.pathname + location.search);
    }
  }

  cta.addEventListener("click", function (e) {
    e.preventDefault();
    enter();
  });
  if (exitBtn) exitBtn.addEventListener("click", leave);

  /* Explorer hides every non-menu section (display:none, css/sections.css), so the
     Sun's "Open" link (href="#sun-section") would target an invisible element and the
     click would appear to do nothing. Leave Explorer first, then let the BROWSER do the
     fragment navigation: that gives the smooth scroll, a real history entry (so Back
     returns to Explorer) and the focus target for free — all of which a hand-rolled
     preventDefault + scrollIntoView would have to reimplement, and get wrong.
     Planet-page links and modifier-clicks fall through untouched. */
  if (explore) {
    explore.addEventListener("click", function (e) {
      var href = explore.getAttribute("href") || "";
      if (!isOn() || href.charAt(0) !== "#") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button > 0)) return;
      exit(true);   // keep focus — the anchor navigation sets the focus target itself
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !isOn()) return;
    leave();
  });
  window.addEventListener("popstate", function () {
    if (location.hash === "#explore") enter(false);
    else { exit(); pushedByUs = false; }
  });

  /* deep link: open straight into the explorer */
  if (location.hash === "#explore") enter(false);
})();
