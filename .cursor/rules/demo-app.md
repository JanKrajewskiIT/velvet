---
paths:
  - 'demo/**/*.tsx'
  - 'demo/**/*.css'
---

> Type: Rule (normative constraints)
> Source of truth: Rules define mandatory constraints; skills define operational playbooks.

# Demo App Conventions

## Use Library Components

- Import UI from the library only
- Never create demo-local wrappers that duplicate library behavior
- Demo should exercise real public APIs, not private internals

## Default-first Showcases

- Showcase built-in component defaults first
- Only pass text overrides when the point of the example is customization
- When a component has owned library copy, let the demo show that copy in at least one example
- Extracted composites worth keeping should get their own clear showcase sections

## Styling

- Use design tokens only
- Keep `demo.css` minimal and focused on layout/composition
- Never recreate library component styling in demo-local CSS
- No inline styles in demo sections
- When a layout pattern repeats, add a reusable demo utility class

## Structure

- One section component per major category or theme
- Keep examples realistic, readable, and short
- Prefer multiple focused examples over one giant overloaded showcase block

## Component Documentation Expectations

- New public components should get at least one default usage example in demo
- If a component has important state variants, showcase only meaningful ones (not every permutation)
- Demonstrate the default API first, then customization variants
- For renamed or deprecated APIs, demo must use the current recommended API
