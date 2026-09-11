# 8. Experience Direction & Detailed Design Rules

The website should feel like an **interactive scientific instrument disguised as a premium editorial experience**.

The visitor should immediately understand:

1. They are looking at the real Solar System.
2. The planets themselves are the primary navigation.
3. Every planet contains deeper, trustworthy information.
4. The interface is visually sophisticated without becoming difficult to use.

The experience should create this progression:

**Wonder → Orientation → Exploration → Focus → Understanding → Further Exploration**

Do not turn the product into a generic "space-themed website." The Solar System itself must remain the source of the interaction model, visual hierarchy, and information architecture.

---

## 8.1 Information Architecture

### Primary route

The default route is the Solar System landing/explorer.

Conceptually:

`Solar System → Planet → Planet Dashboard → Another Planet / Return to System`

The visitor should never feel trapped inside a planet page.

### Navigation hierarchy

The orbital map is the primary navigation.

Secondary navigation may provide:

* Home / Solar System
* Planet selector
* About / Information, only if genuinely useful
* Accessibility or preferences where appropriate

Do not create a large traditional navigation menu that competes with the orbital system.

If a menu exists, it should support the map rather than replace it.

### Planet detail pages

Each planet should have a consistent information architecture so visitors can compare planets naturally.

Recommended structure:

1. Planet hero
2. Key facts / primary statistics
3. Physical characteristics
4. Orbit and position
5. Atmosphere / composition where applicable
6. Moons and notable features
7. Short educational explanation
8. Related exploration / return to Solar System

The exact content can evolve, but the visual system must remain consistent across planets.

---

## 8.2 Landing Page — Detailed Experience

### First viewport

The first viewport is the most important part of the product.

It should contain:

* restrained navigation
* concise introductory statement
* interactive Solar System
* Sun as visual anchor
* planetary orbit rings
* clearly identifiable planets
* primary exploration affordance
* enough negative space that the system does not feel crowded

The orbital system should visually dominate the page.

Avoid placing a huge marketing headline over the Solar System if doing so reduces the clarity of the map.

### Solar System visualization

The orbital diagram must communicate hierarchy:

**Sun → inner planets → outer planets**

Orbit rings should be visually subtle. They are structural guides, not decorative circles.

Planet nodes should have:

* distinct visual identity
* appropriate relative ordering
* clear hover/focus state
* accessible text label
* click/tap interaction
* subtle atmospheric glow where appropriate
* smooth but restrained motion

Do not make planets visually identical spheres with only different colors.

Where real imagery is unavailable, use clearly structured placeholders that preserve the intended visual hierarchy.

### Planet interaction states

Every planet should have at least these states:

* Default
* Hover
* Keyboard focus
* Active / selected
* Loading
* Disabled, only if technically necessary

Hover/focus should reveal useful context such as:

* Planet name
* Short descriptor
* One key fact
* Explore affordance

The interaction must not require the visitor to precisely hit a tiny planet.

Use an adequate invisible or expanded interaction target around small visual planets while keeping the visual planet itself accurate.

### Solar System navigation

The visitor should be able to:

* Click a planet
* Tab through planets
* Use keyboard activation
* Navigate back to the system
* Switch directly to another planet from a planet page
* Understand which planet is currently selected

If practical, support a compact planet selector as a secondary navigation mechanism on mobile and detail pages.

---

## 8.3 Planet Pages — Detailed Experience

Each planet page should feel like entering a different scientific profile while remaining part of the same universe.

### Hero

The hero should establish:

* Planet name
* Planet type / short descriptor
* Strong planetary imagery
* One concise introductory statement
* Clear return/explore control

The imagery should feel immersive but must never make text unreadable.

Use layered gradients, atmospheric overlays, and glass surfaces rather than heavy opaque boxes.

### Data dashboard

The dashboard is not a decorative collection of cards.

Every widget must answer a real question.

Examples:

* **Mass:** How massive is this planet?
* **Gravity:** How would gravity compare with Earth?
* **Distance from Sun:** Where is it located?
* **Orbital period:** How long is its year?
* **Rotation period:** How long is its day?
* **Temperature:** How hot/cold is it?
* **Moons:** How many known moons does it have?

Use the hierarchy:

**Label → primary value → unit → optional context**

Do not display unnecessary decimal precision.

Prefer human-readable values while preserving scientific accuracy.

### Widget types

Use a restrained vocabulary:

* Large statistic tile
* Comparison bar
* Sparkline
* Progress-style scale
* Dot matrix
* Small timeline
* Orbital indicator
* Compact fact list
* Educational callout

Do not use charts simply because the design reference contains charts.

A visualization must make the fact easier to understand.

### Data interpretation

Whenever a number could be difficult for a general visitor to understand, provide context.

For example:

* `1.88 years` → `One Martian year`
* Large distances → human-readable units
* Gravity → contextualized against Earth where useful

