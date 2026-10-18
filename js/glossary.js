/* ============================================================
   Solar System — glossary: the jargon, explained where it appears
   ------------------------------------------------------------
   The FIRST time each term below appears in a page's content, it becomes
   a small button that opens its definition. One table, here, for every
   page; the pages themselves are not edited, so a term can never be
   explained two different ways.

   Uses the Popover API (light dismiss and Escape come free), positioned by
   script beside the term -- CSS anchor positioning is not yet everywhere.
   Without popover support it falls back to a plain toggled box. Without
   JS the words simply stay words.

   A definition is announced when shown (role="status"), and the button
   keeps focus, so reading carries on from where it was.
   ============================================================ */
(function () {
  "use strict";
  var U = window.SolarUtil;
  if (!U || !document.body) return;

  /* Standard values: the AU fixed by the IAU in 2012; light-year per Julian
     year; Voyager heliopause crossings per NASA/JPL. Worded to agree with
     the pages (formation.html puts the frost line near 2.7 AU). */
  var TERMS = [
    { id: "au", re: /\bAU\b/, title: "Astronomical unit (AU)",
      def: "The average distance between Earth and the Sun, fixed at exactly 149,597,870.7 km (about 150 million km). Sunlight crosses it in about 8 minutes 19 seconds." },
    { id: "light-year", re: /\blight-years?\b/i, title: "Light-year",
      def: "The distance light travels in a year: about 9.46 trillion km, or roughly 63,000 AU. A distance, not a time." },
    { id: "escape-velocity", re: /\b[Ee]scape velocity\b/, title: "Escape velocity",
      def: "The speed something needs to coast away from a world's gravity for good, with no further push (ignoring the drag of any air)." },
    { id: "axial-tilt", re: /\b[Aa]xial tilt\b/, title: "Axial tilt",
      def: "How far a planet's spin axis leans from upright, measured against its orbit. Earth's lean of about 23.4° is what gives it seasons." },
    { id: "retrograde", re: /\bretrograde\b/i, title: "Retrograde",
      def: "Turning the opposite way to the direction the planet travels around the Sun. Venus and Uranus spin retrograde; on Venus the Sun rises in the west." },
    { id: "kuiper-belt", re: /\bKuiper Belt\b/, title: "Kuiper Belt",
      def: "A vast ring of icy bodies beyond Neptune's orbit, left over from the Solar System's formation. Pluto is one of its largest members." },
    { id: "heliopause", re: /\bheliopause\b/i, title: "Heliopause",
      def: "The boundary where the Sun's outflowing solar wind meets the gas between the stars. Voyager 1 crossed it in 2012 and Voyager 2 in 2018." },
    { id: "frost-line", re: /\bfrost line\b/i, title: "Frost line",
      def: "The distance from the young Sun beyond which water could freeze into ice. In our system it lay near 2.7 AU, in what is now the asteroid belt." },
    { id: "planetesimal", re: /\bplanetesimals?\b/i, title: "Planetesimal",
      def: "One of the solid bodies, from about a kilometre to hundreds of kilometres across, that formed in the young Solar System and merged to build the planets." },
    { id: "protoplanetary-disc", re: /\bprotoplanetary dis[ck]s?\b/i, title: "Protoplanetary disc",
      def: "The flattened, spinning disc of gas and dust around a newborn star, from which its planets form." },
  ];
  var byId = {};
  TERMS.forEach(function (t) { byId[t.id] = t; });

  /* Content only: the article, a planet's dashboard, and the landing's Sun and
     statistics bands. Never inside something that is already interactive or
     is a heading, label or credit. */
  var roots = document.querySelectorAll("#article, #dashboard, #sun-section, #stats");
  if (!roots.length) return;
  var SKIP = "a, button, h1, h2, h3, h4, label, summary, kbd, code, svg, select, option, " +
    ".term, .heading-link, .source-tag, .figure__credit, .toc, .chip";

  function textNodes(node, out) {
    Array.prototype.slice.call(node.childNodes).forEach(function (c) {
      if (c.nodeType === 3) out.push(c);
      else if (c.nodeType === 1 && !c.matches(SKIP)) textNodes(c, out);
    });
    return out;
  }

  var pending = TERMS.slice();
  function markTerms(textNode) {
    var node = textNode;
    while (pending.length && node) {
      var text = node.nodeValue, best = null, bestAt = Infinity, bestLen = 0;
      pending.forEach(function (t) {
        var m = t.re.exec(text);
        if (m && m.index < bestAt) { best = t; bestAt = m.index; bestLen = m[0].length; }
      });
      if (!best) return;
      var hit = node.splitText(bestAt);
      var rest = hit.splitText(bestLen);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "term";
      btn.setAttribute("data-term", best.id);
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "termPop");
      btn.innerHTML = U.esc(hit.nodeValue) + '<span class="sr-only">, definition</span>';
      hit.parentNode.replaceChild(btn, hit);
      pending.splice(pending.indexOf(best), 1);
      node = rest;
    }
  }
  Array.prototype.forEach.call(roots, function (root) {
    textNodes(root, []).forEach(function (n) { if (pending.length) markTerms(n); });
  });
  if (!document.querySelector(".term")) return;

  /* ── the one definition box ───────────────────────────────── */
  var pop = document.createElement("div");
  pop.id = "termPop";
  pop.className = "term-pop";
  var native = typeof pop.showPopover === "function";
  if (native) pop.setAttribute("popover", "");     // "auto": light dismiss + Escape
  else pop.hidden = true;
  pop.innerHTML = '<div class="term-pop__body" role="status"></div>';
  document.body.appendChild(pop);
  var popBody = pop.querySelector(".term-pop__body");

  var openBtn = null, closedBtn = null, closedAt = 0;
  function isOpen() { return native ? pop.matches(":popover-open") : !pop.hidden; }
  function onClosed() {
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    closedBtn = openBtn; closedAt = Date.now(); openBtn = null;
    popBody.textContent = "";
  }
  function hide() {
    if (!isOpen()) return;
    if (native) pop.hidePopover();          // fires "toggle" -> onClosed
    else { pop.hidden = true; onClosed(); }
  }
  if (native) pop.addEventListener("toggle", function (e) { if (e.newState === "closed") onClosed(); });

  /* Below the term, or above it when there is no room; never off-screen. */
  function place(btn) {
    var r = btn.getBoundingClientRect();
    var w = pop.offsetWidth, h = pop.offsetHeight, gap = 8, edge = 12;
    var left = Math.min(Math.max(edge, r.left), window.innerWidth - w - edge);
    var top = r.bottom + gap + h <= window.innerHeight - edge ? r.bottom + gap : Math.max(edge, r.top - gap - h);
    pop.style.left = Math.round(left) + "px";
    pop.style.top = Math.round(top) + "px";
  }

  function show(btn) {
    var t = byId[btn.getAttribute("data-term")];
    if (!t) return;
    if (openBtn && openBtn !== btn) openBtn.setAttribute("aria-expanded", "false");
    if (native) { if (!isOpen()) pop.showPopover(); }
    else pop.hidden = false;
    openBtn = btn;
    btn.setAttribute("aria-expanded", "true");
    /* Filled AFTER it is shown: a status region that appears already holding
       its text is not reliably read. */
    popBody.innerHTML = '<strong class="term-pop__title">' + U.esc(t.title) + "</strong> " + U.esc(t.def);
    place(btn);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".term");
    if (btn) {
      /* Clicking the open term closes it. With the Popover API the pointerdown
         has usually light-dismissed it already, so "just closed by this same
         button" counts as closing too -- otherwise it would reopen at once. */
      if (openBtn === btn) { hide(); closedBtn = null; return; }   // our own close: no guard after it
      if (closedBtn === btn && Date.now() - closedAt < 400) return;
      show(btn);
      return;
    }
    if (!native && isOpen() && !pop.contains(e.target)) hide();   // fallback light dismiss
  });
  if (!native) {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { var b = openBtn; hide(); closedBtn = null; if (b) b.focus(); }
    });
  }
  /* A fixed box would drift away from its word as the page moves. */
  window.addEventListener("scroll", function () { if (isOpen()) hide(); }, { passive: true });
  window.addEventListener("resize", function () { if (isOpen()) hide(); });
})();
