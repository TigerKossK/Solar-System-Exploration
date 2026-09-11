# PlayHold — Scroll-Reveal Opening / Hero Integration Specification

## Purpose

Implement a new opening section for the **PlayHold website** based on the two reference implementations in the original design file.

The goal is **not** to copy the reference component literally. The goal is to preserve the interaction concept from the first reference and combine it with the visual language of the continuation.

### Core idea

The website should initially feel **dark, minimal, and almost hidden**.

As the user scrolls down, the main **PlayHold** experience should gradually be revealed from underneath, creating a cinematic "curtain reveal" / scroll-reveal effect.

The interaction and composition should feel like the **first reference**, while the colors, visual styling, typography, glass effects, and overall design language should follow the **second reference**.

Most importantly:

> **Use the existing PlayHold website's actual color system. Do not introduce the red/black color palette from the reference.**

The final result should feel like it belongs naturally to the existing PlayHold website.

---

# 1. What to Take From the First Reference

The first reference contains the main interaction concept that should be preserved.

### Required behavior

1. The page starts with a dark/quiet opening state.
2. The main PlayHold content is initially hidden or visually covered.
3. The user scrolls downward.
4. The opening acts like a **curtain/reveal layer**.
5. The PlayHold content underneath gradually becomes visible.
6. The reveal should be tied to the user's scroll position rather than being a simple automatic animation.
7. The transition should feel cinematic and intentional.
8. The user should clearly understand that scrolling is revealing the next/main part of the website.

### Important

Do **not** reproduce the exact text, branding, "SOBERS" content, app-store buttons, or other content from the reference.

The reference is being used for its:

- scroll-reveal concept
- fixed-underneath content technique
- cinematic opening
- parallax/reveal behavior
- smooth GSAP animation
- layered composition

The actual content must belong to **PlayHold**.

---

# 2. What to Take From the Continuation

The continuation should be treated as the main **visual styling reference**.

Use its design language for:

- typography
- spacing
- glass surfaces
- borders
- subtle gradients
- background effects
- glow effects
- hover interactions
- responsive behavior
- overall premium/cinematic appearance

The result should look like a refined version of the PlayHold website rather than a copy of the reference component.

---

# 3. Color Requirements — VERY IMPORTANT

## Never copy the reference colors directly

The reference contains strong dark/black styling and red/destructive accents.

**Do not use those colors for PlayHold.**

Instead:

1. Inspect the existing PlayHold project.
2. Find the existing theme variables/design tokens.
3. Reuse the project's:
   - `background`
   - `foreground`
   - `primary`
   - `secondary`
   - `muted`
   - `muted-foreground`
   - `border`
   - other existing theme tokens where appropriate.
4. If the website has a custom color palette, use that palette instead.
5. Do not create a new independent color system unless absolutely necessary.

### Color principle

The animation may temporarily make the screen feel darker during the opening, but the actual colors must still belong to the PlayHold visual identity.

For example, glass effects, glow effects, borders, gradients, and text should derive their appearance from the existing website theme.

### Forbidden

- Red accent system copied from the reference
- Random black/red gradients
- Unrelated colors
- Hardcoded colors that conflict with the existing PlayHold theme
- Rebranding the website around the reference's colors

---

# 4. Visual Concept

The final opening should have approximately this visual sequence:

### State A — Initial Opening

When the page first loads:

- The screen feels dark and calm.
- The opening layer dominates the viewport.
- The main PlayHold content is not immediately exposed.
- Background effects should be subtle.
- Avoid overwhelming the user with animation.
- The design should feel premium rather than empty.

### State B — User Starts Scrolling

When the user scrolls:

- The opening begins moving/revealing.
- The PlayHold content underneath starts becoming visible.
- Background elements can move at a slightly different rate.
- Text/elements may fade or translate into place.
- The transition should feel smooth and connected to the scroll position.

### State C — Main PlayHold Content Revealed

After the reveal:

- The main PlayHold section is fully visible.
- The user can continue scrolling normally.
- No element should remain stuck over the content.
- The page must remain usable and responsive.

---

# 5. Animation Direction

Use **GSAP + ScrollTrigger** if the project already supports GSAP or if adding it is appropriate.

The reference uses:

- `gsap`
- `ScrollTrigger`
- `gsap.context()`
- scroll-linked animation
- parallax
- opacity transitions
- scale transitions
- staggered content reveals

Use these ideas where they improve the PlayHold experience.

## Suggested animation behavior

### Opening layer

Animate properties such as:

- `transform`
- `opacity`
- `scale`
- `clip-path`

according to the scroll position.

### Main content

The PlayHold content can use subtle:

- `opacity: 0 → 1`
- `translateY`
- `scale`
- parallax movement

Do not animate everything aggressively.

The animation should prioritize:

**smoothness > complexity.**

---

# 6. Curtain Reveal Technique

The reference uses a wrapper that remains in normal document flow while the actual footer/content is positioned underneath it.