The site should teach, not merely display raw database values.

---

## 8.4 Scientific Accuracy & Data Integrity

This is a **non-negotiable product rule**.

Planetary data must come from reputable public scientific sources, preferably NASA or equivalent authoritative references.

Every displayed scientific value must be traceable to a source.

Never invent:

* measurements
* moon counts
* temperatures
* dates
* discoveries
* scientific claims
* quotes
* comparisons

Use a centralized planet data model rather than scattering values throughout HTML.

Conceptually, a planet record should contain:

* id
* name
* type
* description
* mass
* radius
* gravity
* distanceFromSun
* orbitalPeriod
* rotationPeriod
* temperature
* moonCount
* imagery
* source metadata

Use consistent units throughout the site.

---

## 8.5 Cosmic Environment

The background should feel deep and spatial rather than like a flat dark webpage.

Use:

* near-black base
* subtle teal atmospheric gradients
* sparse stars
* restrained nebula effects
* soft radial lighting
* occasional depth layers

Avoid:

* dense starfields
* random colorful space textures
* cartoon galaxies
* excessive lens flares
* generic sci-fi HUD decoration

The target is:

**premium astronomical visualization, not a spaceship dashboard.**

---

## 8.6 Glass System

Glass surfaces must be used selectively.

Good uses:

* navigation
* planet labels
* floating controls
* data cards
* secondary selectors

Avoid turning every element into glass.

The cosmic background should remain visible through translucent surfaces.

The existing glass recipe from Reference #2 remains authoritative.

---

## 8.7 Motion

Motion should communicate spatial relationships.

Use subtle transitions for:

* planet hover/focus
* orbit emphasis
* page transitions
* widget entrance
* glass highlights
* navigation changes
* chart drawing

Motion should generally be short, smooth, and non-distracting.

If the orbital diagram is animated, it should be intentionally slow enough for comfortable exploration.

Do not imply that the displayed planetary positions are astronomically current unless the implementation actually calculates current positions.

If the visualization is illustrative rather than physically to scale, communicate that appropriately.

Respect:

`prefers-reduced-motion: reduce`

When reduced motion is enabled:

* stop unnecessary orbital animation
* remove decorative movement
* minimize transitions
* preserve all functionality

---

## 8.8 Responsive Design

Responsive behavior must be designed rather than treated as a final CSS patch.

### Desktop

Show the complete orbital composition with generous negative space.

### Tablet

Reduce orbital scale and spacing while preserving:

* planet ordering
* labels
* selection
* navigation
* hierarchy

### Mobile

Do not simply shrink the entire Solar System until it becomes unreadable.

Instead:

* prioritize Sun and planetary ordering
* give the orbital visualization a dedicated visual region
* use controlled zoom/pan or a compact exploration mode if necessary
* provide an accessible planet list/selector
* keep planet targets easy to tap
* prevent horizontal page overflow

The mobile experience must remain a genuine Solar System explorer.

---

## 8.9 Accessibility

Accessibility is part of the product architecture.

Requirements:

* keyboard navigation for every interactive planet
* visible focus indicators
* semantic buttons/links
* meaningful accessible names
* text alternatives for the orbital visualization
* alt text for meaningful imagery
* WCAG AA contrast
* no information conveyed by color alone
* reduced-motion support
* logical heading hierarchy
* screen-reader-friendly planet navigation

The visual orbital map may be complex, but its underlying interaction model must remain understandable without vision.

Provide a semantic alternative such as a planet navigation list.

---

## 8.10 Performance

Because the website is static, performance should be one of its strengths.

Prioritize:

* minimal JavaScript
* optimized imagery
* lazy loading below-the-fold images
* responsive image sizing
* efficient CSS
* no unnecessary dependencies
* no large animation libraries unless genuinely required
* avoidance of expensive continuous effects on low-power devices

Do not sacrifice performance for decorative effects.

---

## 8.11 Technical Architecture

The stack remains:

**Plain HTML + CSS + JavaScript**

No framework is required.

Suggested organization:

```text
Solar System/
├── index.html
├── planet/
│   ├── mercury.html
│   ├── venus.html
│   ├── earth.html
│   ├── mars.html
│   ├── jupiter.html
│   ├── saturn.html
│   ├── uranus.html
│   └── neptune.html
├── css/
├── js/
├── assets/
├── References/
├── DESIGN-SPEC.md
└── PROMPT.md
```

This is a suggested organization, not a requirement to create every file immediately.

Keep data, visualization logic, UI behavior, and styling logically separated.

---

## 8.12 Component System

Even without a framework, use reusable visual primitives.

Core components should conceptually include:

* Glass panel
* Pill button
* Navigation
* Planet node
* Orbit ring
* Planet label
* Stat card
* Chart card
* Section heading
* Return control
* Planet selector
* Data source indicator

