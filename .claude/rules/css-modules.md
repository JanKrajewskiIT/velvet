---
paths:
  - 'src/**/*.module.css'
---

# CSS Modules Rules

- camelCase class names: `.menuItem`, `.addButton` -- never kebab-case or PascalCase
- Use CSS custom properties from `globals.css`: `var(--color-*)`, `var(--spacing-*)`, `var(--font-size-*)`, `var(--radius-*)`, `var(--shadow-*)`
- Never hardcode colors, spacing, or shadows -- always use design tokens
- Never import CSS from another component's directory
- Dark theme handled by semantic tokens -- never target `[data-theme='dark']` in component CSS
