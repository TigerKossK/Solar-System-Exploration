/* ============================================================
   Solar System — keyboard shortcuts
   ------------------------------------------------------------
   - "?" opens a short list of the site's shortcuts, showing only the ones
     that work on this page.
   - On a planet page, ← and → go to the previous and next planet: the same
     links as the pager at its foot (a[rel=prev] / a[rel=next]).
   - WCAG 2.1.4 (Character Key Shortcuts, A): "/" (search) and "?" are
     single-character shortcuts. The list carries a switch that turns both
     off, remembered (SolarUtil.singleKeys). Ctrl/Cmd+K always opens search,
     and the search palette's "Shortcuts" button keeps this list reachable
     with the switch off.
   Nothing fires while typing, while another dialog is open, or with a
   modifier held, so browser and screen-reader keys are left alone.
   ============================================================ */
(function () {
  "use strict";
  var U = window.SolarUtil;
  if (!U || !U.singleKeys || !document.body) return;

  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
  var prev = document.querySelector('a[rel="prev"]');
  var next = document.querySelector('a[rel="next"]');
  var onPlanet = !!(prev || next);
  var onMap = !!document.getElementById("orreryStage");

  var k = function (s) { return "<kbd>" + s + "</kbd>"; };
  var row = function (keys, what) { return '<div class="keys__row"><dt>' + keys + "</dt><dd>" + what + "</dd></div>"; };
  var cmdK = k(mac ? "⌘" : "Ctrl") + k("K");
  var rows =
    row(k("/") + " or " + cmdK, "Search the site") +
    (onPlanet ? row(k("←") + k("→"), "Previous or next planet") : "") +
    (onMap ? row(k("←") + k("→"), "Step through the planets while the map has focus or is full screen") : "") +
    row(k("Esc"), onMap ? "Close a dialog, or leave the full-screen map" : "Close a dialog") +
    row(k("?"), "Show this list");

  /* Dressed as the mission dialog (css/components.css) rather than given a
     second copy of the same dialog styles. Close first, as there. */
  var dlg = document.createElement("dialog");
  dlg.className = "mission-dialog keys-dialog";
  dlg.setAttribute("aria-labelledby", "keysTitle");
  dlg.innerHTML =
    '<button class="mission-dialog__close btn btn--ghost btn--sm" type="button">Close</button>' +
    '<h2 class="mission-dialog__title" id="keysTitle">Keyboard shortcuts</h2>' +
    '<dl class="keys">' + rows + "</dl>" +
    '<label class="keys__switch"><input type="checkbox" id="keysSingle"> ' +
      "Single-key shortcuts (" + k("/") + " and " + k("?") + ")</label>" +
    '<p class="keys__note">Turn these off if you use speech input, or if they go off by accident. ' +
      cmdK + " always opens search.</p>";
  document.body.appendChild(dlg);

  var box = dlg.querySelector("#keysSingle");
  box.addEventListener("change", function () {
    if (box.checked) U.store.remove("solar.keys");
    else U.store.set("solar.keys", "off");
  });

  function open() {
    if (dlg.open) return;
    box.checked = U.singleKeys();
    if (dlg.showModal) dlg.showModal();
    else dlg.setAttribute("open", "");
  }
  function close() {
    if (dlg.close) dlg.close();
    else dlg.removeAttribute("open");
  }
  dlg.addEventListener("click", function (e) {
    if (e.target.closest(".mission-dialog__close") || U.backdropHit(dlg, e)) close();
  });
  window.addEventListener("pagehide", function () { if (dlg.open) close(); });

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    if (U.isTyping(e) || U.dialogOpen()) return;
    if (e.key === "?") {
      if (!U.singleKeys()) return;
      e.preventDefault();
      open();
      return;
    }
    if (!onPlanet || e.shiftKey) return;
    var link = e.key === "ArrowLeft" ? prev : e.key === "ArrowRight" ? next : null;
    if (!link) return;
    e.preventDefault();
    link.click();       // a real navigation: history, view transition and all
  });

  window.SolarKeys = { open: open };
})();