Use the same general technique if it produces the intended effect.

Conceptually:

```text
PAGE
│
├── Opening / Reveal Wrapper
│   └── controls how much of the underlying content is visible
│
└── PlayHold Main Content
    └── positioned underneath / revealed during scroll
```

The exact implementation can differ if a cleaner architecture is better for the existing project.

Do not force the original implementation if it causes:

- layout bugs
- scrolling problems
- mobile issues
- accessibility issues
- performance problems
- conflicts with the existing application structure.

---

# 7. Background Styling

The continuation reference contains several useful visual techniques.

Adapt them to PlayHold.

## 7.1 Subtle Grid

A very subtle grid can be used as a background texture.

Characteristics:

- low contrast
- theme-aware
- should never compete with the main content
- should fade toward the edges if appropriate

Use existing theme colors rather than hardcoded red/black values.

## 7.2 Ambient Glow / Aurora

A subtle radial glow can be placed behind the opening.

It should use the PlayHold:

- primary color
- secondary color
- existing accent colors

Keep the opacity restrained.

The glow should make the opening feel atmospheric, not colorful or flashy.

## 7.3 Glass Surfaces

The continuation uses glass-like pills and panels.

If PlayHold needs buttons or controls in the opening:

- use translucent theme-aware backgrounds
- subtle borders
- backdrop blur
- soft shadows
- restrained hover transitions

Do not overuse glassmorphism.

---

# 8. Typography

Use the existing PlayHold typography if one is already defined.

If the project has no established font:

- choose a modern sans-serif that matches the existing design.
- do not blindly copy the reference font.

Typography should be:

- clean
- modern
- readable
- premium
- responsive

Large display text may be used during the reveal, but it must have a clear purpose.

---

# 9. PlayHold Content

The reference content must **not** be copied.

Replace it with the actual PlayHold content.

Examples of elements that may belong here, depending on the existing website:

- PlayHold branding
- main heading
- short value proposition
- primary CTA
- secondary CTA
- relevant navigation/action
- existing product messaging

Before inventing new content, inspect the existing project and reuse its terminology and content.

---

# 10. Interactive Elements

The continuation contains a magnetic button primitive.

A similar effect can be used for important PlayHold buttons if it fits the website.

### Magnetic interaction requirements

- subtle movement toward the cursor
- smooth easing
- return animation when the cursor leaves
- no excessive movement
- must not interfere with clicking
- must not cause layout shifts

If the magnetic effect hurts usability or performance, use a simpler hover interaction instead.

---

# 11. Accessibility

The animation must not make the website difficult to use.

Support:

- keyboard navigation
- visible focus states
- semantic HTML
- readable contrast
- reduced-motion preferences

For users with:

```css
prefers-reduced-motion: reduce
```

reduce or disable non-essential animation.

The PlayHold content must remain accessible even if animation is disabled.

---

# 12. Responsive Behavior

The opening must work on:

- desktop
- laptop
- tablet
- mobile

Do not simply scale the desktop design down.

### Mobile requirements

On smaller screens:

- reduce large typography
- reduce glow intensity
- reduce animation distance
- prevent horizontal overflow
- prevent oversized background elements from causing layout problems
- keep CTAs easy to tap
- ensure the reveal still feels intentional

The website must remain fully usable if GSAP animations are unavailable.

---

# 13. Performance Requirements

This is important.

The animation must not make the PlayHold website lag.

Avoid:

- unnecessary continuous JavaScript loops
- excessive DOM elements
- huge blur areas everywhere
- excessive box shadows
- unnecessary re-renders
- multiple competing ScrollTriggers
- expensive animations on large surfaces

Prefer:

- transform-based animation
- opacity animation
- GPU-friendly properties
- a small number of ScrollTriggers
- proper GSAP cleanup

Use `gsap.context()` or an equivalent cleanup strategy for React.

---

# 14. React / Project Compatibility

Before implementing anything, inspect the existing project.

Determine:

- framework
- React version
- TypeScript setup
- Tailwind setup
- shadcn setup
- component directory
- styling architecture
- existing animation libraries
- existing theme tokens
- existing layout structure

Do **not** assume the project is identical to the reference.

If the project already has the required infrastructure, reuse it.

Only install dependencies that are actually needed.

---

# 15. shadcn / Tailwind / TypeScript

The original reference assumes:

- shadcn-style project structure
- Tailwind CSS
- TypeScript

Before changing the project:

1. Check whether these are already installed/configured.
2. Check where UI components are currently stored.
3. Check the existing `lib/utils` setup.
4. Check the Tailwind/theme configuration.
5. Reuse the existing architecture.

If the project genuinely lacks required infrastructure, explain what is missing and install/configure only what is necessary.

Do not rebuild the entire project unnecessarily.

---

# 16. Component Architecture

Prefer a clean component structure.

For example:

```text
components/
├── ui/
│   └── playhold-reveal.tsx
│
└── ...
```

