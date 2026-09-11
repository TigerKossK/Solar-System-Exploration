# Hero Section & Planet Exploration Improvements

## Objective

Improve the existing website without changing its overall visual identity, interaction logic, or existing planet-exploration concept beyond the specific changes described below.

The goal is to make the experience feel more polished, modern, intuitive, and capable of delivering a stronger first impression.

**Important:** Preserve the existing colors, overall design language, typography, planet/orbit logic, content, and interaction behavior everywhere except where a change is explicitly requested below.

---

## 1. Fix the Planet Information UI Blocking Problem

### Current problem

After the user clicks **"Explore the Planets"**, the planet exploration interface has a usability problem:

- When the mouse/cursor moves close to one of the planets, a canvas/panel appears with information about that planet.
- This information canvas can visually and/or interactively block the user's ability to reach and explore other planets.
- The user should not feel trapped by the information panel.

### Required improvement

Redesign the planet information UI so it does **not interfere with exploration**.

Requirements:

- The information canvas/panel must not block access to other planets.
- The user must still be able to move around the orbit view naturally.
- The UI should feel like an informational overlay rather than an obstacle placed on top of the interactive scene.
- Preserve the existing information and functionality contained in the panel.
- Keep the interaction intuitive and smooth.
- Avoid creating a large permanent panel that occupies the center of the experience.
- Position, anchor, scale, or animate the information UI intelligently so that it does not cover the planet the user is trying to explore or the nearby navigation area.
- The solution must work consistently across all planets, not just one specific planet.

### UX goal

The user should be able to:

1. Move around the orbit scene.
2. Approach/select a planet.
3. See its information.
4. Continue moving toward and exploring another planet immediately.

The information UI must support exploration rather than interrupt it.

---

## 2. Remove the Duplicate Planet Navigation from the Bottom Sidebar

### Current problem

There are currently too many ways to explore/select planets.

This creates unnecessary visual and interaction complexity.

### Required change

Remove the individual planets from the bottom sidebar section containing the text:

> **"The eight planets"**

That section should no longer provide a separate planet-by-planet navigation system.

### New exploration model

After this change, the primary ways to explore planets should be:

- **Orbit View:** Users explore planets directly through the orbital scene.
- **Arrow Navigation:** The existing left/right arrow controls can be used to switch to the next/previous planet.

Do not add another replacement planet list somewhere else.

### Important

The purpose of this change is **simplification**, not the removal of planet exploration.

All planet information and functionality should remain available through the orbit experience and arrow-based navigation.

The resulting interaction hierarchy should feel intentional:

**Orbit View → Select/Explore Planet → Use Arrows to Move Between Planets**

---

## 3. Major Redesign of the First Hero Section

### Main objective

The first hero section should become significantly more interesting, modern, premium, and visually engaging.

Use the available **Impeccable skills** to redesign the hero section with strong visual hierarchy, polished composition, spacing, typography, motion, and interaction design.

The redesign should feel like a deliberate upgrade rather than a completely unrelated website.

### Design direction

Keep the existing website's identity and visual language, but make the first hero section substantially more impressive.

The hero should:

- Create a strong first impression.
- Feel modern and cinematic.
- Have a clear visual focal point.
- Communicate the space/astronomy theme immediately.
- Maintain strong readability and usability.
- Avoid unnecessary visual clutter.
- Feel consistent with the rest of the website.
- Transition naturally into the existing content below it.

### Use the New Reference

A new visual reference has been added to the project.

Use that reference as a design direction for the new hero section.

Do **not** copy the reference literally.

Instead:

- Study its composition, visual hierarchy, atmosphere, proportions, and overall design language.
- Adapt the useful ideas to this website's existing identity.
- Preserve the project's own visual language and astronomy theme.

### Replace the Building

The reference contains a building/architectural element.

For this website, replace that visual concept with an astronomical subject.

The corresponding visual area should feature:

- **Earth**, or
- **another planet from the Solar System**

The result should feel intentional and integrated into the hero composition.

The planet should not look like a generic placeholder.

It should feel like a high-quality, visually rich central object.

### Planet Image Generation

For generating the planet visual used in the redesigned hero, use the available **Higgsfield skills**.

The generated planet should match the hero's composition, lighting, scale, atmosphere, and overall aesthetic.

Do not introduce a visually inconsistent image that looks disconnected from the rest of the site.

---

## 4. Preserve Existing Colors and Logic Outside the Hero

This is a critical constraint.

