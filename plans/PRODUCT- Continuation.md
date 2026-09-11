PRODUCT.md-Product Continuation / Experience & Interaction Specification

3. Experience Direction

The website must feel like an interactive scientific instrument disguised as a premium editorial experience.

The visitor should immediately understand:

They are looking at the real Solar System.

The planets themselves are the primary navigation.

Every planet contains deeper, trustworthy information.

The interface is visually sophisticated without becoming difficult to use.

The experience should create a progression:

Wonder → Orientation → Exploration → Focus → Understanding → Further Exploration

Do not turn the product into a generic "space-themed website." The Solar System itself must remain the source of the interaction model, visual hierarchy, and information architecture.

4. Information Architecture

4.1 Primary route

The default route is the Solar System landing/explorer.

Conceptually:

Solar System → Planet → Planet Dashboard → Another Planet / Return to System

The visitor should never feel trapped inside a planet page.

4.2 Navigation hierarchy

The orbital map is the primary navigation.

Secondary navigation may provide:

Home / Solar System

Planet selector

About / Information, only if genuinely useful

Accessibility or preferences where appropriate

Do not create a large traditional navigation menu that competes with the orbital system.

If a menu exists, it should support the map rather than replace it.

4.3 Planet detail pages

Each planet should have a consistent information architecture so that visitors can compare planets naturally.

Recommended structure:

Planet hero

Key facts / primary statistics

Physical characteristics

Orbit and position

Atmosphere / composition where applicable

Moons and notable features

Short educational explanation

Related exploration / return to Solar System

The exact content can evolve, but the visual system must remain consistent across planets.

5. Landing Page — Detailed Experience

5.1 First viewport

The first viewport is the most important part of the product.

It should contain:

A restrained navigation layer

A concise introductory statement

The interactive Solar System

The Sun as the visual anchor

Planetary orbit rings

Clearly identifiable planets

A primary exploration affordance

Enough negative space that the system does not feel crowded

The orbital system should visually dominate the page.

Avoid placing a large marketing headline over the Solar System if doing so reduces the clarity of the map.

5.2 Solar System visualization

The orbital diagram must communicate hierarchy:

Sun → inner planets → outer planets

Orbit rings should be visually subtle. They are structural guides, not decorative circles.

Planet nodes should have:

Distinct visual identity

Appropriate relative ordering

Clear hover/focus state

Accessible text label

Click/tap interaction

Subtle atmospheric glow where appropriate

Smooth but restrained motion

Do not make planets visually identical spheres with only different colors.

Where real imagery is unavailable, use clearly structured placeholders that preserve the intended visual hierarchy.

5.3 Planet interaction states

Every planet should have at least these states:

Default

Hover

Keyboard focus

Active / selected

Loading

Disabled, only if technically necessary

Hover/focus should reveal useful context such as:

Planet name

Short descriptor

One key fact

"Explore" affordance

The interaction must not require the visitor to precisely hit a tiny planet.

Use an adequate invisible or expanded interaction target around small visual planets while keeping the visual planet itself accurate.

5.4 Solar System navigation

The visitor should be able to:

Click a planet

Tab through planets

Use keyboard activation

Navigate back to the system

Switch directly to another planet from a planet page

Understand which planet is currently selected

If practical, support a compact planet selector as a secondary navigation mechanism on mobile and detail pages.

6. Planet Page — Detailed Experience

Each planet page should feel like entering a different scientific profile while remaining part of the same universe.

6.1 Hero

The hero should establish:

Planet name

Planet type / short descriptor

Strong planetary imagery

One concise introductory statement

A clear return/explore control

The imagery should feel immersive but must never make text unreadable.

Use layered gradients, atmospheric overlays, and glass surfaces rather than heavy opaque boxes.

6.2 Data dashboard

The dashboard is not a decorative collection of cards.

Every widget must answer a real question.

Examples:

Mass: How massive is this planet?

Gravity: How would gravity compare with Earth?

Distance from Sun: Where is it located?

Orbital period: How long is its year?

Rotation period: How long is its day?

Temperature: How hot/cold is it?

Moons: How many known moons does it have?

Use visual hierarchy:

Label → primary value → unit → optional context

Do not display unnecessary decimal precision.

Prefer human-readable values while preserving scientific accuracy.

6.3 Widget types

Use a restrained vocabulary of widgets:

Large statistic tile

Comparison bar

Sparkline

Progress-style scale

Dot matrix

Small timeline

Orbital indicator

Compact fact list

Educational callout

Do not use charts simply because the design reference contains charts.

A visualization must make the fact easier to understand.

6.4 Data interpretation

Whenever a number could be difficult for a general visitor to understand, provide context.

For example:

"1.88 years" can be paired with "One Martian year"

A large distance can include a human-readable unit

Gravity can be contextualized against Earth where appropriate

The site should teach, not merely display raw database values.

7. Scientific Accuracy & Data Integrity

This is a non-negotiable product rule.

7.1 Data source

Planetary data must come from reputable public scientific sources, preferably NASA or equivalent authoritative references.

