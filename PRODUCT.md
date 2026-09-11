# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML / CSS / JS (no framework), chosen by the user. Deploys as static files to
any static host (e.g. Netlify, GitHub Pages). No backend.

## Users

Primary visitor is the **curious general public** — space enthusiasts and casually interested
people, not a classroom cohort. They arrive in a one-off, exploratory session (often from a
link), on desktop or mobile, with no account. Their job: browse the solar system, satisfy
curiosity, and pick up real facts about the planets that interest them.

## Product Purpose

An **educational solar-system explorer**. The landing page renders the solar system itself as
the entry point; visitors move from the whole system to an individual planet and read its
data. Success = an engaging, informative explore session in which a casual visitor leaves
having actually learned real facts about one or more planets, and wanting to look at more.

## Positioning

The **solar system's real structure is the navigation**: the landing renders the Sun and the
planets on their orbits as a live map, and each planet is the way in to its own page. Once
there, planetary facts are presented as a **data dashboard** (stat tiles / charts), not a
flat paragraph list. A neighboring "space facts" site typically uses a menu + article layout;
here the map is the interface and the data is instrumented like a dashboard.

## Operating Context

- Casual, unauthenticated, mostly one-off sessions; discovery-driven, not task-driven.
- Desktop and mobile both matter; the orbital map must remain usable and legible at small sizes.
- Core loop: scan the orbital system → focus/select a planet → read that planet's data page →
  optionally return to the map and pick another.

## Capabilities and Constraints

- **Landing:** an orbital diagram — Sun at center, the planets positioned on orbit rings;
  planets are focusable/selectable and lead to their detail pages.
- **Per-planet pages:** a data dashboard of real facts presented as widgets — e.g. mass,
  distance from the Sun, orbital period, day length, temperature, gravity, number of moons.
- **Data:** sourced from public/open planetary facts (NASA-style reference values); no
  invented numbers.
- **Imagery:** placeholders for now, structured so real planet imagery can be swapped in later.
- **Technical:** static site only; no server, database, auth, or dynamic backend.
- **Explicitly undecided (do not invent):** the site/product name; whether scope includes only
  the 8 planets or also the Sun-as-page / dwarf planets (Pluto) / moons; whether a
  system-overview "dashboard" page exists in addition to per-planet pages; the accent color
  (the user will supply the "something else" accent later).

## Brand Commitments

- Working project name is "Solar System"; no final product name, logo, or brand assets exist yet.
- The user has made three visual reference images binding as **visual direction**
  (`References/Reference#1.png`, `#2.png`, `#3.png`). Their aesthetic meaning is recorded
  separately in the design spec and will be formalized in a later `new-work`/DESIGN.md step —
  not expanded here, since this file holds product truth, not visual worlds.

## Evidence on Hand

- No real product content, testimonials, customers, benchmarks, pricing, or press exist — and
  none may be fabricated.
- Three visual reference images in `References/` (visual direction, not product evidence).
- Planetary facts are to come from public reference data; they are not yet written into the repo.

## Product Principles

1. **The map is the interface** — visitors explore by the solar system's real structure, not
   by menus.
2. **Only real facts** — every planetary number is a verifiable public value; never invent data.
3. **Wonder first, depth second** — pull the casual visitor in visually, then reward curiosity
   with instrumented, scannable data.
4. **Frictionless and universal** — a one-off visit works with no login, on any device.

## Accessibility & Inclusion

General-public audience with no assumed prior knowledge. Product-specific requirements: the
interactive orbital map must be **keyboard-navigable** and expose **text alternatives** for
each planet (it cannot be mouse/visual-only), planet imagery needs alt text, and the dark
palette must meet WCAG AA contrast for text and interactive states.