The exact path should follow the existing project conventions.

Possible separation:

```text
PlayHoldReveal
├── RevealBackground
├── RevealContent
├── PlayHoldActions
└── optional interactive button primitive
```

Do not create unnecessary abstractions.

---

# 17. Dependencies

The original reference uses GSAP.

If GSAP is not already installed and the final implementation benefits from it:

```bash
npm install gsap
```

Use `ScrollTrigger` for the scroll-linked reveal.

If another animation solution already exists in the project and is better suited, evaluate it before adding another dependency.

---

# 18. Important Reference Features

The following features from the reference are useful and should be considered:

### From the first reference

- cinematic opening
- scroll-triggered reveal
- content hidden underneath
- fixed/underlying layer technique
- parallax
- staggered reveal
- smooth GSAP transitions
- "curtain" feeling

### From the continuation

- theme-adaptive styling
- subtle grid
- ambient glow
- glass surfaces
- large display typography
- refined borders
- smooth hover effects
- magnetic buttons where appropriate
- responsive layout
- premium/cinematic appearance

---

# 19. What NOT to Copy

Do not copy these reference-specific elements unless they already belong to PlayHold:

- "SOBERS"
- "Accountability Redefined"
- "Transparent Tracking"
- "12-Step Progress"
- "Sponsor Connection"
- "Absolute Privacy"
- "Ready to begin?"
- "Download iOS"
- "Download Android"
- "Volvox"
- reference copyright text
- reference red/destructive color scheme
- reference branding
- reference-specific messaging

These are examples from the source component, not requirements for PlayHold.

---

# 20. Implementation Workflow for Claude Code

Follow this workflow in order.

## Step 1 — Inspect

Inspect the existing PlayHold project before modifying anything.

Identify:

- application entry/layout
- existing home/main page
- theme
- components
- CSS/Tailwind configuration
- existing animations
- existing PlayHold content
- existing navigation
- existing buttons/CTAs

## Step 2 — Understand the Existing Design

Determine the actual PlayHold design system.

Do not invent a new palette.

Find the existing theme tokens and visual conventions.

## Step 3 — Plan the Integration

Determine:

- where the opening belongs
- what existing section it reveals
- what content should be visible underneath
- what must remain unchanged
- what components need to be created or modified

## Step 4 — Implement

Build the scroll-reveal opening using the reference concept.

Keep the implementation modular and maintainable.

## Step 5 — Integrate

Connect the reveal to the actual PlayHold page.

Do not create an isolated demo page unless it is useful for testing.

## Step 6 — Test

Test:

- initial page load
- scrolling slowly
- scrolling quickly
- scrolling back upward
- mobile viewport
- tablet viewport
- desktop viewport
- keyboard navigation
- reduced motion
- refresh/reload
- different screen heights

## Step 7 — Fix

Resolve:

- overflow
- z-index problems
- layout shifts
- animation glitches
- ScrollTrigger refresh issues
- mobile problems
- performance problems
- console errors

## Step 8 — Final Verification

Confirm that:

- the PlayHold content is correctly revealed
- the opening looks cinematic
- colors match the existing PlayHold website
- no reference branding remains
- no red/black reference palette was accidentally introduced
- the page remains responsive
- the animation does not cause noticeable lag
- existing functionality still works

---

# 21. Acceptance Criteria

The implementation is successful only if all of the following are true:

- [ ] The page starts with a dark/minimal opening.
- [ ] The main PlayHold content is initially concealed or visually covered.
- [ ] Scrolling reveals the PlayHold content.
- [ ] The reveal feels cinematic and smooth.
- [ ] The interaction concept comes from the first reference.
- [ ] The visual styling comes primarily from the continuation.
- [ ] The colors come from the existing PlayHold website.
- [ ] No red/black reference palette is introduced.
- [ ] No reference branding or text remains.
- [ ] GSAP/ScrollTrigger is used appropriately if needed.
- [ ] Animations are cleaned up correctly in React.
- [ ] Mobile layout works correctly.
- [ ] Desktop layout works correctly.
- [ ] Reduced-motion users are supported.
- [ ] Keyboard users can use the page.
- [ ] No horizontal overflow is introduced.
- [ ] No significant performance regression is introduced.
- [ ] Existing PlayHold functionality remains intact.

---

# 22. Most Important Instruction

**Do not treat the original component as a template that must be copied line-by-line.**

Treat it as a **design and interaction reference**.

The intended result is:

> **The opening/reveal behavior of the first reference + the visual language of the continuation + the actual colors/content/branding of PlayHold.**

The final implementation should look as if the effect was originally designed specifically for PlayHold, not pasted from another project.

When there is a conflict between the reference implementation and the existing PlayHold project, prioritize:

1. Existing PlayHold functionality
2. Existing PlayHold design system and colors
3. Performance and responsiveness
4. Accessibility
5. The requested cinematic scroll-reveal experience
6. Reference implementation details