The same component should behave consistently everywhere.

Do not create eight slightly different versions of the same statistic card.

---

## 8.13 Navigation & URL Behavior

The site must work as a static website on hosts such as GitHub Pages.

Every planet should have a directly addressable URL.

Refreshing a planet page must not break navigation.

Browser Back/Forward should behave naturally.

Prefer real HTML links wherever possible instead of relying exclusively on JavaScript click handlers.

---

## 8.14 Loading, Empty & Error States

If imagery fails:

* preserve the layout
* show a neutral fallback
* preserve planet name and data

If a chart cannot render:

* show the underlying value in accessible text

If JavaScript is unavailable:

* core planetary information and navigation should remain as useful as reasonably possible

A decorative visualization failure must never make the product unusable.

---

## 8.15 Content Tone

Content should feel:

* curious
* clear
* scientific
* accessible
* concise
* respectful of the visitor's intelligence

Avoid:

* excessive marketing language
* fake excitement
* unexplained scientific jargon
* long textbook paragraphs
* meaningless "mind-blowing" claims

The visitor should feel that they are exploring a real scientific subject through a beautifully designed interface.

---

## 8.16 Visual Hierarchy Rule

At every moment, the visitor should be able to identify:

1. Where they are
2. What they are looking at
3. What they can interact with
4. What information matters most
5. Where they can go next

If a decorative element competes with a planet, statistic, or navigation control, reduce the decorative element.

The interface should feel sophisticated because of composition, spacing, typography, lighting, and interaction — not because of the number of effects.

---

## 8.17 Exploration Enhancements

Recommended but secondary features:

### Planet comparison

Allow visitors to compare two planets using the same metrics.

Example:

`Earth vs Mars`

with:

* Mass
* Radius
* Gravity
* Day length
* Year length
* Temperature
* Moons

### "Did you know?" facts

Use occasional short facts as secondary discovery moments.

All facts must be sourced.

### Scale explanation

The Solar System contains extreme scale differences.

The interface must not pretend that one visualization can simultaneously represent true distances and true planet sizes.

If the orbital diagram is not physically to scale, make that clear when appropriate.

### Contextual comparisons

Where useful, compare values to Earth.

These comparisons should improve comprehension rather than create misleading equivalence.

---

## 8.18 Things the Builder Must NOT Do

Do not:

* turn the site into a generic SaaS dashboard
* copy the reference websites literally
* copy logos, text, photography, or branding from the references
* invent product branding
* invent testimonials or evidence
* invent planetary data
* add unnecessary backend architecture
* add authentication
* add a database
* add a framework unless explicitly requested
* overuse glassmorphism
* overuse neon colors
* fill every empty area
* use excessive animations
* make the Solar System purely decorative
* hide planetary navigation behind a conventional menu
* make mobile an afterthought
* use tiny inaccessible planet targets
* depend on hover for essential information
* present raw scientific numbers without useful context
* claim a visualization is physically accurate if it is only illustrative

---

## 8.19 Definition of a Successful Build

The finished website succeeds if a first-time visitor can:

1. Immediately recognize the Solar System.
2. Understand that the planets are interactive.
3. Select a planet without instructions.
4. Reach a planet detail page naturally.
5. Understand the most important facts within seconds.
6. Explore deeper information without reading a wall of text.
7. Return to the Solar System easily.
8. Explore another planet.
9. Use the core experience on mobile.
10. Navigate the core experience with a keyboard.
11. Trust that the displayed scientific information is real and sourced.

The intended feeling is:

> **"I came here to look at the Solar System, and I ended up actually understanding something about it."**

---

## 8.20 Build Priority

When implementation begins, prioritize:

### Priority 1 — Core experience

* Solar System landing
* Sun + 8 planets
* Planet navigation
* Planet detail pages
* Real scientific data
* Responsive layout
* Accessible interaction

### Priority 2 — Visual fidelity

* Reference-inspired composition
* Cosmic palette
* Glass system
* Typography
* Planet imagery
* Dashboard widgets

### Priority 3 — Interaction polish

* Motion
* Hover/focus states
* Transitions
* Micro-interactions
* Planet selector
* Comparison features

### Priority 4 — Optional enhancements

* Additional educational modules
* Advanced comparisons
* More sophisticated visualization
* Optional atmospheric effects

Never implement Priority 3 or 4 at the expense of Priority 1.

---

## 8.21 Final Product Rule

When a design decision is ambiguous, choose the option that best supports:

**scientific clarity + exploration + accessibility + visual restraint**

The visual references define the aesthetic direction.

The product principles define what the website must accomplish.

Scientific accuracy defines what may be shown.

Accessibility defines how the experience must remain usable.

Performance defines how much visual complexity is acceptable.

These constraints must be treated as one unified system rather than independently.
