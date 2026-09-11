# Solar System — Design Specification (from 3 references)

> **Status:** committed build brief. This is the user-**pinned** visual direction (three
> references fused). Per impeccable, a pinned brief beats the concept roll — we build this
> directly, we do not invent alternative visual worlds.
> **Formal visual system (DESIGN.md)** is written from the *built* world at finish, not before.

## Context
Greenfield project at `c:\Claude code projects\Solar System`. An **educational Solar System**
explorer for the **curious general public**: a landing page that renders the solar system as
an interactive orbital diagram, and inner pages that present real planet data (mass, distance,
temperature, moons…) as dashboard widgets. Stack: **plain static HTML/CSS/JS**. Product truth
lives in [../PRODUCT.md](../PRODUCT.md).

**Synthesis intent (the user's pinned fusion of the three references):**
- **Landing / first page** → skeleton of **Reference #1**, recolored cosmic. Its concentric
  rings become planetary **orbits**; its floating node-widgets become the **planets**; its
  center ("20k+ Specialists") becomes the **Sun**.
- **Colors + "liquid glass"** → from **Reference #2** (deep teal / dark green-blue + a blue
  tint + one more accent the user will specify later).
- **Inner pages + widget system + overall web-design idea** → from **Reference #3**,
  recolored into Reference #2's palette. Landing = sans (like #1); inner pages = serif
  (like #3).

All hex values below are eyedropper **estimates** from the PNGs — tuned against the real build.

---

## 1. Reference-by-reference analysis

### Reference #1 — "Marketeam" (LANDING skeleton)
**Layout:** one big **floating rounded card** (radius ≈ 28px) on a soft lavender background;
the card breathes ~2–3% on every side. Inside, three stacked bands:
| Band | Height (of card) | Contents |
|---|---|---|
| Nav | ~11% | Logo left · links (Your Team/Solutions/Blog/Pricing) center-left · `Log In` + `Join Now` pill right |
| Hero | ~72% | **Left ~45%:** huge bold headline + `Start Project` pill + floating "David" tag. **Right ~55%:** concentric orbital rings |
| Partner strip | ~9% | 5 logos evenly spaced (Dreamure · SWITCH.WIN · Sphere · PinSpace · Visionix) |

**Orbital diagram (the key element):** ~3 concentric circles, outer Ø ≈ 40% of card width,
centered in the right half. Center label "20k+ / Specialists". **8–9 nodes** ride the rings:
avatar circles (Ø ≈ 48–56px) and glowing rounded-square app icons (~48px). Thin 1px ring
strokes at low opacity.

**Type:** heavy geometric grotesque sans; headline ≈ 56–64px, tight leading, black with the
final two lines in white. **CTA:** black pill ~150×44, small chevron.

### Reference #2 — "Paradigm" (COLOR + GLASS)
**Palette:** ambient **teal → dark green-blue**, bright teal top-left fading to near-black.
Content sits on near-black glass. This is the "dark green a little blue" the user named.
**Glass language:** panels with 1px translucent borders + very low-opacity fills; **ghost/
outline** buttons (thin border, transparent fill, small pill radius); a **frosted floating
circular widget** (video-call bubble, bottom-right) with close + audio glyphs; translucent
refractive **3D glass blocks** = the "liquid glass" motif.
**Type:** clean light-weight sans, centered hero; lots of negative space.

### Reference #3 — "Apogee" (INNER PAGES + WIDGETS)
**Layout:** whole page **rounded with a dark frame** around a full-bleed photo hero.
Nav = logo left · centered pill group (`Menu` | `Book a demo`) · outline pill `Find out more`
right. Hero = centered **serif** headline (~64–72px) + muted subtext + white pill CTA
`Discover the Core` with arrow.
**Dashboard (the widget system):** a browser window (traffic lights, tabs Dashboard/Core/
Growth/Analytics/Setting) overlapping the hero. Section tabs "Global / Cluster / Insights"
(active high-contrast, rest muted). Widget grid:
| Row | Cards | Widget types |
|---|---|---|
| 1 | Revenue Growth · Lead Performance · Sales Trend | big value + %-change chip + mini bar sparkline · **dot-matrix** grid · dual-metric **bar chart** |
| 2 | Real-time inference log · Predictive Trajectory | scrolling list · **3 KPI stat tiles** |

**Card style:** ~16px radius, ~20px padding, subtle border, dark translucent fill, small
uppercase muted label + large value. **Grid:** 12-col; row 1 = three 4-col cards, row 2 =
~5/7 split. **Colors** here are sepia/gold → **replaced** with #2's teal in our build.

---

## 2. What the three share (the common DNA to keep)
1. **Floating rounded container** with generous outer breathing room.
2. **Dark-dominant** surfaces with **one ambient color glow**.
3. **3-zone nav:** logo left · links center · action pill(s) right.
4. **One big hero headline + short subtext**, heavy negative space.
5. **Pill CTA with a small arrow/chevron**, always.
6. **Soft glows & gradients over hard edges**; rounded corners everywhere.
7. **Depth by layering** — floating nodes / glass blocks + bubble / dashboard overlapping hero.

---

## 3. Unified color system (from Reference #2 — estimates, to tune)
`--accent` is a **placeholder** for the "something else" color the user will provide. Build
wires everything through the token so one value updates all accent usage. Interim placeholder
accent = a warm solar amber/gold (thematically the Sun), clearly swappable.

| Token | Est. hex | Use |
|---|---|---|
| `--bg-void` | `#08110F` | deepest background / page void |
| `--bg-deep` | `#0A1E26` | primary dark green-blue base |
| `--bg-panel` | `#0C2A33` | raised surfaces / hero card |
| `--teal-600` | `#12414A` | mid teal, gradients |
| `--teal-400` | `#1E6E7E` | ambient glow, active state |
| `--teal-300` | `#2A7D8C` | brightest teal highlight |
| `--text-hi` | `#E8EDEE` | primary text |
| `--text-lo` | `#8FA3A6` | muted labels / captions |
| `--glass-fill` | `rgba(230,245,245,0.05)` | glass panel fill |
| `--glass-brd` | `rgba(140,200,205,0.16)` | 1px glass/ghost border |
| `--accent` | **amber placeholder → user TBD** | CTAs, planet highlights, focus |

**Glassmorphism recipe:** `backdrop-filter: blur(16–24px)` + `--glass-fill` + 1px
`--glass-brd` + a faint top inner highlight. Cosmic backdrop = near-black base + radial teal
nebula glow + subtle starfield.

---

## 4. Unified grid & space usage
- **Container:** max-width 1280–1440px, **12 columns**, 24px gutters.
- **Landing (#1 skeleton):** full-width nav → hero split **headline cols 1–5 / orbital system
  cols 6–12** → full-width bottom strip. On narrow screens the orbital system moves below the
  headline.
- **Inner pages (#3 skeleton):** rounded page frame; **centered hero** (cols 3–10); widget grid
  on 12 cols — three cards = 4 cols each, two cards = 6/6 or 5/7.
- **Rhythm:** outer page padding 24–40px; ~96–120px between sections; card padding 20–24px;
  card gap 16–24px; hero column gap 48–64px.
- **Space rule:** every screen = one floating rounded surface + one ambient glow + heavy
  negative space; never fill edge-to-edge.

---

## 5. Page-by-page fusion (the build brief)
**Landing (Reference #1, cosmic recolor):**
- Floating rounded card on a cosmic starfield/nebula bg (teal palette, not lavender).
- 3-zone nav (frosted glass) + bottom strip (repurposed as "Explore / mission" links).
- Hero left: **bold sans** headline + glass pill CTA + floating planet-name tag (the "David"
  bubble reinterpreted).
- Hero right: **the Solar System as the orbital diagram** — center node = **Sun** (replaces
  "20k+"); each ring = a planet's **orbit**; each node = a **planet** (replaces avatars/icons),
  soft-glow discs; hover/focus shows the planet-name tag; click → that planet's page.

**Inner pages (Reference #3, recolored):**
- Full-bleed planet imagery + rounded page frame; **serif** headline; white/glass pill CTA.
- Per-planet **dashboard**: real data as #3-style widgets recolored teal — stat tiles (mass,
  gravity, day length), a distance/temperature **sparkline or bar chart**, a **dot-matrix**
  (e.g., moons or composition), a KPI row (orbital period, distance from Sun, moon count).

**Typography (mirror the refs):** Landing = heavy geometric sans. Inner pages = elegant serif
headlines. Body/UI/widgets = clean neutral sans throughout.

---

## 6. Open items
- `--accent` ("something else") — placeholder amber until the user supplies it.
- Scope edges (Sun page / Pluto / moons / system-overview page) — undecided, see PRODUCT.md.

## 7. Build order
1. **Landing page** (`index.html`) — the priority "main page"; prove the hero (orbital system)
   first.
2. Per-planet pages after the landing is approved.
3. Formal `DESIGN.md` recorded from the built world at finish.