The redesign should **not** cause unnecessary changes to the rest of the website.

### Preserve

Keep the following unchanged unless a change is strictly required for compatibility:

- Existing color palette.
- Existing general visual identity.
- Existing typography system outside the redesigned hero.
- Existing planet data/content.
- Existing orbit behavior.
- Existing navigation logic.
- Existing section structure.
- Existing animations outside the hero.
- Existing interaction patterns outside the explicitly requested changes.

### Scope of visual change

The major visual redesign should be concentrated in the **first hero section**.

Do not redesign the entire website.

The hero should feel newer and more dynamic while still clearly belonging to the same website.

---

## 5. Add a More Dynamic Scroll-Triggered Hero Transition

The first hero section already has a scroll-triggered animation.

Keep that concept, but improve it substantially.

### Required behavior

The hero should use a **more dynamic scroll-triggered transition**.

The animation should feel:

- Smooth.
- Cinematic.
- Responsive.
- Modern.
- Intentional.
- Connected to the movement of the page.

Avoid making it feel like a simple fade or basic translate animation.

### Possible motion characteristics

Use the Impeccable skills and the existing project architecture to create a more sophisticated transition using appropriate combinations of:

- Scale.
- Depth/parallax.
- Positional movement.
- Opacity.
- Blur/depth changes when appropriate.
- Layered movement.
- Perspective.
- Controlled rotation when visually appropriate.

Do not add excessive motion just for the sake of animation.

The final result should feel premium rather than distracting.

### Performance requirement

The new animation must remain performant.

Avoid introducing unnecessary rendering work, excessive DOM updates, or animation logic that creates noticeable lag or stuttering.

Prefer efficient animation techniques and preserve the existing performance characteristics of the website.

---

# Implementation Rules

## Preserve Existing Functionality

Do not remove existing functionality unless it is explicitly requested in this prompt.

The following removals are intentional:

1. Individual planet entries from the **"The eight planets"** bottom sidebar.
2. The current hero design in the first section, which is being replaced by the improved design.

Everything else should remain functional.

---

## Design Consistency

The redesigned hero must still feel like part of the same project.

Do not:

- Introduce an unrelated color scheme.
- Replace the website's overall identity.
- Redesign unrelated sections.
- Add unnecessary UI elements.
- Create multiple competing planet-navigation systems.
- Add visual effects that reduce usability.

The redesign should be a **focused evolution**, not a complete redesign of the entire website.

---

## Responsive Design

Make sure the new hero and the planet information UI work correctly across different viewport sizes.

Check at minimum:

- Desktop.
- Laptop-sized screens.
- Narrow desktop/tablet widths.

The hero composition, generated planet visual, text, scroll animation, and planet information UI should adapt instead of breaking or covering important content.

---

# Required Workflow

Before modifying the code:

1. Inspect the current implementation of the first hero section.
2. Inspect the existing planet exploration/orbit implementation.
3. Inspect the current bottom sidebar containing **"The eight planets"**.
4. Inspect the current planet information canvas/panel behavior.
5. Inspect the existing scroll-triggered hero animation.
6. Inspect the newly added reference asset.
7. Identify the correct Impeccable and Higgsfield skills available in the project and use them where appropriate.

Do not assume how the current implementation works. Inspect it first and modify the existing architecture rather than unnecessarily rebuilding unrelated parts.

---

# Validation Requirements

After implementation, verify that:

### Planet Exploration

- The information canvas no longer blocks access to other planets.
- All planets remain explorable.
- Arrow navigation still works.
- Orbit-based exploration still works.
- There is no duplicate planet list in the **"The eight planets"** sidebar.

### Hero

- The first hero section is visibly more modern and engaging.
- The new reference has clearly influenced the composition.
- The building concept has been replaced by Earth or another planet.
- The generated planet visual fits the design.
- The hero preserves the site's existing identity.
- The scroll-triggered animation is more dynamic than before.
- The animation remains smooth and performant.

### Regression Check

Make sure the changes do not break:

- Existing navigation.
- Existing planet information.
- Existing orbit interactions.
- Existing page sections.
- Existing responsive behavior.
- Existing styling outside the intended hero redesign.

---

# Final Design Principle

The end result should feel like a **more refined version of the existing website**, not a completely different project.

The core concept stays the same:

**Interactive Solar System exploration + educational astronomy experience.**

The improvements should make the experience:

**Cleaner → More intuitive → More immersive → More modern → More visually impressive**

while preserving the original project's logic and identity.