Every displayed scientific value must be traceable to a source.

Do not invent:

Measurements

Moon counts

Temperatures

Dates

Discoveries

Scientific claims

Quotes

Comparisons

7.2 Data normalization

Use a single structured data model for planets.

A planet record should conceptually contain:

id

name

type

description

mass

radius

gravity

distanceFromSun

orbitalPeriod

rotationPeriod

temperature

moonCount

imagery

source metadata

The implementation may use a JavaScript data object or another static structure, but values should not be scattered throughout HTML.

7.3 Units

Use consistent units throughout the site.

Where a scientific value has multiple commonly useful units, select one primary display unit and optionally provide a secondary interpretation.

Never mix units accidentally between planet cards.

8. Visual System — Additional Rules

The existing DESIGN-SPEC.md is authoritative for the visual language.

The following rules extend it rather than replace it.

8.1 Cosmic environment

The background should feel deep and spatial, not like a flat dark webpage.

Use:

Near-black base

Subtle teal atmospheric gradients

Sparse stars

Very restrained nebula effects

Soft radial lighting

Occasional depth layers

Avoid:

Dense starfields

Random colorful space textures

Cartoon galaxies

Excessive lens flares

Generic sci-fi HUD decoration

The visual target is premium astronomical visualization, not a spaceship dashboard.

8.2 Glass

Glass surfaces must be used selectively.

Good uses:

Navigation

Planet labels

Floating controls

Data cards

Secondary selectors

Avoid turning every element into glass.

The background must remain visible through translucent surfaces.

8.3 Accent color

The --accent token remains TBD.

No implementation should hard-code an assumed final accent color.

All accent-dependent components must reference the token.

9. Motion & Interaction Design

Motion should communicate spatial relationships.

9.1 Appropriate motion

Use subtle transitions for:

Planet hover/focus

Orbit emphasis

Page transitions

Widget entrance

Glass highlights

Navigation changes

Chart drawing

Motion should generally be short, smooth, and non-distracting.

9.2 Orbital animation

If the orbital diagram uses animation, it should be intentionally slow.

Do not make the planets move so quickly that visitors cannot select them.

The orbital animation should also not imply that the displayed positions represent the actual current astronomical positions unless the implementation genuinely calculates them.

If positions are illustrative rather than real-time, treat them as a visual educational model.

9.3 Reduced motion

Respect:

prefers-reduced-motion: reduce

When enabled:

Stop unnecessary orbital animation

Remove decorative movement

Keep essential transitions minimal

Preserve usability and hierarchy

10. Responsive Design

Responsive behavior must be designed, not treated as a final CSS patch.

Desktop

Desktop can show the complete orbital composition with generous negative space.

Tablet

Reduce orbital scale and spacing while preserving:

Planet ordering

Labels

Selection

Navigation

Visual hierarchy

Mobile

The Solar System cannot simply be shrunk until everything becomes unreadable.

On mobile:

Prioritize the Sun and planetary ordering

Allow the orbital visualization to occupy a dedicated visual region

Use controlled zoom/pan or a compact exploration mode if necessary

Provide a secondary accessible planet list/selector

Keep planet targets easy to tap

Avoid horizontal page overflow

The mobile experience should remain a genuine Solar System explorer, not merely a list of planets.

11. Accessibility

Accessibility is part of the product architecture.

Requirements

Keyboard navigation for all interactive planets

Visible focus indicators

Semantic buttons/links

Meaningful accessible names

Text alternatives for the orbital visualization

Alt text for meaningful imagery

WCAG AA contrast for text and controls

No information conveyed by color alone

Reduced-motion support

Logical heading hierarchy

Screen-reader-friendly planet navigation

The visual orbital map may be complex, but the underlying interaction model must remain understandable without vision.

Provide a semantic alternative such as a planet navigation list.

12. Performance

The site is static, so performance should be one of its strengths.

Prioritize:

Minimal JavaScript

Optimized imagery

Lazy loading below-the-fold images

Responsive image sizing

Efficient CSS

No unnecessary dependencies

No large animation libraries unless genuinely required

Avoiding expensive continuous effects on low-power devices

The first meaningful experience should appear quickly.

Do not sacrifice performance for decorative effects.

13. Technical Architecture

The stack remains:

Plain HTML + CSS + JavaScript

No framework is required.

Recommended conceptual structure:

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
│   ├── main.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── data.js
│   ├── solar-system.js
│   ├── planet.js
│   └── ui.js
├── assets/
├── References/
├── DESIGN-SPEC.md
└── PROMPT.md

This is a suggested organization, not a requirement to create every file immediately.

Keep data, visualization logic, UI behavior, and styling logically separated.

14. Component System

Create reusable visual primitives even without a framework.

Core components should conceptually include:

Glass panel

Pill button

Navigation

Planet node

Orbit ring

Planet label

Stat card

Chart card

Section heading

Breadcrumb / return control

Planet selector

Data source indicator

The same component should behave consistently everywhere.

Avoid creating eight slightly different versions of the same statistic card.

15. Navigation & URL Behavior

