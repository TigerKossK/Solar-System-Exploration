# Effects & Components — 21st.dev integrations (as built)

Records how the two 21st.dev React components were integrated into the **plain static**
Solar System build. Decision (see approved plan): the site stays HTML/CSS/JS with **no
framework**; the components' *effects* were **ported to vanilla WebGL** — the visual result is
the GLSL, not React, so nothing is lost. Both are **layered on top of a fully working core**
and degrade gracefully to nothing.

## 1. Velaris → cosmic background
- **Source:** 21st.dev "Velaris" (`velaris.tsx`) — full-screen simplex-noise living gradient.
- **Port:** [js/background.js](../js/background.js). Vertex + fragment **GLSL kept verbatim**;
  React (`useEffect`/`useRef`/`cn`) replaced with a vanilla init. No dependencies.
- **Placement:** the site background — a fixed `<canvas id="bg">` inside `.cosmos`, behind the
  floating glass panel, on the landing and every planet page.
- **Recolour (was green):** `u_bg` `#08110f`; `u_colors` `#0a2630 / #123f49 / #1e6e7e / #0c2a33`.
- **Restraint & performance (per §8.5 / §8.10 / §21):** `speed 0.25`, `grain 0.15`;
  resolution capped at 1.5× DPR; **`prefers-reduced-motion` → one static frame** (no loop);
  **pauses when the tab is hidden**; **no WebGL/JS → the CSS `.cosmos__fallback` gradient shows**.

## 2. LiquidChrome → primary CTA
- **Source:** 21st.dev "Chrome Button" (`chrome-button.tsx`). Its `liquid-chrome` dependency and
  `ogl` were **not provided**; since the effect is decorative (not scientific data), it was
  **re-authored** as a faithful vanilla shader rather than fetched — no `ogl`, no dependency.
- **Port:** [js/liquid-chrome.js](../js/liquid-chrome.js) — a flowing metallic domain-warp,
  teal-black, `speed ≈ 2`, `amplitude 0.32`.
- **Placement:** exactly **one** instance per view — the `#primaryCta` button ("Explore the
  planets" on the landing; "Back to the Solar System" on planet pages). It enhances the button
  in place: wraps the label above an injected `<canvas>`.
- **Restraint & fallback:** secondary/ghost buttons are untouched; `prefers-reduced-motion` →
  one static frame; pauses off-screen (IntersectionObserver) and on hidden tab; **no WebGL/JS →
  the button stays the amber `.btn--primary` pill**, so the CTA never depends on the effect.
- **CSS hook:** `.btn.has-liquid` (added by JS) in [css/components.css](../css/components.css).

## 3. Files
| File | Role |
|---|---|
| `js/background.js` | Velaris port (site background) |
| `js/liquid-chrome.js` | LiquidChrome port (single CTA) |
| `css/main.css` `.cosmos__fallback` | non-WebGL background fallback |
| `css/components.css` `.btn.has-liquid` | liquid CTA styling |

## 4. Not done here (deliberately)
- These are Priority 2/3. The site is fully usable with **both effects deleted** (their own
  rule). Real planet imagery still replaces the CSS orb placeholders when available.
- The `--accent` token is still the placeholder amber, awaiting the user's final colour.
