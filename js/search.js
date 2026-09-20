/* ============================================================
   Solar System — site search
   ------------------------------------------------------------
   A complete search over every page, with no dependency and no build step
   beyond scripts/build-search-index.py.

   WHY NO LIBRARY: the whole corpus is ~6,200 words in 142 records. MiniSearch,
   FlexSearch, Lunr and Orama are all built for one or more orders of magnitude
   more than that, they all add a dependency this project does not otherwise
   have, and — the deciding point — getting MATCH POSITIONS back out of them
   for snippet highlighting is harder than computing them directly. Highlighted
   context was the requirement, so the index is ours.

   WHAT IT DOES: an inverted index with BM25 scoring and per-field weighting,
   prefix matching so results appear while typing, and edit-distance-1 typo
   tolerance for longer words. Results are grouped, keyboard-navigable, and
   carry a highlighted snippet of the matching sentence.

   Requires js/util.js (escaping) and js/search-index.js (the data).
   ============================================================ */
(function () {
  "use strict";

  if (!window.SolarUtil) return;
  var DOCS = null;                     // filled by loadIndex(), see the bottom
  var esc = window.SolarUtil.esc;
  var attr = window.SolarUtil.attr;

  /* Served from a project subpath, and planet pages sit a level down, so every
     href has to be rewritten relative to wherever we are. */
  var PREFIX = /\/planet\//.test(location.pathname) ? "../" : "";

  /* ---------- text normalisation --------------------------------------
     js/data.js is full of typographic characters a visitor will never type:
     U+00D7 multiplication signs, U+2212 minus, en dashes, degree signs and
     superscript digits ("3.30 × 10²³", "−173 to 427 °C"). Without folding
     these, "-173" can never match the text that is on the page. NFKD also
     decomposes the superscripts into ordinary digits. */
  var canNormalize = typeof "".normalize === "function";
  function norm(s) {
    var v = String(s == null ? "" : s);
    if (canNormalize) {
      v = v.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    }
    return v
      .replace(/[\u2212\u2013\u2014\u2010\u2011]/g, "-")
      .replace(/\u00d7/g, "x")
      .replace(/\u00b0/g, " ")
      .toLowerCase();
  }
  function tokenize(s) {
    var parts = norm(s).split(/[^a-z0-9]+/);
    var keep = [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i]) keep.push(parts[i]);
    }
    return keep;
  }

  /* Words carrying no discriminating power in a corpus this small. Kept short
     on purpose: over-filtering breaks real queries like "the sun".

     The question words matter here specifically because this is an educational
     site and people type questions at it. "how hot is venus" otherwise spends
     two of its four tokens on "how" and "hot"; "how" appears nowhere useful,
     falls through to the fuzzy pass, and drags in unrelated documents. */
  var STOP = {};
  ("a an and are as at be by for from in is it its of on or that the to with " +
   "do does did what which who whom whose when where why how much many long big")
    .split(" ").forEach(function (w) { STOP[w] = 1; });

  /* ---------- index ----------------------------------------------------- */
  var postings = Object.create(null);   // term -> { docId: weightedTf }
  var lengths = [];                     // weighted length per doc
  var terms = [];                       // every distinct term, for prefix/fuzzy scans
  var avgLen = 0;

  var FIELD_WEIGHT = { t: 2, s: 5, b: 1 };   // page title, section heading, body

  function buildIndex() {
    for (var d = 0; d < DOCS.length; d++) {
      var doc = DOCS[d];
      var len = 0;
      for (var f in FIELD_WEIGHT) {
        var w = FIELD_WEIGHT[f];
        var toks = tokenize(doc[f] || "");
        for (var i = 0; i < toks.length; i++) {
          var t = toks[i];
          var bucket = postings[t] || (postings[t] = Object.create(null));
          bucket[d] = (bucket[d] || 0) + w;
          len += w;
        }
      }
      lengths[d] = len;
      avgLen += len;
    }
    avgLen = avgLen / (DOCS.length || 1);
    terms = Object.keys(postings);
  }

  /* ---------- matching -------------------------------------------------- */
  /* Bounded single-edit check — cheaper and clearer than a full DP matrix
     when the only question is "within one edit?". */
  function withinOneEdit(a, b) {
    if (a === b) return true;
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    var i = 0, j = 0, diff = 0;
    while (i < la && j < lb) {
      if (a.charAt(i) !== b.charAt(j)) {
        if (++diff > 1) return false;
        if (la > lb) i++;
        else if (lb > la) j++;
        else { i++; j++; }
      } else { i++; j++; }
    }
    return diff + (la - i) + (lb - j) <= 1;
  }

  /* Each query token expands to the indexed terms it can match: exact, then
     prefix (so results appear mid-word while typing), then — only if nothing
     else hit and the word is long enough for it to mean anything — one typo. */
  function expand(tok, isLast) {
    var out = [];
    var i, t;
    if (postings[tok]) out.push({ term: tok, boost: 1 });
    if (isLast || !out.length) {
      for (i = 0; i < terms.length; i++) {
        t = terms[i];
        if (t !== tok && t.length > tok.length && t.indexOf(tok) === 0) {
          out.push({ term: t, boost: 0.7 });
        }
      }
    }
    if (!out.length && tok.length >= 4) {
      for (i = 0; i < terms.length; i++) {
        t = terms[i];
        if (withinOneEdit(tok, t)) out.push({ term: t, boost: 0.45 });
      }
    }
    return out;
  }

  var K1 = 1.2, B = 0.7;

  function search(query, limit) {
    var toks = tokenize(query);
    if (!toks.length) return [];
    var scores = Object.create(null);
    var matched = Object.create(null);   // docId -> terms, for highlighting
    var hitCount = Object.create(null);  // docId -> how many query tokens hit
    var N = DOCS.length;
    var required = 0;

    for (var qi = 0; qi < toks.length; qi++) {
      var tok = toks[qi];
      if (STOP[tok] && toks.length > 1) continue;
      required++;
      var cands = expand(tok, qi === toks.length - 1);
      var seenThisToken = Object.create(null);
      for (var c = 0; c < cands.length; c++) {
        var term = cands[c].term, boost = cands[c].boost;
        var bucket = postings[term];
        if (!bucket) continue;
        var df = 0, id;
        for (id in bucket) df++;
        var idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
        for (id in bucket) {
          var tf = bucket[id];
          var denom = tf + K1 * (1 - B + B * (lengths[id] / (avgLen || 1)));
          scores[id] = (scores[id] || 0) + idf * ((tf * (K1 + 1)) / (denom || 1)) * boost;
          (matched[id] || (matched[id] = [])).push(term);
          if (!seenThisToken[id]) {
            seenThisToken[id] = 1;
            hitCount[id] = (hitCount[id] || 0) + 1;
          }
        }
      }
    }

    var out = [];
    for (var d in scores) {
      /* A document matching every query token always outranks one that matched
         only some — otherwise a long page mentioning "Saturn" many times beats
         the page that is actually about "Saturn moons". */
      out.push({
        doc: DOCS[d],
        score: scores[d] + (hitCount[d] === required ? 1000 : 0),
        terms: matched[d],
      });
    }
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, limit || 30);
  }

  /* ---------- snippet + highlighting ------------------------------------ */
  function reEscape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function buildRegex(termList) {
    var uniq = Object.create(null), parts = [];
    for (var i = 0; i < termList.length; i++) {
      var t = termList[i];
      if (t.length < 2 || uniq[t]) continue;
      uniq[t] = 1;
      parts.push(reEscape(t));
    }
    if (!parts.length) return null;
    /* Longest first, so "planetary" wins over "planet" and the mark covers the
       whole word. The trailing \w* completes a prefix match — typing "plan"
       highlights all of "planets", not a fragment of it. */
    parts.sort(function (a, b) { return b.length - a.length; });
    return new RegExp("(?:" + parts.join("|") + ")\\w*", "gi");
  }

  /* Escapes everything and injects only <mark>. The query reaches element
     CONTENT here and never an attribute — attr() guards the one place a value
     does end up in an href. */
  function highlight(text, re) {
    if (!re) return esc(text);
    re.lastIndex = 0;
    var out = "", last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m[0].length === 0) { re.lastIndex++; continue; }
      out += esc(text.slice(last, m.index)) + "<mark>" + esc(m[0]) + "</mark>";
      last = m.index + m[0].length;
    }
    return out + esc(text.slice(last));
  }

  function snippet(body, re) {
    if (!re) return esc(body.slice(0, 160));
    re.lastIndex = 0;
    var m = re.exec(body);
    var at = m ? m.index : 0;
    var start = Math.max(0, at - 70);
    if (start > 0) {                        // never cut mid-word
      var sp = body.indexOf(" ", start);
      if (sp > -1 && sp < at) start = sp + 1;
    }
    var end = Math.min(body.length, start + 210);
    var text = body.slice(start, end);
    return (start > 0 ? "…" : "") + highlight(text, re) +
      (end < body.length ? "…" : "");
  }

  /* A text fragment makes the destination page scroll to and highlight the
     exact sentence the result came from — the deep-link half of "show me where
     this matched". Silently ignored where unsupported, and the plain #anchor
     still does its job there. */
  function hrefFor(doc, re) {
    var url = PREFIX + doc.u + "#" + (doc.a || "");
    if (!re) return url;
    re.lastIndex = 0;
    var m = re.exec(doc.b);
    if (!m) return url;
    var phrase = doc.b.slice(m.index, Math.min(doc.b.length, m.index + 60)).trim();
    var cut = phrase.lastIndexOf(" ");
    if (cut > 20) phrase = phrase.slice(0, cut);
    if (phrase.length < 4) return url;
    return url + ":~:text=" + encodeURIComponent(phrase);
  }

  var KIND_LABEL = { planet: "Planets", article: "Articles", page: "Landing page" };

  /* ---------- UI --------------------------------------------------------- */
  var dlg = document.createElement("dialog");
  dlg.className = "search";
  dlg.setAttribute("aria-label", "Search the site");
  dlg.innerHTML =
    '<div class="search__bar">' +
      '<svg class="search__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">' +
        '<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/>' +
        '<path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
      '<input class="search__input" type="search" autocomplete="off" spellcheck="false" ' +
        'placeholder="Search planets, missions, facts…" role="combobox" ' +
        'aria-expanded="false" aria-controls="searchResults" aria-autocomplete="list" ' +
        'aria-label="Search the site" />' +
      '<button class="search__close btn btn--ghost btn--sm" type="button">Close</button>' +
    "</div>" +
    '<div class="search__results" id="searchResults" role="listbox" aria-label="Search results"></div>' +
    '<p class="search__status sr-only" role="status" aria-live="polite"></p>' +
    '<p class="search__hint"><kbd>↑</kbd><kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close</p>';
  document.body.appendChild(dlg);

  var input = dlg.querySelector(".search__input");
  var results = dlg.querySelector(".search__results");
  var status = dlg.querySelector(".search__status");
  var active = -1, rows = [];

  var SEEDS = ["Jupiter", "moons", "Voyager", "frost line"];

  function render(query) {
    rows = [];
    active = -1;
    input.removeAttribute("aria-activedescendant");

    /* The empty state is checked BEFORE the index, because it does not need
       one. Otherwise opening the palette flashed "Loading…" and only then the
       suggestions, which made an instant, in-memory search feel slow. */
    if (!query.trim()) {
      results.innerHTML = '<p class="search__empty">Try ' +
        SEEDS.map(function (s) {
          return '<button class="search__seed" type="button">' + esc(s) + "</button>";
        }).join("") + "</p>";
      input.setAttribute("aria-expanded", "false");
      status.textContent = "";
      return;
    }

    /* Typing can outrun the lazy index load, so every entry point funnels back
       through loadIndex rather than assuming DOCS exists. (Function
       declarations hoist, so calling loadIndex from above it is fine.) */
    if (indexState !== "ready") {
      if (indexState !== "failed") {
        results.innerHTML = '<p class="search__empty">Loading…</p>';
        loadIndex(function () { render(query); });
      }
      return;
    }

    var hits = search(query, 24);
    if (!hits.length) {
      results.innerHTML = '<p class="search__empty">No matches for “' + esc(query) +
        '”. Try a shorter word, or one of these: ' +
        SEEDS.map(function (s) {
          return '<button class="search__seed" type="button">' + esc(s) + "</button>";
        }).join("") + "</p>";
      input.setAttribute("aria-expanded", "false");
      status.textContent = "No results";
      return;
    }

    var html = "", lastKind = "", n = 0;
    for (var i = 0; i < hits.length; i++) {
      var h = hits[i], doc = h.doc;
      var re = buildRegex(h.terms);
      if (doc.k !== lastKind) {
        lastKind = doc.k;
        html += '<p class="search__group">' + esc(KIND_LABEL[doc.k] || doc.k) + "</p>";
      }
      html +=
        '<a class="search__row" role="option" id="sr' + n + '" aria-selected="false" ' +
          'tabindex="-1" href="' + attr(hrefFor(doc, re)) + '">' +
          '<span class="search__where">' +
            highlight(doc.t.replace(/\s*—\s*Solar System$/, ""), re) + "</span>" +
          '<span class="search__title">' + highlight(doc.s, re) + "</span>" +
          '<span class="search__snippet">' + snippet(doc.b, re) + "</span>" +
        "</a>";
      n++;
    }
    results.innerHTML = html;
    results.scrollTop = 0;
    rows = results.querySelectorAll(".search__row");
    input.setAttribute("aria-expanded", "true");
    status.textContent = n + (n === 1 ? " result" : " results");
  }

  function setActive(i) {
    if (!rows.length) return;
    if (active > -1 && rows[active]) {
      rows[active].classList.remove("is-active");
      rows[active].setAttribute("aria-selected", "false");
    }
    active = (i + rows.length) % rows.length;
    var row = rows[active];
    row.classList.add("is-active");
    row.setAttribute("aria-selected", "true");
    input.setAttribute("aria-activedescendant", row.id);
    row.scrollIntoView({ block: "nearest" });
  }

  var debounce = null;
  input.addEventListener("input", function () {
    window.clearTimeout(debounce);
    var v = input.value;
    /* 120ms. The whole search is in-memory, so this is about not re-rendering
       the result list on every keystroke of a burst, not about latency. */
    debounce = window.setTimeout(function () { render(v); }, 120);
  });

  results.addEventListener("click", function (e) {
    var seed = e.target.closest(".search__seed");
    if (!seed) return;
    input.value = seed.textContent;
    render(input.value);
    input.focus();
  });

  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter" && active > -1 && rows[active]) {
      e.preventDefault();
      rows[active].click();
    }
  });
  dlg.querySelector(".search__close").addEventListener("click", close);
  dlg.addEventListener("click", function (e) {
    /* Backdrop only. e.target === dialog is also true for its own padding —
       the same trap js/sections.js hit with the mission dialog. */
    if (e.target !== dlg || !e.detail) return;
    var r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right ||
        e.clientY < r.top || e.clientY > r.bottom) close();
  });

  /* ---------- lazy index load -------------------------------------------
     js/search-index.js is ~53 KB. Loading it on every page view would undo a
     good part of the weight this release just removed from mobile, and most
     visitors never search. So it is fetched on the first open instead.

     Injected as a <script> tag rather than fetch()ed, deliberately: fetch of a
     local file is blocked by CORS under file://, and keeping the site openable
     straight from disk is a standing constraint here (see js/util.js). A
     script tag has no such restriction. */
  var indexState = "idle";              // idle | loading | ready | failed
  var pending = null;

  function loadIndex(done) {
    if (indexState === "ready") { done(); return; }
    pending = done;
    if (indexState === "loading") return;
    if (window.SEARCH_INDEX) {          // already on the page: nothing to fetch
      DOCS = window.SEARCH_INDEX;
      buildIndex();
      indexState = "ready";
      done();
      return;
    }
    indexState = "loading";
    var tag = document.createElement("script");
    tag.src = PREFIX + "js/search-index.js";
    tag.onload = function () {
      if (!window.SEARCH_INDEX) { tag.onerror(); return; }
      DOCS = window.SEARCH_INDEX;
      buildIndex();
      indexState = "ready";
      if (pending) { pending(); pending = null; }
    };
    tag.onerror = function () {
      indexState = "failed";
      results.innerHTML = '<p class="search__empty">Search could not load. ' +
        "Please reload the page and try again.</p>";
      status.textContent = "Search unavailable";
    };
    document.head.appendChild(tag);
  }

  function open(seed) {
    if (dlg.open) return;
    if (dlg.showModal) dlg.showModal();
    else dlg.setAttribute("open", "");
    input.value = seed || "";
    if (indexState === "ready") {
      render(input.value);
    } else {
      results.innerHTML = '<p class="search__empty">Loading…</p>';
      loadIndex(function () { render(input.value); });
    }
    input.focus();
  }
  function close() {
    if (dlg.close) dlg.close();
    else dlg.removeAttribute("open");
  }

  /* ---------- triggers ---------------------------------------------------
     "/" and Cmd/Ctrl+K were both verified unbound on this site. Escape is
     handled by <dialog> itself, which also stops it reaching js/explorer.js's
     document-level handler — so opening search inside Explorer mode and
     pressing Escape closes the search, not both at once. */
  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) ||
      !!(e.target && e.target.isContentEditable);
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open();
      return;
    }
    if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      open();
    }
  });

  window.SolarSearch = { open: open, close: close };

  /* Topbar trigger, added as a sibling of .nav__links so the mobile rule that
     hides those links leaves it alone. js/mobile-nav.js adds the tab-bar one. */
  var topbar = document.querySelector(".topbar__inner");
  if (topbar) {
    var btn = document.createElement("button");
    btn.className = "search-trigger";
    btn.type = "button";
    btn.setAttribute("aria-label", "Search the site");
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">' +
        '<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.9"/>' +
        '<path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>' +
      '<span class="search-trigger__label">Search</span>' +
      '<kbd class="search-trigger__kbd">/</kbd>';
    btn.addEventListener("click", function () { open(); });
    topbar.appendChild(btn);
  }
})();