The site should work as a static website on hosts such as GitHub Pages.

Prefer straightforward routes that do not require server-side routing.

Every planet should have a directly addressable URL.

Refreshing a planet page must not break navigation.

The visitor should be able to use browser Back/Forward naturally.

Links should remain real links wherever possible rather than relying exclusively on JavaScript click handlers.

16. Loading, Empty, and Error States

Even a static website needs deliberate failure behavior.

If imagery fails:

Preserve the layout

Show a neutral fallback

Preserve the planet name and data

If a chart cannot render:

Show the underlying value in accessible text

If JavaScript is unavailable:

Core planetary information and navigation should remain as useful as reasonably possible

Do not allow a decorative visualization failure to make the product unusable.

17. Content Tone

The content should sound:

Curious

Clear

Scientific

Accessible

Concise

Respectful of the visitor's intelligence

Avoid:

Excessive marketing language

Fake excitement

Overuse of exclamation marks

Unexplained scientific jargon

Long textbook paragraphs

"Mind-blowing" claims without substance

A visitor should feel that they are exploring a real scientific subject through a beautifully designed interface.

18. Microcopy

Interface labels should be short and purposeful.

Examples of the intended style:

Explore Mars

View planet

Back to Solar System

Key facts

Orbit

Atmosphere

Moons

Compare

Learn more

Do not invent final brand names or slogans.

The product name remains undecided.

19. Visual Hierarchy Rules

At any moment, the visitor should be able to identify:

Where they are

What they are looking at

What they can interact with

What information matters most

Where they can go next

If a decorative element competes with a planet, statistic, or navigation control, reduce the decorative element.

The interface should feel sophisticated because of composition, spacing, typography, lighting, and interaction — not because of the number of effects.

20. Exploration Enhancements

The following are recommended improvements, but they must remain subordinate to the core product.

20.1 Planet comparison

A lightweight comparison mode could allow visitors to compare two planets using the same metrics.

Example:

Earth vs Mars

with:

Mass

Radius

Gravity

Day length

Year length

Temperature

Moons

This reinforces the educational purpose without turning the site into a spreadsheet.

20.2 "Did you know?" facts

Use occasional short facts as secondary discovery moments.

Facts must be sourced and must not become random trivia spam.

20.3 Scale explanation

The Solar System has extreme scale differences.

The UI should acknowledge this rather than pretending that one screen can simultaneously represent true distances and true planet sizes.

If the orbital diagram is not physically to scale, make it clear through subtle educational language when appropriate.

20.4 Contextual comparisons

Where useful, compare values to Earth.

Examples:

Earth's gravity = 1× reference

A planet's day relative to an Earth day

A planet's year relative to an Earth year

These comparisons should improve comprehension, not create misleading equivalence.

21. Things the Builder Must NOT Do

Do not:

Turn the site into a generic SaaS dashboard

Copy the reference websites literally

Copy logos, text, photography, or branding from the references

Invent product branding

Invent testimonials or evidence

Invent planetary data

Add unnecessary backend architecture

Add authentication

Add a database

Add a framework unless explicitly requested

Overuse glassmorphism

Overuse neon colors

Fill every empty area

Use excessive animations

Make the Solar System purely decorative

Hide the planetary navigation behind a conventional menu

Make the mobile version an afterthought

Use tiny inaccessible planet targets

Depend on hover for essential information

Present raw scientific numbers without useful context

Claim that a visualization is physically accurate if it is only illustrative

22. Definition of a Successful Build

The finished website succeeds if a first-time visitor can:

Immediately recognize the Solar System.

Understand that the planets are interactive.

Select a planet without instructions.

Reach a planet detail page naturally.

Understand the most important facts within seconds.

Explore deeper information without reading a wall of text.

Return to the Solar System easily.

Explore another planet.

Use the core experience on mobile.

Navigate the core experience with a keyboard.

Trust that the displayed scientific information is real and sourced.

The website should leave the visitor with the feeling:

"I came here to look at the Solar System, and I ended up actually understanding something about it."

23. Build Priority

When implementation begins, prioritize in this order:

Priority 1 — Core experience

Solar System landing

Sun + 8 planets

Planet navigation

Planet detail pages

Real scientific data

Responsive layout

Accessible interaction

Priority 2 — Visual fidelity

Reference-inspired composition

Cosmic palette

Glass system

Typography

Planet imagery

Dashboard widgets

Priority 3 — Interaction polish

Motion

Hover/focus states

Transitions

Micro-interactions

Planet selector

Comparison features

Priority 4 — Optional enhancements

Additional educational modules

Advanced comparisons

More sophisticated visualization

Optional atmospheric effects

Do not implement Priority 3 or 4 at the expense of Priority 1.

24. Final Product Rule

When a design decision is ambiguous, choose the option that best supports:

scientific clarity + exploration + accessibility + visual restraint

The visual references define the aesthetic direction.

The product principles define what the website must accomplish.

Scientific accuracy defines what may be shown.

Accessibility defines how the experience must remain usable.

Performance defines how much visual complexity is acceptable.

These constraints should be treated together rather than independently.