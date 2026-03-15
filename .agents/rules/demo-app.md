---
paths:
  - 'demo/**/*.tsx'
  - 'demo/**/*.css'
---

# Demo App Conventions

## Use library components

- Import all UI from `@jankrajewskiit/ui` (or `../../src` in dev) -- never redefine buttons, inputs, chips, headings, text
- Use `Button`, `IconButton`, `Chip`, `TagChip`, `Heading`, `Text`, `Input`, `TextArea` etc. from the library
- Never create demo-local wrappers that duplicate library component behavior

## Styling

- Use design tokens (`var(--color-*)`, `var(--spacing-*)`, `var(--font-*)`) -- never hardcoded colors, sizes, or font values
- Keep `demo.css` minimal: only layout helpers for demo sections (grids, spacing between examples)
- Never add classes that replicate library component styles (e.g. `.miniButton`, `.statusChip`)
- No inline `style` in demo sections -- all styling via `demo.css` utility classes (`.col`, `.row`, `.flex1`, `.surfacePanel`, `.marqueeTag`, etc.)
- When a new layout pattern appears more than once, add a reusable class to `demo.css` instead of duplicating inline styles

## Structure

- One section component per category (e.g. `NavigationSection`, `FeedbackSection`)
- Sections showcase library components with realistic props -- keep demo code readable and concise
