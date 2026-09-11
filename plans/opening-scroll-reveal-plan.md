# Plan — Cinematic Scroll-Reveal Opening (Solar System landing)

## Context

Two docs in `Improvements/` drive this work:
- `PlayHold_Scroll_Reveal_Design_Spec.md` — a dark, minimal **curtain/scroll-reveal opening** that lifts to expose the site as you scroll.
- `Frontent Design (Intro).md` — the reference implementation (a React/shadcn/Tailwind/TS **footer** component using GSAP + ScrollTrigger, glass pills, aurora, giant background text, magnetic buttons, on a red/black "SOBERS/Volvox" theme).

**Reality check that reframes the work:** the reference assumes React + shadcn + Tailwind + TS + GSAP, but this project is a **vanilla static HTML/CSS/JS** site with no build step and no JS libraries. It already has a scroll-reveal system (`js/reveal.js` + `.reveal` CSS, reduced-motion & no-JS aware), a fixed cosmic background (`.cosmos`), a deep-teal palette with an amber `--accent` placeholder (`css/main.css`), and Sora/Hanken/Spectral fonts. "PlayHold" is a placeholder name; the real target is this Solar System explorer.

We **rebuild the concept** (not the code) in vanilla HTML/CSS/JS. Outcome: a tasteful dark opening that, on scroll, dissolves to reveal the existing Intro section underneath — no framework change, no new dependencies, existing site untouched below the opening.

## Decisions locked (from Q&A)

- **A** — Stay vanilla; do not convert to React. Re-create the concept only.
- **B** — "PlayHold" = this Solar System site; reuse its teal/amber tokens, fonts, branding.
- **C** — The two references are identical; use that single component as the concept source.
- **D (i)** — Add a new dark full-screen opening before everything; scrolling past it reveals the existing Intro underneath.
- **E** — Include: aurora glow + giant background word + large headline + existing glass buttons/scroll-cue. Skip: marquee, heartbeat.
- **F (b)** — Zero new dependencies. Lightweight vanilla scroll/CSS reveal (no GSAP).
- **G** — No magnetic buttons.
- Graceful degradation: reduced-motion shows content immediately; no-JS keeps the site fully usable.
- Polish (default on, easily removed): fixed topbar fades in as the opening dissolves.

## The effect

On load: calm, dark viewport — a `--bg-void` veil over the fixed cosmos, a giant faint `SOLAR` wordmark, a short headline + scroll cue. Scrolling the first ~screenful drives a 0→1 progress that fades the veil out (revealing the living cosmos), parallaxes + fades the word, fades/slides the headline up and away, and fades the topbar in. As the sticky stage releases, the existing Intro section slides up into place. Scrolling up reverses it.

## Technical approach (vanilla, GPU-friendly)

- A `.opening` block (~180vh tall = scroll runway) placed before `<main class="scroll">`. Its inner `.opening__stage` is `position: sticky; top:0; height:100vh; overflow:hidden` — pins during the runway, releases as the Intro reaches the top.
- One passive `scroll` listener throttled by `requestAnimationFrame` sets a single custom property `--p` (0→1) on `.opening`. CSS `calc()` distributes `--p` to opacity/transform of the veil, word, content, and cue — only `opacity`/`transform` (no layout, no continuous loop). Handler goes inert (`pointer-events:none`) at `--p >= 1`, restores on scroll-up.
- Reuses existing tokens/fonts from `css/main.css` and the `.scroll-cue`/`.scroll-cue__dot` primitive — no new color system, no red/black.

## Files

**1. `js/opening.js`** *(new)* — IIFE. Reads `.opening`; bails under `prefers-reduced-motion` (CSS handles the static case). rAF-throttled handler computes `p = clamp(scrollY / (opening.offsetHeight − innerHeight), 0, 1)`, sets `--p`, toggles `body.is-opening` while `p < 0.6` (topbar fade), sets `pointer-events` off at `p>=1`. Listens to `scroll` (passive) + `resize`; runs once on load. Synchronous `<script>` at end of body so `is-opening` is set before first paint (no flash).

