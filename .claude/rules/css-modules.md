---
paths:
  - 'src/**/*.module.css'
---

# CSS Modules

- camelCase classes (`.menuItem`) -- never kebab/PascalCase
- Design tokens from `globals.css`: `var(--color-*)`, `var(--spacing-*)`, `var(--font-size-*)`, `var(--radius-*)`, `var(--shadow-*)`
- Never hardcode colors/spacing/shadows
- Prefer style composition for shared primitives (`composes: ... from '../shared/*.module.css'`)
- Shared imports are allowed only from dedicated primitive/style folders (`inputs/shared`, equivalent shared folders), not arbitrary sibling components
- Dark theme via semantic tokens -- never target `[data-theme='dark']`

## CSS custom properties for dynamic values

- When a component needs JS-driven values (percentages, offsets, delays), inject them as CSS custom properties via `style={{ '--my-var': value }}` and consume with `var(--my-var)` in the `.module.css`
- Always provide a fallback: `var(--my-var, <default>)`
- Prefer this pattern over direct inline CSS properties (`width`, `left`, `animation-delay`) -- keeps styling logic in CSS
- Static values that look dynamic but have a fixed set (e.g. size variants sm/md/lg) should use variant classes instead of custom properties