**2. `css/opening.css`** *(new)* — self-contained/easy to delete:
- `html:not(.js) .opening { display: none; }` (no-JS: site starts at Intro).
- `.opening { --p: 0; height: 180vh; }`; `.opening__stage { position: sticky; top:0; height:100vh; overflow:hidden; display:grid; place-items:center; }`.
- `.opening__veil` (radial `--bg-void` vignette) `opacity: calc(1 - var(--p))`.
- `.opening__aurora` — radial glow (teal `rgba(30,110,126,..)` + amber `rgba(245,185,66,..)`), low opacity, slow breathe keyframe, fades with `(1 - --p)`.
- `.opening__word` — `SOLAR` in `--font-display` 800, transparent fill + faint stroke/gradient (rgba of `--text-hi`); parallax `translateY`/`scale` from `--p`, `opacity: calc((1 - var(--p)) * .5)`.
- `.opening__content` — `opacity: calc(1 - var(--p))`, `translateY(calc(var(--p) * -40px))`.
- `.opening__cue` — reuses `.scroll-cue`, direct child of stage (correct anchoring), `opacity: calc(1 - var(--p))`.
- `.topbar { transition: opacity .5s var(--ease); }` + `.is-opening .topbar { opacity:0; pointer-events:none; }`.
- `@media (prefers-reduced-motion: reduce)`: `.opening{height:100vh}`, stage `position:relative`, veil `opacity:0`, aurora `animation:none`, word/content/cue reset — static, readable, no pin.
- `@media (max-width: 980px)`: reduce word/headline size + glow; guard horizontal overflow.

**3. `index.html`** — three small insertions, nothing renamed:
- `<head>`: `<link rel="stylesheet" href="css/opening.css" />` after `sections.css`, before `responsive.css`.
- Insert `.opening` markup immediately before `<main class="scroll">`:
  ```html
  <div class="opening" id="opening">
    <div class="opening__stage">
      <div class="opening__veil" aria-hidden="true"></div>
      <div class="opening__aurora" aria-hidden="true"></div>
      <div class="opening__word" aria-hidden="true">SOLAR</div>
      <div class="opening__content">
        <p class="opening__title display">Eight worlds. One star.</p>
        <p class="opening__sub">Scroll to enter the map.</p>
      </div>
      <a class="scroll-cue opening__cue" href="#intro" aria-label="Scroll to enter">
        <span class="scroll-cue__dot"></span>
      </a>
    </div>
  </div>
  ```
  (Title is `<p>`, not `<h1>`, so the Intro's `#intro-title` stays the sole page `<h1>`. `href="#intro"` lets keyboard users skip the scrub. Cue is a stage child, not inside content, so its `bottom:28px` anchors to the stage.)
- Add `<script src="js/opening.js"></script>` with the other scripts at end of `<body>`.

## Copy (tunable)
- Background word: **SOLAR** · Headline: **"Eight worlds. One star."** · Subhead: **"Scroll to enter the map."**

## Non-goals / guardrails
- Do not modify `.hero/.orrery/#orreryStage/#sun/#readout/#selectorList` or any IDs consumed by `solar-system.js`/`liquid-chrome.js`/`explorer.js`.
- Do not touch `js/reveal.js` — integrate alongside it.
- No GSAP, no marquee, no heartbeat, no magnetic buttons, no red/black.

## Verification (end-to-end, static site)
Serve from the project dir: `python -m http.server 8000` → `http://localhost:8000/`.
1. Load → dark opening: veil + faint `SOLAR` + headline + cue; topbar hidden.
2. Scroll slowly → veil lifts, word parallaxes/fades, headline fades up, topbar fades in (~60%), Intro slides up seamlessly. Fast scroll → no jank. Scroll up → reverses.
3. Reduced motion (OS or DevTools emulate) → static dark hero, no pin/scrub, content visible.
4. No-JS (DevTools disable JS) → `.opening` hidden; site starts at Intro; nav/skip-link work.
5. Responsive (360px+) → headline/word scale down, no horizontal overflow, glow restrained.
6. Keyboard → Tab reaches "Scroll to enter"; Enter jumps to `#intro`. Nav + brand anchors still jump.
7. Regression → orrery, readout, explorer mode, existing `.reveal`, fixed cosmos all still work.
